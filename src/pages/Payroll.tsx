import { Plus, Download, Filter, FileText, CreditCard } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { mockPayroll, mockEmployees } from '../data/mockData';
import { PayrollRecord } from '../types';

const Payroll = () => {
  const columns = [
    {
      header: 'Employee',
      accessor: (p: PayrollRecord) => {
        const emp = mockEmployees.find(e => e.id === p.employeeId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
              {emp?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{emp?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{emp?.department}</p>
            </div>
          </div>
        );
      },
    },
    { header: 'Month', accessor: 'month' as keyof PayrollRecord },
    { 
      header: 'Basic Salary', 
      accessor: (p: PayrollRecord) => `$${p.basicSalary.toLocaleString()}`
    },
    { 
      header: 'Bonus', 
      accessor: (p: PayrollRecord) => (
        <span className="text-emerald-600 font-medium">+${p.bonus}</span>
      )
    },
    { 
      header: 'Deductions', 
      accessor: (p: PayrollRecord) => (
        <span className="text-red-600 font-medium">-${p.deduction + p.loan + p.providentFund}</span>
      )
    },
    { 
      header: 'Net Salary', 
      accessor: (p: PayrollRecord) => (
        <span className="font-bold text-slate-900">${p.netSalary.toLocaleString()}</span>
      )
    },
    {
      header: 'Status',
      accessor: (p: PayrollRecord) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {p.status}
        </span>
      ),
    },
    {
      header: 'Invoice',
      accessor: () => (
        <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-colors">
          <Download className="w-3.5 h-3.5" />
          PDF
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-500 font-medium">Process salaries, bonuses and deductions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <FileText className="w-5 h-5" />
            Salary Template
          </button>
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <Plus className="w-5 h-5" />
            Generate Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Net Salary</p>
              <p className="text-2xl font-extrabold text-slate-900">$845,200</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Bonuses</p>
              <p className="text-2xl font-extrabold text-slate-900">$12,450</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Deductions</p>
              <p className="text-2xl font-extrabold text-slate-900">$3,840</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">PF Contributions</p>
              <p className="text-2xl font-extrabold text-slate-900">$18,200</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
          <option>October 2023</option>
          <option>September 2023</option>
          <option>August 2023</option>
        </select>
        <div className="h-4 w-px bg-slate-200 mx-2"></div>
        <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Marketing</option>
        </select>
        <div className="flex-1"></div>
        <button className="text-blue-600 text-sm font-bold hover:underline">Download Report</button>
      </div>

      <DataTable columns={columns} data={mockPayroll} />
    </div>
  );
};

export default Payroll;
