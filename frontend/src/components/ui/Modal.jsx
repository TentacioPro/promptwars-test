import React, { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

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
    
    // Focus first focusable element gracefully
    setTimeout(() => {
      const focusable = contentRef.current?.querySelector('input, button, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a14]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" 
      ref={overlayRef} 
      onClick={handleBackdropClick} 
      role="dialog" 
      aria-modal="true" 
      aria-label={title}
    >
      <div 
        className={`glass-panel-heavy w-full ${sizeClasses[size]} rounded-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform animate-in zoom-in-95 duration-200`} 
        ref={contentRef}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
