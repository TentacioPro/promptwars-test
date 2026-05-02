import React from 'react';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import PriorityBadge from '../components/ui/PriorityBadge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { CheckSquare } from 'lucide-react';

export default function TaskList({ tasks = [], loading, onRefresh, onTaskClick }) {
  if (loading) return <Skeleton variant="text" count={8} height={40} />;
  if (tasks.length === 0) return <EmptyState icon={CheckSquare} title="No tasks" message="Create your first task to get started" />;

  return (
    <div className="task-list-page">
      <h1 className="page-title">Tasks — List View</h1>
      <div className="task-table">
        <div className="task-table__header">
          <span>Title</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Due Date</span>
          <span>Assignee</span>
        </div>
        {tasks.map((t) => (
          <div key={t.id} className="task-table__row" onClick={() => onTaskClick?.(t)} role="button" tabIndex={0}>
            <span className="task-table__title">{t.title}</span>
            <span><StatusBadge status={t.status} /></span>
            <span><PriorityBadge priority={t.priority || 'medium'} /></span>
            <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</span>
            <span>{t.assigneeId?.slice(0, 8) || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
