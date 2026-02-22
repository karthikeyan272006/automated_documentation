import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';

const Attendance = () => {
    const [attendanceData] = useState([
        { date: '2024-02-22', login: '09:00 AM', logout: '06:30 PM', workHours: '9.5h', status: 'Present' },
        { date: '2024-02-21', login: '09:15 AM', logout: '06:00 PM', workHours: '8.75h', status: 'Late' },
        { date: '2024-02-20', login: '08:55 AM', logout: '05:45 PM', workHours: '8.8h', status: 'Present' },
    ]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Attendance Tracker</h1>
                    <p className="text-slate-500">Manage your daily work hours and attendance logs.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                        <Calendar size={18} />
                        Feb 2024
                    </button>
                    <button className="btn-hubstaff">
                        Download Log
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Login Time</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Logout Time</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Work Hours</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {attendanceData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-5 font-bold text-slate-700">{row.date}</td>
                                <td className="px-8 py-5 text-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Clock size={14} />
                                        </div>
                                        {row.login}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                            <Clock size={14} />
                                        </div>
                                        {row.logout}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold ring-1 ring-indigo-200">
                                        {row.workHours}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${row.status === 'Present' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                        <span className={`text-sm font-bold ${row.status === 'Present' ? 'text-emerald-700' : 'text-orange-700'}`}>
                                            {row.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stat-card border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Average Daily Hours</p>
                            <h3 className="text-xl font-bold text-slate-900">8h 45m</h3>
                        </div>
                    </div>
                </div>
                <div className="stat-card border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">This Month Total</p>
                            <h3 className="text-xl font-bold text-slate-900">168.5 Hours</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
