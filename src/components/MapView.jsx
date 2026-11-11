import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, AlertCircle, ThumbsUp } from 'lucide-react';

// Generador de iconos modernos para Leaflet con HTML/SVG sin problemas de rutas
const createCustomIcon = (severity) => {
  const colors = {
    Crítica: '#ef4444',
    Alta: '#f97316',
    Media: '#f59e0b',
    Baja: '#3b82f6',
  };
  const color = colors[severity] || '#3b82f6';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 12px ${color}88;
        border: 2px solid #ffffff;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: 800;
          font-size: 13px;
        ">!</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Capturador de clics en el mapa para iniciar reporte en coordenadas exactas
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function MapView({ reports, onSelectLocationToReport, onConfirmReport, isDesktop = false }) {
  // Coordenadas iniciales por defecto (Bogotá, Colombia - ajustable por GPS)
  const [center, setCenter] = useState([4.653456, -74.072092]);
  const [userLocation, setUserLocation] = useState(null);

  // Obtener geolocalización del dispositivo
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        (err) => {
          console.warn('Geolocalización rechazada o no disponible:', err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  return (
    <div className="map-screen-wrap">
      {/* Barra de control flotante superior */}
      <div className="map-floating-bar">
        <div className="map-search-badge">
          <AlertCircle size={16} color="#60a5fa" />
          <span>
            {isDesktop
              ? 'Haz clic en el mapa para reportar una zona de peligro'
              : 'Toca el mapa para reportar una zona de peligro'}
          </span>
        </div>
        <button
          className="map-action-fab"
          onClick={handleLocateMe}
          title="Centrar en mi ubicación GPS"
        >
          <Crosshair size={20} color="#60a5fa" />
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onMapClick={(latlng) => {
            onSelectLocationToReport(latlng);
          }}
        />

        {/* Marcador de ubicación actual del usuario */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-pulse',
              html: `<div style="
                width: 18px;
                height: 18px;
                background: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 15px #3b82f6;
              "></div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            })}
          >
            <Popup>
              <div style={{ color: '#0f172a', fontWeight: 'bold' }}>📍 Tu ubicación actual</div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de zonas de riesgo */}
        {reports.map((report) => {
          const coords = report.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const [lng, lat] = coords;

          return (
            <Marker
              key={report._id}
              position={[lat, lng]}
              icon={createCustomIcon(report.severity)}
            >
              <Popup>
                <div style={{ color: '#0f172a', maxWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: report.severity === 'Crítica' ? '#fee2e2' : '#fef3c7',
                      color: report.severity === 'Crítica' ? '#b91c1c' : '#b45309'
                    }}>
                      {report.severity}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {report.confirmationsCount || 1} confirmaciones
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700' }}>
                    {report.title}
                  </h4>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#475569' }}>
                    {report.description}
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                    <strong>📍</strong> {report.location.address || 'Zona marcada'}
                  </div>

                  <button
                    onClick={() => onConfirmReport(report._id)}
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <ThumbsUp size={12} /> Confirmar riesgo
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

