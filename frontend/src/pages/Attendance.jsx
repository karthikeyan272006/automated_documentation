import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';
import moment from 'moment';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchAttendance();
    }, [user]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (user?.role === 'admin') {
                // Admin views all attendance
                response = await api.get('/attendance');
            } else {
                // User views their own attendance
                response = await api.get(`/attendance/${user._id}`);
            }

            setAttendanceData(response.data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance records.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        return moment(timeString).format('hh:mm A');
    };

    const calculateTotalHours = () => {
        const total = attendanceData.reduce((acc, curr) => acc + parseFloat(curr.workHours || 0), 0);
        return total.toFixed(2);
    };

    const calculateAverageHours = () => {
        if (attendanceData.length === 0) return '0.00';
        const total = attendanceData.reduce((acc, curr) => acc + parseFloat(curr.workHours || 0), 0);
        return (total / attendanceData.length).toFixed(2);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Attendance Tracker</h1>
                    <p className="text-slate-500">
                        {user?.role === 'admin'
                            ? 'Viewing all team attendance records.'
                            : 'Manage your daily work hours and attendance logs.'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        <Calendar size={18} />
                        {moment().format('MMMM YYYY')}
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                        Download Log
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Login Time</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Logout Time</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Work Hours</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <Loader2 size={40} className="animate-spin text-indigo-600" />
                                            <p className="font-medium">Fetching attendance records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        No attendance records found for this period.
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map((row) => (
                                    <tr key={row._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-slate-700">
                                            {moment(row.date).format('DD MMM YYYY')}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 font-bold text-xs">
                                                    {row.userId?.fullname?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-medium text-slate-900">{row.userId?.fullname || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <Clock size={14} />
                                                </div>
                                                {formatTime(row.loginTime)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                                    <Clock size={14} />
                                                </div>
                                                {formatTime(row.logoutTime)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold ring-1 ring-indigo-200">
                                                {row.workHours}h
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && attendanceData.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Average Daily Hours</p>
                                <h3 className="text-xl font-bold text-slate-900">{calculateAverageHours()}h</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 border-l-4 border-l-indigo-500 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Work Hours</p>
                                <h3 className="text-xl font-bold text-slate-900">{calculateTotalHours()} Hours</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
