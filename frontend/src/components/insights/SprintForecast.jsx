import React, { useEffect, useState } from 'react';
import { aiAPI } from '../../lib/api.js';
import Skeleton from '../ui/Skeleton.jsx';

export default function SprintForecast({ teamId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    aiAPI.forecast(teamId).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <Skeleton variant="card" height={150} />;
  if (!data?.forecast) return <p style={{ opacity: 0.5 }}>No active sprint or select a team</p>;

  const f = data.forecast;
  const probPercent = Math.round(f.completionProbability * 100);

  return (
    <div className="sprint-forecast">
      <h4>📊 Sprint Forecast</h4>
      <div className="sprint-forecast__name">{f.sprintName}</div>
      <div className="sprint-forecast__gauge">
        <div className="sprint-forecast__gauge-bg">
          <div className="sprint-forecast__gauge-fill" style={{ width: `${probPercent}%`, backgroundColor: probPercent > 70 ? '#4ade80' : probPercent > 40 ? '#facc15' : '#ef4444' }} />
        </div>
        <span className="sprint-forecast__prob">{probPercent}% likely to complete</span>
      </div>
      <div className="sprint-forecast__stats">
        <div><strong>{f.done}</strong>/{f.total} done</div>
        <div><strong>{f.remaining}</strong> remaining</div>
        <div><strong>{f.daysLeft}</strong> days left</div>
        <div>Velocity: <strong>{f.velocity}</strong> tasks/day</div>
      </div>
    </div>
  );
}
