const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const dbUrl = process.env.NEON_DB_URL.replace(/^psql '/, '').replace(/'$/, '');

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    // 1. Read and execute schema
    const schemaSql = fs.readFileSync('backend/schema.sql', 'utf8');
    console.log('Executing schema.sql to ensure tables exist...');
    await client.query(schemaSql);

    // 2. Truncate existing data to start fresh
    console.log('Truncating tables...');
    await client.query('TRUNCATE TABLE payroll, leaves, attendance, employees RESTART IDENTITY CASCADE');

    console.log('Inserting real data into employees...');
    const employeesResult = await client.query(`
      INSERT INTO employees (name, email, role, department, salary) 
      VALUES 
        ('Amit Patel', 'amit.patel@company.com', 'Senior Developer', 'Engineering', 95000.00),
        ('Sarah Jenkins', 'sarah.j@company.com', 'HR Manager', 'HR', 78000.00),
        ('Michael Chen', 'm.chen@company.com', 'Product Designer', 'Design', 82000.00),
        ('Emily Roberts', 'emily.r@company.com', 'Sales Executive', 'Sales', 65000.00),
        ('David Wilson', 'david.w@company.com', 'Marketing Lead', 'Marketing', 88000.00),
        ('John Doe', 'john.doe@gmail.com', 'Admin', 'Administration', 120000.00)
      RETURNING id, name;
    `);

    const employees = employeesResult.rows;

    console.log('Inserting attendance logs...');
    for (const emp of employees) {
      await client.query(`
        INSERT INTO attendance (employee_id, date, status, check_in, check_out)
        VALUES 
          ($1, CURRENT_DATE - INTERVAL '2 days', 'Present', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '09:00:00', CURRENT_DATE - INTERVAL '2 days' + INTERVAL '17:30:00'),
          ($1, CURRENT_DATE - INTERVAL '1 day', 'Present', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '08:55:00', CURRENT_DATE - INTERVAL '1 day' + INTERVAL '17:05:00'),
          ($1, CURRENT_DATE, CASE WHEN random() > 0.8 THEN 'Late' ELSE 'Present' END, CURRENT_DATE + INTERVAL '09:15:00', null)
      `, [emp.id]);
    }

    console.log('Inserting leave requests...');
    await client.query(`
      INSERT INTO leaves (employee_id, start_date, end_date, type, status, reason)
      VALUES 
        ($1, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 'Annual Leave', 'Approved', 'Family vacation'),
        ($2, CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '10 days', 'Sick Leave', 'Pending', 'Medical appointment')
    `, [employees[0].id, employees[1].id]);

    console.log('Inserting payroll data...');
    for (const emp of employees) {
      const baseSalary = 5000.00;
      const deductions = 500.00;
      const netSalary = baseSalary - deductions;

      await client.query(`
        INSERT INTO payroll (employee_id, month, year, base_salary, bonuses, deductions, net_salary, status)
        VALUES 
          ($1, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month'), EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month'), $2, 0, $3, $4, 'Paid'),
          ($1, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE), $2, 0, $3, $4, 'Unpaid')
      `, [emp.id, baseSalary, deductions, netSalary]);
    }

    console.log('✅ Seeding completed successfully! Dummy data removed and standard demo data inserted.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

main();
