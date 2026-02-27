import { Employee, Attendance, LeaveRequest, PayrollRecord, Expense, Task, Invoice } from '../types';

export const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', department: 'Management', designation: 'General Manager', joinDate: '2022-01-15', status: 'Active' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Manager', department: 'Engineering', designation: 'Senior Developer', joinDate: '2022-03-20', status: 'Active' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'Employee', department: 'HR', designation: 'HR Executive', joinDate: '2022-06-10', status: 'Active' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Employee', department: 'Marketing', designation: 'Marketing Coordinator', joinDate: '2023-01-05', status: 'Active' },
  { id: '5', name: 'Robert Wilson', email: 'robert@example.com', role: 'Employee', department: 'Design', designation: 'UX Designer', joinDate: '2023-04-12', status: 'Blocked' },
];

export const mockAttendance: Attendance[] = [
  { id: '1', employeeId: '1', date: '2023-11-01', clockIn: '09:00 AM', clockOut: '06:00 PM', status: 'Present' },
  { id: '2', employeeId: '2', date: '2023-11-01', clockIn: '09:15 AM', clockOut: '06:15 PM', status: 'Present' },
  { id: '3', employeeId: '3', date: '2023-11-01', clockIn: '09:05 AM', clockOut: '05:55 PM', status: 'Present' },
];

export const mockLeaves: LeaveRequest[] = [
  { id: '1', employeeId: '2', type: 'Sick Leave', startDate: '2023-11-05', endDate: '2023-11-06', reason: 'Flu', status: 'Approved' },
  { id: '2', employeeId: '4', type: 'Casual Leave', startDate: '2023-11-10', endDate: '2023-11-12', reason: 'Family event', status: 'Pending' },
];

export const mockPayroll: PayrollRecord[] = [
  { id: '1', employeeId: '1', month: 'October 2023', basicSalary: 5000, bonus: 500, deduction: 100, loan: 0, providentFund: 500, netSalary: 4900, status: 'Paid' },
  { id: '2', employeeId: '2', month: 'October 2023', basicSalary: 4000, bonus: 200, deduction: 50, loan: 100, providentFund: 400, netSalary: 3650, status: 'Paid' },
];

export const mockExpenses: Expense[] = [
  { id: '1', title: 'Office Supplies', amount: 250, category: 'General', date: '2023-11-01', status: 'Paid' },
  { id: '2', title: 'Software Subscription', amount: 1500, category: 'IT', date: '2023-11-05', status: 'Pending' },
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Quarterly Review', assignedTo: 'John Doe', priority: 'High', status: 'In Progress', dueDate: '2023-11-15' },
  { id: '2', title: 'Website Redesign', assignedTo: 'Robert Wilson', priority: 'Medium', status: 'To Do', dueDate: '2023-11-30' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', clientName: 'Acme Corp', amount: 5000, date: '2023-11-01', dueDate: '2023-11-15', status: 'Paid' },
  { id: 'INV-002', clientName: 'Globex Inc', amount: 3500, date: '2023-11-03', dueDate: '2023-11-17', status: 'Unpaid' },
];
