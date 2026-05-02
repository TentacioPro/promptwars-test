import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => {
        setTasks(d.tasks || []);
        setLoading(false);
      });
  }, []);

  const handleDragEnd = (event) => {
    // Implement dnd reordering logic here
  };

  if (loading) return <div className="glass-panel"><p>Loading Tasks...</p></div>;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="kanban-board" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {['todo', 'in-progress', 'review', 'done'].map(status => (
          <div key={status} className="glass-panel" style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '15px' }}>{status.replace('-', ' ')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.filter(t => t.status === status).map(t => (
                <div key={t.id} className="task-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                  <strong>{t.title}</strong>
                  {t.description && <p style={{ fontSize: '12px', marginTop: '5px' }}>{t.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
