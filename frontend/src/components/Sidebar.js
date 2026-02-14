import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, ListTodo, FileText, Settings, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth(); // Get user from auth context

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
        { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    ];

    if (user && user.role === 'admin') {
        navItems.push({ path: '/admin', icon: <Shield size={20} />, label: 'Admin Panel' });
    }

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AutoDocs
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${isActive(item.path)
                            ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                            : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
