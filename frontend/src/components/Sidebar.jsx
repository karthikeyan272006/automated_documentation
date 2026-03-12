import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import {
    Clock,
    LayoutDashboard,
    CheckSquare,
    FileText,
    Users,
    DollarSign,
    Settings,
    Monitor,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const displayName = user?.name || 'User';
    const displayEmail = user?.email || '';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { name: 'Time Tracking', icon: <Clock size={20} />, path: '/time-tracking' },
        { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
        { name: 'Activity', icon: <Monitor size={20} />, path: '/activity-realtime' },
        { name: 'Attendance', icon: <Users size={20} />, path: '/attendance' },
        { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
        { name: 'Payroll', icon: <DollarSign size={20} />, path: '/payroll' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div className="sidebar-container h-full flex flex-col">

            {/* Logo Section (NO USERNAME HERE) */}
            <div className="p-5 flex items-center gap-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
                    <Clock size={22} />
                </div>
                <div className="flex flex-col leading-tight overflow-hidden">
                    <span className="text-lg font-bold tracking-tight text-slate-800">LogicDocs</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''} flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-slate-50`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom: User profile card + Sign out */}
            <div className="p-4 border-t border-slate-100 flex flex-col gap-3">

                {/* User Card: Avatar + Name + Email */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {avatarLetter}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-slate-800 truncate" title={displayName}>
                            {loading ? "Loading..." : (user?.name || 'User')}
                        </span>
                        <span className="text-xs text-slate-500 truncate" title={displayEmail}>
                            {user?.email}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
