import React, { useState } from 'react';
import { aiAPI } from '../../lib/api.js';
import Avatar from '../ui/Avatar.jsx';
import { Sparkles } from 'lucide-react';

/**
 * AI Skill-Match assignee suggestion widget.
 * Calls POST /api/ai/suggest-assignee to get ranked suggestions.
 */
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
    <div className="ai-suggestion">
      <div className="ai-suggestion__header">
        <Sparkles size={16} />
        <strong>🎯 AI Assignee Suggestion</strong>
      </div>

      {!suggestions && !loading && (
        <button onClick={fetchSuggestions} className="btn btn--primary btn--sm">
          <Sparkles size={14} /> Find best match
        </button>
      )}

      {loading && <p style={{ opacity: 0.6 }}>🤖 Analyzing skills and workload...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {suggestions && suggestions.length > 0 && (
        <div className="ai-suggestion__list">
          {suggestions.map((s, i) => (
            <div key={s.uid || i} className="ai-suggestion__item">
              <Avatar name={s.displayName || s.uid} size={28} />
              <div className="ai-suggestion__info">
                <strong>{s.displayName || s.uid}</strong>
                <span className="ai-suggestion__score">{Math.round((s.matchScore || 0) * 100)}% match</span>
                {s.reason && <small>{s.reason}</small>}
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions && suggestions.length === 0 && (
        <p style={{ opacity: 0.6 }}>No matching team members found</p>
      )}
    </div>
  );
}
