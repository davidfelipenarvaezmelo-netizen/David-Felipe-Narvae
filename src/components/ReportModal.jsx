import React, { useState, useEffect } from 'react';
import { X, MapPin, Send } from 'lucide-react';

const CATEGORIES = [
  'Robo o Asalto',
  'Zona Oscura / Sin Iluminación',
  'Acoso Callejero',
  'Pelea o Disturbios',
  'Vía en Mal Estado / Obstáculo',
  'Sospechoso Merodeando',
  'Otro',
];

const SEVERITIES = ['Baja', 'Media', 'Alta', 'Crítica'];

export default function ReportModal({ isOpen, onClose, onSubmit, preselectedCoords }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState('Media');
  const [address, setAddress] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [latitude, setLatitude] = useState(preselectedCoords?.lat || 4.653456);
  const [longitude, setLongitude] = useState(preselectedCoords?.lng || -74.072092);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedCoords) {
      setLatitude(preselectedCoords.lat.toFixed(6));
      setLongitude(preselectedCoords.lng.toFixed(6));
      setAddress(`Punto seleccionado: (${preselectedCoords.lat.toFixed(4)}, ${preselectedCoords.lng.toFixed(4)})`);
    }
  }, [preselectedCoords]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      title,
      description,
      category,
      severity,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || 'Ubicación reportada por usuario',
      reportedBy: reportedBy || 'Comunidad Rutas Seguras',
    });

    setIsSubmitting(false);
    onClose();
    // Reset
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="modal-title">Reportar Zona de Riesgo</h2>
            <p className="modal-subtitle">Tu reporte alertará a toda la comunidad en tiempo real</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título del Reporte</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Asalto reciente a transeúntes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría del Riesgo</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1e293b' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nivel de Severidad</label>
            <div className="severity-selector">
              {SEVERITIES.map((sev) => (
                <button
                  type="button"
                  key={sev}
                  className={`severity-btn ${severity === sev ? `active-${sev}` : ''}`}
                  onClick={() => setSeverity(sev)}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción de lo ocurrido o advertencia</label>
            <textarea
              className="form-textarea"
              placeholder="Describe detalladamente el peligro para que otros usuarios tomen precauciones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Ubicación / Referencia</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Dirección o punto de referencia"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Lat: {latitude}</span>
              <span>Lng: {longitude}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tu Nombre o Alias (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Anónimo si se deja vacío"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !title.trim()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Send size={18} />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Alerta Inmediata'}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

