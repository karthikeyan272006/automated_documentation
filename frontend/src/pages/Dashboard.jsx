import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Clock, CheckCircle, Activity, Zap, Target, ArrowUpRight, ListTodo } from 'lucide-react';
import { useRealTimeTracking } from '../hooks/useRealTimeTracking';
import useAuth from '../hooks/useAuth';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { status } = useRealTimeTracking(user?._id, analytics?.daily?.tasks?.[0]);

    useEffect(() => {
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

        fetchAnalytics();
    }, []);

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-[80vh]">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        </Layout>
    );

    if (!analytics) return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 text-red-500">
                    <Activity size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Sync Connection Interrupted</h3>
                <p className="text-slate-400 max-w-sm mb-8">We couldn't retrieve your productivity data. Please ensure the backend server is operational.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Retry Connection
                </button>
            </div>
        </Layout>
    );

    const barData = {
        labels: analytics?.weekly?.chartData.map(d => d.date) || [],
        datasets: [
            {
                label: 'Productivity Pulse',
                data: analytics?.weekly?.chartData.map(d => d.time) || [],
                backgroundColor: 'rgba(139, 92, 246, 0.5)',
                borderColor: '#8b5cf6',
                borderWidth: 2,
                borderRadius: 12,
                hoverBackgroundColor: '#a78bfa',
            },
        ],
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Welcome back, <span className="text-gradient">{user?.name || 'Developer'}</span>!
                    </h1>
                    <p className="text-slate-400 font-medium">Here's your productivity pulse for today.</p>
                </div>
                <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl glass-card border-white/5 transition-all duration-500 ${status === 'Active' ? 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}`}>
                    <div className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                    <span className={`text-sm font-bold tracking-wide uppercase ${status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {status === 'Active' ? 'Coding in Progress' : 'System Idle'}
                    </span>
                </div>
            </div>

            {/* Stats Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-card p-8 border-violet-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Clock size={80} className="text-violet-400" />
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-violet-500/20 rounded-2xl text-violet-400">
                            <Clock size={24} />
                        </div>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Focus Duration</span>
                    </div>
                    <h2 className="text-4xl font-black text-white">{formatTime(analytics.daily.totalTime)}</h2>
                    <div className="mt-4 flex items-center text-emerald-400 text-sm font-bold">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span>12% more than yesterday</span>
                    </div>
                </div>

                <div className="glass-card p-8 border-pink-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle size={80} className="text-pink-400" />
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400">
                            <CheckCircle size={24} />
                        </div>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Milestones</span>
                    </div>
                    <h2 className="text-4xl font-black text-white">{analytics.daily.tasksCompleted}</h2>
                    <p className="text-slate-500 text-sm mt-4 font-medium">Tasks pushed to production</p>
                </div>

                <div className="glass-card p-8 border-emerald-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Target size={80} className="text-emerald-400" />
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <Zap size={24} />
                        </div>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Efficiency</span>
                    </div>
                    <h2 className="text-4xl font-black text-white">94%</h2>
                    <div className="mt-4 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[94%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Activity Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <Activity size={20} className="mr-3 text-indigo-400" />
                            Velocity Stream
                        </h3>
                        <select className="bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center">
                        <ListTodo size={20} className="mr-3 text-pink-400" />
                        Today's Focus
                    </h3>
                    <div className="space-y-4">
                        {analytics.daily.tasks.length > 0 ? (
                            analytics.daily.tasks.map((task, i) => (
                                <div key={task._id} className="group flex items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                                        }`}>
                                        {task.status === 'completed' ? <CheckCircle size={20} /> : <Zap size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                            {task.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{task.status}</p>
                                    </div>
                                    <ArrowUpRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <Activity size={40} className="mx-auto text-slate-700 mb-4 opacity-20" />
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No Active Sessions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

