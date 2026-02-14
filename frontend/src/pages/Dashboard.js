import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Clock, CheckCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Layout><div>Loading analytics...</div></Layout>;
    if (!analytics) return <Layout><div>Error loading data</div></Layout>;

    const barData = {
        labels: analytics.weekly.chartData.map(d => d.date),
        datasets: [
            {
                label: 'Focus Time (seconds)',
                data: analytics.weekly.chartData.map(d => d.time),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
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
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Today's Focus Time</p>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {formatTime(analytics.daily.totalTime)}
                        </h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Tasks Completed Today</p>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {analytics.daily.tasksCompleted}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Weekly Activity</h3>
                    <Bar data={barData} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Today's Tasks</h3>
                    {analytics.daily.tasks.length > 0 ? (
                        <ul className="space-y-3">
                            {analytics.daily.tasks.map(task => (
                                <li key={task._id} className="flex justify-between items-center p-2 border-b">
                                    <span className={task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}>
                                        {task.title}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${task.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {task.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center py-4">No activity today yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
