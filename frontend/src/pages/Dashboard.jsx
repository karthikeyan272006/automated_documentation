import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../utils/api';
import { Clock, CheckCircle, Activity, Zap, Target, ArrowUpRight, ListTodo, Users, MousePointer2, Keyboard, Camera } from 'lucide-react';
import useAuth from '../hooks/useAuth';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                const { data } = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/analytics');
                setAnalytics(data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchAnalytics();
    }, [setUser]);

    if (loading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / (3600 || 0));
        const m = Math.floor(((seconds || 0) % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-slate-500">Your agency is looking productive today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all">
                        Invite Members
                    </button>
                    <button className="btn-hubstaff">
                        <Zap size={18} />
                        Boost Productivity
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-md">+4.5%</span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Total Work Time</span>
                    <h2 className="text-2xl font-bold text-slate-900">{formatTime(analytics?.daily?.totalTime)}</h2>
                </div>

                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-md">+2.1%</span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Activity Level</span>
                    <h2 className="text-2xl font-bold text-slate-900">92%</h2>
                </div>

                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-slate-400 text-sm font-bold bg-slate-50 px-2 py-1 rounded-md">Flat</span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Tasks Completed</span>
                    <h2 className="text-2xl font-bold text-slate-900">{analytics?.daily?.tasksCompleted || 0}</h2>
                </div>

                <div className="stat-card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded-md">-1.2%</span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Active Members</span>
                    <h2 className="text-2xl font-bold text-slate-900">1</h2>
                </div>
            </div>

            {/* Detailed Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Productivity Trends</h3>
                            <p className="text-sm text-slate-500">Activity breakdown by hour</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mr-4">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div> Work
                                <div className="w-3 h-3 bg-slate-200 rounded-full ml-2"></div> Idle
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-end gap-2 px-2">
                        {[40, 65, 80, 50, 90, 70, 45, 60, 85, 95, 30, 55].map((val, i) => (
                            <div key={i} className="flex-1 bg-indigo-600 rounded-t-lg transition-all duration-500 hover:bg-indigo-700 cursor-pointer group relative" style={{ height: `${val}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}% Active
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>8 AM</span>
                        <span>10 AM</span>
                        <span>12 PM</span>
                        <span>2 PM</span>
                        <span>4 PM</span>
                        <span>6 PM</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Real-time Monitors</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <Keyboard size={18} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Keyboard usage</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">45 keys/min</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <MousePointer2 size={18} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Mouse activity</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">120 clicks/hr</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <Camera size={18} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Last Screenshot</span>
                            </div>
                            <span className="text-sm font-bold text-slate-500">2 min ago</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Focus App</h4>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">VS</div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-800">Visual Studio Code</p>
                                <p className="text-[10px] text-slate-500">4h 22m today</p>
                            </div>
                            <ArrowUpRight size={14} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


