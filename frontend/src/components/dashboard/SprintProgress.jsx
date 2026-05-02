import React from 'react';

/**
 * Sprint progress bar widget.
 * Can be driven by API data or passed props.
 */
export default function SprintProgress({ total = 0, done = 0, sprintName = '', daysLeft = 0 }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="sprint-progress">
      {sprintName && <div className="sprint-progress__name">{sprintName}</div>}
      <div className="sprint-progress__bar-bg">
        <div className="sprint-progress__bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="sprint-progress__stats">
        <span>{done}/{total} tasks ({percent}%)</span>
        {daysLeft > 0 && <span>{daysLeft} days left</span>}
      </div>
    </div>
  );
}
