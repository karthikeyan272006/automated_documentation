import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LayoutDashboard, ListTodo, FileText, Settings, LogOut, Shield, Zap, History } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={22} />, label: 'Overview' },
        { path: '/tasks', icon: <ListTodo size={22} />, label: 'Work Space' },
        { path: '/activity', icon: <History size={22} />, label: 'Tracker' },
        { path: '/reports', icon: <FileText size={22} />, label: 'Analytics' },
    ];

    if (user && user.role === 'admin') {
        navItems.push({ path: '/admin', icon: <Shield size={22} />, label: 'Admin Hub' });
    }

    return (
        <aside className="fixed left-6 top-6 bottom-6 w-64 glass-card border-white/5 flex flex-col z-50">
            <div className="p-8 pb-10">
                <div className="flex items-center space-x-3 group">
                    <div className="p-2 bg-violet-600 rounded-xl shadow-lg shadow-violet-500/30 group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={24} className="text-white" fill="white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gradient tracking-tight">
                        AutoDocs
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <p className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-4">Core Navigation</p>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className={`${isActive(item.path) ? 'text-violet-400' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-semibold text-emerald-500">Live Engine</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Tracking user activity</p>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-3 p-4 w-full rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all duration-300 border border-red-500/10"
                >
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

