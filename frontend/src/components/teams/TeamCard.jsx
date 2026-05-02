import React from 'react';
import GlassCard from '../ui/GlassCard.jsx';
import Avatar from '../ui/Avatar.jsx';
import { Users, ArrowRight } from 'lucide-react';

export default function TeamCard({ team, onClick }) {
  const memberCount = team.members?.length || 0;

  return (
    <GlassCard className="team-card" onClick={() => onClick?.(team)} style={{ cursor: 'pointer' }}>
      <div className="team-card__header">
        <h3>{team.name}</h3>
        <span className="team-card__count"><Users size={14} /> {memberCount}</span>
      </div>
      {team.description && <p className="team-card__desc">{team.description}</p>}
      <div className="team-card__members">
        {(team.members || []).slice(0, 5).map((m) => (
          <Avatar key={m.uid} name={m.uid.slice(0, 5)} size={28} />
        ))}
        {memberCount > 5 && <span className="team-card__more">+{memberCount - 5}</span>}
      </div>
      <div className="team-card__footer">
        <span className="team-card__role">{team.ownerId ? 'Owner' : 'Member'}</span>
        <ArrowRight size={16} />
      </div>
    </GlassCard>
  );
}
