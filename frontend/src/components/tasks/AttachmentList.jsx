import React, { useState } from 'react';
import { uploadAPI } from '../../lib/api.js';
import Icon from '../ui/Icon.jsx';
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
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Icon name="attach_file" className="text-[16px]" /> Attachments ({localAttachments.length})
        </h3>
        
        <label className="text-[10px] uppercase font-bold tracking-widest text-[#6c63ff] hover:text-white cursor-pointer transition-colors flex items-center gap-1">
          {uploading ? <Icon name="sync" className="animate-spin text-[14px]" /> : <Icon name="upload" className="text-[14px]" />}
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" onChange={handleUpload} disabled={uploading} hidden />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {localAttachments.map((a) => (
          <div key={a.id || a.url} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Icon name="insert_drive_file" className="text-[18px]" />
              </div>
              <span className="text-xs text-white font-medium truncate">{a.name}</span>
            </a>
            <button 
              onClick={() => handleDelete(a.id)} 
              className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" 
              aria-label="Delete file"
            >
              <Icon name="delete" className="text-[16px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
