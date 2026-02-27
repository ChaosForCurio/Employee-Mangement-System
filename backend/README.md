# Employee Management System - PHP Backend

This backend is built using PHP and PostgreSQL (Neon). It provides RESTful API endpoints for the React frontend.

## Prerequisites
- PHP 7.4 or higher
- PostgreSQL (already configured via Neon)

## Setup Instructions

### 1. Database Initialization
Run the SQL commands in `backend/schema.sql` in your Neon Console or using a tool like `psql`.

```bash
# If you have psql installed, you can use the connection string from .env.local
psql 'your-neon-connection-string' -f backend/schema.sql
```

### 2. Configuration
The backend automatically reads the database connection string from the project's `.env.local` file. Ensure the `NEON_DB_URL` is correct.

### 3. Running the Server
You can run a local PHP server specifically for the backend:

```bash
cd backend
php -S localhost:8000
```

The React frontend is already configured to talk to `http://localhost:8000/api`.

## API Endpoints
- `GET /api/employees.php` - Fetch all employees
- `POST /api/employees.php` - Add a new employee
- `DELETE /api/employees.php?id={id}` - Remove an employee
- `GET /api/attendance.php` - Fetch attendance records
- `POST /api/attendance.php` - Record attendance
- `GET /api/leaves.php` - Fetch leave requests
- `POST /api/leaves.php` - Submit leave request

## Scalability
- **Indexes**: Critical columns like `email`, `employee_id`, and `date` are indexed for fast lookups even as data grows.
- **Connection Pooling**: Uses Neon's built-in pooling via the connection string for efficient resource management.
- **PDO**: Prepared statements are used to prevent SQL injection and improve performance.
