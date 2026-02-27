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
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  bonus: number;
  deduction: number;
  loan: number;
  providentFund: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
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
