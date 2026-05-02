import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard.jsx';

const STATUS_COLORS = {
  todo: '#94a3b8',
  in_progress: '#60a5fa',
  review: '#c084fc',
  done: '#4ade80',
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

/**
 * Droppable kanban column with task cards.
 */
export default function KanbanColumn({ status, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
    >
      <div className="kanban-column__header">
        <span className="kanban-column__indicator" style={{ backgroundColor: STATUS_COLORS[status] }} />
        <h3 className="kanban-column__title">{STATUS_LABELS[status] || status}</h3>
        <span className="kanban-column__count">{tasks.length}</span>
      </div>
      <div className="kanban-column__body">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}
