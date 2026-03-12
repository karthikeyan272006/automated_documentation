import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';
import moment from 'moment';

const Attendance = () => {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                // Fetch attendance for the logged-in user
                const res = await api.get(`/attendance/${user._id}`);
                setAttendanceData(res.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAttendance();
        }
    }, [user]);

    const formatTime = (time) => {
        return time ? new Date(time).toLocaleTimeString("en-IN") : '--:--';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    const calculateMonthlyHours = () => {
        let totalMinutes = 0;
        attendanceData.forEach(item => {
            if (item.workingHours && typeof item.workingHours === 'string') {
                const match = item.workingHours.match(/(\d+)h (\d+)m/);
                if (match) {
                    totalMinutes += (parseInt(match[1]) * 60) + parseInt(match[2]);
                }
            }
        });

        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Attendance Record</h1>
                    <p className="text-slate-500">View and manage employee attendance logs.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                        <Calendar size={18} />
                        {moment().format('MMM YYYY')}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">User Name</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Login Time</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Logout Time</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Working Hours</th>
                            <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-10 text-center text-slate-500 font-medium whitespace-nowrap">Loading attendance data...</td>
                            </tr>
                        ) : attendanceData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-10 text-center text-slate-500 font-medium whitespace-nowrap">No attendance records found.</td>
                            </tr>
                        ) : (
                            attendanceData.map((row, i) => (
                                <tr key={row._id || i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-slate-700 whitespace-nowrap">{formatDate(row.date)}</td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="font-semibold text-slate-800">{row.userId?.fullname || row.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">{row.userId?.email || ''}</div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-600 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Clock size={14} />
                                            </div>
                                            {formatTime(row.loginTime)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-600 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                                <Clock size={14} />
                                            </div>
                                            {row.logoutTime ? formatTime(row.logoutTime) : <span className="text-emerald-600 font-bold animate-pulse">Active</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 ${row.workingHours ? 'bg-indigo-50 text-indigo-700 ring-indigo-200' : 'bg-slate-50 text-slate-400 ring-slate-100'} rounded-full text-xs font-bold ring-1`}>
                                            {row.workingHours || '--'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${row.status === 'Present' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                            <span className={`text-sm font-bold ${row.status === 'Present' ? 'text-emerald-700' : 'text-orange-700'}`}>
                                                {row.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stat-card border-l-4 border-l-emerald-500 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Days Present</p>
                            <h3 className="text-xl font-bold text-slate-900">
                                {attendanceData.filter(d => d.status === 'Present').length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="stat-card border-l-4 border-l-indigo-500 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Monthly Hours Logged</p>
                            <h3 className="text-xl font-bold text-slate-900">
                                {calculateMonthlyHours()}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Attendance;

