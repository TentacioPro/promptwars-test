import React, { useState } from 'react';
import { tasksAPI } from '../../lib/api.js';
import Avatar from '../ui/Avatar.jsx';
import { Send } from 'lucide-react';
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
    <div className="comments-thread">
      <h4>💬 Comments ({localComments.length})</h4>
      <div className="comments-thread__list">
        {localComments.map((c) => (
          <div key={c.id} className="comments-thread__item">
            <Avatar name={c.authorId?.slice(0, 5) || '?'} size={28} />
            <div className="comments-thread__body">
              <span className="comments-thread__time">{timeAgo(c.createdAt)}</span>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="comments-thread__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="input"
          maxLength={1000}
        />
        <button type="submit" className="btn btn--primary" disabled={submitting || !text.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
