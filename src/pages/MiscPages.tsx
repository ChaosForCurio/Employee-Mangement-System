import { Award, Bell, Briefcase, ClipboardList, Info, Star } from 'lucide-react';

export const AwardsPage = () => (
  <div className="p-4 md:p-8 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Awards & Training</h1>
        <p className="text-slate-500 font-medium">Employee recognition and skill development.</p>
      </div>
      <button className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 shadow-lg">
        <Award className="w-5 h-5" />
        New Training
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Recent Awards
        </h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold">#1</div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Employee of the Month</p>
                <p className="text-xs text-slate-500">Awarded to John Doe for exceptional performance.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Active Training Programs
        </h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">TS</div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Technical Skills Bootcamp</p>
                <p className="text-xs text-slate-500">12 Employees currently enrolled.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const NoticeBoardPage = () => (
  <div className="p-4 md:p-8 space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Notice Board</h1>
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6 items-start">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg">System Maintenance Scheduled</h3>
              <span className="text-xs font-bold text-slate-400">2 hours ago</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              We will be conducting scheduled system maintenance this weekend. The HRM portal will be inaccessible on Saturday from 10:00 PM to 2:00 AM. Please ensure all your work is saved.
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HolidaysPage = () => (
  <div className="p-4 md:p-8 space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Holiday Calendar 2023</h1>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100">
        {[
          { name: 'New Year', date: 'Jan 01, 2023', day: 'Sunday' },
          { name: 'Labor Day', date: 'May 01, 2023', day: 'Monday' },
          { name: 'Independence Day', date: 'Jul 04, 2023', day: 'Tuesday' },
          { name: 'Thanksgiving', date: 'Nov 23, 2023', day: 'Thursday' },
          { name: 'Christmas Day', date: 'Dec 25, 2023', day: 'Monday' },
        ].map((h, i) => (
          <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{h.name}</p>
                <p className="text-xs text-slate-500 font-medium">{h.day}</p>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-700">{h.date}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TimeChangeRequestsPage = () => (
  <div className="p-4 md:p-8 space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Time Change Requests</h1>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Pending Requests</h3>
      </div>
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">No pending time change requests.</p>
      </div>
    </div>
  </div>
);
