import React from 'react';

export default function Dashboard() {
  return (
    <div className="dashboard bento-grid">
      <section className="glass-panel" style={{ gridColumn: 'span 2' }}>
        <h2>Dashboard</h2>
        <p>Welcome to your Skill Hub! (AI Features + Burnout Heatmap coming here)</p>
      </section>
      
      <section className="glass-panel">
        <h3>Tasks Overview</h3>
        <ul>
          <li>To Do: 5</li>
          <li>In Progress: 2</li>
          <li>Done: 10</li>
        </ul>
      </section>

      <section className="glass-panel">
        <h3>🤖 Auto-Standup Digest</h3>
        <p><i>Fetching today's standup summary...</i></p>
      </section>
    </div>
  );
}
