import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#020617]">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

            <Sidebar />

            <main className="flex-1 ml-[320px] mr-8 my-6 z-10">
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;

