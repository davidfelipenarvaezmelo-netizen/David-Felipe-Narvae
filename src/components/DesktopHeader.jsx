import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DesktopHeader({ title, subtitle, isConnected, onOpenPanic }) {
  return (
    <header className="desktop-topbar">
      <div className="desktop-topbar-titles">
        <h2 className="desktop-page-title">{title}</h2>
        <p className="desktop-page-subtitle">{subtitle}</p>
      </div>

      <div className="desktop-topbar-actions">
        <span className={`connection-pill ${isConnected ? 'pill-online' : 'pill-offline'}`}>
          <span className="pulse-dot"></span>
          {isConnected ? 'Tiempo Real Activo' : 'Modo Seguro (Local)'}
        </span>

        <button
          className="sos-btn sos-btn-desktop"
          onClick={onOpenPanic}
          title="Activar alerta de pánico SOS"
        >
          <AlertTriangle size={16} />
          <span>S.O.S Emergencia</span>
        </button>
      </div>
    </header>
  );
}
