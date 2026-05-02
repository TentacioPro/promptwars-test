import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Friendly empty state with icon, message, and optional CTA.
 */
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message = '', action, actionLabel }) {
  return (
    <div className="empty-state">
      <Icon size={48} strokeWidth={1} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && actionLabel && (
        <button className="btn btn--primary" onClick={action}>{actionLabel}</button>
      )}
    </div>
  );
}
