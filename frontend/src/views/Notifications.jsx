import React from 'react';
import { useNotifications } from '../contexts/NotificationContext.jsx';
import NotificationItem from '../components/notifications/NotificationItem.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { Bell, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <h1 className="page-title">Notifications</h1>
        {unreadCount > 0 && (
          <button className="btn btn--ghost btn--sm" onClick={markAllRead}>
            <CheckCheck size={16} /> Mark all read ({unreadCount})
          </button>
        )}
      </div>
      {loading ? <Skeleton variant="text" count={6} height={50} /> :
        notifications.length === 0 ? <EmptyState icon={Bell} title="All caught up" /> :
        <div className="notifications-page__list">
          {notifications.map((n) => <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />)}
        </div>
      }
    </div>
  );
}
