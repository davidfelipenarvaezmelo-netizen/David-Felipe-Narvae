import React, { useState } from 'react';
import { Search, ThumbsUp, MapPin, Calendar, User, Filter } from 'lucide-react';

export default function ReportsList({ reports, onConfirmReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' || rep.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="feed-container">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Buscar por zona, robo, acoso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '130px', padding: '8px' }}
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
        >
          <option value="ALL">Severidad</option>
          <option value="Crítica">Crítica</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {filteredReports.length} {filteredReports.length === 1 ? 'zona de riesgo' : 'zonas de riesgo'} registradas
        </span>
      </div>

      {filteredReports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <p>No se encontraron reportes con los filtros seleccionados.</p>
        </div>
      ) : (
        filteredReports.map((report) => (
          <div key={report._id} className="card-report">
            <div className="card-header-row">
              <span className={`badge-tag badge-${report.severity}`}>
                {report.severity}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>
              {report.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '10px' }}>
              {report.description}
            </p>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#60a5fa" />
                <span>{report.location?.address || 'Ubicación en mapa'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#94a3b8" />
                <span>Reportado por: {report.reportedBy || 'Anónimo'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                Categoría: <strong style={{ color: '#94a3b8' }}>{report.category}</strong>
              </span>

              <button
                onClick={() => onConfirmReport(report._id)}
                style={{
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ThumbsUp size={13} />
                <span>Validar ({report.confirmationsCount || 1})</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

