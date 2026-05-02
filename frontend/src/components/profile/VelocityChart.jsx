import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VelocityChart({ velocityHistory = [] }) {
  if (velocityHistory.length === 0) return <p style={{ opacity: 0.5 }}>No velocity data yet</p>;

  const data = velocityHistory.map((v, i) => ({
    sprint: v.sprintId || `S${i + 1}`,
    planned: v.planned || 0,
    completed: v.completed || 0,
  }));

  return (
    <div className="velocity-chart">
      <h4>📈 Velocity History</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="sprint" stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <Tooltip contentStyle={{ background: 'rgba(20,20,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
          <Line type="monotone" dataKey="planned" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa' }} name="Planned" />
          <Line type="monotone" dataKey="completed" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80' }} name="Completed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
