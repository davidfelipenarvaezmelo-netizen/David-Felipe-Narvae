import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      timeout: 5000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket Frontend] Conectado al servidor de alertas en tiempo real con id:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket Frontend] Desconectado del servidor de alertas');
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket Frontend] Error de conexión:', err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const emitPanicAlert = (data) => {
  if (socket && socket.connected) {
    socket.emit('send_panic_signal', data);
  } else {
    console.warn('[Socket] Alerta SOS simulada (servidor desconectado)');
  }
};

