import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout() {
  return (
    <div className="bg-[#0a0a14] min-h-screen text-[#f0f0f5]">
      <Navbar />
      <Sidebar />
      {/* 
        md:ml-64 -> pushes content past sidebar on desktop
        pt-24 -> pushes content past fixed navbar 
        pb-20 -> padding for mobile bottom nav
      */}
      <main className="md:ml-64 pt-24 px-4 md:px-8 pb-20 md:pb-12 min-h-screen transition-all">
        <Outlet />
      </main>
      
      {/* Background Gradient Effect matching design */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#c4c0ff]/10 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#3529c2]/5 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
}
