import React, { useState } from 'react';
import { tasksAPI } from '../../lib/api.js';
import Icon from '../ui/Icon.jsx';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommentsThread({ taskId, comments = [] }) {
  const [text, setText] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await tasksAPI.addComment(taskId, text.trim());
      setLocalComments((prev) => [...prev, newComment]);
      setText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Icon name="chat_bubble" className="text-[16px]" /> Comments ({localComments.length})
      </h3>
      
      <div className="space-y-4 mb-4">
        {localComments.map((c) => (
          <div key={c.id} className="flex gap-3 items-start">
            <img 
              alt={c.authorId || '?'} 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorId || '?')}&background=0D8ABC&color=fff`} 
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <div className="flex-1 bg-white/5 rounded-xl rounded-tl-none p-3 border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">{c.authorId || 'User'}</span>
                <span className="text-[10px] text-slate-500 font-medium">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a comment..."
          className="w-full bg-[#0a0a14] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#6c63ff] transition-all"
          maxLength={1000}
        />
        <button 
          type="submit" 
          disabled={submitting || !text.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#6c63ff]/10 text-[#6c63ff] hover:bg-[#6c63ff]/20 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="send" className="text-[18px] ml-1" />
        </button>
      </form>
    </div>
  );
}
