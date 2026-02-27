import { Search, Bell, Mail, UserCircle } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm ml-64">
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search for employees, tasks, invoices..."
          className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r pr-6">
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Mail className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1 pr-3 rounded-lg transition-colors">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
            <UserCircle className="w-full h-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">John Doe</p>
            <p className="text-xs font-medium text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
