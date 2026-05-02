import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard.jsx';

const STATUS_CONFIG = {
  todo: { color: 'bg-slate-400', colorCode: '#94a3b8', label: 'To Do', glowClass: '' },
  in_progress: { color: 'bg-[#60a5fa]', colorCode: '#60a5fa', label: 'In Progress', glowClass: 'ring-2 ring-[#60a5fa]/30 shadow-[0_0_30px_rgba(96,165,250,0.1)]' },
  review: { color: 'bg-[#c084fc]', colorCode: '#c084fc', label: 'Review', glowClass: '' },
  done: { color: 'bg-[#4ade80]', colorCode: '#4ade80', label: 'Done', glowClass: '' },
};

export default function KanbanColumn({ status, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  return (
    <div
      ref={setNodeRef}
      className={`glass-panel p-6 rounded-xl flex flex-col gap-4 min-h-[716px] transition-all ${isOver ? config.glowClass || 'ring-2 ring-white/20' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
          <h3 className="font-subtitle text-sm font-bold text-white uppercase tracking-wider">{config.label}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${config.colorCode}33`, color: config.colorCode }}>
          {tasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
        
        {/* Drop placeholder when empty */}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-white/5 rounded-xl h-24 flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined text-[32px]">move_to_inbox</span>
          </div>
        )}
      </div>
    </div>
  );
}
