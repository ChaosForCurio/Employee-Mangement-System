import { useState, useEffect } from 'react';
import { Plus, Download, Filter, FileText, CreditCard, Loader2, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { api } from '../utils/api';
import { PayrollRecord, Employee } from '../types';
import { PayrollModal } from '../components/PayrollModal';

const Payroll = () => {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [payrollData, employeeData] = await Promise.all([
        api.getPayroll(),
        api.getEmployees()
      ]);
      setPayroll(payrollData);
      setEmployees(employeeData);
    } catch (err: any) {
      console.error('Failed to fetch payroll:', err);
      setError(err.message || 'Failed to fetch payroll data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, status: PayrollRecord['status']) => {
    try {
      await api.updatePayrollStatus(Number(id), status);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) return;
    try {
      await api.deletePayroll(Number(id));
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete payroll record');
    }
  };

  const handleSave = async (data: Partial<PayrollRecord>) => {
    try {
      if (data.id) {
        await api.updatePayroll(Number(data.id), data);
      } else {
        await api.addPayroll(data);
      }
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: (p: PayrollRecord) => {
        const emp = employees.find(e => e.id == p.employee_id);
        const name = p.employee_name || emp?.name || 'Unknown';
        const dept = p.department || emp?.department || 'N/A';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
              {name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{dept}</p>
            </div>
          </div>
        );
      },
    },
    { header: 'Month', accessor: 'month' as keyof PayrollRecord },
    {
      header: 'Basic Salary',
      accessor: (p: PayrollRecord) => `$${Number(p.base_salary).toLocaleString()}`
    },
    {
      header: 'Bonus',
      accessor: (p: PayrollRecord) => (
        <span className="text-emerald-600 font-medium">+${Number(p.bonuses).toLocaleString()}</span>
      )
    },
    {
      header: 'Deductions',
      accessor: (p: PayrollRecord) => (
        <span className="text-red-600 font-medium">-${Number(p.deductions).toLocaleString()}</span>
      )
    },
    {
      header: 'Net Salary',
      accessor: (p: PayrollRecord) => (
        <span className="font-bold text-slate-900">${Number(p.net_salary).toLocaleString()}</span>
      )
    },
    {
      header: 'Status',
      accessor: (p: PayrollRecord) => (
        <button
          onClick={() => handleStatusUpdate(p.id, p.status === 'Paid' ? 'Pending' : 'Paid')}
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
        >
          {p.status}
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: (p: PayrollRecord) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedPayroll(p); setIsModalOpen(true); }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-colors ml-2">
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
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
          <button
            onClick={() => { setSelectedPayroll(null); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
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
              <p className="text-2xl font-extrabold text-slate-900">${payroll.reduce((sum, p) => sum + Number(p.net_salary), 0).toLocaleString()}</p>
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
              <p className="text-2xl font-extrabold text-slate-900">${payroll.reduce((sum, p) => sum + Number(p.bonuses), 0).toLocaleString()}</p>
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
              <p className="text-2xl font-extrabold text-slate-900">${payroll.reduce((sum, p) => sum + Number(p.deductions), 0).toLocaleString()}</p>
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
              <p className="text-sm font-semibold text-slate-500">Total Records</p>
              <p className="text-2xl font-extrabold text-slate-900">{payroll.length}</p>
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

      {loading && payroll.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error && payroll.length === 0 ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-6">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800 underline">
            Retry Connection
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={payroll} />
      )}

      <PayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        payroll={selectedPayroll}
      />
    </div>
  );
};

export default Payroll;
