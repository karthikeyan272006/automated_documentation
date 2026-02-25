import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    console.log('Layout Rendering...');
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <main className="main-content flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
