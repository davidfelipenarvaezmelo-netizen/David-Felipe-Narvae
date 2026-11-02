const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Datos de demostración iniciales (por si el backend o MongoDB aún no están corriendo)
export const initialMockReports = [
  {
    _id: 'mock_1',
    title: 'Postes sin luz en pasaje peatonal',
    description: 'Falta total de iluminación en las noches, propicio para asaltos.',
    category: 'Zona Oscura / Sin Iluminación',
    severity: 'Alta',
    location: {
      type: 'Point',
      coordinates: [-74.072092, 4.653456], // Bogotá / Coordenadas de ejemplo
      address: 'Calle 63 con Carrera 13',
    },
    reportedBy: 'David F.',
    status: 'Activo',
    confirmationsCount: 14,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'mock_2',
    title: 'Hurto con arma blanca a ciclistas',
    description: 'Sujetos en motocicleta interceptando a quienes cruzan por la ciclorruta.',
    category: 'Robo o Asalto',
    severity: 'Crítica',
    location: {
      type: 'Point',
      coordinates: [-74.068211, 4.658792],
      address: 'Avenida Caracas #68',
    },
    reportedBy: 'Comunidad Ciclista',
    status: 'Activo',
    confirmationsCount: 28,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'mock_3',
    title: 'Tramo con obras sin señalizar y escombros',
    description: 'Hueco profundo sin cerramiento en esquina poco visible.',
    category: 'Vía en Mal Estado / Obstáculo',
    severity: 'Media',
    location: {
      type: 'Point',
      coordinates: [-74.075432, 4.650123],
      address: 'Carrera 17 con Calle 60',
    },
    reportedBy: 'Vecino del Sector',
    status: 'Activo',
    confirmationsCount: 5,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

export const initialMockAlerts = [
  {
    _id: 'alert_1',
    title: '⚠️ Precaución en Zona Rosa',
    message: 'Reporte múltiple de robos en los últimos 20 minutos. Evite transitar en solitario.',
    level: 'Peligro',
    zoneName: 'Chapinero Central',
    location: {
      coordinates: [-74.069, 4.655],
    },
    createdAt: new Date().toISOString(),
  },
];

// Obtener reportes
export const fetchReports = async () => {
  try {
    const res = await fetch(`${BASE_URL}/reports`);
    if (!res.ok) throw new Error('Error al conectar con la API');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('[API Fallback] Usando datos locales de muestra:', err.message);
    return initialMockReports;
  }
};

// Crear reporte
export const createReportApi = async (reportData) => {
  try {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (!res.ok) throw new Error('Error al enviar reporte');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('[API Fallback] Guardando reporte localmente:', err.message);
    // Simular guardado local para que la UI no se bloquee
    return {
      _id: `local_${Date.now()}`,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      severity: reportData.severity,
      location: {
        type: 'Point',
        coordinates: [reportData.longitude, reportData.latitude],
        address: reportData.address || 'Ubicación seleccionada',
      },
      reportedBy: reportData.reportedBy || 'Yo',
      status: 'Activo',
      confirmationsCount: 1,
      createdAt: new Date().toISOString(),
    };
  }
};

// Confirmar reporte
export const confirmReportApi = async (reportId) => {
  try {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/confirm`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error al confirmar');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('[API Fallback] Confirmación local');
    return null;
  }
};

// Obtener alertas
export const fetchAlerts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error('Error al obtener alertas');
    const data = await res.json();
    return data.data;
  } catch (err) {
    return initialMockAlerts;
  }
};

