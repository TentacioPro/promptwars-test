import React, { useEffect } from 'react';
import { dashboardAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import HealthIndicator from '../ui/HealthIndicator.jsx';
import Skeleton from '../ui/Skeleton.jsx';

export default function HealthHeatmap() {
  const { data, loading, execute } = useApi(dashboardAPI.healthMap);

  useEffect(() => { execute(); }, []);

  if (loading) return <Skeleton variant="card" height={100} />;

  const heatmap = data?.heatmap || [];
  if (heatmap.length === 0) return <p style={{ opacity: 0.5 }}>No workload data yet</p>;

  return (
    <div className="health-heatmap">
      <div className="health-heatmap__grid">
        {heatmap.map((m) => (
          <div key={m.uid} className="health-heatmap__cell">
            <HealthIndicator intensity={m.intensity} size={16} />
            <div className="health-heatmap__info">
              <span className="health-heatmap__name">{m.uid.slice(0, 8)}</span>
              <span className="health-heatmap__count">{m.activeTasks} active</span>
            </div>
          </div>
        ))}
      </div>
      <div className="health-heatmap__legend">
        {['low', 'medium', 'high', 'critical'].map((i) => (
          <span key={i}><HealthIndicator intensity={i} size={8} showLabel /></span>
        ))}
      </div>
    </div>
  );
}
