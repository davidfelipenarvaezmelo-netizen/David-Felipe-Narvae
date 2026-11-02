import React from 'react';
import { MapPin, Plus, Bell, ListFilter, ShieldAlert } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenReport, unreadAlertsCount }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => setActiveTab('map')}
      >
        <MapPin size={20} />
        <span>Mapa</span>
      </button>

      <button
        className={`nav-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        <ListFilter size={20} />
        <span>Zonas</span>
      </button>

      {/* Botón flotante central de acción rápida: Reportar */}
      <button
        className="nav-center-action"
        onClick={onOpenReport}
        title="Reportar nueva zona de riesgo"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      <button
        className={`nav-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
        onClick={() => setActiveTab('alerts')}
      >
        <div style={{ position: 'relative' }}>
          <Bell size={20} />
          {unreadAlertsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -6,
                background: '#ef4444',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                borderRadius: '999px',
                padding: '1px 5px',
                lineHeight: 1,
              }}
            >
              {unreadAlertsCount}
            </span>
          )}
        </div>
        <span>Alertas</span>
      </button>
    </nav>
  );
}

