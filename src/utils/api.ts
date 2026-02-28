/**
 * API Utility for connecting the React frontend to the PHP backend.
 * Update the BASE_URL if your PHP server is running on a different port.
 */

const BASE_URL = 'http://localhost:8000/api';

const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text || response.statusText}`);
  }
  return response.json();
};

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    return await handleFetchError(response);
  } catch (err: any) {
    console.error('Network Error:', err);
    throw new Error(err.message || 'Network connection failed. Please check if the server is running.');
  }
};

const postData = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleFetchError(response);
  } catch (err: any) {
    throw new Error(err.message || 'Failed to post data.');
  }
};

const patchData = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleFetchError(response);
  } catch (err: any) {
    throw new Error(err.message || 'Failed to update data.');
  }
};

const deleteData = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    return await handleFetchError(response);
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete data.');
  }
};

export const api = {
  // Employees
  getEmployees: () => fetchData(`${BASE_URL}/employees.php`),
  addEmployee: (data: any) => postData(`${BASE_URL}/employees.php`, data),
  updateEmployee: (id: number, data: any) => patchData(`${BASE_URL}/employees.php`, { id, ...data }),
  deleteEmployee: (id: number) => deleteData(`${BASE_URL}/employees.php?id=${id}`),

  // Attendance
  getAttendance: (employeeId?: number) => {
    const url = employeeId
      ? `${BASE_URL}/attendance.php?employee_id=${employeeId}`
      : `${BASE_URL}/attendance.php`;
    return fetchData(url);
  },
  addAttendance: (data: any) => postData(`${BASE_URL}/attendance.php`, data),
  updateAttendance: (id: number, data: any) => patchData(`${BASE_URL}/attendance.php`, { id, ...data }),
  deleteAttendance: (id: number) => deleteData(`${BASE_URL}/attendance.php?id=${id}`),

  // Leaves
  getLeaves: (employeeId?: number) => {
    const url = employeeId
      ? `${BASE_URL}/leaves.php?employee_id=${employeeId}`
      : `${BASE_URL}/leaves.php`;
    return fetchData(url);
  },
  addLeave: (data: any) => postData(`${BASE_URL}/leaves.php`, data),
  updateLeave: (id: number, data: any) => patchData(`${BASE_URL}/leaves.php`, { id, ...data }),
  updateLeaveStatus: (id: number, status: string) =>
    patchData(`${BASE_URL}/leaves.php`, { id, status }),
  deleteLeave: (id: number) => deleteData(`${BASE_URL}/leaves.php?id=${id}`),

  // Payroll
  getPayroll: () => fetchData(`${BASE_URL}/payroll.php`),
  addPayroll: (data: any) => postData(`${BASE_URL}/payroll.php`, data),
  updatePayroll: (id: number, data: any) => patchData(`${BASE_URL}/payroll.php`, { id, ...data }),
  updatePayrollStatus: (id: number, status: string) =>
    patchData(`${BASE_URL}/payroll.php`, { id, status }),
  deletePayroll: (id: number) => deleteData(`${BASE_URL}/payroll.php?id=${id}`),
};
