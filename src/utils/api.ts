/**
 * API Utility for connecting the React frontend to the PHP backend.
 * Update the BASE_URL if your PHP server is running on a different port.
 */

const BASE_URL = 'http://localhost:8000/api';

const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const postData = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const patchData = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteData = async (url: string) => {
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return response.json();
};

export const api = {
  // Employees
  getEmployees: () => fetchData(`${BASE_URL}/employees.php`),
  addEmployee: (data: any) => postData(`${BASE_URL}/employees.php`, data),
  deleteEmployee: (id: number) => deleteData(`${BASE_URL}/employees.php?id=${id}`),

  // Attendance
  getAttendance: (employeeId?: number) => {
    const url = employeeId
      ? `${BASE_URL}/attendance.php?employee_id=${employeeId}`
      : `${BASE_URL}/attendance.php`;
    return fetchData(url);
  },
  recordAttendance: (data: any) => postData(`${BASE_URL}/attendance.php`, data),

  // Leaves
  getLeaves: (employeeId?: number) => {
    const url = employeeId
      ? `${BASE_URL}/leaves.php?employee_id=${employeeId}`
      : `${BASE_URL}/leaves.php`;
    return fetchData(url);
  },
  requestLeave: (data: any) => postData(`${BASE_URL}/leaves.php`, data),
  updateLeaveStatus: (id: number, status: string) =>
    patchData(`${BASE_URL}/leaves.php`, { id, status }),

  // Payroll
  getPayroll: () => fetchData(`${BASE_URL}/payroll.php`),
  createPayroll: (data: any) => postData(`${BASE_URL}/payroll.php`, data),
  updatePayrollStatus: (id: number, status: string) =>
    patchData(`${BASE_URL}/payroll.php`, { id, status }),
};
