import React from 'react';
import SkillTag from '../ui/SkillTag.jsx';

/**
 * Team skill coverage matrix — shows which skills exist vs required.
 * Driven by aggregated team member skills and task required skills.
 */
export default function SkillGaps({ memberSkills = [], requiredSkills = [] }) {
  // Aggregate unique skills team has
  const teamSkillSet = new Set(memberSkills.flat());
  const gaps = requiredSkills.filter((s) => !teamSkillSet.has(s));
  const covered = requiredSkills.filter((s) => teamSkillSet.has(s));

  return (
    <div className="skill-gaps">
      <h4>🎯 Skill Coverage</h4>
      {covered.length > 0 && (
        <div className="skill-gaps__section">
          <strong style={{ color: '#4ade80' }}>✅ Covered ({covered.length})</strong>
          <div className="skill-gaps__tags">{covered.map((s) => <SkillTag key={s} skill={s} />)}</div>
        </div>
      )}
      {gaps.length > 0 && (
        <div className="skill-gaps__section">
          <strong style={{ color: '#f87171' }}>⚠️ Gaps ({gaps.length})</strong>
          <div className="skill-gaps__tags">{gaps.map((s) => <SkillTag key={s} skill={s} />)}</div>
        </div>
      )}
      {requiredSkills.length === 0 && <p style={{ opacity: 0.5 }}>Add required skills to tasks to see coverage analysis</p>}
    </div>
  );
}
