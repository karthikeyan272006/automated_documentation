import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    Clock,
    LayoutDashboard,
    CheckSquare,
    FileText,
    Users,
    DollarSign,
    Settings,
    Monitor
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Time Tracking', icon: <Clock size={20} />, path: '/tracker' },
        { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
        { name: 'Activity', icon: <Monitor size={20} />, path: '/activity-realtime' },
        { name: 'Attendance', icon: <Users size={20} />, path: '/attendance' },
        { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
        { name: 'Payroll', icon: <DollarSign size={20} />, path: '/payroll' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div className="sidebar-container">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                    <Clock size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">HubStaff <span className="text-indigo-600">Clone</span></span>
            </div>

            <nav className="flex-1 px-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        JD
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-slate-800 truncate">John Doe</span>
                        <span className="text-xs text-slate-500 truncate">john@example.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
