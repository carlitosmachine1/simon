import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  SHELTERS_DATA,
  Shelter,
} from '../data/hurricaneData';
import { calculateDistanceKm, formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';
import {
  Compass,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Crosshair,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NOAA_MAPSERVER_API =
  'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer';

// CARTO Basemaps API key to remove "API key required" watermark on raster tiles
const CARTO_API_KEY =
  (import.meta as any).env?.VITE_CARTO_API_KEY || 'cb1_4hee_1_1c1b83982f353128945c2288';

interface TrajectoryMapProps {
  selectedShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  userCoords?: { lat: number; lng: number } | null;
  refreshTrigger?: number;
  dynamicStatus?: any;
  dynamicTrajectoryPoints?: any;
  onLiveStormData?: (data: {
    lat: number;
    lng: number;
    windKmh: number;
    gustKmh: number;
    pressureHpa: number;
    category: number;
    advisoryNum: string;
    advisoryDate: string;
    movement: string;
    speedKmh: number;
  }) => void;
}

export const TrajectoryMap: React.FC<TrajectoryMapProps> = ({
  selectedShelterId,
  onSelectShelter,
  userCoords,
  refreshTrigger,
  dynamicStatus,
  dynamicTrajectoryPoints,
  onLiveStormData,
}) => {
  const { t, language } = useLanguage();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layers refs
  const forecastLayerRef = useRef<L.GeoJSON | null>(null);
  const coneLayerRef = useRef<L.GeoJSON | null>(null);
  const pastLayerRef = useRef<L.GeoJSON | null>(null);
  const pointsLayerRef = useRef<L.GeoJSON | null>(null);
  const warningsLayerRef = useRef<L.GeoJSON | null>(null);
  const sheltersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Base map layers ref
  const baseLayersRef = useRef<Record<string, L.TileLayer>>({});

  // UI & Layer Visibility States
  const [showForecast, setShowForecast] = useState(true);
  const [showCone, setShowCone] = useState(true);
  const [showPast, setShowPast] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);
  const [showShelters, setShowShelters] = useState(false);

  // Status & Metadata states
  const [statusText, setStatusText] = useState<string>(
    language === 'en' ? 'Connecting to NOAA...' : 'Conectando con NOAA…'
  );
  const [statusDotColor, setStatusDotColor] = useState<string>('#d99b35'); // yellow
  const [tileMsg, setTileMsg] = useState<string>('');
  const [stormSummaryHtml, setStormSummaryHtml] = useState<string>(
    language === 'en'
      ? 'Searching for active tropical systems in official NOAA feed...'
      : 'Buscando sistemas activos en la fuente oficial NOAA…'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Mobile scroll protection (locked by default to prevent getting trapped while scrolling page)
  const [isMapLockedForScroll, setIsMapLockedForScroll] = useState<boolean>(true);

  const hasFittedBoundsRef = useRef(false);

  // Escape helper for HTML popups
  const esc = (v: any) => {
    return String(v ?? (language === 'en' ? 'N/A' : 'No disponible')).replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c] || c)
    );
  };

  // Popup builder for NOAA features
  const popupFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const p = feature.properties || {};
      const title =
        p.stormname ||
        p.STORMNAME ||
        p.stormName ||
        (language === 'en' ? 'NOAA Tropical Product' : 'Producto tropical NOAA');

      const rows = Object.entries(p)
        .filter(
          ([k, v]) =>
            v !== null &&
            v !== '' &&
            !['Shape', 'shape', 'objectid', 'OBJECTID'].includes(k)
        )
        .slice(0, 14);

      const html = `
        <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.45;max-width:280px;">
          <div style="font-weight:700;font-size:13px;color:#193247;border-bottom:1px solid #d6e1e8;padding-bottom:4px;margin-bottom:6px;">
            ${esc(title)}
          </div>
          ${rows
            .map(
              ([k, v]) =>
                `<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:3px;">
                  <strong style="color:#607788;">${esc(k)}:</strong>
                  <span style="font-weight:600;color:#193247;text-align:right;">${esc(v)}</span>
                </div>`
            )
            .join('')}
        </div>
      `;
      layer.bindPopup(html);
    },
    [language]
  );

  // Fetch individual layer as GeoJSON from NOAA MapServer
  const fetchLayer = async (layerId: number, where = '1=1') => {
    const params = new URLSearchParams({
      where,
      outFields: '*',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'geojson',
    });
    params.set('_ts', String(Date.now()));
    const url = `${NOAA_MAPSERVER_API}/${layerId}/query?${params.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`NOAA layer ${layerId}: HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Error del servicio NOAA');
    return data;
  };

  // Refresh all NOAA layers
  const refreshNOAALayers = useCallback(async () => {
    setIsRefreshing(true);
    setStatusText(language === 'en' ? 'Updating from NOAA...' : 'Actualizando datos oficiales…');
    setStatusDotColor('#d99b35');

    try {
      // Query layer 6 (Forecast Track), 7 (Cone), 11 (Past Track), 5 (Forecast Points), 8 (Watch-Warning)
      const results = await Promise.allSettled([
        fetchLayer(6),
        fetchLayer(7),
        fetchLayer(11),
        fetchLayer(5),
        fetchLayer(8),
      ]);

      const layerRefs = [
        forecastLayerRef.current,
        coneLayerRef.current,
        pastLayerRef.current,
        pointsLayerRef.current,
        warningsLayerRef.current,
      ];

      const names = ['forecast', 'cone', 'past', 'points', 'warnings'];
      const errors: string[] = [];

      results.forEach((result, idx) => {
        const lRef = layerRefs[idx];
        if (result.status === 'fulfilled' && lRef) {
          lRef.clearLayers().addData(result.value);
        } else if (result.status === 'rejected') {
          errors.push(`${names[idx]}: ${result.reason.message}`);
        }
      });

      // Extract system summary
      const forecastGeo = forecastLayerRef.current ? (forecastLayerRef.current.toGeoJSON() as any) : null;
      const forecastFeatures = forecastGeo?.features || [];
      const pointsGeo = pointsLayerRef.current ? (pointsLayerRef.current.toGeoJSON() as any) : null;
      const pointsFeatures = pointsGeo?.features || [];

      const allFeatures = [...forecastFeatures, ...pointsFeatures];

      const findName = (f: any) => {
        const p = f.properties || {};
        return String(p.stormname || p.STORMNAME || p.stormName || p.name || '')
          .trim()
          .toLowerCase();
      };

      const featureTime = (f: any) => {
        const p = f.properties || {};
        return p.advdate || p.ADVDATE || p.idp_filedate || p.idp_ingestdate || '';
      };

      const targetSystemFeatures = allFeatures.filter((f) => findName(f));
      const activeSystems = allFeatures.filter((f) => findName(f));
      const uniqueNames = [...new Set(activeSystems.map(findName))];
      const latestTime = allFeatures.map(featureTime).filter(Boolean).sort().slice(-1)[0];

      // Extract latest live coordinates and intensity from point tau 0 or point features
      if (targetSystemFeatures.length && onLiveStormData) {
        const tau0 = pointsFeatures.find(
          (f: any) =>
            findName(f) &&
            (f.properties?.tau === 0 || f.properties?.TAU === 0)
        );
        const refFeature = tau0 || targetSystemFeatures[0];
        if (refFeature && refFeature.geometry) {
          const coords =
            refFeature.geometry.type === 'Point'
              ? refFeature.geometry.coordinates
              : refFeature.geometry.coordinates?.[0];

          if (coords && coords.length >= 2) {
            const props = refFeature.properties || {};
            const maxKnots = props.maxwind || props.MAXWIND || 80;
            const gustKnots = props.gust || props.GUST || 100;
            const mslp = props.mslp || props.MSLP || 977;
            const headingDeg = props.tcdir || props.TCDIR || 300;
            const speedKt = props.tcspd || props.TCSPD || 4;

            onLiveStormData({
              lng: coords[0],
              lat: coords[1],
              windKmh: Math.round(maxKnots * 1.852),
              gustKmh: Math.round(gustKnots * 1.852),
              pressureHpa: mslp,
              category: props.ssnum ?? props.SSNUM ?? 2,
              advisoryNum: String(props.advisnum || props.ADVISNUM || '24A'),
              advisoryDate: String(props.advdate || props.ADVDATE || ''),
              movement: `${headingDeg}°`,
              speedKmh: Math.round(speedKt * 1.852),
            });
          }
        }
      }

      let summaryHtml = '';
      if (uniqueNames.length) {
        summaryHtml =
          language === 'en'
            ? `<div class="font-bold text-[#193247] mb-1">✅ Active tropical cyclone detected: ${uniqueNames.map((n) => n.toUpperCase()).join(', ')}</div>
               <div class="text-[#607788]">Official NOAA GIS track elements rendered: ${targetSystemFeatures.length}.</div>`
            : `<div class="font-bold text-[#193247] mb-1">✅ Ciclón tropical activo detectado: ${uniqueNames.map((n) => n.toUpperCase()).join(', ')}</div>
               <div class="text-[#607788]">Elementos geográficos oficiales NOAA en mapa: ${targetSystemFeatures.length}.</div>`;
      } else {
        summaryHtml =
          language === 'en'
            ? '<div class="font-bold text-[#2A9D72] mb-1">🟢 Pacific in Calm — Green Alert</div><div class="text-[#607788]">No active named tropical cyclones currently reported in the Pacific basin. Surveillance active.</div>'
            : '<div class="font-bold text-[#2A9D72] mb-1">🟢 Pacífico en Calma — Alerta Verde</div><div class="text-[#607788]">Sin ciclones tropicales activos en el resumen oficial de NOAA. Vigilancia permanente activa.</div>';
      }

      if (latestTime) {
        summaryHtml += `
          <div class="mt-2 pt-1 border-t border-[#d6e1e8] text-xs font-semibold text-[#193247]">
            ${language === 'en' ? 'Official Bulletin Date:' : 'Boletín Oficial:'}
            <span class="text-[#1479a8] font-bold ml-1">${esc(latestTime)}</span>
          </div>`;
      }

      if (errors.length) {
        summaryHtml += `<div class="mt-2 text-[#d84a4a] text-xs">${errors.map(esc).join('<br>')}</div>`;
      }

      setStormSummaryHtml(summaryHtml);

      // Fit bounds to the active storm if not yet fitted
      if (!hasFittedBoundsRef.current && mapInstanceRef.current) {
        const validGroup = L.featureGroup(
          layerRefs.filter(Boolean) as L.Layer[]
        );
        const bounds = validGroup.getBounds();
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds.pad(0.18), { maxZoom: 8 });
          hasFittedBoundsRef.current = true;
        }
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString(language === 'en' ? 'en-US' : 'es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdatedTime(timeStr);

      setStatusText(
        errors.length
          ? language === 'en'
            ? `Partial update · ${timeStr}`
            : `Actualización parcial · ${timeStr}`
          : language === 'en'
          ? `NOAA Live Sync Complete · ${timeStr}`
          : `Consulta completada con NOAA · ${timeStr}`
      );
      setStatusDotColor(errors.length ? '#d99b35' : '#2a9d72');
    } catch (e: any) {
      setStatusText(
        language === 'en'
          ? `Could not reach NOAA (${e.message || 'network'})`
          : `No se pudo actualizar NOAA (${e.message || 'error de red'})`
      );
      setStatusDotColor('#c93c3c');
      setStormSummaryHtml(
        `<div class="text-[#c93c3c] font-semibold">${e.message || 'Error'}.</div>
         <div class="text-[#607788] text-xs mt-1">Se conservan las últimas capas cargadas.</div>`
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [language, popupFeature, onLiveStormData]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      center: [20.0, -106.0],
      zoom: 6,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
      scrollWheelZoom: false, // Prevents unintended zoom on desktop scroll
      dragging: !isMapLockedForScroll,
      touchZoom: !isMapLockedForScroll,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Base map providers with official CARTO API key
    const cartoAttr =
      '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors';
    const baseMaps: Record<string, L.TileLayer> = {
      'Calles (CARTO)': L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
        {
          subdomains: 'abcd',
          maxZoom: 14,
          attribution: cartoAttr,
        }
      ),
      'Océano (Esri)': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 11,
          attribution: 'Tiles &copy; Esri, NOAA, GEBCO',
        }
      ),
      'Satélite (Esri)': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 14,
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
        }
      ),
    };

    baseMaps['Calles (CARTO)'].addTo(map);
    baseLayersRef.current = baseMaps;

    L.control.layers(baseMaps, undefined, { position: 'topright', collapsed: true }).addTo(map);

    // Fallback if tile errors occur
    let tilesLoaded = 0;
    let tilesFailed = 0;
    const order = Object.keys(baseMaps);

    order.forEach((name, idx) => {
      const layer = baseMaps[name];
      layer.on('tileload', () => {
        tilesLoaded++;
        setTileMsg('');
      });
      layer.on('tileerror', () => {
        tilesFailed++;
        if (!map.hasLayer(layer) || tilesLoaded > 0 || tilesFailed < 4) return;
        const nextName = order[idx + 1];
        if (!nextName) {
          setTileMsg(' · No cargan mapas base (red bloqueada)');
          return;
        }
        map.removeLayer(layer);
        baseMaps[nextName].addTo(map);
        tilesFailed = 0;
        setTileMsg(' · Cambiado a ' + nextName);
      });
    });

    // Create GeoJSON layers exactly matching official styles
    forecastLayerRef.current = L.geoJSON(null, {
      style: { color: '#d84a4a', weight: 3.5, opacity: 0.95 },
      onEachFeature: popupFeature,
    }).addTo(map);

    coneLayerRef.current = L.geoJSON(null, {
      style: {
        color: '#d99b35',
        weight: 1.5,
        fillColor: '#f2b84b',
        fillOpacity: 0.22,
      },
      onEachFeature: popupFeature,
    }).addTo(map);

    pastLayerRef.current = L.geoJSON(null, {
      style: { color: '#247ba0', weight: 3, opacity: 0.9 },
      onEachFeature: popupFeature,
    }).addTo(map);

    pointsLayerRef.current = L.geoJSON(null, {
      pointToLayer: (_feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 5.5,
          color: '#ffffff',
          weight: 2,
          fillColor: '#d84a4a',
          fillOpacity: 1,
        }),
      onEachFeature: popupFeature,
    }).addTo(map);

    warningsLayerRef.current = L.geoJSON(null, {
      style: {
        color: '#9d4edd',
        weight: 2,
        fillColor: '#9d4edd',
        fillOpacity: 0.18,
      },
      pointToLayer: (_feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 5,
          color: '#9d4edd',
          fillColor: '#9d4edd',
          fillOpacity: 0.85,
        }),
      onEachFeature: popupFeature,
    }).addTo(map);

    // Shelters Layer Group
    sheltersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Trigger initial fetch
    refreshNOAALayers();

    // Auto-refresh every 5 minutes (standard NHC update cycle)
    const interval = setInterval(refreshNOAALayers, 5 * 60 * 1000);

    const onVisibilityChange = () => {
      if (!document.hidden) refreshNOAALayers();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Invalidate size
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update scroll lock state on map instance
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (isMapLockedForScroll) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.disable(); // keep desktop wheel scroll safe
    }
  }, [isMapLockedForScroll]);

  // Synchronize layers visibility toggles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const sync = (layer: L.Layer | null, isVisible: boolean) => {
      if (!layer) return;
      if (isVisible && !map.hasLayer(layer)) map.addLayer(layer);
      if (!isVisible && map.hasLayer(layer)) map.removeLayer(layer);
    };

    sync(forecastLayerRef.current, showForecast);
    sync(coneLayerRef.current, showCone);
    sync(pastLayerRef.current, showPast);
    sync(pointsLayerRef.current, showPoints);
    sync(warningsLayerRef.current, showWarnings);
    sync(sheltersLayerRef.current, showShelters);
  }, [showForecast, showCone, showPast, showPoints, showWarnings, showShelters]);

  // Render Shelters onto sheltersLayerRef when showShelters is true
  useEffect(() => {
    const layer = sheltersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!showShelters) return;

    SHELTERS_DATA.forEach((shelter) => {
      const isSelected = selectedShelterId === shelter.id;
      const markerColor = isSelected ? '#B84A45' : shelter.petsAllowed ? '#3F8063' : '#245A66';

      const iconHtml = `
        <div style="background:${markerColor};width:${isSelected ? 26 : 20}px;height:${isSelected ? 26 : 20}px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);">
          ${shelter.petsAllowed ? '🐾' : 'H'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'shelter-pin',
        html: iconHtml,
        iconSize: [isSelected ? 26 : 20, isSelected ? 26 : 20],
        iconAnchor: [isSelected ? 13 : 10, isSelected ? 13 : 10],
      });

      const marker = L.marker([shelter.lat, shelter.lng], { icon: customIcon });

      let distanceStr = '';
      if (userCoords) {
        const d = calculateDistanceKm(userCoords.lat, userCoords.lng, shelter.lat, shelter.lng);
        distanceStr = `<div style="color:#245A66;font-weight:600;margin-top:2px;">📍 ${formatDistance(d)} ${language === 'en' ? 'from you' : 'de tu ubicación'}</div>`;
      }

      const popupHtml = `
        <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.45;max-width:240px;">
          <div style="font-weight:700;color:#193247;font-size:13px;">${shelter.name}</div>
          <div style="color:#607788;font-size:11px;margin:2px 0;">${shelter.municipality}, ${shelter.state}</div>
          <div style="font-size:11px;color:#252A2E;">${shelter.address}</div>
          ${distanceStr}
          <div style="margin-top:6px;padding-top:4px;border-top:1px solid #d6e1e8;">
            <a href="${getGoogleMapsDirectionsUrl(shelter.lat, shelter.lng)}" target="_blank" rel="noopener noreferrer" style="color:#1479a8;font-weight:700;text-decoration:none;">
              Google Maps ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectShelter) onSelectShelter(shelter);
      });

      marker.addTo(layer);
    });
  }, [showShelters, selectedShelterId, userCoords, language, onSelectShelter]);

  // Center on hurricane
  const handleCenterHurricane = () => {
    if (!mapInstanceRef.current) return;
    const geo = pointsLayerRef.current ? (pointsLayerRef.current.toGeoJSON() as any) : null;
    const pts = geo?.features || [];
    if (pts.length) {
      const p = pts[0];
      if (p.geometry && p.geometry.type === 'Point') {
        const [lng, lat] = p.geometry.coordinates;
        mapInstanceRef.current.setView([lat, lng], 8, { animate: true });
        return;
      }
    }
    // Fallback approximate position
    mapInstanceRef.current.setView([19.8, -106.0], 8, { animate: true });
  };

  // Re-sync when external refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      refreshNOAALayers();
    }
  }, [refreshTrigger, refreshNOAALayers]);

  return (
    <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[8px] overflow-hidden shadow-none flex flex-col">
      {/* Top Header / NOAA Connection Status */}
      <div className="p-3 sm:p-4 border-b border-[#DDE1DF] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block animate-pulse shrink-0"
              style={{ backgroundColor: statusDotColor }}
            />
            <span className="font-bold text-sm sm:text-base text-[#193247]">
              {language === 'en'
                ? 'Official NOAA / NHC GIS Tracking Service'
                : 'Servicio Geográfico Oficial NOAA / National Hurricane Center'}
            </span>
          </div>
          <div className="text-xs text-[#607788] mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{statusText}</span>
            {tileMsg && <span className="text-[#c93c3c]">{tileMsg}</span>}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Scroll Lock Button for Mobile Peace of Mind */}
          <button
            onClick={() => setIsMapLockedForScroll((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold transition border cursor-pointer ${
              isMapLockedForScroll
                ? 'bg-[#3F8063]/10 text-[#3F8063] border-[#3F8063]/30 hover:bg-[#3F8063]/20'
                : 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1D4852]'
            }`}
            title={
              isMapLockedForScroll
                ? 'El mapa está bloqueado para permitir deslizar la página con total libertad en móvil.'
                : 'El mapa está desbloqueado para interactuar (arrastrar o hacer zoom).'
            }
          >
            {isMapLockedForScroll ? (
              <>
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'en' ? 'Safe Scroll (Locked)' : 'Scroll Seguro (Bloqueado)'}</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'en' ? 'Interacting (Tap to Lock)' : 'Interactuando (Bloquear)'}</span>
              </>
            )}
          </button>

          {/* Quick Center */}
          <button
            onClick={handleCenterHurricane}
            className="flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition cursor-pointer"
            title={t.centerSimonBtn}
          >
            <Crosshair className="w-3.5 h-3.5 text-[#245A66]" />
            <span className="hidden sm:inline">{t.centerSimonBtn}</span>
          </button>

          {/* Refresh Now Button */}
          <button
            onClick={refreshNOAALayers}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'en' ? 'Update NOAA Now' : 'Actualizar NOAA'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map Canvas + Aside Controls and System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        {/* Leaflet Map Canvas (col-span-3 on desktop) */}
        <div className="lg:col-span-3 relative h-[480px] sm:h-[560px] lg:h-[620px] bg-[#dce9ef]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Locked Overlay with Quick Unlock Button on Mobile */}
          {isMapLockedForScroll && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-5 pointer-events-none">
              <button
                onClick={() => setIsMapLockedForScroll(false)}
                className="pointer-events-auto bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <Unlock className="w-4 h-4 text-[#48A9A6]" />
                <span>{language === 'en' ? 'Tap to explore map' : 'Toca para explorar mapa'}</span>
              </button>
            </div>
          )}

          {/* Re-lock button when unlocked */}
          {!isMapLockedForScroll && (
            <div className="absolute top-3 left-3 z-20">
              <button
                onClick={() => setIsMapLockedForScroll(true)}
                className="bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#3F8063]" />
                <span>{language === 'en' ? 'Lock Scroll' : 'Bloquear Scroll'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Aside Panel (col-span-1) with Layer Toggles, System Status, and Legend */}
        <aside className="p-4 sm:p-5 bg-[#FFFFFF] border-t lg:border-t-0 lg:border-l border-[#DDE1DF] overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Card 1: NOAA Active Layers */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#F7F7F4] space-y-2.5">
            <h3 className="font-bold text-[#193247] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#245A66]" />
              <span>{language === 'en' ? 'Map Layers (NOAA GIS)' : 'Capas del Mapa (NOAA GIS)'}</span>
            </h3>

            <div className="space-y-2 text-xs font-medium text-[#252A2E]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showForecast}
                  onChange={(e) => setShowForecast(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{language === 'en' ? 'Forecast Track' : 'Trayectoria pronosticada'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCone}
                  onChange={(e) => setShowCone(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{language === 'en' ? 'Uncertainty Cone' : 'Cono de incertidumbre'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPast}
                  onChange={(e) => setShowPast(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{language === 'en' ? 'Observed Past Track' : 'Trayectoria observada'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPoints}
                  onChange={(e) => setShowPoints(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{language === 'en' ? 'Forecast Points' : 'Puntos de pronóstico'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showWarnings}
                  onChange={(e) => setShowWarnings(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{language === 'en' ? 'Watches & Warnings' : 'Vigilancias y avisos'}</span>
              </label>

              {/* Shelters Toggle */}
              <div className="pt-2 mt-1 border-t border-[#DDE1DF]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showShelters}
                    onChange={(e) => setShowShelters(e.target.checked)}
                    className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold text-[#245A66]">
                    {language === 'en' ? 'Temporary Shelters (272)' : 'Refugios temporales (272)'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Active System Summary from NOAA */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#FFFFFF] space-y-2">
            <h3 className="font-bold text-[#193247] text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#245A66]" />
              <span>{language === 'en' ? 'Active System in NOAA' : 'Sistema en NOAA'}</span>
            </h3>
            <div
              className="text-xs leading-relaxed text-[#252A2E]"
              dangerouslySetInnerHTML={{ __html: stormSummaryHtml }}
            />
          </div>

          {/* Card 3: Symbology / Legend */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#F7F7F4] space-y-2 text-xs">
            <h3 className="font-bold text-[#193247] uppercase tracking-wider text-xs">
              {language === 'en' ? 'Map Legend' : 'Simbología Oficial'}
            </h3>
            <div className="space-y-1.5 text-xs text-[#252A2E]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-0 border-t-3 border-[#247ba0] inline-block" />
                <span>{language === 'en' ? 'Observed Track' : 'Trayectoria observada'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0 border-t-3 border-[#d84a4a] inline-block" />
                <span>{language === 'en' ? 'Forecast Track' : 'Pronóstico oficial'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-3 border border-[#d99b35] bg-[#f2b84b]/30 inline-block rounded-xs" />
                <span>{language === 'en' ? 'Uncertainty Cone' : 'Cono de incertidumbre'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-3 border border-[#9d4edd] bg-[#9d4edd]/20 inline-block rounded-xs" />
                <span>{language === 'en' ? 'Watch / Warning zone' : 'Aviso / Vigilancia'}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#607788] leading-tight pt-1 border-t border-[#DDE1DF]">
              {language === 'en'
                ? 'The cone represents the probable track of the center of a tropical cyclone (67% probability). Hazards occur well outside the cone.'
                : 'El cono describe la incertidumbre histórica del centro (67% probabilidad). El peligro de vientos y oleaje se extiende fuera del cono.'}
            </p>
          </div>

          {/* Card 4: Official NOAA Source Links */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#FFFFFF] space-y-1.5 text-xs">
            <h3 className="font-bold text-[#193247] uppercase tracking-wider text-xs">
              {language === 'en' ? 'Official Feeds' : 'Enlaces de Datos GIS'}
            </h3>
            <div className="space-y-1 text-xs">
              <div>
                <a
                  href="https://www.nhc.noaa.gov/gis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1479a8] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>NHC / NOAA — Productos GIS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a
                  href="https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1479a8] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Servicio MapServer NOAA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a
                  href="https://smn.conagua.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1479a8] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>SMN / CONAGUA México</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Disclaimer Bar */}
      <div className="p-3 bg-[#F7F7F4] border-t border-[#DDE1DF] text-xs text-[#607788] flex flex-wrap items-center justify-between gap-2">
        <span>
          {language === 'en'
            ? 'Geographic Source: NOAA / National Hurricane Center. Map updates directly from NOAA MapServer every 5 minutes.'
            : 'Fuente geográfica: NOAA / National Hurricane Center. El mapa consulta MapServer directamente cada 5 minutos.'}
        </span>
        {lastUpdatedTime && (
          <span className="font-bold text-[#193247] font-tabular">
            {language === 'en' ? `Last sync: ${lastUpdatedTime}` : `Sincronizado: ${lastUpdatedTime}`}
          </span>
        )}
      </div>
    </div>
  );
};
