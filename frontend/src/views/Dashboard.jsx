import React from 'react';
import GlassCard from '../components/ui/GlassCard.jsx';
import StatCards from '../components/dashboard/StatCards.jsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import HealthHeatmap from '../components/dashboard/HealthHeatmap.jsx';
import StandupDigest from '../components/dashboard/StandupDigest.jsx';
import SprintProgress from '../components/dashboard/SprintProgress.jsx';

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      <StatCards />
      <div className="bento-grid">
        <GlassCard span={2} className="bento-item">
          <h3>📋 Activity Feed</h3>
          <ActivityFeed />
        </GlassCard>
        <GlassCard className="bento-item">
          <h3>🔥 Burnout Radar</h3>
          <HealthHeatmap />
        </GlassCard>
        <GlassCard className="bento-item">
          <h3>🤖 Auto-Standup</h3>
          <StandupDigest />
        </GlassCard>
        <GlassCard span={2} className="bento-item">
          <h3>📊 Sprint Progress</h3>
          <SprintProgress />
        </GlassCard>
      </div>
    </div>
  );
}
