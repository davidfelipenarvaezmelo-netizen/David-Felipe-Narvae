# 📱 Rutas Seguras - Frontend Móvil (React + Vite)

Aplicación web móvil (PWA/Responsive) construida en React para la visualización y reporte ciudadano de zonas de riesgo con alertas y notificaciones en tiempo real vía WebSockets.

## 🚀 Tecnologías
- **React 18** (Vite)
- **Leaflet & React-Leaflet** (Mapas interactivos basados en OpenStreetMap, geolocalización por GPS y pines personalizados con indicadores de severidad)
- **Socket.io-client** (Recepción y difusión en tiempo real de reportes de riesgo, alertas de emergencia y señales SOS)
- **Lucide React** (Iconografía moderna)
- **CSS3 Mobile-First Design** (Diseño responsivo optimizado para pantallas táctiles de teléfonos móviles)

## 📂 Estructura del Proyecto
```
David-Felipe-Narvae/
├── src/
│   ├── components/
│   │   ├── AlertBanner.jsx    # Notificación flotante de alertas en tiempo real
│   │   ├── AlertsFeed.jsx     # Historial de alertas de emergencia
│   │   ├── BottomNav.jsx      # Barra de navegación móvil inferior
│   │   ├── Header.jsx         # Encabezado con estado de conexión y botón SOS
│   │   ├── MapView.jsx        # Mapa interactivo Leaflet con GPS y pines de peligro
│   │   ├── PanicModal.jsx     # Ventana de activación de señal de pánico SOS
│   │   ├── ReportModal.jsx    # Formulario para registrar nueva zona de peligro
│   │   └── ReportsList.jsx    # Listado con buscador y filtros por severidad
│   ├── services/
│   │   ├── api.js             # Peticiones HTTP a la API REST (con datos fallback)
│   │   └── socket.js          # Conexión Socket.io para tiempo real
│   ├── App.jsx                # Componente principal y gestor de estados
│   ├── index.css              # Estilos visuales móviles
│   └── main.jsx               # Punto de entrada de la aplicación
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Revisar el archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir en el navegador:
- Navegar a `http://localhost:5173`
- Para probar desde un dispositivo móvil conectado a la misma red WiFi, usar la IP de la red local que Vite muestra en consola (ej. `http://192.168.x.x:5173`).

## 🌟 Funcionalidades Principales
- 🗺️ **Mapa Interactivo:** Visualización de zonas de riesgo con colores según nivel (Baja, Media, Alta, Crítica).
- 📍 **Reporte Fácil:** Toca cualquier punto del mapa o usa el botón central `+` para reportar un incidente.
- 📡 **Alertas en Tiempo Real:** Las zonas reportadas y las alertas se sincronizan al instante entre todos los usuarios conectados sin necesidad de recargar la página.
- 🚨 **Botón de Pánico SOS:** Envía una señal de auxilio urgente con ubicación estimada a la red comunitaria y enlace directo a la línea de emergencias.
- 📋 **Filtros y Búsqueda:** Búsqueda rápida por tipo de delito o situación de riesgo y severidad.

