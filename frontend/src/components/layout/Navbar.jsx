import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import Icon from '../ui/Icon.jsx';

export default function Navbar({ onToggleSidebar }) {
  const { user, profile, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0a14]/80 backdrop-blur-xl flex justify-between items-center h-16 px-6 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Skill Hub
        </Link>
        <div className="hidden md:flex gap-6">
          <Link to="/" className="font-inter text-sm font-semibold text-[#6c63ff] transition-colors duration-200">Dashboard</Link>
          <Link to="/teams" className="font-inter text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors duration-200 px-2 py-1 rounded">Team</Link>
          <Link to="/tasks" className="font-inter text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors duration-200 px-2 py-1 rounded">Projects</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary transition-all w-64 text-white" placeholder="Search insights..." type="text" />
        </div>

        <Link to="/notifications" className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white flex items-center justify-center">
          <Icon name="notifications" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a14]"></span>
          )}
        </Link>

        <Link to="/settings" className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white flex items-center justify-center">
          <Icon name="settings" />
        </Link>

        <div className="relative ml-2">
          <button 
            className="w-8 h-8 rounded-full overflow-hidden border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || user?.email || 'User')}&background=0D8ABC&color=fff`} 
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#12121e] border border-white/10 rounded-xl shadow-xl py-1 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-sm text-white font-medium truncate">{profile?.displayName || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setDropdownOpen(false)}>
                <Icon name="person" className="text-[18px]" /> Profile
              </Link>
              <button 
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 text-left"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <Icon name="logout" className="text-[18px]" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
