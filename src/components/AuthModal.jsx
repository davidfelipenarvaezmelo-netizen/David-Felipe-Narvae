import React, { useEffect, useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const EMPTY_FORM = {
  identifier: '',
  name: '',
  username: '',
  email: '',
  password: '',
};

export default function AuthModal() {
  const { isAuthOpen, authMode, setAuthMode, closeAuth, login, register } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = authMode === 'login';

  useEffect(() => {
    if (!isAuthOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuth();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthOpen, closeAuth]);

  useEffect(() => {
    setError('');
  }, [authMode]);

  useEffect(() => {
    if (isAuthOpen) return;

    setForm(EMPTY_FORM);
    setError('');
    setShowPassword(false);
  }, [isAuthOpen]);

  if (!isAuthOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const changeMode = (mode) => {
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setAuthMode(mode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isLogin && form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login({
          identifier: form.identifier.trim(),
          password: form.password,
        });
      } else {
        await register({
          name: form.name.trim(),
          username: form.username.trim().toLowerCase(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
      }

      setForm(EMPTY_FORM);
      setShowPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div
        className="modal-sheet auth-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-handle"></div>

        <div className="auth-header">
          <div>
            <h2 className="modal-title">
              {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
            </h2>
            <p className="modal-subtitle">
              {isLogin
                ? 'Accede para gestionar tus reportes y alertas'
                : 'Únete a la red comunitaria de Rutas Seguras'}
            </p>
          </div>

          <button className="modal-close-btn" onClick={closeAuth} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => changeMode('login')}
          >
            <LogIn size={15} />
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => changeMode('register')}
          >
            <UserPlus size={15} />
            Registrarse
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">
                  Nombre (opcional)
                </label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={80}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-username">
                  Nombre de usuario
                </label>
                <input
                  id="auth-username"
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="ej: david.2026"
                  value={form.username}
                  onChange={handleChange}
                  pattern="[a-zA-Z0-9._-]{3,30}"
                  title="Entre 3 y 30 caracteres: letras, números, puntos, guiones o guiones bajos"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  Correo electrónico
                </label>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="tucorreo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </>
          )}

          {isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-identifier">
                Usuario o correo
              </label>
              <input
                id="auth-identifier"
                type="text"
                name="identifier"
                className="form-input"
                placeholder="admin o tucorreo@ejemplo.com"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Contraseña
            </label>
            <div className="password-field">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 8 caracteres'}
                value={form.password}
                onChange={handleChange}
                minLength={8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <span className="auth-submit-inner">
              {isSubmitting ? (
                'Procesando...'
              ) : (
                <>
                  <ShieldCheck size={17} />
                  {isLogin ? 'Entrar a mi cuenta' : 'Crear cuenta'}
                </>
              )}
            </span>
          </button>
        </form>

        <p className="auth-hint">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            className="auth-link"
            onClick={() => changeMode(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
