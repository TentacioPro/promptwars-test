import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { profileAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import SkillEditor from '../components/profile/SkillEditor.jsx';
import VelocityChart from '../components/profile/VelocityChart.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Icon from '../components/ui/Icon.jsx';
import toast from 'react-hot-toast';

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
      toast.success('Profile updated successfully');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  if (loading) return <Skeleton variant="card" height={400} className="max-w-7xl mx-auto rounded-xl" />;

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-h1 text-[40px] leading-[1.2] font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-slate-400 font-subtitle text-sm mt-1">Manage your identity, skills, and platform preferences</p>
        </div>
        <button 
          className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(108,99,255,0.2)] disabled:opacity-50"
          onClick={handleSave} 
          disabled={saving}
        >
          <Icon name="save" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Icon name="person" className="text-[#6c63ff]" /> Personal Information
            </h2>
            
            <div className="flex items-center gap-6 pb-6 border-b border-white/5">
              <div className="relative group">
                <img 
                  alt={form.displayName || 'User'} 
                  src={data?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.displayName || 'User')}&background=0D8ABC&color=fff&size=120`} 
                  className="w-24 h-24 rounded-full border-4 border-[#0a0a14] shadow-xl object-cover"
                />
                <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="photo_camera" className="text-white text-[24px]" />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Display Name</label>
                    <input 
                      value={form.displayName} 
                      onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} 
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
                      placeholder="Your name" 
                      maxLength={100} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Job Role</label>
                    <input 
                      value={form.role} 
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} 
                      className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6c63ff] transition-colors" 
                      placeholder="e.g. Frontend Engineer" 
                      maxLength={100} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Bio</label>
              <textarea 
                value={form.bio} 
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} 
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors resize-none" 
                rows={4} 
                maxLength={500} 
                placeholder="Tell us about your experience and focus..." 
              />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="military_tech" className="text-[#6c63ff]" /> Skills & Endorsements
            </h2>
            <SkillEditor skills={form.skills} onChange={(skills) => setForm((f) => ({ ...f, skills }))} />
          </div>
          
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="trending_up" className="text-[#6c63ff]" /> Performance Velocity
            </h2>
            <VelocityChart velocityHistory={data?.velocityHistory || []} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="manage_accounts" className="text-[#6c63ff]" /> Account Info
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Email Address</span>
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <Icon name="mail" className="text-[16px] text-slate-500" /> {data?.email}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Active Teams</span>
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <Icon name="groups" className="text-[16px] text-slate-500" /> {data?.teamIds?.length || 0} teams
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Member Since</span>
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <Icon name="event" className="text-[16px] text-slate-500" /> {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel-heavy p-6 rounded-2xl border-red-500/20 bg-gradient-to-b from-transparent to-red-500/5">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 text-red-400">
              <Icon name="warning" /> Danger Zone
            </h2>
            <p className="text-xs text-slate-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-xl font-bold transition-all border border-red-500/20 text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
