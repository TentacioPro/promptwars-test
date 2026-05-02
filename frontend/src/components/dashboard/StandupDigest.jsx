import React, { useEffect } from 'react';
import { dashboardAPI } from '../../lib/api.js';
import useApi from '../../hooks/useApi.js';
import Skeleton from '../ui/Skeleton.jsx';

export default function StandupDigest() {
  const { data, loading, execute } = useApi(dashboardAPI.standup);

  useEffect(() => { execute(); }, []);

  if (loading) return <Skeleton variant="text" count={4} height={16} />;

  const digest = data?.digest;
  if (!digest) return <p style={{ opacity: 0.5 }}>No standup digest yet. AI will generate one from your team's activity.</p>;

  return (
    <div className="standup-digest">
      <div className="standup-digest__date">📅 {digest.date}</div>
      {(digest.summaries || []).map((s, i) => (
        <div key={i} className="standup-digest__member">
          <strong>{s.displayName}</strong>
          {s.completed?.length > 0 && <div className="standup-digest__section">✅ {s.completed.join(', ')}</div>}
          {s.inProgress?.length > 0 && <div className="standup-digest__section">🔄 {s.inProgress.join(', ')}</div>}
          {s.blocked?.length > 0 && <div className="standup-digest__section">🚫 {s.blocked.join(', ')}</div>}
          <span className={`standup-digest__velocity standup-digest__velocity--${s.velocity}`}>{s.velocity?.replace('_', ' ')}</span>
        </div>
      ))}
    </div>
  );
}
