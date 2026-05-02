import React, { useEffect } from 'react';
import { dashboardAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import Skeleton from '../ui/Skeleton.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { Activity } from 'lucide-react';

const ACTION_LABELS = {
  task_created: '📝 Created task',
  task_status_changed: '🔄 Changed status',
  comment_added: '💬 Commented on',
  member_joined: '👋 Joined team',
  team_created: '🏗️ Created team',
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

export default function ActivityFeed() {
  const { data, loading, execute } = useApi(dashboardAPI.activity);

  useEffect(() => { execute(); }, []);

  if (loading) return <Skeleton variant="text" count={5} height={16} />;

  const activities = data?.activities || [];
  if (activities.length === 0) return <EmptyState icon={Activity} title="No activity yet" message="Activity will appear here as your team works" />;

  return (
    <div className="activity-feed">
      {activities.map((a) => (
        <div key={a.id} className="activity-feed__item">
          <span className="activity-feed__action">
            {ACTION_LABELS[a.action] || a.action}
          </span>
          {a.metadata?.title && <span className="activity-feed__entity"> "{a.metadata.title}"</span>}
          {a.metadata?.from && <span className="activity-feed__meta"> ({a.metadata.from} → {a.metadata.to})</span>}
          <span className="activity-feed__time">{timeAgo(a.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}
