import React, { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccountButton() {
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <button
        className="account-btn"
        onClick={() => openAuth('login')}
        title="Iniciar sesión"
        aria-label="Iniciar sesión"
      >
        <LogIn size={18} />
      </button>
    );
  }

  const initial = (user?.name || user?.username || '?').charAt(0).toUpperCase();

  return (
    <div className="account-menu-wrap" ref={wrapRef}>
      <button
        className="account-avatar"
        onClick={() => setIsOpen((open) => !open)}
        title={user?.username}
        aria-label="Menú de cuenta"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="account-dropdown">
          <div className="account-dropdown-head">
            <span className="account-avatar account-avatar--sm">{initial}</span>
            <div className="account-dropdown-info">
              <strong>{user?.name || user?.username}</strong>
              <span>
                @{user?.username} · {user?.role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
