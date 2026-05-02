import React from 'react';

/**
 * User avatar with image fallback to initials circle.
 */
export default function Avatar({ src, name = '', size = 36, className = '' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      className={`avatar avatar--initials ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        background: 'var(--accent)',
        color: 'var(--bg)',
      }}
      aria-label={name}
    >
      {initials || '?'}
    </div>
  );
}
