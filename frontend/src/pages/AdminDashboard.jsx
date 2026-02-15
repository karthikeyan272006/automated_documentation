import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import { Users, Activity, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await api.get('/admin/users');
                const statsRes = await api.get('/admin/stats');
                setUsers(usersRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Layout><div>Loading Admin Panel...</div></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Panel</h1>

            {/* Overview Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <h2 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h2>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full mr-4 text-purple-600">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Tasks</p>
                            <h2 className="text-2xl font-bold text-gray-800">{stats.totalTasks}</h2>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center">
                        <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Completion Rate</p>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                            </h2>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">All Users</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-gray-50 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b last:border-0 hover:bg-gray-100 transition">
                                        <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Performers</h3>
                    {stats?.performance?.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.performance.map((p, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                index === 1 ? 'bg-gray-200 text-gray-600' :
                                                    'bg-orange-100 text-orange-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">{p.count} Tasks</p>
                                        <p className="text-xs text-gray-500">{(p.totalDuration / 3600).toFixed(1)} hrs</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-400 py-4">No performance data available.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
