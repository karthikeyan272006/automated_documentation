import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';
import { Play, Square, Pause, Clock, List, Activity as ActivityIcon, History, Zap, Timer, ChevronRight } from 'lucide-react';

const TimeTracking = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeActivity, setActiveActivity] = useState(null);
    const [selectedTask, setSelectedTask] = useState('');
    const [activityType, setActivityType] = useState('coding');
    const [description, setDescription] = useState('');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const timerRef = useRef(null);

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
                    let duration = Math.floor((now - startTime) / 1000) - (activeRes.data.totalPausedTime || 0);
                    if (activeRes.data.status === 'Paused' && activeRes.data.pausedAt) {
                        duration -= Math.floor((now - new Date(activeRes.data.pausedAt)) / 1000);
                    }
                    setTimer(duration);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activity data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (activeActivity && activeActivity.status === 'Running') {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (!activeActivity) setTimer(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeActivity]);

    useEffect(() => {
        const handleUserActivity = () => {
            const now = Date.now();
            if (now - lastActivity > 500) { // Throttle updates to 500ms
                setLastActivity(now);
                if (activeActivity && activeActivity.status === 'Paused') {
                    handleResume();
                }
            }
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);

        const idleCheckInterval = setInterval(() => {
            if (activeActivity && activeActivity.status === 'Running') {
                const idleTime = (Date.now() - lastActivity) / 1000;
                if (idleTime > 60) {
                    handlePause();
                }
            }
        }, 5000);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            clearInterval(idleCheckInterval);
        };
    }, [activeActivity, lastActivity]);

    const handleStart = async () => {
        try {
            console.log('Frontend: Starting activity and attendance...');

            // Try attendance start, ignore if already marked for today
            try {
                await api.post('/attendance/start');
            } catch (attErr) {
                if (attErr.response && attErr.response.status === 400 && attErr.response.data.message?.includes('Attendance already marked')) {
                    console.warn('Attendance already started for today, proceeding.');
                } else {
                    console.error('Attendance start error:', attErr);
                }
            }

            const res = await api.post('/activities/start', {
                task: selectedTask || undefined,
                activityType,
                description
            });
            setActiveActivity(res.data);
            const activitiesRes = await api.get('/activities/today');
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Error starting tracking:', error);
            alert(error.response?.data?.message || 'Error starting session');
        }
    };

    const handleStop = async () => {
        try {
            console.log('Frontend: Stopping activity and attendance...');

            // Attendance stop moved to global Sign Out
            // await api.post('/attendance/stop');

            await api.put('/activities/stop');
            setActiveActivity(null);
            const activitiesRes = await api.get('/activities/today');
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Error stopping tracking:', error);
            alert(error.response?.data?.message || 'Error stopping session');
        }
    };

    const handlePause = async () => {
        try {
            const res = await api.put('/activities/pause');
            setActiveActivity(res.data);
        } catch (error) {
            console.error('Error pausing activity:', error);
        }
    };

    const handleResume = async () => {
        try {
            const res = await api.put('/activities/resume');
            setActiveActivity(res.data);
        } catch (error) {
            console.error('Error resuming activity:', error);
        }
    };

    const formatTime = (seconds) => {
        if (seconds === undefined || seconds === null || isNaN(seconds)) return "00:00:00";
        const totalSecs = Math.max(0, Math.floor(seconds));
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalWorkedToday = activities.reduce((acc, curr) => acc + (curr.duration || 0), 0) + (activeActivity ? timer : 0);

    if (loading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Time Tracking</h1>
                    <p className="text-slate-500">Log your work and monitor productivity.</p>
                </div>
                <div className="stat-card flex-row items-center gap-4 py-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worked Today</p>
                        <p className="text-xl font-bold text-slate-900 font-mono">{formatTime(totalWorkedToday)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Timer Card */}
                    <div className="timer-card">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-3 h-3 rounded-full ${activeActivity?.status === 'Running' ? 'bg-emerald-500 animate-pulse' : activeActivity?.status === 'Paused' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                    {activeActivity ? (activeActivity.status === 'Running' ? 'Active' : 'Idle / Paused') : 'System Idle'}
                                </span>
                            </div>
                            <div className="text-6xl font-black font-mono mb-8 tracking-tighter">
                                {formatTime(timer)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    className="bg-slate-800 border border-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedTask}
                                    onChange={(e) => setSelectedTask(e.target.value)}
                                    disabled={activeActivity}
                                >
                                    <option value="">Select Task...</option>
                                    {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                                </select>
                                <input
                                    type="text"
                                    placeholder="What are you working on?"
                                    className="bg-slate-800 border border-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={activeActivity}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 ml-8">
                            {activeActivity ? (
                                <>
                                    {activeActivity.status === 'Running' ? (
                                        <button
                                            onClick={handlePause}
                                            className="w-20 h-20 bg-amber-500 hover:bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-500/30 transition-all active:scale-95"
                                        >
                                            <Pause size={32} fill="white" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleResume}
                                            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
                                        >
                                            <Play size={32} fill="white" className="ml-1" />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleStop}
                                        className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/30 transition-all active:scale-95"
                                    >
                                        <Square size={32} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleStart}
                                    className="w-20 h-20 bg-indigo-600 hover:bg-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                                >
                                    <Play size={32} fill="white" className="ml-1" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Recent Sessions</h3>
                            <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                                View Full Log <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {activities.length > 0 ? (
                                activities.map((act) => (
                                    <div key={act._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                                <ActivityIcon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 capitalize">{act.activityType}</p>
                                                <p className="text-xs text-slate-500">{act.task?.title || 'General Work'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 font-mono">{formatTime(act.duration)}</p>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center">
                                    <History size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-medium tracking-tight">No sessions logged today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="stat-card">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Productivity Summary</h3>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-indigo-600 uppercase">Activity Level</span>
                                <span className="text-xs font-bold text-indigo-600">84%</span>
                            </div>
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 w-[84%]"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Focus Duration</span>
                                <span className="font-bold text-slate-900">1h 16m</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Idle Time</span>
                                <span className="font-bold text-slate-900">18m</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Keystrokes</span>
                                <span className="font-bold text-slate-900">12,450</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-slate-900 text-white border-0">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-indigo-400" />
                            AI Insight
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                            "You are most productive between 10 AM and 12 PM. Try scheduling your hardest tasks during this window."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTracking;

