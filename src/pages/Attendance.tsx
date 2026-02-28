import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Loader2, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { api } from '../utils/api';
import { Attendance, Employee } from '../types';
import { AttendanceModal } from '../components/AttendanceModal';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [attendanceData, employeeData] = await Promise.all([
        api.getAttendance(),
        api.getEmployees()
      ]);
      setAttendance(attendanceData);
      setEmployees(employeeData);
    } catch (err: any) {
      console.error('Failed to fetch attendance:', err);
      setError(err.message || 'Failed to fetch attendance data. Database might be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      await api.deleteAttendance(Number(id));
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const handleSave = async (data: Partial<Attendance>) => {
    try {
      if (data.id) {
        await api.updateAttendance(Number(data.id), data);
      } else {
        await api.addAttendance(data);
      }
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: (a: Attendance) => {
        const emp = employees.find(e => e.id == a.employee_id);
        const name = a.employee_name || emp?.name || 'Unknown';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs text-uppercase font-display">
              {name.charAt(0)}
            </div>
            <p className="font-semibold text-slate-900">{name}</p>
          </div>
        );
      },
    },
    { header: 'Date', accessor: (a: Attendance) => new Date(a.date).toLocaleDateString() },
    { header: 'Clock In', accessor: (a: Attendance) => <span className="text-emerald-600 font-medium">{a.clock_in}</span> },
    { header: 'Clock Out', accessor: (a: Attendance) => <span className="text-amber-600 font-medium">{a.clock_out || '--:--'}</span> },
    {
      header: 'Status',
      accessor: (a: Attendance) => {
        const styles = {
          Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          Late: 'bg-amber-100 text-amber-700 border-amber-200',
          Absent: 'bg-red-100 text-red-700 border-red-200',
          'On Leave': 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return (
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${styles[a.status] || styles.Present}`}>
            {a.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (a: Attendance) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedAttendance(a); setIsModalOpen(true); }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(a.id)}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Attendance Tracking</h1>
          <p className="text-slate-500 font-medium">Daily logs, clock-ins and time management.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSelectedAttendance(null); setIsModalOpen(true); }}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 w-full md:w-auto justify-center"
          >
            <Clock className="w-5 h-5 text-indigo-400" />
            Record Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={attendance.filter(a => a.status === 'Present').length.toString()} icon={CheckCircle2} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard title="Late" value={attendance.filter(a => a.status === 'Late').length.toString()} icon={AlertCircle} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard title="Absent" value={attendance.filter(a => a.status === 'Absent').length.toString()} icon={XCircle} color="text-red-600" bgColor="bg-red-50" />
        <StatCard title="On Leave" value={attendance.filter(a => a.status === 'On Leave').length.toString()} icon={Calendar} color="text-blue-600" bgColor="bg-blue-50" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Logs</h2>
          <div className="flex gap-2">
            <input type="date" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <button className="text-indigo-600 text-sm font-bold px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors">Export Report</button>
          </div>
        </div>
        {loading && attendance.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : error && attendance.length === 0 ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-6 mx-2">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800 underline">
              Retry Connection
            </button>
          </div>
        ) : (
          <DataTable columns={columns} data={attendance} />
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Pending Time Change Requests</h2>
          <div className="py-8 w-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <CheckCircle2 className="w-6 h-6 text-slate-200" />
            </div>
            <p className="font-medium text-sm">No pending time change requests.</p>
          </div>
        </div>
      </div>

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        attendance={selectedAttendance}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-colors cursor-default">
    <div className={`${bgColor} ${color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

export default AttendancePage;

