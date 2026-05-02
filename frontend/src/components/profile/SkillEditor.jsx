import React, { useState } from 'react';
import SkillTag from '../ui/SkillTag.jsx';
import { Plus } from 'lucide-react';

export default function SkillEditor({ skills = [], onChange }) {
  const [input, setInput] = useState('');

  function addSkill() {
    const skill = input.trim();
    if (!skill || skills.includes(skill) || skills.length >= 20) return;
    onChange([...skills, skill]);
    setInput('');
  }

  function removeSkill(skill) {
    onChange(skills.filter((s) => s !== skill));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  }

  return (
    <div className="skill-editor">
      <div className="skill-editor__tags">
        {skills.map((s) => <SkillTag key={s} skill={s} editable onRemove={removeSkill} />)}
      </div>
      <div className="skill-editor__input">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="input" placeholder="Add a skill..." maxLength={50} />
        <button onClick={addSkill} className="btn btn--ghost btn--sm" type="button"><Plus size={14} /></button>
      </div>
      <small>{skills.length}/20 skills</small>
    </div>
  );
}
