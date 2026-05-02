import { Toaster } from 'react-hot-toast';
import React from 'react';

/**
 * App-level toast provider. Add <ToastProvider /> once in App.jsx.
 * Use: import toast from 'react-hot-toast'; toast.success('Done!');
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(20, 20, 40, 0.9)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#4ade80', secondary: '#0a0a14' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#0a0a14' } },
      }}
    />
  );
}
