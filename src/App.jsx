import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MapView from './components/MapView';
import ReportsList from './components/ReportsList';
import AlertsFeed from './components/AlertsFeed';
import ReportModal from './components/ReportModal';
import PanicModal from './components/PanicModal';
import AlertBanner from './components/AlertBanner';
import DesktopSidebar from './components/DesktopSidebar';
import DesktopHeader from './components/DesktopHeader';
import DesktopSummary from './components/DesktopSummary';
import useMediaQuery from './hooks/useMediaQuery';
import { fetchReports, fetchAlerts, createReportApi, confirmReportApi } from './services/api';
import { initSocket, emitPanicAlert } from './services/socket';

const TAB_META = {
  map: {
    title: 'Mapa de riesgos',
    subtitle: 'Explora, reporta y valida zonas de riesgo en tu ciudad en tiempo real',
  },
  list: {
    title: 'Zonas de riesgo',
    subtitle: 'Reportes activos validados por la comunidad',
  },
  alerts: {
    title: 'Alertas en vivo',
    subtitle: 'Canal de emergencias y señales SOS recibidas',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'list' | 'alerts'
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [activeBannerAlert, setActiveBannerAlert] = useState(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(1);

  // Layout independiente: móvil (< 1024px) vs escritorio (>= 1024px)
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      const reportsData = await fetchReports();
      setReports(reportsData);

      const alertsData = await fetchAlerts();
      setAlerts(alertsData);
      if (alertsData.length > 0) {
        setUnreadAlertsCount(alertsData.length);
      }
    };

    loadInitialData();
  }, []);

  // Inicializar Socket.io y escuchar eventos en tiempo real
  useEffect(() => {
    const socket = initSocket();

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    // Evento: Nuevo reporte de zona de riesgo reportado por otro usuario
    const handleNewReport = (newReport) => {
      setReports((prev) => [newReport, ...prev]);
      setActiveBannerAlert({
        title: `🚨 Nueva Zona de Riesgo: ${newReport.category}`,
        message: newReport.title,
      });
    };

    // Evento: Alerta de emergencia masiva
    const handleUrgentAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setUnreadAlertsCount((c) => c + 1);
      setActiveBannerAlert({
        title: `⚠️ ${alert.title}`,
        message: alert.message,
      });
    };

    // Evento: Señal de pánico SOS recibida en vivo
    const handlePanicAlert = (sosData) => {
      const panicObj = {
        _id: sosData.id,
        title: '🚨 ¡SEÑAL DE PÁNICO SOS!',
        message: `${sosData.message} (Cerca a tus inmediaciones)`,
        level: 'Emergencia',
        createdAt: sosData.timestamp,
        zoneName: 'Ubicación en vivo del usuario',
      };
      setAlerts((prev) => [panicObj, ...prev]);
      setUnreadAlertsCount((c) => c + 1);
      setActiveBannerAlert({
        title: '🚨 ALERTA SOS INMEDIATA',
        message: panicObj.message,
      });
    };

    // Evento: Reporte confirmado por otro usuario
    const handleReportConfirmed = (updatedReport) => {
      setReports((prev) =>
        prev.map((r) => (r._id === updatedReport._id ? updatedReport : r))
      );
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_risk_report', handleNewReport);
    socket.on('urgent_safety_alert', handleUrgentAlert);
    socket.on('panic_alert_received', handlePanicAlert);
    socket.on('report_confirmed', handleReportConfirmed);

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_risk_report', handleNewReport);
      socket.off('urgent_safety_alert', handleUrgentAlert);
      socket.off('panic_alert_received', handlePanicAlert);
      socket.off('report_confirmed', handleReportConfirmed);
    };
  }, []);

  // Al hacer clic en el mapa para fijar una zona
  const handleSelectLocation = (latlng) => {
    setSelectedCoords(latlng);
    setIsReportModalOpen(true);
  };

  // Crear reporte
  const handleCreateReport = async (reportData) => {
    const created = await createReportApi(reportData);
    if (created) {
      setReports((prev) => [created, ...prev.filter((r) => r._id !== created._id)]);
    }
  };

  // Confirmar reporte
  const handleConfirmReport = async (reportId) => {
    // Optimistic UI update
    setReports((prev) =>
      prev.map((r) =>
        r._id === reportId
          ? { ...r, confirmationsCount: (r.confirmationsCount || 1) + 1 }
          : r
      )
    );
    await confirmReportApi(reportId);
  };

  // Emitir señal de pánico SOS
  const handleSendPanic = (panicData) => {
    emitPanicAlert(panicData);
    setActiveBannerAlert({
      title: '⚠️ Señal de Pánico Transmitida',
      message: 'Tu aviso SOS ha sido difundido a la red comunitaria.',
    });
  };

  // Navegación compartida por ambos layouts
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'alerts') setUnreadAlertsCount(0);
  };

  const handleOpenReport = (coords = null) => {
    setSelectedCoords(coords);
    setIsReportModalOpen(true);
  };

  const modals = (
    <>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateReport}
        preselectedCoords={selectedCoords}
      />

      <PanicModal
        isOpen={isPanicModalOpen}
        onClose={() => setIsPanicModalOpen(false)}
        onSendPanic={handleSendPanic}
      />
    </>
  );

  // ==================== LAYOUT ESCRITORIO ====================
  if (isDesktop) {
    const meta = TAB_META[activeTab];

    return (
      <div className="desktop-shell">
        {/* Banner flotante de alertas en tiempo real */}
        <AlertBanner
          alert={activeBannerAlert}
          onDismiss={() => setActiveBannerAlert(null)}
        />

        {/* Navegación lateral (exclusiva de escritorio) */}
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenReport={() => handleOpenReport()}
          onOpenPanic={() => setIsPanicModalOpen(true)}
          unreadAlertsCount={unreadAlertsCount}
        />

        <div className="desktop-main">
          <DesktopHeader
            title={meta.title}
            subtitle={meta.subtitle}
            isConnected={isSocketConnected}
            onOpenPanic={() => setIsPanicModalOpen(true)}
          />

          <div className="desktop-content">
            {activeTab === 'map' ? (
              <>
                <section className="desktop-map-area">
                  <MapView
                    reports={reports}
                    isDesktop
                    onSelectLocationToReport={handleSelectLocation}
                    onConfirmReport={handleConfirmReport}
                  />
                </section>

                <aside className="desktop-panel">
                  <DesktopSummary
                    reports={reports}
                    alerts={alerts}
                    onConfirmReport={handleConfirmReport}
                    onOpenReport={() => handleOpenReport()}
                  />
                </aside>
              </>
            ) : (
              <div className="desktop-page">
                {activeTab === 'list' && (
                  <ReportsList
                    reports={reports}
                    onConfirmReport={handleConfirmReport}
                    layout="grid"
                  />
                )}

                {activeTab === 'alerts' && <AlertsFeed alerts={alerts} layout="grid" />}
              </div>
            )}
          </div>
        </div>

        {modals}
      </div>
    );
  }

  // ==================== LAYOUT MÓVIL ====================
  return (
    <div className="mobile-wrapper">
      {/* Banner flotante de alertas en tiempo real */}
      <AlertBanner
        alert={activeBannerAlert}
        onDismiss={() => setActiveBannerAlert(null)}
      />

      {/* Header superior */}
      <Header
        isConnected={isSocketConnected}
        onOpenPanic={() => setIsPanicModalOpen(true)}
      />

      {/* Contenido según pestaña activa */}
      <main className="main-viewport">
        {activeTab === 'map' && (
          <MapView
            reports={reports}
            onSelectLocationToReport={handleSelectLocation}
            onConfirmReport={handleConfirmReport}
          />
        )}

        {activeTab === 'list' && (
          <ReportsList
            reports={reports}
            onConfirmReport={handleConfirmReport}
          />
        )}

        {activeTab === 'alerts' && <AlertsFeed alerts={alerts} />}
      </main>

      {/* Barra de navegación inferior (solo móvil) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenReport={() => handleOpenReport()}
        unreadAlertsCount={unreadAlertsCount}
      />

      {modals}
    </div>
  );
}

