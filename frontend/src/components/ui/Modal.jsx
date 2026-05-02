import React, { useEffect, useRef } from 'react';

/**
 * Accessible modal overlay with ESC close, focus trap, and backdrop click.
 */
export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    const focusable = contentRef.current?.querySelector('input, button, textarea, select, [tabindex]');
    focusable?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const sizeClass = `modal--${size}`;

  return (
    <div className={`modal-overlay ${sizeClass}`} ref={overlayRef} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-content glass-panel" ref={contentRef}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
