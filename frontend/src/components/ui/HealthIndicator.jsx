import React from 'react';

const INTENSITY_CONFIG = {
  low: { color: '#4ade80', label: 'Low' },
  medium: { color: '#facc15', label: 'Medium' },
  high: { color: '#f97316', label: 'High' },
  critical: { color: '#ef4444', label: 'Critical' },
};

/**
 * Colored circle indicator for burnout radar workload intensity.
 */
export default function HealthIndicator({ intensity = 'low', size = 12, showLabel = false }) {
  const config = INTENSITY_CONFIG[intensity] || INTENSITY_CONFIG.low;
  return (
    <span className="health-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: config.color,
          display: 'inline-block',
          boxShadow: `0 0 ${size}px ${config.color}40`,
        }}
      />
      {showLabel && <span style={{ fontSize: 12, color: config.color }}>{config.label}</span>}
    </span>
  );
}
