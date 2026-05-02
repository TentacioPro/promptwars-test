import React from 'react';

const STATUS_CONFIG = {
  todo: { label: 'To Do', className: 'status-badge--todo' },
  in_progress: { label: 'In Progress', className: 'status-badge--in-progress' },
  review: { label: 'Review', className: 'status-badge--review' },
  done: { label: 'Done', className: 'status-badge--done' },
};

/**
 * Color-coded status pill badge.
 */
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
