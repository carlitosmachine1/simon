import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  HURRICANE_CURRENT_STATUS,
  TRAJECTORY_POINTS,
  SHELTERS_DATA,
  Shelter,
  TrajectoryPoint,
} from '../data/hurricaneData';
import { DynamicHurricaneStatus, getLiveHurricaneStatus } from '../utils/hurricaneTracking';
import { getGoogleMapsDirectionsUrl } from '../utils/geo';
import {
  Crosshair,
  MapPin,
  Navigation,
  Layers,
  PawPrint,
  Info,
  Eye,
  EyeOff,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TrajectoryMapProps {
  selectedShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  userCoords?: { lat: number; lng: number } | null;
  dynamicStatus?: DynamicHurricaneStatus;
  dynamicTrajectoryPoints?: TrajectoryPoint[];
  refreshTrigger?: number;
}

export const TrajectoryMap: React.FC<TrajectoryMapProps> = ({
  selectedShelterId,
  onSelectShelter,
  userCoords,
  dynamicStatus,
  dynamicTrajectoryPoints,
  refreshTrigger,
}) => {
  const { t } = useLanguage();
  // Use dynamic status or compute live on the fly
  const liveData = dynamicStatus && dynamicTrajectoryPoints
    ? { status: dynamicStatus, trajectoryPoints: dynamicTrajectoryPoints }
    : getLiveHurricaneStatus(new Date());

  const currentStatus = dynamicStatus || liveData.status;
  const activeTrajectoryPoints = dynamicTrajectoryPoints || liveData.trajectoryPoints;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const sheltersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeTile, setActiveTile] = useState<'osm' | 'satellite'>('osm');
  const [showShelters, setShowShelters] = useState(false);
  const [showWindZones, setShowWindZones] = useState(true);
  const [filterPetsOnly, setFilterPetsOnly] = useState(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('todos');
  // Scroll protection: locked by default on mobile so user doesn't get trapped while scrolling page
  const [isMapLockedForScroll, setIsMapLockedForScroll] = useState<boolean>(true);
  const [scrollHintMessage, setScrollHintMessage] = useState<string | null>(null);

  // If a shelter is selected externally from directory, ensure shelters are visible
  useEffect(() => {
    if (selectedShelterId && !showShelters) {
      setShowShelters(true);
    }
  }, [selectedShelterId]);

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialMap = L.map(mapContainerRef.current, {
      center: [19.2, -105.1],
      zoom: 7,
      minZoom: 5,
      maxZoom: 17,
      zoomControl: false,
      scrollWheelZoom: false, // Prevents unintended zoom when scrolling page on desktop
      dragging: !isMapLockedForScroll,
      touchZoom: !isMapLockedForScroll,
    });

    L.control.zoom({ position: 'topright' }).addTo(initialMap);

    const osmTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(initialMap);

    tileLayerRef.current = osmTile;

    const zonesGroup = L.layerGroup().addTo(initialMap);
    const markersGroup = L.layerGroup().addTo(initialMap);
    const sheltersGroup = L.layerGroup().addTo(initialMap);

    zonesLayerRef.current = zonesGroup;
    markersLayerRef.current = markersGroup;
    sheltersLayerRef.current = sheltersGroup;

    mapInstanceRef.current = initialMap;

    return () => {
      initialMap.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Synchronize Mobile & Page Scroll Lock
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (isMapLockedForScroll) {
      mapInstanceRef.current.dragging.disable();
      mapInstanceRef.current.touchZoom.disable();
      mapInstanceRef.current.scrollWheelZoom.disable();
    } else {
      mapInstanceRef.current.dragging.enable();
      mapInstanceRef.current.touchZoom.enable();
      mapInstanceRef.current.scrollWheelZoom.enable();
    }
  }, [isMapLockedForScroll]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let url = '';
    let attr = '';

    if (activeTile === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = 'Tiles &copy; Esri, Maxar, Earthstar Geographics';
    } else {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
    }

    const newTile = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [activeTile]);

  // Render Trajectory and Danger Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !zonesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();

    // 1. Wind Danger Zones around current eye
    if (showWindZones) {
      // Hurricane Force Winds (> 118 km/h ~ 75 km radius)
      L.circle([currentStatus.lat, currentStatus.lng], {
        radius: 80000,
        color: '#B84A45',
        fillColor: '#B84A45',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '3, 3',
      })
        .bindTooltip(`Vientos Huracanados Cat. 4 (${currentStatus.windSpeedKmh} km/h y rachas ${currentStatus.windGustsKmh} km/h)`, {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesLayerRef.current);

      // Tropical Storm Force Winds (> 63 km/h ~ 240 km radius)
      L.circle([currentStatus.lat, currentStatus.lng], {
        radius: 240000,
        color: '#A66C19',
        fillColor: '#A66C19',
        fillOpacity: 0.08,
        weight: 1,
      })
        .bindTooltip('Radio de Vientos de Tormenta Tropical (> 63 km/h)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesLayerRef.current);

      // Official Coastal Warning Zone (Michoacán a Nayarit)
      const coastalWarningCoords: [number, number][] = [
        [18.0, -102.8],
        [18.3, -103.3],
        [18.7, -103.7],
        [19.0, -104.3],
        [19.2, -104.7],
        [19.5, -105.1],
        [20.5, -105.3],
        [20.8, -105.5],
        [21.5, -105.3],
      ];

      L.polyline(coastalWarningCoords, {
        color: '#B84A45',
        weight: 3.5,
        opacity: 0.85,
      })
        .bindTooltip('Zona Costera de Aviso de Huracán (Punta San Telmo a El Roblito)', {
          sticky: true,
        })
        .addTo(zonesLayerRef.current);
    }

    // 2. Trajectory Polylines
    const historicalPoints = activeTrajectoryPoints.filter((p) => p.type === 'histórico' || p.type === 'actual');
    const forecastPoints = activeTrajectoryPoints.filter((p) => p.type === 'actual' || p.type === 'pronóstico');

    const historicalCoords: [number, number][] = historicalPoints.map((p) => [p.lat, p.lng]);
    const forecastCoords: [number, number][] = forecastPoints.map((p) => [p.lat, p.lng]);

    // Solid historical line
    L.polyline(historicalCoords, {
      color: '#245A66',
      weight: 3,
      opacity: 0.9,
    }).addTo(markersLayerRef.current);

    // Dashed forecast line
    L.polyline(forecastCoords, {
      color: '#A66C19',
      weight: 2.5,
      dashArray: '5, 5',
      opacity: 0.85,
    }).addTo(markersLayerRef.current);

    // 3. Trajectory Points Markers
    activeTrajectoryPoints.forEach((pt) => {
      const isCurrent = pt.type === 'actual';

      let iconHtml = '';
      if (isCurrent) {
        iconHtml = `
          <div class="relative flex items-center justify-center font-sans">
            <span class="absolute w-8 h-8 bg-[#B84A45]/30 rounded-full animate-ping"></span>
            <span class="absolute w-6 h-6 bg-[#245A66]/25 rounded-full"></span>
            <div class="relative w-6 h-6 bg-[#B84A45] border-2 border-white rounded-[3px] flex items-center justify-center text-white font-bold text-[10px] shadow-md">
              S4
            </div>
            <span class="absolute -bottom-4.5 whitespace-nowrap bg-[#252A2E] text-white border border-white/20 text-[9px] font-semibold px-1.5 py-0.2 rounded-[2px] shadow-sm">
              Ojo Actual (${currentStatus.timeText} hrs)
            </span>
          </div>
        `;
      } else if (pt.type === 'histórico') {
        iconHtml = `
          <div class="w-3.5 h-3.5 rounded-[2px] bg-[#245A66] border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs">
            ${pt.category}
          </div>
        `;
      } else {
        iconHtml = `
          <div class="w-3.5 h-3.5 rounded-[2px] bg-[#D99A38] border border-white flex items-center justify-center text-[7px] font-bold text-[#252A2E] shadow-xs">
            ${pt.category}
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'clean-trajectory-marker',
        iconSize: isCurrent ? [24, 24] : [14, 14],
        iconAnchor: isCurrent ? [12, 12] : [7, 7],
      });

      const popupContent = `
        <div class="p-1 text-[#252A2E] font-sans text-xs">
          <div class="flex items-center justify-between border-b border-[#DDE1DF] pb-1 mb-1.5">
            <span class="font-semibold text-[#245A66]">Huracán Simón</span>
            <span class="text-[10px] px-1 py-0.5 rounded-[2px] font-medium ${
              pt.type === 'actual' ? 'bg-[#245A66] text-white font-semibold' : 'bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF]'
            }">
              ${pt.category} (${pt.type === 'actual' ? 'En Vivo' : pt.type})
            </span>
          </div>
          <div class="text-[11px] text-[#687078] mb-1 font-medium font-tabular">${pt.dateTimeFormatted}</div>
          <div class="space-y-0.5 mb-1.5 text-[11px] font-tabular">
            <div><strong>Viento sostenido:</strong> ${pt.windSpeedKmh} km/h (${pt.windSpeedMph} mph)</div>
            <div><strong>Presión mínima:</strong> ${pt.pressureHpa} hPa</div>
            <div><strong>Posición:</strong> ${pt.lat.toFixed(2)}°N, ${Math.abs(pt.lng).toFixed(2)}°O</div>
          </div>
          <p class="text-[11px] text-[#687078] bg-[#F7F7F4] p-1.5 rounded-[3px] border border-[#DDE1DF]">${pt.statusText}</p>
        </div>
      `;

      L.marker([pt.lat, pt.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markersLayerRef.current!);
    });
  }, [showWindZones, currentStatus.lat, currentStatus.lng, currentStatus.timeText, refreshTrigger]);

  // Render Shelters Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !sheltersLayerRef.current) return;

    sheltersLayerRef.current.clearLayers();

    if (!showShelters) return;

    const filteredShelters = SHELTERS_DATA.filter((s) => {
      if (filterPetsOnly && !s.petsAllowed) return false;
      if (selectedStateFilter !== 'todos' && s.state !== selectedStateFilter) return false;
      return true;
    });

    filteredShelters.forEach((shelter) => {
      const isSelected = selectedShelterId === shelter.id;

      const shelterIconHtml = `
        <div class="relative cursor-pointer">
          <div class="w-6 h-6 rounded-[3px] flex items-center justify-center border ${
            isSelected
              ? 'bg-[#245A66] border-white ring-2 ring-[#245A66]'
              : shelter.petsAllowed
              ? 'bg-[#3F8063] border-white'
              : 'bg-[#245A66] border-white'
          } text-white shadow-xs">
            <svg class="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          ${
            shelter.petsAllowed
              ? `<span class="absolute -top-1 -right-1 bg-[#D99A38] text-white text-[7px] font-bold rounded-[2px] px-0.5">P</span>`
              : ''
          }
        </div>
      `;

      const shelterIcon = L.divIcon({
        html: shelterIconHtml,
        className: 'clean-shelter-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const gmapsLink = getGoogleMapsDirectionsUrl(shelter.lat, shelter.lng, shelter.name);

      const shelterPopup = `
        <div class="p-1 text-[#252A2E] font-sans text-xs min-w-[220px]">
          <div class="flex items-center justify-between border-b border-[#DDE1DF] pb-1 mb-1">
            <span class="text-[10px] font-semibold text-[#245A66] uppercase">
              ${shelter.state} • ${shelter.municipality}
            </span>
            <span class="text-[10px] ${
              shelter.petsAllowed ? 'text-[#3F8063] font-medium' : 'text-[#687078]'
            }">
              ${shelter.petsAllowed ? 'Mascotas: Sí' : 'Sin mascotas'}
            </span>
          </div>
          <h4 class="font-semibold text-[#252A2E] text-xs mb-1">${shelter.name}</h4>
          <p class="text-[11px] text-[#687078] mb-1.5 leading-tight">${shelter.address}</p>
          
          <div class="text-[11px] font-tabular bg-[#F7F7F4] p-1.5 rounded-[3px] border border-[#DDE1DF] mb-2 space-y-0.5">
            <div><strong>Capacidad:</strong> ${shelter.capacity} personas</div>
            <div><strong>Estado:</strong> ${shelter.status}</div>
          </div>

          <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" 
             class="flex items-center justify-center gap-1 w-full bg-[#245A66] hover:bg-[#1b434c] text-white font-medium py-1 px-2 rounded-[3px] text-xs text-center transition">
            <span>Ruta en Google Maps</span>
          </a>
        </div>
      `;

      const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
        .bindPopup(shelterPopup)
        .addTo(sheltersLayerRef.current!);

      marker.on('click', () => {
        if (onSelectShelter) {
          onSelectShelter(shelter);
        }
      });
    });
  }, [showShelters, filterPetsOnly, selectedStateFilter, selectedShelterId, onSelectShelter]);

  // Handle User Coordinates marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userCoords) {
      const userIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-4 h-4 bg-[#245A66]/30 rounded-full animate-ping"></span>
            <div class="w-3.5 h-3.5 bg-[#245A66] border-2 border-white rounded-full shadow-sm"></div>
          </div>
        `,
        className: 'clean-user-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .bindPopup(
          '<div class="p-1 font-sans text-xs font-semibold text-[#252A2E]">Tu Ubicación Actual</div>'
        )
        .addTo(mapInstanceRef.current);
    }
  }, [userCoords]);

  const handleCenterHurricane = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [currentStatus.lat, currentStatus.lng],
        8,
        { animate: true }
      );
    }
  };

  const handleCenterShelters = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([19.4, -104.9], 7.5, { animate: true });
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] overflow-hidden shadow-none">
      {/* Map Header / Discrete Controls Bar */}
      <div className="p-3 border-b border-[#DDE1DF] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Layer Styles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTile('osm')}
            className={`px-2.5 py-1 rounded-[4px] font-medium transition text-xs ${
              activeTile === 'osm'
                ? 'bg-[#245A66] text-white'
                : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
            }`}
          >
            {t.baseOSM}
          </button>
          <button
            onClick={() => setActiveTile('satellite')}
            className={`px-2.5 py-1 rounded-[4px] font-medium transition text-xs ${
              activeTile === 'satellite'
                ? 'bg-[#245A66] text-white'
                : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
            }`}
          >
            {t.baseSatellite}
          </button>
        </div>

        {/* Focus, Scroll Protection, and Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scroll Lock Toggle to prevent getting stuck on mobile / desktop */}
          <button
            onClick={() => {
              setIsMapLockedForScroll((prev) => !prev);
              setScrollHintMessage(null);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold transition border cursor-pointer ${
              isMapLockedForScroll
                ? 'bg-[#3F8063]/10 text-[#3F8063] border-[#3F8063]/30 hover:bg-[#3F8063]/20'
                : 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1b434c]'
            }`}
          >
            {isMapLockedForScroll ? (
              <>
                <Lock className="w-3.5 h-3.5 stroke-[2]" />
                <span>{t.scrollSafeLockedMap}</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 stroke-[2]" />
                <span>{t.scrollNavigatingMap}</span>
              </>
            )}
          </button>

          {/* Quick Toggle: Show / Hide Shelters for fast loading */}
          <button
            onClick={() => setShowShelters((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold transition border cursor-pointer ${
              showShelters
                ? 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1b434c]'
                : 'bg-[#FDF4E7] text-[#9A5B18] border-[#E8C28A] hover:bg-[#FAE8CC]'
            }`}
          >
            {showShelters ? (
              <>
                <Eye className="w-3.5 h-3.5 stroke-[2]" />
                <span>{t.sheltersVisibleBtn}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 stroke-[2] text-[#9A5B18]" />
                <span>{t.sheltersHiddenBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={handleCenterHurricane}
            className="inline-flex items-center gap-1 bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-2.5 py-1 rounded-[4px] text-xs font-medium transition cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
            <span>{t.centerSimonBtn}</span>
          </button>

          <button
            onClick={handleCenterShelters}
            className="inline-flex items-center gap-1 bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-2.5 py-1 rounded-[4px] text-xs font-medium transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#3F8063] stroke-[1.75]" />
            <span>Ver Costa y Refugios</span>
          </button>

          {/* State selector */}
          <select
            value={selectedStateFilter}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedStateFilter(val);
              if (mapInstanceRef.current) {
                if (val === 'Colima') {
                  mapInstanceRef.current.setView([19.12, -104.05], 9, { animate: true });
                } else if (val === 'Jalisco') {
                  mapInstanceRef.current.setView([20.15, -105.1], 8, { animate: true });
                } else if (val === 'Nayarit') {
                  mapInstanceRef.current.setView([21.4, -105.2], 8, { animate: true });
                } else if (val === 'todos') {
                  mapInstanceRef.current.setView([19.2, -105.1], 7, { animate: true });
                }
              }
            }}
            className="bg-[#F7F7F4] border border-[#DDE1DF] text-[#252A2E] text-xs rounded-[4px] px-2 py-1 outline-none focus:border-[#245A66]"
          >
            <option value="todos">Todos los Estados (272 refugios)</option>
            <option value="Colima">Colima (216 oficial GIR UEPC)</option>
            <option value="Jalisco">Jalisco (26 Costa Norte/Sur UEPCBJ)</option>
            <option value="Nayarit">Nayarit (26 Bahía/Costa SSPC)</option>
            <option value="Michoacán">Michoacán (2 refugios)</option>
            <option value="Baja California Sur">Baja California Sur (2 refugios)</option>
          </select>
        </div>
      </div>

      {/* Map Canvas with Mobile Scroll Lock Guard */}
      <div
        className="relative w-full h-[460px] md:h-[520px]"
        onClick={() => {
          if (isMapLockedForScroll) {
            setScrollHintMessage('Scroll libre de página activo. Toca "Explorar Mapa" si deseas mover o acercar el mapa.');
            setTimeout(() => setScrollHintMessage(null), 3500);
          }
        }}
      >
        {/* Floating Mobile Scroll Protection Indicator & Quick Toggle */}
        <div className="absolute top-3 right-3 z-[400] md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMapLockedForScroll((prev) => !prev);
              setScrollHintMessage(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border flex items-center gap-1.5 transition active:scale-95 ${
              isMapLockedForScroll
                ? 'bg-white/95 text-[#245A66] border-[#245A66]/30'
                : 'bg-[#245A66] text-white border-white/30'
            }`}
          >
            {isMapLockedForScroll ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Explorar Mapa</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Permitir Scroll</span>
              </>
            )}
          </button>
        </div>

        {/* Temporary hint banner on mobile when touching locked map */}
        {scrollHintMessage && isMapLockedForScroll && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[400] bg-[#252A2E]/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg text-center max-w-[90%] pointer-events-none transition animate-fade-in">
            {scrollHintMessage}
          </div>
        )}

        {/* Floating Agile Mode indicator if shelters are hidden */}
        {!showShelters && (
          <div className="absolute top-3 left-3 z-[400] bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E8C28A] text-[#252A2E] rounded-[4px] px-2.5 py-1.5 text-xs shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D99A38] animate-pulse"></span>
            <span className="font-medium text-[#9A5B18]">Modo ágil activo:</span>
            <span className="text-[#687078] hidden sm:inline">Refugios ocultos para acelerar carga.</span>
            <button
              onClick={() => setShowShelters(true)}
              className="text-[#245A66] hover:underline font-semibold text-xs ml-1 cursor-pointer"
            >
              Mostrar refugios
            </button>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Map Legend & Layer Toggles Footer */}
      <div className="p-3 border-t border-[#DDE1DF] bg-[#F7F7F4] flex flex-wrap items-center justify-between gap-3 text-xs text-[#687078]">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-[#252A2E] font-medium">
            <input
              type="checkbox"
              checked={showShelters}
              onChange={(e) => setShowShelters(e.target.checked)}
              className="accent-[#245A66]"
            />
            <span>Mostrar Refugios ({SHELTERS_DATA.length})</span>
            <span className="text-[11px] text-[#687078] font-normal">
              {showShelters ? '(Desactiva para agilizar)' : '(Ocultos para agilizar carga)'}
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#252A2E] font-medium">
            <input
              type="checkbox"
              checked={showWindZones}
              onChange={(e) => setShowWindZones(e.target.checked)}
              className="accent-[#B84A45]"
            />
            <span>Radios de Viento Oficiales</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#252A2E] font-medium">
            <input
              type="checkbox"
              checked={filterPetsOnly}
              onChange={(e) => setFilterPetsOnly(e.target.checked)}
              className="accent-[#D99A38]"
            />
            <span className="flex items-center gap-1">
              <PawPrint className="w-3 h-3 text-[#D99A38]" />
              Solo Pet-Friendly
            </span>
          </label>
        </div>

        <div className="text-[11px] text-[#687078] flex items-center gap-2">
          <span>Fuente: OpenStreetMap • Trayectoria: NHC / SMN</span>
          <span className="text-[#245A66] font-semibold bg-[#245A66]/8 px-1.5 py-0.5 rounded-[3px]">
            Actualizado {currentStatus.timeText} hrs
          </span>
        </div>
      </div>
    </div>
  );
};
