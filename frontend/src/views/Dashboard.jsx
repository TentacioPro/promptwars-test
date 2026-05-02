import React from 'react';
import { useApi } from '../hooks/useApi.js';
import Icon from '../components/ui/Icon.jsx';

export default function Dashboard() {
  const { data: stats } = useApi('/api/dashboard/stats');
  const { data: recentActivity } = useApi('/api/dashboard/activity');

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      {/* Page Title */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-h1 text-[40px] leading-[1.2] font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-slate-400 mt-1">Coordination overview for Q3 Skill Development</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            AI Engine: Active
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="check_box" iconColor="text-slate-400" label="Backlog" value={stats?.totalTasks || "5"} sublabel="To Do Tasks" />
        <StatCard icon="schedule" iconColor="text-blue-400" label="Active" value="3" sublabel="In Progress" />
        <StatCard icon="visibility" iconColor="text-purple-400" label="Quality" value="2" sublabel="Under Review" />
        <StatCard icon="check_circle" iconColor="text-green-400" label="Success" value="8" sublabel="Completed" isPrimary />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Activity Feed (Span 8) */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span>📋</span> Activity Feed
            </h3>
            <button className="text-xs text-[#6c63ff] font-bold uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <ActivityItem emoji="🚀" title="Cloud Architecture Refactor" action="Created task" author="Sarah Chen" time="2h ago" />
            <div className="border-t border-white/5 w-full"></div>
            <ActivityItem emoji="🔄" title="ML Pipeline Optimization" action="Changed status to In Progress on" author="Marcus Thorne" time="4h ago" />
            <div className="border-t border-white/5 w-full"></div>
            <ActivityItem emoji="✅" title="Accessibility Audit v2" action="Completed" author="Elena Ruiz" time="6h ago" />
          </div>
        </div>

        {/* Burnout Radar (Span 4) */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-xl flex flex-col h-full">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span>🔥</span> Burnout Radar
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <BurnoutItem initials="SC" name="Sarah Chen" tasks="4 active tasks" color="bg-[#1b0091]" indicator="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <BurnoutItem initials="MT" name="Marcus Thorne" tasks="7 active tasks" color="bg-[#502500]" indicator="bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            <BurnoutItem initials="ER" name="Elena Ruiz" tasks="2 active tasks" color="bg-[#1c00a6]" indicator="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <BurnoutItem initials="JK" name="Julian Kim" tasks="12 active tasks" color="bg-[#690005]" indicator="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            
            <div className="mt-4 p-4 glass-panel rounded-xl bg-[#c4c0ff]/10 border-[#c4c0ff]/20">
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-[#c4c0ff] font-bold">AI Insight:</span> Julian is at high risk of burnout. Recommend reallocating 3 tasks to Elena.
              </p>
            </div>
          </div>
        </div>

        {/* Auto-Standup (Span 4) */}
        <div className="col-span-12 lg:col-span-4 glass-panel-heavy ai-glow rounded-xl flex flex-col h-full border-[#6c63ff]/30">
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span>🤖</span> Auto-Standup
              </h3>
              <p className="text-[10px] text-[#c4c0ff]/80 font-bold uppercase tracking-wider mt-1">Aug 24, 2026</p>
            </div>
            <Icon name="auto_awesome" className="text-[#6c63ff]" />
          </div>
          <div className="p-6 space-y-6">
            <StandupItem name="Sarah Chen" status="ON TRACK" statusColor="text-green-400 bg-green-500/10 border-green-500/20" done="4" active="2" blocked="0" />
            <StandupItem name="Julian Kim" status="BEHIND" statusColor="text-red-400 bg-red-500/10 border-red-500/20" done="1" active="8" blocked="3" />
          </div>
        </div>

        {/* Sprint Progress (Span 8) */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-xl flex flex-col h-full">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span>📊</span> Sprint Progress
            </h3>
          </div>
          <div className="p-8 space-y-8 flex-1 flex flex-col justify-center">
            <div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-4xl font-black text-white">68%</span>
                  <span className="text-slate-500 ml-2 font-medium">Completion</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">18 / 26 Tasks</p>
                  <p className="text-xs text-slate-400">4 days remaining</p>
                </div>
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4c0ff] to-[#372cc5] rounded-full shadow-[0_0_15px_rgba(108,99,255,0.5)] transition-all duration-1000" style={{width: '68%'}}>
                  <div className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Velocity</p>
                <p className="text-xl font-bold text-white">4.2 <span className="text-xs text-green-400">+0.8</span></p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Bottlenecks</p>
                <p className="text-xl font-bold text-white">2 <span className="text-xs text-slate-500">Low</span></p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Efficiency</p>
                <p className="text-xl font-bold text-white">92%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconColor, label, value, sublabel, isPrimary }) {
  return (
    <div className={`glass-panel p-6 rounded-xl hover:bg-white/10 transition-all group ${isPrimary ? 'border-[#c4c0ff]/20 bg-[#c4c0ff]/5' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <Icon name={icon} className={`${iconColor} group-hover:scale-110 transition-transform`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isPrimary ? 'text-green-400/50' : 'text-slate-500'}`}>{label}</span>
      </div>
      <div className="text-[40px] leading-[1.2] font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{sublabel}</div>
    </div>
  );
}

function ActivityItem({ emoji, title, action, author, time }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-lg">{emoji}</div>
      <div className="flex-1">
        <p className="text-slate-200 text-sm">
          {action} <span className="text-white font-semibold">"{title}"</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">{author} • {time}</p>
      </div>
    </div>
  );
}

function BurnoutItem({ initials, name, tasks, color, indicator }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-white`}>
          {initials}
        </div>
        <div>
          <p className="text-sm text-white font-medium">{name}</p>
          <p className="text-[10px] text-slate-500">{tasks}</p>
        </div>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full ${indicator}`}></div>
    </div>
  );
}

function StandupItem({ name, status, statusColor, done, active, blocked }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-bold text-white text-sm">{name}</p>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="text-green-500">✅</span> {done}</div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="text-blue-500">🔄</span> {active}</div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="text-red-500">🚫</span> {blocked}</div>
      </div>
    </div>
  );
}
