import React, { useState, useEffect } from 'react';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import BurnoutHeatmap from '../components/insights/BurnoutHeatmap.jsx';
import SprintForecast from '../components/insights/SprintForecast.jsx';
import StandupFeed from '../components/insights/StandupFeed.jsx';
import SkillGaps from '../components/insights/SkillGaps.jsx';

export default function AIInsights() {
  const { data, execute: fetchTeams } = useApi(teamsAPI.list);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  useEffect(() => { fetchTeams(); }, []);
  useEffect(() => { if (data?.teams?.length && !selectedTeamId) setSelectedTeamId(data.teams[0].id); }, [data]);

  const teams = data?.teams || [];

  return (
    <div className="insights-page">
      <div className="insights-page__header">
        <h1 className="page-title">AI Insights</h1>
        <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)} className="input" style={{ maxWidth: 250 }}>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="bento-grid">
        <GlassCard span={2}><BurnoutHeatmap teamId={selectedTeamId} /></GlassCard>
        <GlassCard><SprintForecast teamId={selectedTeamId} /></GlassCard>
        <GlassCard><StandupFeed teamId={selectedTeamId} /></GlassCard>
        <GlassCard span={2}><SkillGaps /></GlassCard>
      </div>
    </div>
  );
}
