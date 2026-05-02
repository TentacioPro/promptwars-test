import React, { useEffect, useState } from 'react';
import { aiAPI } from '../../lib/api.js';
import Skeleton from '../ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function StandupFeed({ teamId }) {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!teamId) return;
    setLoading(true);
    try {
      const data = await aiAPI.standup(teamId);
      setDigest(data);
    } catch (err) {
      toast.error(err.message || 'Failed to generate standup');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Skeleton variant="text" count={6} height={16} />;

  if (!digest) {
    return (
      <div className="standup-feed">
        <h4>🤖 Auto-Standup</h4>
        <p style={{ opacity: 0.5 }}>Generate an AI-powered standup digest from your team's activity.</p>
        <button onClick={generate} className="btn btn--primary btn--sm" disabled={!teamId}>Generate Standup</button>
      </div>
    );
  }

  return (
    <div className="standup-feed">
      <h4>🤖 Standup — {digest.date}</h4>
      {(digest.summaries || []).map((s, i) => (
        <div key={i} className="standup-feed__member">
          <strong>{s.displayName}</strong>
          {s.completed?.length > 0 && <div>✅ Done: {s.completed.join(', ')}</div>}
          {s.inProgress?.length > 0 && <div>🔄 Working: {s.inProgress.join(', ')}</div>}
          {s.blocked?.length > 0 && <div>🚫 Blocked: {s.blocked.join(', ')}</div>}
        </div>
      ))}
      <button onClick={generate} className="btn btn--ghost btn--sm" style={{ marginTop: 8 }}>🔄 Regenerate</button>
    </div>
  );
}
