import React from 'react';
import { AlertCircle, X, Siren } from 'lucide-react';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  return (
    <div className="realtime-alert-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}>
          <Siren size={20} className="pulse-dot" />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
            {alert.title || '¡ALERTA COMUNITARIA EN TIEMPO REAL!'}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            {alert.message}
          </div>
        </div>
      </div>

      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

