import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { teamsAPI } from '../../lib/api.js';
import toast from 'react-hot-toast';

export default function TeamFormModal({ isOpen, onClose, onSuccess, team = null }) {
  const isEdit = !!team;
  const [form, setForm] = useState({ name: team?.name || '', description: team?.description || '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await teamsAPI.update(team.id, form);
        toast.success('Team updated');
      } else {
        await teamsAPI.create(form);
        toast.success('Team created');
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Team' : 'Create Team'}>
      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-group">
          <label htmlFor="team-name">Team Name *</label>
          <input id="team-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required maxLength={100} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="team-desc">Description</label>
          <textarea id="team-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} maxLength={500} className="input" rows={3} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn btn--ghost">Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Saving...' : isEdit ? 'Update' : 'Create Team'}</button>
        </div>
      </form>
    </Modal>
  );
}
