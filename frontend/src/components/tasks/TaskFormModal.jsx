import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import toast from 'react-hot-toast';
import { tasksAPI } from '../../lib/api.js';

const STATUSES = ['todo', 'in_progress', 'review', 'done'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

/**
 * Create/Edit task modal form. If `task` prop is passed, operates in edit mode.
 */
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'} size="large">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title">Title *</label>
          <input id="task-title" name="title" value={form.title} onChange={handleChange} required maxLength={200} className="input" placeholder="Task title" />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description</label>
          <textarea id="task-desc" name="description" value={form.description} onChange={handleChange} maxLength={2000} className="input" rows={3} placeholder="Describe the task..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-status">Status</label>
            <select id="task-status" name="status" value={form.status} onChange={handleChange} className="input">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" name="priority" value={form.priority} onChange={handleChange} className="input">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-team">Team ID *</label>
            <input id="task-team" name="teamId" value={form.teamId} onChange={handleChange} required className="input" placeholder="Team ID" />
          </div>
          <div className="form-group">
            <label htmlFor="task-assignee">Assignee ID</label>
            <input id="task-assignee" name="assigneeId" value={form.assigneeId} onChange={handleChange} className="input" placeholder="(optional)" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-due">Due Date</label>
          <input id="task-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="input" />
        </div>

        <div className="form-group">
          <label htmlFor="task-tags">Tags (comma-separated)</label>
          <input id="task-tags" name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="frontend, auth, bug" />
        </div>

        <div className="form-group">
          <label htmlFor="task-skills">Required Skills (comma-separated)</label>
          <input id="task-skills" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} className="input" placeholder="React, Node.js, Firebase" />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn btn--ghost">Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
