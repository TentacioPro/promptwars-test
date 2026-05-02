import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import MemberList from '../components/teams/MemberList.jsx';
import InviteCode from '../components/teams/InviteCode.jsx';
import TeamFormModal from '../components/teams/TeamFormModal.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';
import toast from 'react-hot-toast';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: team, loading, execute: fetchTeam } = useApi(teamsAPI.get);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => { if (id) fetchTeam(id); }, [id]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;
    try {
      await teamsAPI.delete(id);
      toast.success('Team deleted');
      navigate('/teams');
    } catch (err) { toast.error(err.message); }
  }

  async function handleRemoveMember(uid) {
    try {
      await teamsAPI.removeMember(id, uid);
      toast.success('Member removed');
      fetchTeam(id);
    } catch (err) { toast.error(err.message); }
  }

  if (loading || !team) return <Skeleton variant="card" height={400} className="max-w-7xl mx-auto rounded-xl" />;

  const isOwner = team.ownerId === user?.uid;

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      <button 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit mb-6" 
        onClick={() => navigate('/teams')}
      >
        <Icon name="arrow_back" className="text-[20px]" /> Back to Teams
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c63ff]/20 to-[#3529c2]/20 border border-[#6c63ff]/30 flex items-center justify-center">
            <Icon name="diversity_3" className="text-[#6c63ff] text-[32px]" />
          </div>
          <div>
            <h1 className="font-h1 text-[32px] leading-[1.2] font-bold text-white tracking-tight">{team.name}</h1>
            {team.description && <p className="text-slate-400 font-subtitle text-sm mt-1 max-w-2xl">{team.description}</p>}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex items-center gap-3">
            <button 
              className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 flex items-center gap-2 transition-all border border-white/5"
              onClick={() => setShowEdit(true)}
            >
              <Icon name="edit" className="text-[18px]" /> Edit Team
            </button>
            <button 
              className="px-5 py-2.5 rounded-xl font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 flex items-center gap-2 transition-all border border-red-500/20"
              onClick={handleDelete}
            >
              <Icon name="delete" className="text-[18px]" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icon name="group" className="text-[#6c63ff]" /> Team Members
          </h2>
          <MemberList members={team.members} ownerId={team.ownerId} onRemove={handleRemoveMember} currentUserId={user?.uid} />
        </div>
        
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-[#6c63ff]/20 shadow-[0_0_20px_rgba(108,99,255,0.05)]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="person_add" className="text-[#6c63ff]" /> Invite Link
            </h2>
            <InviteCode teamId={id} code={team.inviteCode} isOwner={isOwner} />
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="info" className="text-[#6c63ff]" /> Team Info
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Created By</span>
                <span className="text-sm text-slate-300">{team.ownerId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Total Members</span>
                <span className="text-sm text-slate-300">{team.members?.length || 0} active members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeamFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onSuccess={() => fetchTeam(id)} team={team} />
    </div>
  );
}
