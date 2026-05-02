import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamsAPI } from '../../lib/api.js';

export default function InviteCode({ teamId, code, isOwner }) {
  const [currentCode, setCurrentCode] = useState(code);
  const [regenerating, setRegenerating] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(currentCode);
    toast.success('Invite code copied!');
  }

  async function regenerate() {
    setRegenerating(true);
    try {
      const data = await teamsAPI.generateInvite(teamId);
      setCurrentCode(data.inviteCode);
      toast.success('New invite code generated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="invite-code">
      <h4>Invite Code</h4>
      <div className="invite-code__display">
        <code className="invite-code__value">{currentCode}</code>
        <button onClick={copyCode} className="btn btn--ghost btn--sm" aria-label="Copy code"><Copy size={14} /></button>
        {isOwner && (
          <button onClick={regenerate} className="btn btn--ghost btn--sm" disabled={regenerating} aria-label="Regenerate code">
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
