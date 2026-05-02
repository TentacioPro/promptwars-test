import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import toast from 'react-hot-toast';
import { tasksAPI } from '../../lib/api.js';

const STATUSES = ['todo', 'in_progress', 'review', 'done'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function TaskFormModal({ isOpen, onClose, onSuccess, task = null, teamId = '' }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    teamId: task?.teamId || teamId,
    assigneeId: task?.assigneeId || '',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    tags: task?.tags?.join(', ') || '',
    requiredSkills: task?.requiredSkills?.join(', ') || '',
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        teamId: form.teamId,
        assigneeId: form.assigneeId || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      if (isEdit) {
        await tasksAPI.update(task.id, payload);
        toast.success('Task updated');
      } else {
        await tasksAPI.create(payload);
        toast.success('Task created');
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'} size="medium">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="space-y-2">
          <label htmlFor="task-title" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title <span className="text-red-400">*</span></label>
          <input 
            id="task-title" name="title" value={form.title} onChange={handleChange} required maxLength={200} 
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
            placeholder="e.g. Implement real-time sync" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="task-desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
          <textarea 
            id="task-desc" name="description" value={form.description} onChange={handleChange} maxLength={2000} rows={4}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors resize-none" 
            placeholder="Detailed description of the task requirements..." 
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="task-status" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
            <select 
              id="task-status" name="status" value={form.status} onChange={handleChange} 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="task-priority" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</label>
            <select 
              id="task-priority" name="priority" value={form.priority} onChange={handleChange} 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="task-team" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team ID <span className="text-red-400">*</span></label>
            <input 
              id="task-team" name="teamId" value={form.teamId} onChange={handleChange} required 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
              placeholder="team_abc123" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="task-assignee" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assignee UID</label>
            <input 
              id="task-assignee" name="assigneeId" value={form.assigneeId} onChange={handleChange} 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
              placeholder="(optional)" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="task-due" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
          <input 
            id="task-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} 
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors block" 
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="task-tags" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tags (csv)</label>
            <input 
              id="task-tags" name="tags" value={form.tags} onChange={handleChange} 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
              placeholder="frontend, feature, bug" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="task-skills" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Required Skills (csv)</label>
            <input 
              id="task-skills" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} 
              className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
              placeholder="React, Node.js" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-8">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-[0_4px_20px_rgba(108,99,255,0.2)]"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
