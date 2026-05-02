import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { profileAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import SkillEditor from '../components/profile/SkillEditor.jsx';
import VelocityChart from '../components/profile/VelocityChart.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const { data, loading, execute: fetchProfile } = useApi(profileAPI.get);
  const [form, setForm] = useState({ displayName: '', bio: '', role: '', skills: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (data) {
      setForm({
        displayName: data.displayName || '',
        bio: data.bio || '',
        role: data.role || '',
        skills: data.skills || [],
      });
    }
  }, [data]);

  async function handleSave() {
    setSaving(true);
    try {
      await profileAPI.update(form);
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  if (loading) return <Skeleton variant="card" height={400} />;

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>

      <GlassCard className="profile-card">
        <div className="profile-card__header">
          <Avatar src={data?.avatarUrl} name={form.displayName} size={80} />
          <div>
            <input value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} className="input profile-card__name-input" placeholder="Your name" maxLength={100} />
            <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input profile-card__role-input" placeholder="Your role (e.g. Frontend Engineer)" maxLength={100} />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="input" rows={3} maxLength={500} placeholder="Tell us about yourself..." />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <SkillEditor skills={form.skills} onChange={(skills) => setForm((f) => ({ ...f, skills }))} />
        </div>

        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </GlassCard>

      <GlassCard>
        <VelocityChart velocityHistory={data?.velocityHistory || []} />
      </GlassCard>

      <GlassCard>
        <h3>Account Info</h3>
        <p>Email: {data?.email}</p>
        <p>Teams: {data?.teamIds?.length || 0}</p>
        <p>Member since: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '—'}</p>
      </GlassCard>
    </div>
  );
}
