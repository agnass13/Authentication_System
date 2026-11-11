import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Alert component for displaying feedback, validation errors,
 * and operation success messages.
 */
export default function AlertMessage({ type = 'error', message, onClose }) {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle2 className="alert-icon" size={20} />,
    error: <AlertCircle className="alert-icon" size={20} />,
    warning: <AlertTriangle className="alert-icon" size={20} />,
    info: <Info className="alert-icon" size={20} />,
  };

  return (
    <div className={`alert-box alert-${type}`} role="alert">
      {iconMap[type] || iconMap.error}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
