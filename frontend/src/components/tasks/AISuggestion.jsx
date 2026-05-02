import React, { useState } from 'react';
import { aiAPI } from '../../lib/api.js';
import Icon from '../ui/Icon.jsx';

export default function AISuggestion({ taskId, teamId, requiredSkills }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSuggestions() {
    setLoading(true);
    setError(null);
    try {
      const data = await aiAPI.suggestAssignee({ taskId, teamId, requiredSkills });
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel-heavy rounded-xl overflow-hidden border-[#6c63ff]/30 shadow-[0_0_20px_rgba(108,99,255,0.1)] transition-all duration-300 relative">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6c63ff]/10 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Icon name="auto_awesome" className="text-[#6c63ff]" />
          <strong className="text-white text-sm font-bold">AI Assignee Match</strong>
        </div>
        {!suggestions && !loading && (
          <button 
            onClick={fetchSuggestions} 
            className="text-[10px] uppercase font-bold tracking-widest text-[#6c63ff] hover:text-white transition-colors"
          >
            Find Match
          </button>
        )}
      </div>

      <div className="p-4 relative z-10">
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm py-2">
            <Icon name="sync" className="animate-spin text-[#6c63ff]" /> Analyzing skills and workload...
          </div>
        )}
        
        {error && <p className="text-red-400 text-sm py-2">{error}</p>}

        {suggestions && suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <div key={s.uid || i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#6c63ff]/30 transition-all">
                <img 
                  alt={s.displayName || s.uid} 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.displayName || s.uid)}&background=0D8ABC&color=fff`} 
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{s.displayName || s.uid}</strong>
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                      {Math.round((s.matchScore || 0) * 100)}% Match
                    </span>
                  </div>
                  {s.reason && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestions && suggestions.length === 0 && (
          <p className="text-slate-400 text-sm py-2">No matching team members found</p>
        )}
      </div>
    </div>
  );
}
