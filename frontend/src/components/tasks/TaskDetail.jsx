import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import StatusBadge from '../ui/StatusBadge.jsx';
import PriorityBadge from '../ui/PriorityBadge.jsx';
import SkillTag from '../ui/SkillTag.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import CommentsThread from './CommentsThread.jsx';
import AttachmentList from './AttachmentList.jsx';
import AISuggestion from './AISuggestion.jsx';
import { X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Task detail side panel — full info, comments, attachments, AI suggestion, status controls.
 */
export default function TaskDetail({ taskId, onClose, onUpdate }) {
  const { data: task, loading, execute } = useApi(tasksAPI.get);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (taskId) execute(taskId);
  }, [taskId]);

  useEffect(() => {
    if (task) setStatus(task.status);
  }, [task]);

  async function handleStatusChange(newStatus) {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      setStatus(newStatus);
      toast.success(`Status changed to ${newStatus}`);
      onUpdate?.();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      toast.success('Task deleted');
      onClose?.();
      onUpdate?.();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading || !task) return <div className="task-detail glass-panel"><Skeleton variant="card" height={300} /></div>;

  return (
    <div className="task-detail glass-panel">
      <div className="task-detail__header">
        <h2>{task.title}</h2>
        <div className="task-detail__actions">
          <button onClick={handleDelete} className="btn btn--danger" aria-label="Delete task"><Trash2 size={16} /></button>
          <button onClick={onClose} className="btn btn--ghost" aria-label="Close"><X size={16} /></button>
        </div>
      </div>

      <div className="task-detail__meta">
        <StatusBadge status={status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Status controls */}
      <div className="task-detail__status-controls">
        {['todo', 'in_progress', 'review', 'done'].map((s) => (
          <button key={s} className={`btn btn--sm ${s === status ? 'btn--primary' : 'btn--ghost'}`} onClick={() => handleStatusChange(s)}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {task.description && <p className="task-detail__description">{task.description}</p>}

      {task.dueDate && <div className="task-detail__field">📅 Due: {new Date(task.dueDate).toLocaleDateString()}</div>}

      {task.requiredSkills?.length > 0 && (
        <div className="task-detail__skills">
          <strong>Required Skills:</strong>
          <div className="task-detail__skill-list">{task.requiredSkills.map((s) => <SkillTag key={s} skill={s} />)}</div>
        </div>
      )}

      {/* AI Suggestion */}
      {task.teamId && task.requiredSkills?.length > 0 && (
        <AISuggestion taskId={taskId} teamId={task.teamId} requiredSkills={task.requiredSkills} />
      )}

      {/* Attachments */}
      <AttachmentList taskId={taskId} attachments={task.attachments || []} />

      {/* Comments */}
      <CommentsThread taskId={taskId} comments={task.comments || []} />
    </div>
  );
}
