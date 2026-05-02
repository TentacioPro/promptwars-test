import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { teamsAPI } from '../../lib/api.js';
import toast from 'react-hot-toast';

export default function JoinTeamModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 8) { toast.error('Code must be 8 characters'); return; }
    setSubmitting(true);
    try {
      const data = await teamsAPI.join(code);
      toast.success(`Joined "${data.teamName}"!`);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Team">
      <form onSubmit={handleSubmit} className="join-form">
        <div className="form-group">
          <label htmlFor="invite-code">Invite Code</label>
          <input id="invite-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8} className="input" placeholder="e.g. A7XK9MQ2" style={{ fontFamily: 'monospace', letterSpacing: 4, fontSize: 20, textAlign: 'center' }} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn btn--ghost">Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={submitting || code.length !== 8}>{submitting ? 'Joining...' : 'Join Team'}</button>
        </div>
      </form>
    </Modal>
  );
}
