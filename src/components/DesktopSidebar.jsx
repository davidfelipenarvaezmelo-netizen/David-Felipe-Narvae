import React from 'react';
import { Shield, MapPin, ListFilter, Bell, Plus, AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'map', label: 'Mapa', icon: MapPin },
  { id: 'list', label: 'Zonas de riesgo', icon: ListFilter },
  { id: 'alerts', label: 'Alertas', icon: Bell },
];

export default function DesktopSidebar({
  activeTab,
  onTabChange,
  onOpenReport,
  onOpenPanic,
  unreadAlertsCount,
}) {
  return (
    <aside className="desktop-sidebar">
      <div className="desktop-brand">
        <div className="logo-icon-wrap">
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">Rutas Seguras</h1>
          <span className="desktop-brand-sub">Red comunitaria en vivo</span>
        </div>
      </div>

      <nav className="desktop-nav">
        <span className="desktop-nav-label">Navegación</span>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`desktop-nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === 'alerts' && unreadAlertsCount > 0 && (
              <span className="desktop-nav-badge">{unreadAlertsCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="desktop-sidebar-spacer" />

      <button className="desktop-report-cta" onClick={onOpenReport}>
        <Plus size={18} />
        <span>Reportar zona</span>
      </button>

      <button className="desktop-sos-cta" onClick={onOpenPanic}>
        <AlertTriangle size={18} />
        <span>Botón de pánico</span>
      </button>

      <p className="desktop-sidebar-foot">Rutas Seguras · v1.0</p>
    </aside>
  );
}
