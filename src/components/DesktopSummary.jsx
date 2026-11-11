import React from 'react';
import { MapPin, ShieldAlert, BellRing, ThumbsUp, Plus } from 'lucide-react';

export default function DesktopSummary({ reports, alerts, onConfirmReport, onOpenReport }) {
  const criticalCount = reports.filter((r) => r.severity === 'Crítica').length;
  const confirmations = reports.reduce((acc, r) => acc + (r.confirmationsCount || 1), 0);
  const latest = reports.slice(0, 4);

  return (
    <div className="panel-scroll">
      <div className="panel-heading">
        <h3>Panel de control</h3>
        <p>Actividad de la red en tu zona</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon"><MapPin size={16} color="#60a5fa" /></span>
          <strong>{reports.length}</strong>
          <span>Reportes activos</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><ShieldAlert size={16} color="#f87171" /></span>
          <strong>{criticalCount}</strong>
          <span>Zonas críticas</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><BellRing size={16} color="#fbbf24" /></span>
          <strong>{alerts.length}</strong>
          <span>Alertas recibidas</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><ThumbsUp size={16} color="#34d399" /></span>
          <strong>{confirmations}</strong>
          <span>Validaciones</span>
        </div>
      </div>

      <div className="panel-section-title">Últimos reportes</div>

      {latest.length === 0 ? (
        <div className="panel-empty">
          <p>Aún no hay zonas reportadas cerca de ti.</p>
        </div>
      ) : (
        <div className="mini-report-list">
          {latest.map((report) => (
            <article key={report._id} className="mini-report">
              <div className="mini-report-top">
                <span className={`badge-tag badge-${report.severity}`}>{report.severity}</span>
                <span className="mini-report-address">
                  {report.location?.address || 'Ubicación en mapa'}
                </span>
              </div>
              <h4>{report.title}</h4>
              <div className="mini-report-bottom">
                <span>{report.category}</span>
                <button onClick={() => onConfirmReport(report._id)}>
                  <ThumbsUp size={13} />
                  {report.confirmationsCount || 1}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <button className="btn-primary panel-cta" onClick={onOpenReport}>
        <span className="panel-cta-inner">
          <Plus size={17} />
          Reportar nueva zona
        </span>
      </button>
    </div>
  );
}
