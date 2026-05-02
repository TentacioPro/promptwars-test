import React from 'react';

/**
 * Loading skeleton with variants: 'card', 'row', 'circle', 'text'.
 */
export default function Skeleton({ variant = 'text', width, height, count = 1, className = '' }) {
  const baseStyle = {
    borderRadius: variant === 'circle' ? '50%' : '8px',
    width: width || (variant === 'circle' ? 40 : '100%'),
    height: height || (variant === 'card' ? 120 : variant === 'circle' ? 40 : 20),
  };

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-pulse" style={baseStyle} />
      ))}
    </div>
  );
}
