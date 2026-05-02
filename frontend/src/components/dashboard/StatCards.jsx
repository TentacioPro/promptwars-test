import React, { useEffect } from 'react';
import { CheckSquare, Clock, Eye, CheckCircle } from 'lucide-react';
import { dashboardAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import GlassCard from '../ui/GlassCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';

const STAT_CARDS = [
  { key: 'todo', label: 'To Do', icon: CheckSquare, color: '#94a3b8' },
  { key: 'in_progress', label: 'In Progress', icon: Clock, color: '#60a5fa' },
  { key: 'review', label: 'Review', icon: Eye, color: '#c084fc' },
  { key: 'done', label: 'Done', icon: CheckCircle, color: '#4ade80' },
];

export default function StatCards() {
  const { data, loading, execute } = useApi(dashboardAPI.stats);

  useEffect(() => { execute(); }, []);

  if (loading || !data) {
    return (
      <div className="stat-cards">
        {STAT_CARDS.map((s) => <GlassCard key={s.key} className="stat-card"><Skeleton variant="card" height={80} /></GlassCard>)}
      </div>
    );
  }

  const counts = data.taskCounts || {};

  return (
    <div className="stat-cards">
      {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
        <GlassCard key={key} className="stat-card">
          <div className="stat-card__icon" style={{ color }}><Icon size={24} /></div>
          <div className="stat-card__info">
            <span className="stat-card__count">{counts[key] || 0}</span>
            <span className="stat-card__label">{label}</span>
          </div>
        </GlassCard>
      ))}
      <GlassCard className="stat-card">
        <div className="stat-card__info">
          <span className="stat-card__count">{counts.total || 0}</span>
          <span className="stat-card__label">Total Tasks</span>
        </div>
      </GlassCard>
      <GlassCard className="stat-card">
        <div className="stat-card__info">
          <span className="stat-card__count">{data.teamCount || 0}</span>
          <span className="stat-card__label">Teams</span>
        </div>
      </GlassCard>
    </div>
  );
}
