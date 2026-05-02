import React from 'react';
import { X } from 'lucide-react';

/**
 * Skill chip/tag with optional remove button.
 */
export default function SkillTag({ skill, onRemove, editable = false }) {
  return (
    <span className="skill-tag">
      {skill}
      {editable && onRemove && (
        <button
          className="skill-tag__remove"
          onClick={(e) => { e.stopPropagation(); onRemove(skill); }}
          aria-label={`Remove ${skill}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
