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
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
                {activeTask && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full flex items-center shadow animate-pulse">
                        <Clock className="mr-2" size={20} />
                        Tracking: {activeTask.title} ({formatTime(timer)})
                    </div>
                )}
            </div>

            {/* Add Task Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <form onSubmit={handleAddTask} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Task Title"
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description (Optional)"
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <Plus size={20} className="mr-2" /> Add
                    </button>
                </form>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className={`bg-white p-5 rounded-lg shadow-sm flex justify-between items-center border-l-4 ${task.status === 'completed'
                                ? 'border-green-500 opacity-75'
                                : task.status === 'in-progress'
                                    ? 'border-yellow-500'
                                    : 'border-gray-300'
                            }`}
                    >
                        <div>
                            <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                            </h3>
                            <p className="text-gray-500 text-sm">{task.description}</p>
                            <span className="text-xs text-gray-400 mt-1 inline-block">
                                Total Time: {formatTime(task.duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {task.status !== 'completed' && (
                                <>
                                    {activeTask?._id === task._id ? (
                                        <button
                                            onClick={stopTimer}
                                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                            title="Stop Timer"
                                        >
                                            <Pause size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startTimer(task)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                            title="Start Timer"
                                        >
                                            <Play size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => completeTask(task)}
                                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                        title="Mark as Completed"
                                    >
                                        <Square size={20} />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="p-2 text-gray-400 hover:text-red-500"
                                title="Delete Task"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No tasks yet. Start by adding one above!
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TaskManager;
