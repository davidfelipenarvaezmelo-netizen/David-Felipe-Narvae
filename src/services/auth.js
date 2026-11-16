import { BASE_URL } from './api';

const TOKEN_KEY = 'rs_token';
const USER_KEY = 'rs_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const parseResponse = async (res) => {
  let payload = null;

  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const error = new Error(payload?.message || 'Ocurrió un error inesperado');
    error.status = res.status;
    throw error;
  }

  return payload;
};

const request = async (path, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return await parseResponse(res);
  } catch (error) {
    if (!error.status) {
      throw new Error('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
    throw error;
  }
};

export const loginUser = async ({ identifier, password }) => {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  return payload.data;
};

export const registerUser = async ({ name, username, email, password }) => {
  const payload = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, username, email, password }),
  });
  return payload.data;
};

export const fetchMe = async (token) => {
  const payload = await request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return payload.data.user;
};

/**
 * Helper para futuras peticiones autenticadas.
 */
export const authFetch = (path, options = {}) => {
  const token = getStoredToken();
  return request(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};
