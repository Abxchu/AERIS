// Disaster events data (simulated)
const disasterEvents = [
    {
        id: 1,
        evento: "Inundación Severa",
        tipo: "Inundación",
        lat: 8.9937,
        lng: -79.5197,
        riesgo: "Alto",
        fecha: "2024-01-15",
        descripcion: "Inundación severa causada por lluvias torrenciales que afectó múltiples sectores residenciales. El nivel del agua alcanzó hasta 2 metros en algunas zonas, causando evacuaciones masivas y daños significativos a la infraestructura local.",
        imagen: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 2,
        evento: "Deslizamiento de Tierra",
        tipo: "Deslizamiento",
        lat: 8.9872,
        lng: -79.5209,
        riesgo: "Moderado",
        fecha: "2024-01-20",
        descripcion: "Deslizamiento de tierra en zona montañosa que bloqueó vías de acceso principales. El evento fue causado por la saturación del suelo debido a precipitaciones prolongadas, afectando aproximadamente 15 viviendas en la zona.",
        imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 3,
        evento: "Colapso Estructural",
        tipo: "Colapso de Vivienda",
        lat: 8.9905,
        lng: -79.5180,
        riesgo: "Alto",
        fecha: "2024-01-25",
        descripcion: "Colapso parcial de edificación residencial de 3 pisos debido a fallas estructurales agravadas por las condiciones climáticas adversas. Se reportaron daños materiales significativos pero sin víctimas fatales gracias a la evacuación preventiva.",
        imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 4,
        evento: "Inundación Urbana",
        tipo: "Inundación",
        lat: 8.9890,
        lng: -79.5230,
        riesgo: "Moderado",
        fecha: "2024-02-01",
        descripcion: "Inundación en zona urbana central causada por desbordamiento del sistema de drenaje pluvial. El evento afectó principalmente calles y avenidas principales, causando interrupciones en el transporte público y comercio local.",
        imagen: "https://images.unsplash.com/photo-1574482620881-b5eb0eeeb4d4?w=400&h=300&fit=crop&crop=center"
    },
    {
        id: 5,
        evento: "Erosión Costera",
        tipo: "Erosión",
        lat: 8.9950,
        lng: -79.5160,
        riesgo: "Bajo",
        fecha: "2024-02-05",
        descripcion: "Proceso de erosión costera acelerado por mareas altas y vientos fuertes. El fenómeno ha causado retroceso de la línea de costa en aproximadamente 3 metros, afectando infraestructura turística y residencial cercana al mar.",
        imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center"
    }
];

// Global variables
let map;
let markers = [];
let currentEvent = null;

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    // Add a small delay to ensure all libraries are loaded
    setTimeout(function() {
        try {
            console.log("Iniciando aplicación...");
            
            // Check if Leaflet is available
            if (typeof L === 'undefined') {
                throw new Error('Leaflet library not loaded');
            }
            
            initializeMap();
            loadDisasterEvents();
            setupEventListeners();
            console.log("Aplicación inicializada correctamente");
            
            // Hide loading indicator if it exists
            const loading = document.getElementById('loading');
            if (loading) {
                loading.classList.add('hidden');
            }
            
        } catch (error) {
            console.error("Error inicializando la aplicación:", error);
            showError("Error al cargar la aplicación: " + error.message);
            
            // Show fallback content
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.innerHTML = `
                    <div style="padding: 50px; text-align: center; background: #f8fafc;">
                        <h3 style="color: #dc2626;">Error al cargar el mapa</h3>
                        <p>No se pudieron cargar las librerías necesarias. Por favor, verifique su conexión a internet y recargue la página.</p>
                        <button onclick="location.reload()" style="background: #0080FF; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Recargar Página
                        </button>
                    </div>
                `;
            }
        }
    }, 500); // 500ms delay to ensure libraries are loaded
});

// Initialize Leaflet map
function initializeMap() {
    try {
        // Center map on Panama with wider view to show all country
        map = L.map('map').setView([8.5, -80.0], 7);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Datos satelitales: Copernicus Programme',
            maxZoom: 18,
        }).addTo(map);

        // Add custom control for legend
        addMapLegend();
        
        console.log("Mapa inicializado correctamente");
    } catch (error) {
        console.error("Error inicializando el mapa:", error);
        throw error;
    }
}

// Add legend to map
function addMapLegend() {
    const legend = L.control({ position: 'bottomleft' });
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        div.style.cssText = `
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 12px;
            line-height: 1.4;
        `;
        
        div.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: #1e293b;">Nivel de Riesgo</h4>
            <div><span style="color: #dc2626;">●</span> Alto</div>
            <div><span style="color: #d97706;">●</span> Moderado</div>
            <div><span style="color: #16a34a;">●</span> Bajo</div>
        `;
        
        return div;
    };
    
    legend.addTo(map);
}

// Load and display disaster events on map
function loadDisasterEvents() {
    try {
        disasterEvents.forEach(event => {
            addEventMarker(event);
        });
        console.log(`${disasterEvents.length} eventos cargados en el mapa`);
    } catch (error) {
        console.error("Error cargando eventos:", error);
        showError("Error al cargar los datos de eventos.");
    }
}

// Add marker for each event
function addEventMarker(event) {
    try {
        // Define marker color based on risk level
        const markerColor = getRiskColor(event.riesgo);
        
        // Create custom marker icon - larger and more visible
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${markerColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 12px;
            ">${getEventIcon(event.tipo)}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Create marker
        const marker = L.marker([event.lat, event.lng], { icon: customIcon })
            .addTo(map);

        // Add popup with basic info
        const popupContent = `
            <div style="font-family: Inter, sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px;">${event.evento}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Tipo:</strong> ${event.tipo}</p>
                <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Riesgo:</strong> 
                    <span style="color: ${markerColor}; font-weight: bold;">${event.riesgo}</span>
                </p>
                <button onclick="showEventDetails(${event.id})" style="
                    background: #0080FF;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                    width: 100%;
                ">Ver Detalles Completos</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);

        // Add click event to marker
        marker.on('click', function() {
            setTimeout(() => showEventDetails(event.id), 100);
        });

        markers.push({ marker, event });
        
    } catch (error) {
        console.error("Error creando marcador para evento:", event.id, error);
    }
}

// Get color based on risk level
function getRiskColor(riesgo) {
    switch (riesgo.toLowerCase()) {
        case 'alto': return '#dc2626';
        case 'moderado': return '#d97706';
        case 'bajo': return '#16a34a';
        default: return '#6b7280';
    }
}

// Get icon based on event type
function getEventIcon(tipo) {
    switch (tipo.toLowerCase()) {
        case 'inundación': return '🌊';
        case 'deslizamiento': return '⛰️';
        case 'colapso de vivienda': return '🏠';
        case 'erosión': return '🌊';
        default: return '⚠️';
    }
}

// Show event details in sidebar
function showEventDetails(eventId) {
    try {
        const event = disasterEvents.find(e => e.id === eventId);
        if (!event) {
            console.error("Evento no encontrado:", eventId);
            return;
        }

        currentEvent = event;

        // Update sidebar content
        document.getElementById('event-title').textContent = event.evento;
        document.getElementById('event-type').textContent = event.tipo;
        document.getElementById('event-risk').textContent = event.riesgo;
        document.getElementById('event-coords').textContent = `${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}`;
        document.getElementById('event-date').textContent = formatDate(event.fecha);
        document.getElementById('event-description').textContent = event.descripcion;

        // Set risk badge color
        const riskElement = document.getElementById('event-risk');
        riskElement.className = `risk-badge risk-${event.riesgo.toLowerCase()}`;

        // Load satellite image
        const imageElement = document.getElementById('event-image');
        imageElement.src = event.imagen;
        imageElement.onerror = function() {
            this.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Imagen+No+Disponible';
        };

        // Show sidebar
        document.getElementById('event-details').classList.remove('hidden');

        // Center map on event location
        map.setView([event.lat, event.lng], 15);

        console.log("Detalles mostrados para evento:", event.evento);
        
    } catch (error) {
        console.error("Error mostrando detalles del evento:", error);
        showError("Error al cargar los detalles del evento.");
    }
}

// Setup event listeners
function setupEventListeners() {
    try {
        // Close button
        document.getElementById('btn-close').addEventListener('click', function() {
            document.getElementById('event-details').classList.add('hidden');
        });

        // Download report button
        document.getElementById('btn-download').addEventListener('click', function() {
            if (currentEvent) {
                generatePDFReport(currentEvent);
            }
        });

        // EO Browser button
        document.getElementById('btn-eo-browser').addEventListener('click', function() {
            if (currentEvent) {
                openEOBrowser(currentEvent);
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('event-details');
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isMarkerClick = e.target.closest('.leaflet-marker-icon') || e.target.closest('.leaflet-popup');
            
            if (!isClickInsideSidebar && !isMarkerClick && !sidebar.classList.contains('hidden')) {
                sidebar.classList.add('hidden');
            }
        });

        console.log("Event listeners configurados");
        
    } catch (error) {
        console.error("Error configurando event listeners:", error);
    }
}

// Generate PDF report
function generatePDFReport(event) {
    try {
        if (typeof window.jspdf === 'undefined') {
            showError("Error: Librería PDF no disponible.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 128, 255);
        doc.text('REPORTE DE DESASTRE NATURAL', 20, 30);

        // Event details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        let yPosition = 50;
        const lineHeight = 8;

        doc.text(`Evento: ${event.evento}`, 20, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Tipo: ${event.tipo}`, 20, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Nivel de Riesgo: ${event.riesgo}`, 20, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Fecha: ${formatDate(event.fecha)}`, 20, yPosition);
        yPosition += lineHeight;
        
        doc.text(`Coordenadas: ${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}`, 20, yPosition);
        yPosition += lineHeight * 2;

        // Description
        doc.text('Descripción:', 20, yPosition);
        yPosition += lineHeight;
        
        const splitDescription = doc.splitTextToSize(event.descripcion, 170);
        doc.text(splitDescription, 20, yPosition);
        yPosition += splitDescription.length * lineHeight + 10;

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generado por Sistema de Monitoreo de Desastres Naturales', 20, yPosition + 20);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, yPosition + 30);
        doc.text('Fuente: Imágenes satelitales Copernicus Programme', 20, yPosition + 40);

        // Save PDF
        const fileName = `reporte_${event.tipo.toLowerCase()}_${event.fecha}.pdf`;
        doc.save(fileName);

        console.log("PDF generado:", fileName);
        
    } catch (error) {
        console.error("Error generando PDF:", error);
        showError("Error al generar el reporte PDF.");
    }
}

// Open EO Browser with event coordinates
function openEOBrowser(event) {
    try {
        // Construct EO Browser URL with coordinates
        const eoUrl = `https://browser.dataspace.copernicus.eu/?zoom=14&lat=${event.lat}&lng=${event.lng}&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fservices.sentinel-hub.com%2Fogc%2Fwms%2Fbd86bcc0-f318-402b-a145-015f85b9427e&datasetId=S2_L2A_CDAS&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-02-29T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR`;
        
        window.open(eoUrl, '_blank');
        console.log("EO Browser abierto para evento:", event.evento);
        
    } catch (error) {
        console.error("Error abriendo EO Browser:", error);
        showError("Error al abrir EO Browser.");
    }
}

// Utility function to format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return dateString;
    }
}

// Show error message
function showError(message) {
    console.error(message);
    alert(message); // Simple error display - could be enhanced with a custom modal
}

// Make showEventDetails globally accessible for popup buttons
window.showEventDetails = showEventDetails;

// Log application ready
console.log("Sistema de Monitoreo de Desastres Naturales - Listo");
