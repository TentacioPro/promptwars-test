import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import TeamCard from '../components/teams/TeamCard.jsx';
import TeamFormModal from '../components/teams/TeamFormModal.jsx';
import JoinTeamModal from '../components/teams/JoinTeamModal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { Plus, UserPlus, Users } from 'lucide-react';

export default function TeamsList() {
  const { data, loading, execute: fetchTeams } = useApi(teamsAPI.list);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => { fetchTeams(); }, []);

  const teams = data?.teams || [];

  return (
    <div className="teams-page">
      <div className="teams-page__header">
        <h1 className="page-title">Teams</h1>
        <div className="teams-page__actions">
          <button className="btn btn--ghost btn--sm" onClick={() => setShowJoin(true)}><UserPlus size={16} /> Join Team</button>
          <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(true)}><Plus size={16} /> Create Team</button>
        </div>
      </div>

      {loading ? (
        <div className="teams-grid"><Skeleton variant="card" count={3} height={160} /></div>
      ) : teams.length === 0 ? (
        <EmptyState icon={Users} title="No teams yet" message="Create a team or join one with an invite code" action={() => setShowCreate(true)} actionLabel="Create Team" />
      ) : (
        <div className="teams-grid">
          {teams.map((t) => <TeamCard key={t.id} team={t} onClick={() => navigate(`/teams/${t.id}`)} />)}
        </div>
      )}

      <TeamFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchTeams} />
      <JoinTeamModal isOpen={showJoin} onClose={() => setShowJoin(false)} onSuccess={fetchTeams} />
    </div>
  );
}
