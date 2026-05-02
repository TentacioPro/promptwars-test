import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import TeamCard from '../components/teams/TeamCard.jsx';
import TeamFormModal from '../components/teams/TeamFormModal.jsx';
import JoinTeamModal from '../components/teams/JoinTeamModal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';

export default function TeamsList() {
  const { data, loading, execute: fetchTeams } = useApi(teamsAPI.list);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => { fetchTeams(); }, []);

  const teams = data?.teams || [];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-h1 text-[40px] leading-[1.2] font-bold text-white tracking-tight">Teams</h1>
          <p className="text-slate-400 font-subtitle text-sm mt-1">Manage cross-functional squads and align their skills</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="px-6 py-2.5 rounded-xl font-bold text-[#c4c0ff] hover:text-white bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 flex items-center gap-2 transition-all"
            onClick={() => setShowJoin(true)}
          >
            <Icon name="person_add" /> Join Team
          </button>
          <button 
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(108,99,255,0.2)]"
            onClick={() => setShowCreate(true)}
          >
            <Icon name="add" /> Create Team
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" count={3} height={160} className="rounded-xl" />
        </div>
      ) : teams.length === 0 ? (
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center p-16 border-dashed border-white/20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Icon name="groups" className="text-[32px] text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No teams yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm">Create a new team to start collaborating or join an existing one using an invite code.</p>
          <button 
            className="bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-all"
            onClick={() => setShowCreate(true)}
          >
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => <TeamCard key={t.id} team={t} onClick={() => navigate(`/teams/${t.id}`)} />)}
        </div>
      )}

      <TeamFormModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchTeams} />
      <JoinTeamModal isOpen={showJoin} onClose={() => setShowJoin(false)} onSuccess={fetchTeams} />
    </div>
  );
}
