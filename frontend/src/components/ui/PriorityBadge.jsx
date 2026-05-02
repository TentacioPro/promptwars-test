import React from 'react';
import { AlertTriangle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', icon: AlertTriangle, className: 'priority--urgent' },
  high: { label: 'High', icon: ArrowUp, className: 'priority--high' },
  medium: { label: 'Medium', icon: Minus, className: 'priority--medium' },
  low: { label: 'Low', icon: ArrowDown, className: 'priority--low' },
};

/**
 * Priority indicator with icon and label.
 */
export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const Icon = config.icon;
  return (
    <span className={`priority-badge ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}
