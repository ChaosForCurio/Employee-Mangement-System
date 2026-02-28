export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  avatar?: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day';
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applied_at?: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  department?: string;
  month: string;
  year: string;
  base_salary: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  status: 'Paid' | 'Unpaid';
  processed_at?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}
