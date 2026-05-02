import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import Skeleton from '../ui/Skeleton.jsx';
import CommentsThread from './CommentsThread.jsx';
import AttachmentList from './AttachmentList.jsx';
import AISuggestion from './AISuggestion.jsx';
import Icon from '../ui/Icon.jsx';
import toast from 'react-hot-toast';

export default function TaskDetail({ taskId, onClose, onUpdate }) {
  const { data: task, loading, execute } = useApi(tasksAPI.get);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (taskId) execute(taskId);
  }, [taskId]);

  useEffect(() => {
    if (task) setStatus(task?.task?.status || task?.status);
  }, [task]);

  const taskData = task?.task || task;

  async function handleStatusChange(newStatus) {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      setStatus(newStatus);
      toast.success(`Status changed to ${newStatus.replace('_', ' ')}`);
      onUpdate?.();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      toast.success('Task deleted successfully');
      onClose?.();
      onUpdate?.();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading || !taskData) {
    return (
      <div className="fixed inset-y-0 right-0 w-[500px] max-w-[90vw] glass-panel-heavy z-50 border-l border-white/10 shadow-2xl p-6 overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300">
        <Skeleton variant="card" height={300} />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a14]/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[500px] max-w-[90vw] glass-panel-heavy z-50 border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] p-0 overflow-y-auto transform transition-transform flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-2xl font-bold text-white leading-tight">{taskData.title}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full transition-colors">
                <Icon name="delete" className="text-[20px]" />
              </button>
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white/10 hover:text-white rounded-full transition-colors">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
          </div>

          {/* Quick Meta */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Icon name="tag" className="text-[14px]" />
              {taskData.tags?.[0] || 'Task'}
            </div>
            {taskData.priority && (
              <div className="flex items-center gap-1.5 text-orange-400">
                <Icon name="priority_high" className="text-[14px]" />
                {taskData.priority}
              </div>
            )}
            {taskData.dueDate && (
              <div className="flex items-center gap-1.5 text-blue-400">
                <Icon name="event" className="text-[14px]" />
                {new Date(taskData.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 flex-1">
          {/* Status Progress */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Status pipeline</h3>
            <div className="flex bg-[#0a0a14] p-1 rounded-xl border border-white/5 relative">
              {['todo', 'in_progress', 'review', 'done'].map((s) => (
                <button 
                  key={s} 
                  className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                    s === status 
                      ? 'bg-[#6c63ff] text-white shadow-[0_0_15px_rgba(108,99,255,0.4)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => handleStatusChange(s)}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          {taskData.description && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {taskData.description}
              </p>
            </div>
          )}

          {/* AI Suggestion */}
          {taskData.teamId && taskData.requiredSkills?.length > 0 && (
            <div className="ai-glow rounded-xl">
              <AISuggestion taskId={taskId} teamId={taskData.teamId} requiredSkills={taskData.requiredSkills} />
            </div>
          )}

          {/* Comments and Attachments */}
          <div className="space-y-6">
            <AttachmentList taskId={taskId} attachments={taskData.attachments || []} />
            <CommentsThread taskId={taskId} comments={taskData.comments || []} />
          </div>
        </div>

      </div>
    </>
  );
}
