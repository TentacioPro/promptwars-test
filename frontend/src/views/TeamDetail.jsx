import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import MemberList from '../components/teams/MemberList.jsx';
import InviteCode from '../components/teams/InviteCode.jsx';
import TeamFormModal from '../components/teams/TeamFormModal.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: team, loading, execute: fetchTeam } = useApi(teamsAPI.get);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => { if (id) fetchTeam(id); }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this team? This cannot be undone.')) return;
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

  if (loading || !team) return <Skeleton variant="card" height={400} />;

  const isOwner = team.ownerId === user?.uid;

  return (
    <div className="team-detail-page">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate('/teams')}><ArrowLeft size={16} /> Back to Teams</button>

      <div className="team-detail-page__header">
        <div>
          <h1>{team.name}</h1>
          {team.description && <p>{team.description}</p>}
        </div>
        {isOwner && (
          <div className="team-detail-page__actions">
            <button className="btn btn--ghost btn--sm" onClick={() => setShowEdit(true)}><Edit size={16} /> Edit</button>
            <button className="btn btn--danger btn--sm" onClick={handleDelete}><Trash2 size={16} /> Delete</button>
          </div>
        )}
      </div>

      <div className="team-detail-page__body">
        <GlassCard className="team-detail-page__members">
          <MemberList members={team.members} ownerId={team.ownerId} onRemove={handleRemoveMember} currentUserId={user?.uid} />
        </GlassCard>
        <GlassCard className="team-detail-page__invite">
          <InviteCode teamId={id} code={team.inviteCode} isOwner={isOwner} />
        </GlassCard>
      </div>

      <TeamFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} onSuccess={() => fetchTeam(id)} team={team} />
    </div>
  );
}
