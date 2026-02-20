import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import { Play, Square, Clock, List, Activity as ActivityIcon, ChevronRight, History, Zap, Timer } from 'lucide-react';

const ActivityTracker = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeActivity, setActiveActivity] = useState(null);
    const [selectedTask, setSelectedTask] = useState('');
    const [activityType, setActivityType] = useState('coding');
    const [description, setDescription] = useState('');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);

    // Fetch tasks and today's activities
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, activitiesRes, activeRes] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/activities/today'),
                    api.get('/activities/active')
                ]);
                setTasks(tasksRes.data);
                setActivities(activitiesRes.data);
                if (activeRes.data) {
                    setActiveActivity(activeRes.data);
                    const startTime = new Date(activeRes.data.startTime);
                    const now = new Date();
                    setTimer(Math.floor((now - startTime) / 1000));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activity data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Timer logic
    useEffect(() => {
        if (activeActivity) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimer(0);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeActivity]);

    const handleStart = async () => {
        try {
            const res = await api.post('/activities/start', {
                task: selectedTask || undefined,
                activityType,
                description
            });
            setActiveActivity(res.data);
            // Refresh activity list
            const activitiesRes = await api.get('/activities/today');
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Error starting activity:', error);
        }
    };

    const handleStop = async () => {
        try {
            await api.put('/activities/stop');
            setActiveActivity(null);
            // Refresh activity list
            const activitiesRes = await api.get('/activities/today');
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Error stopping activity:', error);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalWorkedToday = activities.reduce((acc, curr) => acc + (curr.duration || 0), 0) + (activeActivity ? timer : 0);

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Developer Activity Tracking</h1>
                        <p className="text-slate-400">Track your daily progress and productivity in real-time.</p>
                    </div>
                    <div className="glass-card px-6 py-4 flex items-center space-x-4 border-indigo-500/20 bg-indigo-500/5">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <Clock className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Worked Today</p>
                            <p className="text-2xl font-mono font-bold text-white">{formatTime(totalWorkedToday)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tracker Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-8 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap size={120} className="text-violet-500" />
                            </div>

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Timer className="mr-2 text-violet-400" size={20} />
                                Active Session
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-400 ml-1">Current Task</label>
                                    <select
                                        disabled={!!activeActivity}
                                        value={selectedTask}
                                        onChange={(e) => setSelectedTask(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    >
                                        <option value="">General Work (No Task)</option>
                                        {tasks.map(task => (
                                            <option key={task._id} value={task._id}>{task.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-400 ml-1">Activity Type</label>
                                    <select
                                        disabled={!!activeActivity}
                                        value={activityType}
                                        onChange={(e) => setActivityType(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    >
                                        <option value="coding">Coding</option>
                                        <option value="debugging">Debugging</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="designing">Designing</option>
                                        <option value="testing">Testing</option>
                                        <option value="documentation">Documentation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-8 space-y-2">
                                <label className="text-sm font-semibold text-slate-400 ml-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    disabled={!!activeActivity}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What are you working on?"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5">
                                <div className="flex items-center space-x-6">
                                    <div className={`text-5xl font-mono font-bold ${activeActivity ? 'text-violet-400' : 'text-slate-500'}`}>
                                        {formatTime(timer)}
                                    </div>
                                    <div className="text-sm">
                                        <p className={`font-bold ${activeActivity ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {activeActivity ? 'SESSION ACTIVE' : 'IDLE'}
                                        </p>
                                        <p className="text-slate-400">Real-time tracking enabled</p>
                                    </div>
                                </div>

                                {activeActivity ? (
                                    <button
                                        onClick={handleStop}
                                        className="group relative flex items-center justify-center w-16 h-16 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/10"
                                    >
                                        <Square size={24} fill="currentColor" />
                                        <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded">Stop</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStart}
                                        className="group relative flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full transition-all duration-300 shadow-xl shadow-indigo-500/40 hover:scale-110 active:scale-95"
                                    >
                                        <Play size={24} fill="currentColor" className="ml-1" />
                                        <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded">Start</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Today's Log */}
                        <div className="glass-card p-8 border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <History className="mr-2 text-violet-400" size={20} />
                                    Today's Activity Log
                                </h2>
                                <span className="text-xs font-semibold text-slate-500 bg-white/5 px-3 py-1 rounded-full">{activities.length} Records</span>
                            </div>

                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">
                                        <List size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>No activities recorded today yet.</p>
                                    </div>
                                ) : (
                                    activities.map((act) => (
                                        <div key={act._id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-slate-900/50 rounded-xl">
                                                    <ActivityIcon className="text-violet-400" size={18} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <p className="font-bold text-white capitalize">{act.activityType}</p>
                                                        <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20 font-bold uppercase tracking-tight">
                                                            {act.task ? act.task.title : 'General'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1">{act.description || 'No description provided'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-white font-bold">{formatTime(act.duration || 0)}</p>
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {act.endTime ? ` - ${new Date(act.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ' (Active)'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Productivity Insights */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-violet-500/10 to-transparent">
                            <h3 className="font-bold text-white mb-4 flex items-center">
                                <Zap className="mr-2 text-yellow-500" size={18} />
                                Daily Goal
                            </h3>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-violet-400 bg-violet-500/10">
                                            Progress
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-violet-400">
                                            {Math.min(Math.round((totalWorkedToday / 28800) * 100), 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-800">
                                    <div
                                        style={{ width: `${Math.min(Math.round((totalWorkedToday / 28800) * 100), 100)}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500 transition-all duration-1000"
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 text-center">8 hours daily focus goal</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-white/5">
                            <h3 className="font-bold text-white mb-4">Focus Suggestions</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start space-x-3">
                                    <div className="p-1 bg-emerald-500/10 rounded-lg mt-0.5">
                                        <ChevronRight size={14} className="text-emerald-500" />
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">You've been coding for 2 hours. Consider taking a 10-minute break for better focus.</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start space-x-3">
                                    <div className="p-1 bg-violet-500/10 rounded-lg mt-0.5">
                                        <ChevronRight size={14} className="text-violet-500" />
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">Complete your pending task "Dashboard UI" to reach your goal today.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ActivityTracker;
