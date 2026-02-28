import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { api } from '../utils/api';
import { LeaveRequest, Employee } from '../types';
import { LeaveModal } from '../components/LeaveModal';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [leavesData, employeeData] = await Promise.all([
        api.getLeaves(),
        api.getEmployees()
      ]);
      setLeaves(leavesData);
      setEmployees(employeeData);
    } catch (err: any) {
      console.error('Failed to fetch leaves:', err);
      setError(err.message || 'Failed to load leave data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, status: LeaveRequest['status']) => {
    try {
      await api.updateLeaveStatus(Number(id), status);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      await api.deleteLeave(Number(id));
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete leave request');
    }
  };

  const handleSave = async (data: Partial<LeaveRequest>) => {
    try {
      if (data.id) {
        await api.updateLeave(Number(data.id), data);
      } else {
        await api.addLeave(data);
      }
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: (l: LeaveRequest) => {
        const emp = employees.find(e => e.id == l.employee_id);
        const name = l.employee_name || emp?.name || 'Unknown';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
              {name.charAt(0)}
            </div>
            <p className="font-semibold text-slate-900">{name}</p>
          </div>
        );
      },
    },
    { header: 'Type', accessor: 'type' as keyof LeaveRequest },
    {
      header: 'Duration',
      accessor: (l: LeaveRequest) => {
        const start = new Date(l.start_date);
        const end = new Date(l.end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return (
          <div>
            <p className="font-medium text-slate-700">{start.toLocaleDateString()} - {end.toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{diffDays} {diffDays === 1 ? 'Day' : 'Days'}</p>
          </div>
        );
      }
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
      accessor: (l: LeaveRequest) => (
        <div className="flex gap-2">
          {l.status === 'Pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(l.id, 'Approved')}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStatusUpdate(l.id, 'Rejected')}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Reject"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => { setSelectedLeave(l); setIsModalOpen(true); }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(l.id)}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 font-medium">Manage leave categories, quotas and applications.</p>
        </div>
        <button
          onClick={() => { setSelectedLeave(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          New Leave Request
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
        {loading && leaves.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error && leaves.length === 0 ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center space-y-4">
            <p className="font-medium text-lg">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2.5 rounded-xl font-bold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <DataTable columns={columns} data={leaves} />
        )}
      </div>

      <LeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        leave={selectedLeave}
      />
    </div>
  );
};

export default LeaveManagement;
