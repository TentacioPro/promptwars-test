import React from 'react';
import Avatar from '../ui/Avatar.jsx';
import { Crown, UserMinus } from 'lucide-react';

export default function MemberList({ members = [], ownerId, onRemove, currentUserId }) {
  return (
    <div className="member-list">
      <h4>Members ({members.length})</h4>
      {members.map((m) => (
        <div key={m.uid} className="member-list__item">
          <Avatar name={m.uid.slice(0, 5)} size={32} />
          <div className="member-list__info">
            <span className="member-list__name">{m.uid}</span>
            <span className="member-list__role">
              {m.role === 'owner' && <><Crown size={12} /> Owner</>}
              {m.role === 'member' && 'Member'}
            </span>
          </div>
          {onRemove && currentUserId === ownerId && m.uid !== ownerId && (
            <button onClick={() => onRemove(m.uid)} className="btn btn--ghost btn--sm" aria-label="Remove member">
              <UserMinus size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
