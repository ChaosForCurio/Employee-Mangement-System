import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { mockEmployees } from '../data/mockData';
import { Employee } from '../types';

const Employees = () => {
  const columns = [
    {
      header: 'Employee',
      accessor: (emp: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
            {emp.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{emp.name}</p>
            <p className="text-xs text-slate-500">{emp.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Department', accessor: 'department' as keyof Employee },
    { header: 'Designation', accessor: 'designation' as keyof Employee },
    {
      header: 'Join Date',
      accessor: (emp: Employee) => new Date(emp.joinDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: (emp: Employee) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
          emp.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {emp.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-slate-500 font-medium">Manage your workforce, roles and permissions.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Employees</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Now</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">1,120</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">On Leave</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">24</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees by name, email or department..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <DataTable columns={columns} data={mockEmployees} />
    </div>
  );
};

export default Employees;
