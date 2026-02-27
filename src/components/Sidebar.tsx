import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, CalendarDays, Wallet, Receipt, 
  CheckSquare, FileText, Settings, LogOut, Award, Briefcase, Bell, ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Employees', icon: Users, path: '/employees' },
    { name: 'Attendance', icon: Clock, path: '/attendance' },
    { name: 'Leave Management', icon: CalendarDays, path: '/leave' },
    { name: 'Payroll', icon: Wallet, path: '/payroll' },
    { name: 'Expenses', icon: Receipt, path: '/expenses' },
    { name: 'Invoices', icon: FileText, path: '/invoices' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Awards & Training', icon: Award, path: '/training' },
    { name: 'Holidays', icon: Briefcase, path: '/holidays' },
    { name: 'Notice Board', icon: Bell, path: '/notices' },
    { name: 'Time Change', icon: ClipboardList, path: '/time-requests' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          SmartHR
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-4 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
