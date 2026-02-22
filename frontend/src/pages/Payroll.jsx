import React from 'react';
import { DollarSign, Download, CreditCard, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const Payroll = () => {
    const payments = [
        { id: '#PAY-8821', period: 'Feb 1 - Feb 15, 2024', amount: '$2,450.00', status: 'Paid', date: 'Feb 16, 2024' },
        { id: '#PAY-8790', period: 'Jan 16 - Jan 31, 2024', amount: '$2,300.00', status: 'Paid', date: 'Feb 1, 2024' },
        { id: '#PAY-8744', period: 'Jan 1 - Jan 15, 2024', amount: '$2,400.00', status: 'Paid', date: 'Jan 16, 2024' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Payroll & Payments</h1>
                    <p className="text-slate-500">Automated salary calculation and history.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all">
                        <DollarSign size={18} />
                        Get Paid Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20">
                    <DollarSign size={100} className="absolute -right-4 -bottom-4 opacity-10" />
                    <p className="text-indigo-100 text-sm font-medium mb-2">Available for Withdrawal</p>
                    <h2 className="text-4xl font-bold mb-6">$1,240.50</h2>
                    <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp size={14} />
                        Based on 42.5 hours this week
                    </div>
                </div>

                <div className="stat-card">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-xl w-fit mb-4">
                        <CreditCard size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Hourly Rate</p>
                    <h3 className="text-2xl font-bold text-slate-900">$55.00/hr</h3>
                    <p className="text-[10px] font-bold text-indigo-600 mt-2 uppercase tracking-widest">Senior Developer Rate</p>
                </div>

                <div className="stat-card">
                    <div className="p-3 bg-slate-50 text-slate-600 rounded-xl w-fit mb-4">
                        <PieChartIcon size={24} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Next Payment</p>
                    <h3 className="text-2xl font-bold text-slate-900">March 1, 2024</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest text-emerald-500">Auto-processing active</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Payment History</h3>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Transactions</button>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment ID</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Period</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-slate-900">{p.id}</td>
                                <td className="px-8 py-5 text-slate-600">{p.period}</td>
                                <td className="px-8 py-5 font-bold text-slate-900">{p.amount}</td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-emerald-200 uppercase tracking-wider">
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-slate-500 text-sm uppercase font-bold">{p.date}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payroll;
