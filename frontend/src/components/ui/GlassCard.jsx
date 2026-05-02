import React from 'react';

/**
 * Reusable glassmorphism container panel.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.span] - Grid column span (for bento grids)
 * @param {object} [props.style] - Inline styles
 * @param {function} [props.onClick] - Click handler
 */
export default function GlassCard({ children, className = '', span, style = {}, onClick, ...rest }) {
  const spanStyle = span ? { gridColumn: `span ${span}` } : {};

  return (
    <div
      className={`glass-panel ${className}`}
      style={{ ...spanStyle, ...style }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}
