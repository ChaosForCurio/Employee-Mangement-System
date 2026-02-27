import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import Payroll from './pages/Payroll';
import { ExpensesPage as Expenses, InvoicesPage as Invoices, TasksPage as Tasks } from './pages/Operations';
import { AwardsPage as Training, HolidaysPage as Holidays, NoticeBoardPage as Notices, TimeChangeRequestsPage as TimeRequests } from './pages/MiscPages';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0 lg:ml-64'}`}>
          <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="bg-slate-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/training" element={<Training />} />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/time-requests" element={<TimeRequests />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
