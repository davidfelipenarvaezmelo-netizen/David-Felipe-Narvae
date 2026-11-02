import React, { useState } from 'react';
import { AlertTriangle, X, Radio, PhoneCall } from 'lucide-react';

export default function PanicModal({ isOpen, onClose, onSendPanic }) {
  const [reason, setReason] = useState('Sospecho que me están siguiendo');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleTrigger = () => {
    setIsSending(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSendPanic({
            location: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
            message: reason,
          });
          setIsSending(false);
          onClose();
        },
        () => {
          onSendPanic({
            location: { latitude: 4.6534, longitude: -74.072 },
            message: reason,
          });
          setIsSending(false);
          onClose();
        }
      );
    } else {
      onSendPanic({
        location: { latitude: 4.6534, longitude: -74.072 },
        message: reason,
      });
      setIsSending(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ background: '#1c1316', borderTop: '2px solid #ef4444' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" style={{ background: '#ef4444' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={24} color="#ef4444" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fca5a5' }}>
              BOTÓN DE PÁNICO (S.O.S)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
          Al activar el botón SOS, se enviará una notificación prioritaria con tus coordenadas a todos los usuarios conectados y autoridades de la red comunitaria.
        </p>

        <div className="form-group">
          <label className="form-label" style={{ color: '#f87171' }}>Motivo de la señal SOS</label>
          <select
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="Sospecho que me están siguiendo">Sospecho que me están siguiendo</option>
            <option value="Estoy presenciando un robo a mano armada">Estoy presenciando un robo a mano armada</option>
            <option value="Acoso o agresión física inminente">Acoso o agresión física inminente</option>
            <option value="Emergencia médica en vía pública">Emergencia médica en vía pública</option>
            <option value="Pido acompañamiento en la zona">Pido acompañamiento en la zona</option>
          </select>
        </div>

        <button
          onClick={handleTrigger}
          disabled={isSending}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #ef4444, #991b1b)',
            color: 'white',
            fontWeight: '800',
            fontSize: '1rem',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <Radio size={20} className="pulse-dot" />
          <span>{isSending ? 'EMITIENDO SEÑAL...' : 'EMITIR ALERTA SOS AHORA'}</span>
        </button>

        <a
          href="tel:123"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '14px',
            padding: '10px',
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.85rem',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <PhoneCall size={16} />
          <span>Llamar directamente al número de emergencia (123)</span>
        </a>
      </div>
    </div>
  );
}

