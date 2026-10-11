import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  HURRICANE_CURRENT_STATUS,
  TRAJECTORY_POINTS,
  SHELTERS_DATA,
  Shelter,
} from '../data/hurricaneData';
import { getGoogleMapsDirectionsUrl } from '../utils/geo';
import {
  Layers,
  MapPin,
  Crosshair,
  Wind,
  ShieldAlert,
  PawPrint,
  ExternalLink,
  Navigation,
} from 'lucide-react';

interface TrajectoryMapProps {
  selectedShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  userCoords?: { lat: number; lng: number } | null;
}

export const TrajectoryMap: React.FC<TrajectoryMapProps> = ({
  selectedShelterId,
  onSelectShelter,
  userCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const sheltersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeTile, setActiveTile] = useState<'osm' | 'satellite'>('osm');
  const [showShelters, setShowShelters] = useState(true);
  const [showWindZones, setShowWindZones] = useState(true);
  const [filterPetsOnly, setFilterPetsOnly] = useState(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('todos');

  // Tile layers refs
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center between hurricane and the Pacific Mexican coast (Colima / Jalisco)
    const initialMap = L.map(mapContainerRef.current, {
      center: [18.8, -104.9],
      zoom: 7,
      minZoom: 5,
      maxZoom: 17,
      zoomControl: false,
    });

    // Custom Zoom control position
    L.control.zoom({ position: 'topright' }).addTo(initialMap);

    // Initial tile layer: OpenStreetMap Standard (100% free, zero API key)
    const osmTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(initialMap);

    tileLayerRef.current = osmTile;

    // Layer groups
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

  // Update Tile Layer when activeTile changes
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
      // Hurricane Force Winds (vientos huracanados > 118 km/h ~ 75 km radius)
      L.circle([HURRICANE_CURRENT_STATUS.lat, HURRICANE_CURRENT_STATUS.lng], {
        radius: 80000,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.28,
        weight: 2,
        dashArray: '4, 4',
      })
        .bindTooltip('Vientos Huracanados Cat 4 (> 118 km/h y rachas 295 km/h)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesLayerRef.current);

      // Tropical Storm Force Winds (> 63 km/h ~ 250 km radius)
      L.circle([HURRICANE_CURRENT_STATUS.lat, HURRICANE_CURRENT_STATUS.lng], {
        radius: 250000,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.12,
        weight: 1.5,
      })
        .bindTooltip('Vientos de Tormenta Tropical (> 63 km/h)', {
          permanent: false,
          direction: 'top',
        })
        .addTo(zonesLayerRef.current);

      // Coastal Risk Line (Red Alert Zone)
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
        color: '#dc2626',
        weight: 5,
        opacity: 0.8,
      })
        .bindTooltip('ZONA DE ALERTA ROJA COSTERA (Punta San Telmo a El Roblito)', {
          sticky: true,
        })
        .addTo(zonesLayerRef.current);
    }

    // 2. Trajectory Polylines: Historical (solid) & Forecast (dashed)
    const historicalPoints = TRAJECTORY_POINTS.filter((p) => p.type === 'histórico' || p.type === 'actual');
    const forecastPoints = TRAJECTORY_POINTS.filter((p) => p.type === 'actual' || p.type === 'pronóstico');

    const historicalCoords: [number, number][] = historicalPoints.map((p) => [p.lat, p.lng]);
    const forecastCoords: [number, number][] = forecastPoints.map((p) => [p.lat, p.lng]);

    // Solid historical line
    L.polyline(historicalCoords, {
      color: '#dc2626',
      weight: 3.5,
      opacity: 0.9,
    }).addTo(markersLayerRef.current);

    // Dashed forecast line
    L.polyline(forecastCoords, {
      color: '#fbbf24',
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.9,
    }).addTo(markersLayerRef.current);

    // 3. Trajectory Points Markers
    TRAJECTORY_POINTS.forEach((pt) => {
      const isCurrent = pt.type === 'actual';

      let iconHtml = '';
      if (isCurrent) {
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 bg-sky-500/20 rounded-full animate-ping"></span>
            <div class="relative w-8 h-8 bg-slate-900 border-2 border-sky-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-sky-950/80">
              🌀
            </div>
            <span class="absolute -bottom-5 whitespace-nowrap bg-slate-900 text-sky-200 border border-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              Simón Cat. 4 (Actual)
            </span>
          </div>
        `;
      } else if (pt.type === 'histórico') {
        iconHtml = `
          <div class="w-4 h-4 rounded-full bg-red-400 border border-white flex items-center justify-center shadow text-[8px] font-bold text-white">
            ${pt.category}
          </div>
        `;
      } else {
        // Forecast
        iconHtml = `
          <div class="w-5 h-5 rounded-full bg-amber-500 border border-black flex items-center justify-center shadow text-[9px] font-black text-black">
            ${pt.category}
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-trajectory-marker',
        iconSize: isCurrent ? [32, 32] : [20, 20],
        iconAnchor: isCurrent ? [16, 16] : [10, 10],
      });

      const popupContent = `
        <div class="p-2 text-slate-900 font-sans min-w-[210px]">
          <div class="flex items-center justify-between border-b pb-1 mb-1">
            <span class="font-bold text-red-700 text-sm">Huracán Simón</span>
            <span class="text-xs px-1.5 py-0.5 rounded font-black ${
              pt.type === 'actual' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-800'
            }">
              ${pt.category} (${pt.type.toUpperCase()})
            </span>
          </div>
          <div class="text-xs text-slate-600 mb-1 font-semibold">${pt.dateTimeFormatted}</div>
          <div class="text-xs space-y-0.5 mb-2">
            <div><strong>Vientos sostenidos:</strong> ${pt.windSpeedKmh} km/h (${pt.windSpeedMph} mph)</div>
            <div><strong>Presión mínima:</strong> ${pt.pressureHpa} hPa</div>
            <div><strong>Posición:</strong> ${pt.lat.toFixed(1)}°N, ${Math.abs(pt.lng).toFixed(1)}°O</div>
          </div>
          <p class="text-[11px] text-slate-700 bg-slate-100 p-1.5 rounded">${pt.statusText}</p>
        </div>
      `;

      L.marker([pt.lat, pt.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markersLayerRef.current!);
    });
  }, [showWindZones]);

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
        <div class="relative cursor-pointer transition-transform hover:scale-110">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
            isSelected
              ? 'bg-blue-600 border-white ring-4 ring-blue-400 scale-125'
              : shelter.petsAllowed
              ? 'bg-emerald-600 border-emerald-200'
              : 'bg-indigo-600 border-indigo-200'
          } text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          ${
            shelter.petsAllowed
              ? `<span class="absolute -top-1 -right-1 bg-amber-400 text-amber-950 text-[9px] font-black rounded-full px-1 shadow border border-white">🐾</span>`
              : ''
          }
        </div>
      `;

      const shelterIcon = L.divIcon({
        html: shelterIconHtml,
        className: 'custom-shelter-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const gmapsLink = getGoogleMapsDirectionsUrl(shelter.lat, shelter.lng, shelter.name);

      const shelterPopup = `
        <div class="p-2 text-slate-900 font-sans min-w-[240px] max-w-[280px]">
          <div class="flex items-center justify-between border-b pb-1 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              ${shelter.state} • ${shelter.municipality}
            </span>
            <span class="text-[10px] font-bold ${
              shelter.petsAllowed ? 'text-amber-700 bg-amber-100' : 'text-slate-500'
            } px-1.5 py-0.5 rounded">
              ${shelter.petsAllowed ? '🐾 Acepta Mascotas' : 'Sin mascotas'}
            </span>
          </div>
          <h4 class="font-bold text-slate-900 text-xs mb-1">${shelter.name}</h4>
          <p class="text-[11px] text-slate-600 mb-2 leading-tight">${shelter.address}</p>
          
          <div class="grid grid-cols-2 gap-1 text-[10px] bg-slate-100 p-1.5 rounded mb-2">
            <div><strong>Capacidad:</strong> ${shelter.capacity} pers.</div>
            <div><strong>Ocupación:</strong> ${shelter.currentOccupancy || 0} pers.</div>
            <div class="col-span-2 text-emerald-800"><strong>Estado:</strong> ${shelter.status}</div>
          </div>

          ${
            shelter.phone
              ? `<div class="mb-2 text-[11px]"><a href="tel:${shelter.phone.replace(
                  /\s+/g,
                  ''
                )}" class="text-blue-600 font-bold hover:underline">📞 Tel: ${shelter.phone}</a></div>`
              : ''
          }

          <div class="pt-1 border-t flex flex-col gap-1.5">
            <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" 
               class="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-xs text-center transition">
              <span>📍 Cómo llegar (Google Maps)</span>
            </a>
          </div>
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

  // Handle User coordinates marker
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
            <span class="absolute w-6 h-6 bg-blue-500/40 rounded-full animate-ping"></span>
            <div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
          </div>
        `,
        className: 'custom-user-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .bindPopup(
          '<div class="p-1 font-sans text-xs font-bold text-slate-800">📍 Tu Ubicación Actual</div>'
        )
        .addTo(mapInstanceRef.current);
    }
  }, [userCoords]);

  // Center on Hurricane
  const handleCenterHurricane = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [HURRICANE_CURRENT_STATUS.lat, HURRICANE_CURRENT_STATUS.lng],
        8,
        { animate: true }
      );
    }
  };

  // Center on Coast & Shelters
  const handleCenterShelters = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([19.8, -104.8], 7.5, { animate: true });
    }
  };

  // Center on User if available
  const handleCenterUser = () => {
    if (mapInstanceRef.current && userCoords) {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 12, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-2">
        {/* Layer style toggle (100% Free & Open, zero API keys) */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 flex items-center shadow-lg text-xs">
          <button
            onClick={() => setActiveTile('osm')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTile === 'osm'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Mapa OpenStreetMap
          </button>
          <button
            onClick={() => setActiveTile('satellite')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTile === 'satellite'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Satélite Esri
          </button>
        </div>

        {/* Quick centers */}
        <button
          onClick={handleCenterHurricane}
          className="bg-slate-900/95 hover:bg-slate-800 text-sky-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95 border border-sky-500/40"
        >
          <Crosshair className="w-3.5 h-3.5 text-sky-400" />
          <span>Ojo Simón (Actual)</span>
        </button>

        <button
          onClick={handleCenterShelters}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95 border border-slate-700/80"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ver Costa y Refugios</span>
        </button>

        {userCoords && (
          <button
            onClick={handleCenterUser}
            className="bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95 border border-blue-400"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Mi Posición</span>
          </button>
        )}
      </div>

      {/* Bottom Floating Legend & Filters Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 sm:p-3 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium hover:text-white">
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                Refugios ({SHELTERS_DATA.length})
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-medium hover:text-white">
              <input
                type="checkbox"
                checked={showWindZones}
                onChange={(e) => setShowWindZones(e.target.checked)}
                className="rounded accent-red-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                Radios de Viento Cat 4
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-medium hover:text-amber-200">
              <input
                type="checkbox"
                checked={filterPetsOnly}
                onChange={(e) => setFilterPetsOnly(e.target.checked)}
                className="rounded accent-amber-400"
              />
              <span className="flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5" />
                Solo Pet-Friendly
              </span>
            </label>
          </div>

          {/* State selector filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Zona:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-red-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Jalisco">Jalisco (Puerto Vallarta / Costalegre)</option>
              <option value="Colima">Colima (Manzanillo / Tecomán)</option>
              <option value="Nayarit">Nayarit (Bahía de Banderas)</option>
              <option value="Michoacán">Michoacán</option>
              <option value="Baja California Sur">Baja California Sur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trajectory status corner badge */}
      <div className="absolute top-16 sm:top-14 right-3 z-10 pointer-events-none hidden sm:block">
        <div className="bg-slate-900/90 border border-red-500/30 rounded-xl p-2.5 shadow-xl text-[11px] backdrop-blur-md max-w-[200px]">
          <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Alerta SIAT-CT</span>
          </div>
          <div className="text-slate-300 leading-tight">
            Vientos sostenidos de <span className="text-white font-bold">240 km/h</span>. Desplazamiento al Norte rumbo a costas de Jalisco y Colima.
          </div>
        </div>
      </div>
    </div>
  );
};
