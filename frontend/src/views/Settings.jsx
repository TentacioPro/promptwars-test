import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { teamsAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import InviteCode from '../components/teams/InviteCode.jsx';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, profile, logout } = useAuth();
  const { data, execute: fetchTeams } = useApi(teamsAPI.list);

  useEffect(() => { fetchTeams(); }, []);

  const teams = data?.teams || [];

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>

      <GlassCard>
        <h3>Account</h3>
        <p>Email: {user?.email}</p>
        <p>Display Name: {profile?.displayName || '—'}</p>
        <button className="btn btn--danger btn--sm" onClick={logout} style={{ marginTop: 12 }}>Sign Out</button>
      </GlassCard>

      <GlassCard>
        <h3>Team Management</h3>
        {teams.length === 0 ? <p style={{ opacity: 0.5 }}>No teams</p> :
          teams.map((t) => (
            <div key={t.id} style={{ marginBottom: 16 }}>
              <strong>{t.name}</strong>
              <InviteCode teamId={t.id} code={t.inviteCode} isOwner={t.ownerId === user?.uid} />
            </div>
          ))
        }
      </GlassCard>
    </div>
  );
}
