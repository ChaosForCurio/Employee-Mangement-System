const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = 8000;

// Clean up Neon DB URL (handles "psql 'url'", "psql url", or just "url")
const rawDbUrl = process.env.NEON_DB_URL || '';
const dbUrl = rawDbUrl.replace(/^psql\s+['"]?/, '').replace(/['"]?$/, '').trim();

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    max: 20, // X-Scale: concurrent request limit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Cache Utility
const cache = require('./utils/cache.cjs');

// Log pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

app.use(cors());
app.use(express.json());

// Helper for DB queries with Read/Write awareness
const query = async (text, params, options = {}) => {
    const { useCache = false, ttl = 60, cacheKey } = options;

    if (useCache && cacheKey) {
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`[Cache] HIT: ${cacheKey}`);
            return { rows: cached, fromCache: true };
        }
        console.log(`[Cache] MISS: ${cacheKey}`);
    }

    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        if (duration > 100) {
            console.log(`[Slow Query] ${duration}ms: ${text.substring(0, 100)}...`);
        }

        if (useCache && cacheKey) {
            cache.set(cacheKey, result.rows, ttl);
        }

        return result;
    } catch (err) {
        console.error(`[DB Error] ${err.message} | SQL: ${text.substring(0, 50)}`);
        throw err;
    }
};

// --- Background Tasks ---
const refreshMetrics = async () => {
    try {
        await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_stats');
        console.log('[DB] Materialized View mv_dashboard_stats refreshed');
    } catch (err) {
        // Fallback if concurrent refresh fails (e.g. if index is missing)
        try {
            await pool.query('REFRESH MATERIALIZED VIEW mv_dashboard_stats');
            console.log('[DB] Materialized View mv_dashboard_stats refreshed (non-concurrent)');
        } catch (innerErr) {
            console.error('[DB Error] Failed to refresh MV:', innerErr.message);
        }
    }
};

// Initial refresh and then every 5 minutes
setTimeout(refreshMetrics, 1000);
setInterval(refreshMetrics, 5 * 60 * 1000);

// --- Stats Endpoint (X-Scale Dashboard) ---
app.get('/api/stats.php', async (req, res) => {
    try {
        const result = await query('SELECT * FROM mv_dashboard_stats', [], {
            useCache: true,
            cacheKey: 'dashboard_stats',
            ttl: 30
        });
        res.json(result.rows[0] || {
            total_employees: 0,
            today_attendance: 0,
            pending_leaves: 0,
            monthly_payroll: 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Employees ---
app.get('/api/employees.php', async (req, res) => {
    try {
        const result = await query('SELECT * FROM employees ORDER BY id DESC', [], {
            useCache: true,
            cacheKey: 'all_employees',
            ttl: 30 // Short TTL for employee list
        });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees.php', async (req, res) => {
    const { name, email, role, department, salary } = req.body;
    try {
        const result = await query(
            'INSERT INTO employees (name, email, role, department, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, role, department, salary]
        );
        cache.delete('all_employees'); // Invalidate cache
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/employees.php', async (req, res) => {
    const { id, name, email, role, department, salary } = req.body;
    try {
        const result = await query(
            'UPDATE employees SET name = $1, email = $2, role = $3, department = $4, salary = $5 WHERE id = $6 RETURNING *',
            [name, email, role, department, salary, id]
        );
        cache.delete('all_employees'); // Invalidate cache
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/employees.php', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM employees WHERE id = $1', [id]);
        cache.delete('all_employees'); // Invalidate cache
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Attendance ---
app.get('/api/attendance.php', async (req, res) => {
    const { employee_id } = req.query;
    try {
        let result;
        if (employee_id) {
            result = await query(
                'SELECT a.*, e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id = e.id WHERE a.employee_id = $1 ORDER BY a.date DESC',
                [employee_id],
                { useCache: true, cacheKey: `attendance_emp_${employee_id}`, ttl: 60 }
            );
        } else {
            result = await query(
                'SELECT a.*, e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id = e.id ORDER BY a.date DESC',
                [],
                { useCache: true, cacheKey: 'attendance_all', ttl: 60 }
            );
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance.php', async (req, res) => {
    const { employee_id, date, status, check_in, check_out } = req.body;
    try {
        const result = await query(
            'INSERT INTO attendance (employee_id, date, status, check_in, check_out) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [employee_id, date, status, check_in, check_out]
        );
        cache.delete('attendance_all');
        cache.delete(`attendance_emp_${employee_id}`);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/attendance.php', async (req, res) => {
    const { id, status, check_out } = req.body;
    try {
        let result;
        if (check_out) {
            result = await query(
                'UPDATE attendance SET status = $1, check_out = $2 WHERE id = $3 RETURNING *',
                [status, check_out, id]
            );
        } else {
            result = await query(
                'UPDATE attendance SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
        }
        cache.clear(); // Clear all attendance related cache for simplicity
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/attendance.php', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM attendance WHERE id = $1', [id]);
        cache.clear();
        res.json({ message: 'Attendance record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Leaves ---
app.get('/api/leaves.php', async (req, res) => {
    const { employee_id } = req.query;
    try {
        let result;
        if (employee_id) {
            result = await query(
                'SELECT l.*, e.name as employee_name FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE l.employee_id = $1 ORDER BY l.applied_at DESC',
                [employee_id],
                { useCache: true, cacheKey: `leaves_emp_${employee_id}`, ttl: 120 }
            );
        } else {
            result = await query(
                'SELECT l.*, e.name as employee_name FROM leaves l JOIN employees e ON l.employee_id = e.id ORDER BY l.applied_at DESC',
                [],
                { useCache: true, cacheKey: 'leaves_all', ttl: 120 }
            );
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leaves.php', async (req, res) => {
    const { employee_id, start_date, end_date, type, reason } = req.body;
    try {
        const result = await query(
            "INSERT INTO leaves (employee_id, start_date, end_date, type, reason, status) VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *",
            [employee_id, start_date, end_date, type, reason]
        );
        cache.clear();
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/leaves.php', async (req, res) => {
    const { id, status, start_date, end_date, type, reason } = req.body;
    try {
        let result;
        if (status && !start_date) {
            result = await query(
                'UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
        } else {
            result = await query(
                'UPDATE leaves SET start_date = $1, end_date = $2, type = $3, reason = $4, status = $5 WHERE id = $6 RETURNING *',
                [start_date, end_date, type, reason, status, id]
            );
        }
        cache.clear();
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/leaves.php', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM leaves WHERE id = $1', [id]);
        cache.clear();
        res.json({ message: 'Leave record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Payroll ---
app.get('/api/payroll.php', async (req, res) => {
    try {
        const result = await query(
            'SELECT p.*, e.name as employee_name, e.department FROM payroll p JOIN employees e ON p.employee_id = e.id ORDER BY p.year DESC, p.month DESC',
            [],
            { useCache: true, cacheKey: 'payroll_all', ttl: 300 }
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/payroll.php', async (req, res) => {
    const { employee_id, month, year, base_salary, bonuses, deductions, net_salary, status } = req.body;
    try {
        const result = await query(
            'INSERT INTO payroll (employee_id, month, year, base_salary, bonuses, deductions, net_salary, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [employee_id, month, year, base_salary, bonuses, deductions, net_salary, status]
        );
        cache.delete('payroll_all');
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/payroll.php', async (req, res) => {
    const { id, status, month, year, base_salary, bonuses, deductions, net_salary } = req.body;
    try {
        let result;
        if (status && !month) {
            result = await query(
                'UPDATE payroll SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
        } else {
            result = await query(
                'UPDATE payroll SET month = $1, year = $2, base_salary = $3, bonuses = $4, deductions = $5, net_salary = $6, status = $7 WHERE id = $8 RETURNING *',
                [month, year, base_salary, bonuses, deductions, net_salary, status, id]
            );
        }
        cache.delete('payroll_all');
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/payroll.php', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM payroll WHERE id = $1', [id]);
        cache.delete('payroll_all');
        res.json({ message: 'Payroll record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
