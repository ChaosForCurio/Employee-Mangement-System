import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Users, CreditCard, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
];

const attendanceData = [
  { name: 'Mon', count: 120 },
  { name: 'Tue', count: 125 },
  { name: 'Wed', count: 118 },
  { name: 'Thu', count: 122 },
  { name: 'Fri', count: 110 },
];

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Overview</h1>
        <p className="text-slate-500 font-medium">System performance and workforce analytics for Nov 2023.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value="128" change="+4.5%" trend="up" icon={Users} color="blue" />
        <StatCard title="Monthly Revenue" value="$45,200" change="+12.2%" trend="up" icon={CreditCard} color="emerald" />
        <StatCard title="Total Expenses" value="$12,850" change="-2.4%" trend="down" icon={Calendar} color="amber" />
        <StatCard title="Pending Tasks" value="34" change="+8" trend="up" icon={Clock} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Revenue vs Expenses</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 font-semibold text-slate-500">
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Weekly Attendance</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span> Present
              </span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Announcements</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Annual General Meeting', date: 'Nov 15, 2023', category: 'Event' },
              { title: 'New Health Insurance Policy', date: 'Nov 10, 2023', category: 'Policy' },
              { title: 'Office Holiday - Thanksgiving', date: 'Nov 23, 2023', category: 'Holiday' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.category} • {item.date}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Upcoming Events</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Don't miss out on important team activities.</p>
            
            <div className="flex-1 space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-xs font-bold text-blue-400 uppercase mb-1">Tomorrow, 10:00 AM</p>
                <p className="font-bold">Team Sync Meeting</p>
                <div className="flex -space-x-2 mt-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-bold">+5</div>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all active:scale-95 mt-4 shadow-xl shadow-blue-900/40">
              Create New Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors[color]} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
