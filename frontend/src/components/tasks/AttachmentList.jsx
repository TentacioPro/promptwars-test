import React, { useState } from 'react';
import { uploadAPI } from '../../lib/api.js';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttachmentList({ taskId, attachments = [] }) {
  const [localAttachments, setLocalAttachments] = useState(attachments);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadAPI.upload(file);
      setLocalAttachments((prev) => [...prev, result]);
      toast.success('File uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fileId) {
    try {
      await uploadAPI.delete(fileId);
      setLocalAttachments((prev) => prev.filter((a) => a.id !== fileId));
      toast.success('File deleted');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="attachment-list">
      <h4><Paperclip size={16} /> Attachments ({localAttachments.length})</h4>
      <div className="attachment-list__items">
        {localAttachments.map((a) => (
          <div key={a.id || a.url} className="attachment-list__item">
            <a href={a.url} target="_blank" rel="noopener noreferrer">{a.name}</a>
            <button onClick={() => handleDelete(a.id)} className="btn btn--ghost btn--sm" aria-label="Delete file">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <label className="btn btn--ghost btn--sm attachment-list__upload">
        <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload file'}
        <input type="file" onChange={handleUpload} disabled={uploading} hidden />
      </label>
    </div>
  );
}
