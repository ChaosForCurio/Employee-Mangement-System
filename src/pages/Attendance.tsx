import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { mockAttendance, mockEmployees } from '../data/mockData';
import { Attendance } from '../types';

const AttendancePage = () => {
  const columns = [
    {
      header: 'Employee',
      accessor: (a: Attendance) => {
        const emp = mockEmployees.find(e => e.id === a.employeeId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
              {emp?.name.charAt(0)}
            </div>
            <p className="font-semibold text-slate-900">{emp?.name}</p>
          </div>
        );
      },
    },
    { header: 'Date', accessor: (a: Attendance) => new Date(a.date).toLocaleDateString() },
    { header: 'Clock In', accessor: (a: Attendance) => <span className="text-emerald-600 font-medium">{a.clockIn}</span> },
    { header: 'Clock Out', accessor: (a: Attendance) => <span className="text-amber-600 font-medium">{a.clockOut}</span> },
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
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${styles[a.status]}`}>
            {a.status}
          </span>
        );
      },
    },
    {
      header: 'Total Hours',
      accessor: () => '8h 30m',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Attendance Tracking</h1>
          <p className="text-slate-500 font-medium">Daily logs, clock-ins and time management.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <Clock className="w-5 h-5" />
            Clock In Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Present Today" value="112" icon={CheckCircle2} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard title="Late Arrivals" value="08" icon={AlertCircle} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard title="Absent" value="04" icon={XCircle} color="text-red-600" bgColor="bg-red-50" />
        <StatCard title="On Leave" value="12" icon={Calendar} color="text-blue-600" bgColor="bg-blue-50" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Logs</h2>
          <div className="flex gap-2">
            <input type="date" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
            <button className="text-blue-600 text-sm font-bold px-3 py-1.5 hover:bg-blue-50 rounded-lg">Export Report</button>
          </div>
        </div>
        <DataTable columns={columns} data={mockAttendance} />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Pending Time Change Requests</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">3 New Requests</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2].map(i => (
            <div key={i} className="py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100"></div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Sarah Smith</p>
                  <p className="text-xs text-slate-500">Requested change for Oct 24: 09:15 AM → 09:00 AM</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">Approve</button>
                <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`${bgColor} ${color} p-3 rounded-xl`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

export default AttendancePage;
