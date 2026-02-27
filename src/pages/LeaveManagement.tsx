import { Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { mockLeaves, mockEmployees } from '../data/mockData';
import { LeaveRequest } from '../types';

const LeaveManagement = () => {
  const columns = [
    {
      header: 'Employee',
      accessor: (l: LeaveRequest) => {
        const emp = mockEmployees.find(e => e.id === l.employeeId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
              {emp?.name.charAt(0)}
            </div>
            <p className="font-semibold text-slate-900">{emp?.name}</p>
          </div>
        );
      },
    },
    { header: 'Type', accessor: 'type' as keyof LeaveRequest },
    { 
      header: 'Duration', 
      accessor: (l: LeaveRequest) => (
        <div>
          <p className="font-medium text-slate-700">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">2 Days</p>
        </div>
      )
    },
    { header: 'Reason', accessor: 'reason' as keyof LeaveRequest },
    {
      header: 'Status',
      accessor: (l: LeaveRequest) => {
        const styles = {
          Approved: 'bg-emerald-100 text-emerald-700',
          Pending: 'bg-amber-100 text-amber-700',
          Rejected: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[l.status]}`}>
            {l.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (l: LeaveRequest) => l.status === 'Pending' ? (
        <div className="flex gap-2">
          <button className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Approve">
            <CheckCircle className="w-5 h-5" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      ) : null,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 font-medium">Manage leave categories, quotas and applications.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
          <Plus className="w-5 h-5" />
          Set Leave Quota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900">Annual Leave Quota</h3>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-500">Average Taken</span>
              <span className="text-slate-900">12 / 20 Days</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full w-[60%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-amber-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900">Sick Leave Quota</h3>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-500">Average Taken</span>
              <span className="text-slate-900">4 / 10 Days</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full w-[40%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-900">Casual Leave Quota</h3>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-500">Average Taken</span>
              <span className="text-slate-900">2 / 5 Days</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[40%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Leave Applications</h2>
        <DataTable columns={columns} data={mockLeaves} />
      </div>
    </div>
  );
};

export default LeaveManagement;
