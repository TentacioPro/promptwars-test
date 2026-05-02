import React, { useEffect, useState } from 'react';
import { aiAPI } from '../../lib/api.js';
import HealthIndicator from '../ui/HealthIndicator.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import Avatar from '../ui/Avatar.jsx';

export default function BurnoutHeatmap({ teamId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    aiAPI.burnout(teamId).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <Skeleton variant="card" height={150} />;
  if (!data) return <p style={{ opacity: 0.5 }}>Select a team to view burnout data</p>;

  const scores = data.scores || [];

  return (
    <div className="burnout-heatmap">
      <h4>🔥 Burnout Radar</h4>
      <div className="burnout-heatmap__grid">
        {scores.map((s) => (
          <div key={s.uid} className="burnout-heatmap__cell">
            <Avatar name={s.displayName || s.uid} size={32} />
            <div className="burnout-heatmap__info">
              <strong>{s.displayName || s.uid.slice(0, 8)}</strong>
              <div className="burnout-heatmap__stats">
                <span>{s.activeTasks} active</span>
                {s.urgentTasks > 0 && <span style={{ color: '#f97316' }}>{s.urgentTasks} urgent</span>}
                {s.overdueTasks > 0 && <span style={{ color: '#ef4444' }}>{s.overdueTasks} overdue</span>}
              </div>
            </div>
            <HealthIndicator intensity={s.intensity} size={20} showLabel />
          </div>
        ))}
      </div>
    </div>
  );
}
