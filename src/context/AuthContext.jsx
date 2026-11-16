import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearSession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  loginUser,
  registerUser,
  saveSession,
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSessionLoading, setIsSessionLoading] = useState(() => Boolean(getStoredToken()));

  // Revalidar el token guardado contra el backend
  useEffect(() => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setIsSessionLoading(false);
      return undefined;
    }

    let cancelled = false;

    fetchMe(storedToken)
      .then((freshUser) => {
        if (cancelled) return;
        setUser(freshUser);
        saveSession({ token: storedToken, user: freshUser });
      })
      .catch((error) => {
        if (cancelled) return;
        // Solo cerramos la sesión si el token es inválido o la cuenta está bloqueada
        if (error.status === 401 || error.status === 403) {
          clearSession();
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsSessionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const startSession = useCallback((session) => {
    saveSession(session);
    setToken(session.token);
    setUser(session.user);
    setIsAuthOpen(false);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const session = await loginUser(credentials);
      startSession(session);
      return session.user;
    },
    [startSession]
  );

  const register = useCallback(
    async (payload) => {
      const session = await registerUser(payload);
      startSession(session);
      return session.user;
    },
    [startSession]
  );

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAuthOpen,
      authMode,
      isSessionLoading,
      openAuth,
      closeAuth,
      setAuthMode,
      login,
      register,
      logout,
    }),
    [
      user,
      token,
      isAuthOpen,
      authMode,
      isSessionLoading,
      openAuth,
      closeAuth,
      login,
      register,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}
