import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { Attendance, Employee } from '../types';

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Attendance>) => Promise<void>;
    attendance?: Attendance | null;
}

export const AttendanceModal = ({ isOpen, onClose, onSave, attendance }: AttendanceModalProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(false);
    const [formData, setFormData] = useState<Partial<Attendance>>({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        clock_in: '',
        clock_out: '',
        status: 'Present'
    });

    useEffect(() => {
        if (isOpen) {
            loadEmployees();
            if (attendance) {
                setFormData({
                    ...attendance,
                    // Ensure time formats are HH:mm
                    clock_in: attendance.clock_in?.substring(0, 5) || '',
                    clock_out: attendance.clock_out?.substring(0, 5) || ''
                });
            } else {
                setFormData({
                    employee_id: '',
                    date: new Date().toISOString().split('T')[0],
                    clock_in: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                    clock_out: '',
                    status: 'Present'
                });
            }
        }
    }, [isOpen, attendance]);

    const loadEmployees = async () => {
        try {
            setFetchingEmployees(true);
            const data = await api.getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error('Failed to load employees:', err);
        } finally {
            setFetchingEmployees(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.employee_id || !formData.date || !formData.clock_in) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (err: any) {
            alert(err.message || 'Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {attendance ? 'Edit Attendance' : 'Record Attendance'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Employee</label>
                        <select
                            disabled={!!attendance || fetchingEmployees}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                            value={formData.employee_id}
                            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.department})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Status</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Clock In</label>
                            <input
                                type="time"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.clock_in}
                                onChange={(e) => setFormData({ ...formData, clock_in: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Clock Out</label>
                            <input
                                type="time"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.clock_out}
                                onChange={(e) => setFormData({ ...formData, clock_out: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (attendance ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
