import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 pt-20 bg-[#0a0a14] hidden md:flex flex-col overflow-y-auto z-40">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center border border-[#6c63ff]/30">
              <Icon name="psychology" className="text-[#6c63ff]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Skill Hub</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">AI Coordination</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 flex-grow">
          <SidebarLink to="/" icon="dashboard" label="Overview" exact />
          <SidebarLink to="/teams" icon="groups" label="Squads" />
          <SidebarLink to="/tasks" icon="format_list_bulleted" label="Tasks" />
          <SidebarLink to="/insights" icon="analytics" label="Insights" />
          <SidebarLink to="/profile" icon="person" label="Profile" />
        </div>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-[0_4px_20px_rgba(108,99,255,0.3)] flex items-center justify-center gap-2 mb-4">
            <Icon name="add" className="text-sm" />
            New Project
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <footer className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a14]/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <MobileNavLink to="/" icon="dashboard" label="Overview" exact />
        <MobileNavLink to="/teams" icon="groups" label="Team" />
        
        <button className="bg-[#6c63ff] w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-[#6c63ff]/40 transform transition-transform active:scale-95 border-4 border-[#0a0a14]">
          <Icon name="add" className="text-white" />
        </button>
        
        <MobileNavLink to="/tasks" icon="format_list_bulleted" label="Tasks" />
        <MobileNavLink to="/insights" icon="analytics" label="Insights" />
      </footer>
    </>
  );
}

function SidebarLink({ to, icon, label, exact }) {
  return (
    <NavLink 
      to={to} 
      end={exact}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 transition-all duration-200 ` +
        (isActive 
          ? "text-white bg-[#6c63ff]/10 border-r-2 border-[#6c63ff] shadow-[0_0_10px_rgba(108,99,255,0.2)]" 
          : "text-slate-400 hover:bg-white/5 hover:text-white")
      }
    >
      <Icon name={icon} />
      <span className="font-inter text-sm font-medium">{label}</span>
    </NavLink>
  );
}

function MobileNavLink({ to, icon, label, exact }) {
  return (
    <NavLink 
      to={to} 
      end={exact}
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ` +
        (isActive ? "text-[#6c63ff]" : "text-slate-400")
      }
    >
      <Icon name={icon} />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
