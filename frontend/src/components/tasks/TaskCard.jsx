import React from 'react';
import StatusBadge from '../ui/StatusBadge.jsx';
import PriorityBadge from '../ui/PriorityBadge.jsx';
import Avatar from '../ui/Avatar.jsx';
import { MessageSquare, Paperclip, Calendar } from 'lucide-react';

/**
 * Kanban task card — shows title, priority, assignee, due date, comment/attachment counts.
 */
export default function TaskCard({ task, onClick }) {
  const hasDue = task.dueDate;
  const isOverdue = hasDue && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="task-card" onClick={() => onClick?.(task)} role="button" tabIndex={0} aria-label={task.title}>
      <div className="task-card__header">
        <PriorityBadge priority={task.priority || 'medium'} />
        {task.tags?.length > 0 && (
          <span className="task-card__tag">{task.tags[0]}</span>
        )}
      </div>

      <h4 className="task-card__title">{task.title}</h4>

      {task.description && (
        <p className="task-card__desc">{task.description.slice(0, 80)}{task.description.length > 80 ? '...' : ''}</p>
      )}

      <div className="task-card__footer">
        <div className="task-card__meta">
          {hasDue && (
            <span className={`task-card__due ${isOverdue ? 'task-card__due--overdue' : ''}`}>
              <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.comments?.length > 0 && <span><MessageSquare size={12} /> {task.comments.length}</span>}
          {task.attachments?.length > 0 && <span><Paperclip size={12} /> {task.attachments.length}</span>}
        </div>
        {task.assigneeId && <Avatar name={task.assigneeId.slice(0, 5)} size={24} />}
      </div>
    </div>
  );
}
