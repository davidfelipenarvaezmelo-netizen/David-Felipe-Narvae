import React from 'react';
import { Shield, AlertTriangle, Radio } from 'lucide-react';

export default function Header({ isConnected, onOpenPanic }) {
  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon-wrap">
          <Shield size={20} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">Rutas Seguras</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`connection-pill ${isConnected ? 'pill-online' : 'pill-offline'}`}>
              <span className="pulse-dot"></span>
              {isConnected ? 'Tiempo Real Activo' : 'Modo Seguro (Local)'}
            </span>
          </div>
        </div>
      </div>

      <button className="sos-btn" onClick={onOpenPanic} title="Activar alerta de pánico SOS">
        <AlertTriangle size={15} />
        <span>S.O.S</span>
      </button>
    </header>
  );
}

