import React from 'react';
import {
  Shield,
  MapPin,
  ListFilter,
  Bell,
  Plus,
  AlertTriangle,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const initial = (user?.name || user?.username || '?').charAt(0).toUpperCase();

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

      {isAuthenticated ? (
        <div className="desktop-account">
          <span className="account-avatar account-avatar--sm">{initial}</span>
          <div className="desktop-account-info">
            <strong>{user?.name || user?.username}</strong>
            <span>
              @{user?.username} · {user?.role}
            </span>
          </div>
          <button
            className="desktop-account-logout"
            onClick={logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <button className="desktop-login-btn" onClick={() => openAuth('login')}>
          <LogIn size={16} />
          Iniciar sesión
        </button>
      )}

      <p className="desktop-sidebar-foot">Rutas Seguras · v1.0</p>
    </aside>
  );
}
