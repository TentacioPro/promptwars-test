import React from 'react';
import { Bell, CheckSquare, MessageSquare, Users, AlertTriangle } from 'lucide-react';

const TYPE_ICONS = {
  task_assigned: CheckSquare,
  status_changed: CheckSquare,
  comment_added: MessageSquare,
  team_invite: Users,
  burnout_alert: AlertTriangle,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationItem({ notification, onMarkRead }) {
  const Icon = TYPE_ICONS[notification.type] || Bell;

  return (
    <div
      className={`notification-item ${notification.read ? 'notification-item--read' : 'notification-item--unread'}`}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
      role="button"
      tabIndex={0}
    >
      <div className="notification-item__icon"><Icon size={18} /></div>
      <div className="notification-item__body">
        <p className="notification-item__message">{notification.message}</p>
        <span className="notification-item__time">{timeAgo(notification.createdAt)}</span>
      </div>
      {!notification.read && <span className="notification-item__dot" />}
    </div>
  );
}
