import React from 'react';
import { Siren, Clock, MapPin, Radio, ShieldCheck } from 'lucide-react';

export default function AlertsFeed({ alerts }) {
  return (
    <div className="feed-container">
      <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '12px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Radio size={16} color="#60a5fa" />
          <h3 style={{ fontSize: '0.9rem', color: '#93c5fd', fontWeight: '700' }}>Canal de Emergencias en Vivo</h3>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
          Recibes avisos inmediatos emitidos por autoridades y alertas SOS de personas en zonas de alto riesgo.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <ShieldCheck size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#10b981' }} />
          <p style={{ fontWeight: '600', color: '#94a3b8' }}>Sin alertas críticas activas en este momento</p>
          <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Tu trayecto parece seguro según los últimos reportes.</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert._id || alert.id}
            style={{
              background: '#1a1f33',
              borderLeft: '4px solid #ef4444',
              borderRadius: '12px',
              padding: '14px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Siren size={16} color="#ef4444" />
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#f87171' }}>
                  {alert.title || 'Alerta de Riesgo'}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                {new Date(alert.createdAt || alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '10px', lineHeight: '1.4' }}>
              {alert.message}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <MapPin size={13} color="#f87171" />
              <span>{alert.zoneName || 'Ubicación referenciada'}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

