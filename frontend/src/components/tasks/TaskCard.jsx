import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../ui/Icon.jsx';

const PRIORITY_CONFIG = {
  urgent: { color: 'bg-red-500/20 text-red-400', icon: 'priority_high' },
  high: { color: 'bg-orange-500/20 text-orange-400', icon: 'keyboard_arrow_up' },
  medium: { color: 'bg-slate-500/20 text-slate-400', icon: 'keyboard_double_arrow_up' },
  low: { color: 'bg-blue-500/20 text-blue-400', icon: 'keyboard_arrow_down' }
};

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const priority = PRIORITY_CONFIG[task.priority || 'medium'];
  const hasDue = task.dueDate;
  const isDone = task.status === 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`glass-card p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-white/20 transition-all group ${isDone ? 'opacity-60 grayscale-[0.3]' : ''}`}
      onClick={() => onClick?.(task)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${priority.color}`}>
          <Icon name={priority.icon} className="text-[14px]" />
          {task.priority || 'Medium'}
        </div>
        {task.tags?.length > 0 && (
          <div className="bg-[#6c63ff]/10 text-[#c3c0ff] px-2 py-0.5 rounded text-[10px] font-bold uppercase truncate max-w-[100px]">
            {task.tags[0]}
          </div>
        )}
      </div>

      <h4 className={`text-white font-bold mb-2 group-hover:text-[#c3c0ff] transition-colors ${isDone ? 'line-through' : ''}`}>
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 text-slate-500">
          {isDone ? (
            <div className="flex items-center gap-1 text-green-500/80">
              <Icon name="check_circle" className="text-[16px]" />
              <span className="text-[11px]">Completed</span>
            </div>
          ) : (
            <>
              {hasDue && (
                <div className="flex items-center gap-1">
                  <Icon name="calendar_today" className="text-[16px]" />
                  <span className="text-[11px]">{new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              )}
              {task.comments?.length > 0 && (
                <div className="flex items-center gap-1">
                  <Icon name="chat_bubble" className="text-[16px]" />
                  <span className="text-[11px]">{task.comments.length}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {task.assigneeId && (
          <img 
            alt="Assignee" 
            className="w-6 h-6 rounded-full border border-white/20 object-cover" 
            src={`https://ui-avatars.com/api/?name=${task.assigneeId}&background=0D8ABC&color=fff`} 
          />
        )}
      </div>
    </div>
  );
}
