import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Play, Pause, Square, Plus, Trash2, Clock } from 'lucide-react';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [activeTask, setActiveTask] = useState(null);
    const [timer, setTimer] = useState(0);

    const fetchTasks = async () => {
        const { data } = await api.get('/tasks');
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        let interval;
        if (activeTask) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTask]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        await api.post('/tasks', { title: newTaskTitle, description: newTaskDesc });
        setNewTaskTitle('');
        setNewTaskDesc('');
        fetchTasks();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        }
    };

    const startTimer = (task) => {
        if (activeTask) {
            alert('Stop current task first!');
            return;
        }
        setActiveTask(task);
        setTimer(task.duration || 0); // Resume from previous duration
        updateTaskStatus(task._id, 'in-progress');
    };

    const stopTimer = async () => {
        if (!activeTask) return;

        await api.put(`/tasks/${activeTask._id}`, {
            duration: timer,
            status: 'in-progress' // Keep in progress until manually completed
        });

        setActiveTask(null);
        setTimer(0);
        fetchTasks();
    };

    const completeTask = async (task) => {
        await api.put(`/tasks/${task._id}`, { status: 'completed' });
        if (activeTask?._id === task._id) {
            setActiveTask(null);
            setTimer(0);
        }
        fetchTasks();
    };

    const updateTaskStatus = async (id, status) => {
        await api.put(`/tasks/${id}`, { status });
        fetchTasks();
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Task <span className="text-gradient">Manager</span></h1>
                    <p className="text-slate-400 font-medium">Coordinate your development lifecycle and track velocity.</p>
                </div>
                {activeTask && (
                    <div className="flex items-center space-x-4 px-6 py-3 rounded-2xl glass-card border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-pulse">
                        <Clock className="text-indigo-400" size={20} />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            Syncing: {activeTask.title} ({formatTime(timer)})
                        </span>
                    </div>
                )}
            </div>

            {/* Add Task Form */}
            <div className="glass-card p-8 border-white/5 mb-10">
                <form onSubmit={handleAddTask} className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Objective Title"
                            className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Additional Context (Optional)"
                            className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary flex items-center shadow-indigo-500/40"
                    >
                        <Plus size={20} className="mr-2" />
                        Initialize Task
                    </button>
                </form>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className={`glass-card p-6 border-white/5 flex justify-between items-center group transition-all duration-300 hover:bg-white/5 ${task.status === 'completed' ? 'opacity-60 grayscale' : ''
                            } ${activeTask?._id === task._id ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                    >
                        <div className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                    task.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-400'
                                }`}>
                                {task.status === 'completed' ? <Square size={20} fill="currentColor" /> : <Play size={20} />}
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                                <div className="flex items-center space-x-4 mt-1">
                                    <p className="text-slate-500 text-xs font-medium">{task.description || 'No description provided.'}</p>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                                        Total Log: {formatTime(task.duration)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {task.status !== 'completed' && (
                                <div className="flex items-center bg-slate-900/50 rounded-2xl p-1 border border-white/5">
                                    {activeTask?._id === task._id ? (
                                        <button
                                            onClick={stopTimer}
                                            className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                                            title="Pause Tracking"
                                        >
                                            <Pause size={18} fill="currentColor" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startTimer(task)}
                                            className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all"
                                            title="Resume Tracking"
                                        >
                                            <Play size={18} fill="currentColor" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => completeTask(task)}
                                        className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all"
                                        title="Finalize Objective"
                                    >
                                        <Square size={18} />
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                title="Purge Record"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="glass-card p-20 text-center border-dashed border-white/10">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Plus className="text-slate-600" size={32} />
                        </div>
                        <h4 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Awaiting Objectives</h4>
                        <p className="text-slate-600 text-sm mt-2">Initialize your first task to start tracking velocity.</p>
                    </div>
                )}
            </div>
        </Layout>

    );
};

export default TaskManager;
