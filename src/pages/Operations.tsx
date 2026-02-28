import {
  Plus, Receipt, FileText, CheckSquare, Search, Filter,
  MoreHorizontal, Download, ArrowUpRight, Clock, User
} from 'lucide-react';
import { DataTable } from '../components/DataTable';

import { Expense, Invoice, Task } from '../types';

export const ExpensesPage = () => {
  const columns = [
    { header: 'Title', accessor: 'title' as keyof Expense },
    { header: 'Category', accessor: 'category' as keyof Expense },
    { header: 'Date', accessor: 'date' as keyof Expense },
    {
      header: 'Amount',
      accessor: (e: Expense) => <span className="font-bold text-slate-900">${e.amount.toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: (e: Expense) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${e.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
          {e.status}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: () => (
        <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
          <p className="text-slate-500 font-medium">Track company expenditures and payments.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total This Month</p>
          <p className="text-3xl font-black text-slate-900">$12,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Pending Approval</p>
          <p className="text-3xl font-black text-amber-600">$1,840.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Approved Today</p>
          <p className="text-3xl font-black text-emerald-600">$450.00</p>
        </div>
      </div>

      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export const InvoicesPage = () => {
  const columns = [
    { header: 'Invoice ID', accessor: 'id' as keyof Invoice },
    { header: 'Client', accessor: 'clientName' as keyof Invoice },
    {
      header: 'Amount',
      accessor: (i: Invoice) => <span className="font-bold text-slate-900">${i.amount.toLocaleString()}</span>
    },
    { header: 'Date', accessor: 'date' as keyof Invoice },
    { header: 'Due Date', accessor: 'dueDate' as keyof Invoice },
    {
      header: 'Status',
      accessor: (i: Invoice) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${i.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
          i.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
          {i.status}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: () => (
        <button className="text-blue-600 hover:text-blue-700">
          <Download className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices & Billing</h1>
          <p className="text-slate-500 font-medium">Manage client billing and estimates.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export const TasksPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-500 font-medium">Coordinate projects and team assignments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-900">{status}</h3>
              <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                {0}
              </span>
            </div>

            <div className="space-y-4">
              {({} as any[]).map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {task.priority}
                    </span>
                    <button className="text-slate-300 group-hover:text-slate-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-4">{task.title}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">{task.dueDate}</span>
                    </div>
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                      {task.assignedTo.charAt(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
