import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { PayrollRecord, Employee } from '../types';
import { api } from '../utils/api';

interface PayrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payrollData: Partial<PayrollRecord>) => Promise<void>;
    payroll?: PayrollRecord | null;
}

export const PayrollModal: React.FC<PayrollModalProps> = ({
    isOpen,
    onClose,
    onSave,
    payroll
}) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        base_salary: 0,
        bonuses: 0,
        deductions: 0,
        status: 'Unpaid' as PayrollRecord['status']
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1].map(String);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    useEffect(() => {
        if (payroll) {
            setFormData({
                employee_id: payroll.employee_id || '',
                month: payroll.month || '',
                year: payroll.year || '',
                base_salary: Number(payroll.base_salary) || 0,
                bonuses: Number(payroll.bonuses) || 0,
                deductions: Number(payroll.deductions) || 0,
                status: payroll.status || 'Unpaid'
            });
        } else {
            setFormData({
                employee_id: '',
                month: new Date().toLocaleString('default', { month: 'long' }),
                year: new Date().getFullYear().toString(),
                base_salary: 0,
                bonuses: 0,
                deductions: 0,
                status: 'Unpaid'
            });
        }
        setError(null);
    }, [payroll, isOpen]);

    const fetchEmployees = async () => {
        try {
            setIsLoadingEmployees(true);
            const data = await api.getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees', err);
        } finally {
            setIsLoadingEmployees(false);
        }
    };

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const empId = e.target.value;
        const employee = employees.find(emp => emp.id === empId);
        setFormData({
            ...formData,
            employee_id: empId,
            base_salary: employee && (employee as any).salary ? Number((employee as any).salary) : 0
        });
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.employee_id || !formData.month || !formData.year) {
            setError("All fields are required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // net_salary will be calculated on backend as well, but we send it for consistency
            const net_salary = formData.base_salary + formData.bonuses - formData.deductions;

            await onSave({
                ...formData,
                net_salary,
                id: payroll?.id
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save payroll record.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const netSalary = formData.base_salary + formData.bonuses - formData.deductions;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">
                        {payroll ? 'Edit Payroll Record' : 'Generate Payroll'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Employee *</label>
                            <select
                                value={formData.employee_id}
                                onChange={handleEmployeeChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                disabled={isLoadingEmployees || !!payroll}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Month *</label>
                                <select
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Year *</label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-600">Base Salary</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={formData.base_salary}
                                        onChange={(e) => setFormData({ ...formData, base_salary: parseFloat(e.target.value) || 0 })}
                                        className="bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 w-32 outline-none focus:ring-2 focus:ring-blue-500/20 text-right font-bold"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-green-600">Bonuses</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={formData.bonuses}
                                        onChange={(e) => setFormData({ ...formData, bonuses: parseFloat(e.target.value) || 0 })}
                                        className="bg-white border border-green-100 rounded-lg pl-7 pr-3 py-1.5 w-32 outline-none focus:ring-2 focus:ring-green-500/20 text-right font-bold text-green-600"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-red-600">Deductions</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={formData.deductions}
                                        onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                                        className="bg-white border border-red-100 rounded-lg pl-7 pr-3 py-1.5 w-32 outline-none focus:ring-2 focus:ring-red-500/20 text-right font-bold text-red-600"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-base font-bold text-slate-900">Net Salary</span>
                                <span className="text-lg font-black text-blue-600">${netSalary.toLocaleString()}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Payment Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-75"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? 'Processing...' : (payroll ? 'Update' : 'Generate')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
