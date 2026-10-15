import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { SHELTERS_DATA, Shelter } from '../data/hurricaneData';
import { calculateDistanceKm, formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';
import {
  Compass,
  RefreshCw,
  Lock,
  Unlock,
  Crosshair,
  Layers,
  Wind,
  Gauge,
  Clock,
  ShieldAlert,
  ChevronRight,
  Eye,
  Sliders,
  Check,
  MapPin,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ActiveStormSystem } from '../utils/noaaFeed';
import {
  OFFICIAL_PACIFIC_STORMS,
  StormTrajectoryProfile,
  StormWaypoint,
  generateUncertaintyCone,
} from '../utils/stormTrajectories';

const NOAA_MAPSERVER_API =
  'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer';

const CARTO_API_KEY =
  (import.meta as any).env?.VITE_CARTO_API_KEY || 'cb1_4hee_1_1c1b83982f353128945c2288';

interface TrajectoryMapProps {
  selectedShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  userCoords?: { lat: number; lng: number } | null;
  refreshTrigger?: number;
  dynamicStatus?: any;
  dynamicTrajectoryPoints?: any;
  activeStorms?: ActiveStormSystem[];
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
  activeStorms,
  onLiveStormData,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Storm selection filter: 'all' or specific storm id ('storm-simon', 'storm-twenty-one')
  const [selectedStormId, setSelectedStormId] = useState<string>('all');

  // Density mode: 'compact' (de-saturated, minimal badges, mobile-optimized) vs 'detailed' (full timestamps & labels)
  const [labelDensity, setLabelDensity] = useState<'compact' | 'detailed'>('compact');

  // Current map zoom level tracked for responsive detail rendering
  const [zoomLevel, setZoomLevel] = useState<number>(5.5);

  // Screen width detector for mobile responsive layout
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Layer groups references
  const noaaForecastLayerRef = useRef<L.GeoJSON | null>(null);
  const noaaConeLayerRef = useRef<L.GeoJSON | null>(null);
  const noaaPastLayerRef = useRef<L.GeoJSON | null>(null);
  const noaaPointsLayerRef = useRef<L.GeoJSON | null>(null);
  const noaaWarningsLayerRef = useRef<L.GeoJSON | null>(null);

  // Multi-storm dedicated vector layers
  const customStormsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const sheltersLayerRef = useRef<L.LayerGroup | null>(null);

  // Registry of waypoint markers to allow focusing from sidebar
  const waypointMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // UI layer visibility toggles
  const [showForecastTrack, setShowForecastTrack] = useState<boolean>(true);
  const [showConeOfUncertainty, setShowConeOfUncertainty] = useState<boolean>(true);
  const [showPastTrack, setShowPastTrack] = useState<boolean>(true);
  const [showWaypointsAndLabels, setShowWaypointsAndLabels] = useState<boolean>(true);
  const [showStormLabels, setShowStormLabels] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(false);

  // Connection & status states
  const [statusText, setStatusText] = useState<string>(
    isEn ? 'Connecting to NOAA GIS...' : 'Conectando con NOAA GIS…'
  );
  const [statusDotColor, setStatusDotColor] = useState<string>('#d99b35');
  const [tileMsg, setTileMsg] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Mobile scroll protection (locked by default to prevent getting trapped while scrolling page)
  const [isMapLockedForScroll, setIsMapLockedForScroll] = useState<boolean>(true);

  // Get active storm profiles merged with live data
  const stormProfiles: StormTrajectoryProfile[] = useMemo(() => {
    return OFFICIAL_PACIFIC_STORMS.map((storm) => {
      // If live feed gave us updated coordinates or intensity for Trudy or Simon
      const matchingLive = activeStorms?.find(
        (as) =>
          as.id === storm.id ||
          as.name.toLowerCase().includes(storm.stormName.toLowerCase()) ||
          storm.stormName.toLowerCase().includes(as.name.toLowerCase()) ||
          (storm.id === 'storm-trudy' && (as.name.toLowerCase().includes('trudy') || as.id.includes('trudy') || as.id.includes('21'))) ||
          (storm.id === 'storm-simon' && (as.name.toLowerCase().includes('simon') || as.id.includes('simon') || as.id.includes('20')))
      );

      if (matchingLive) {
        return {
          ...storm,
          currentWindKmh: matchingLive.windSpeedKmh,
          currentGustsKmh: matchingLive.windGustsKmh,
          currentPressureHpa: matchingLive.pressureHpa,
          currentLat: matchingLive.lat,
          currentLng: matchingLive.lng,
          coordinatesText: matchingLive.coordinatesText,
          distanceReferenceEs: matchingLive.distanceReference,
          distanceReferenceEn: matchingLive.distanceReference,
          advisoryNum: matchingLive.advisoryNum,
          advisoryDate: matchingLive.advisoryDate,
        };
      }

      if (dynamicStatus && storm.id === 'storm-trudy') {
        return {
          ...storm,
          currentWindKmh: dynamicStatus.windSpeedKmh || storm.currentWindKmh,
          currentGustsKmh: dynamicStatus.windGustsKmh || storm.currentGustsKmh,
          currentPressureHpa: dynamicStatus.pressureHpa || storm.currentPressureHpa,
          currentLat: dynamicStatus.lat || storm.currentLat,
          currentLng: dynamicStatus.lng || storm.currentLng,
          coordinatesText: dynamicStatus.coordinatesText || storm.coordinatesText,
          distanceReferenceEs: dynamicStatus.distanceReference || storm.distanceReferenceEs,
        };
      }

      return storm;
    });
  }, [activeStorms, dynamicStatus]);

  // Selected storm object or primary storm for sidebar schedule
  const activeStormForSidebar = useMemo(() => {
    if (selectedStormId !== 'all') {
      const found = stormProfiles.find((s) => s.id === selectedStormId);
      if (found) return found;
    }
    return stormProfiles[0];
  }, [selectedStormId, stormProfiles]);

  // Helper for safe HTML escaping
  const esc = (v: any) => {
    return String(v ?? (isEn ? 'N/A' : 'No disponible')).replace(
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

  // Popup formatter for NOAA GIS features
  const popupFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const p = feature.properties || {};
      const stormName = String(
        p.stormname || p.STORMNAME || p.stormName || p.name || 'Ciclón Tropical'
      ).toUpperCase();

      const tau = p.tau ?? p.TAU;
      const ssnum = p.ssnum ?? p.SSNUM;
      const maxWindKt = p.maxwind ?? p.MAXWIND;
      const gustKt = p.gust ?? p.GUST;
      const mslp = p.mslp ?? p.MSLP;
      const advDate = p.advdate || p.ADVDATE || p.validtime || p.VALIDTIME;

      const windKmh = maxWindKt ? Math.round(maxWindKt * 1.852) : null;
      const gustKmh = gustKt ? Math.round(gustKt * 1.852) : null;

      let catText = 'Ciclón Tropical';
      if (ssnum !== undefined && ssnum !== null) {
        if (ssnum === 0) {
          catText =
            windKmh && windKmh >= 63
              ? isEn
                ? 'Tropical Storm'
                : 'Tormenta Tropical'
              : isEn
              ? 'Tropical Depression'
              : 'Depresión Tropical';
        } else {
          catText = isEn ? `Hurricane Cat. ${ssnum}` : `Huracán Cat. ${ssnum}`;
        }
      }

      const html = `
        <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.4;max-width:280px;color:#252A2E;">
          <div style="background:#1E293B;color:#FFFFFF;padding:6px 10px;border-radius:4px 4px 0 0;margin:-13px -19px 8px -19px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#94A3B8;">${isEn ? 'NOAA Official Track' : 'Trayectoria Oficial NOAA'}</div>
            <div style="font-weight:800;font-size:14px;color:#FFFFFF;">${esc(stormName)}</div>
          </div>

          <div style="margin-bottom:6px;">
            <span style="font-weight:700;color:#245A66;font-size:12px;">${catText}</span>
            ${tau !== undefined ? `<span style="color:#687078;font-size:11px;margin-left:6px;">(${tau === 0 ? (isEn ? 'Current center' : 'Centro actual') : `+${tau} hrs`})</span>` : ''}
          </div>

          ${
            windKmh
              ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid #E2E8F0;">
                  <strong style="color:#687078;">${isEn ? 'Sustained Winds:' : 'Vientos Sostenidos:'}</strong>
                  <span style="font-weight:700;color:#252A2E;">${windKmh} km/h (${maxWindKt} kt)</span>
                </div>`
              : ''
          }

          ${
            gustKmh
              ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid #E2E8F0;">
                  <strong style="color:#687078;">${isEn ? 'Peak Gusts:' : 'Rachas Máximas:'}</strong>
                  <span style="font-weight:700;color:#B84A45;">${gustKmh} km/h (${gustKt} kt)</span>
                </div>`
              : ''
          }

          ${
            mslp && mslp < 1100
              ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px;padding-bottom:3px;border-bottom:1px solid #E2E8F0;">
                  <strong style="color:#687078;">${isEn ? 'Central Pressure:' : 'Presión Central:'}</strong>
                  <span style="font-weight:700;color:#252A2E;">${mslp} hPa</span>
                </div>`
              : ''
          }

          ${
            advDate
              ? `<div style="font-size:11px;color:#687078;margin-top:6px;">
                  <strong>${isEn ? 'Official Bulletin:' : 'Boletín Oficial:'}</strong> ${esc(advDate)}
                </div>`
              : ''
          }
        </div>
      `;
      layer.bindPopup(html);
    },
    [isEn]
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

  // Refresh NOAA MapServer layers
  const refreshNOAALayers = useCallback(async () => {
    setIsRefreshing(true);
    setStatusText(isEn ? 'Syncing NOAA GIS...' : 'Sincronizando NOAA GIS…');
    setStatusDotColor('#d99b35');

    try {
      const results = await Promise.allSettled([
        fetchLayer(6), // Forecast Track
        fetchLayer(7), // Cone
        fetchLayer(11), // Past Track
        fetchLayer(5), // Forecast Points
        fetchLayer(8), // Warnings
      ]);

      const layerRefs = [
        noaaForecastLayerRef.current,
        noaaConeLayerRef.current,
        noaaPastLayerRef.current,
        noaaPointsLayerRef.current,
        noaaWarningsLayerRef.current,
      ];

      results.forEach((result, idx) => {
        const lRef = layerRefs[idx];
        if (result.status === 'fulfilled' && lRef) {
          lRef.clearLayers().addData(result.value);
        }
      });

      // Extract point tau 0 if present to report live storm coordinates (Trudy is primary threat)
      const pointsGeo = noaaPointsLayerRef.current ? (noaaPointsLayerRef.current.toGeoJSON() as any) : null;
      const pointsFeatures = pointsGeo?.features || [];

      if (pointsFeatures.length && onLiveStormData) {
        // Prioritize Trudy (ep21) as primary threat, or tau 0
        const trudyPt =
          pointsFeatures.find(
            (f: any) =>
              (f.properties?.tau === 0 || f.properties?.TAU === 0) &&
              (String(f.properties?.stormname || '').toLowerCase().includes('trudy') || f.properties?.stormnum === 21)
          ) ||
          pointsFeatures.find((f: any) => f.properties?.tau === 0 || f.properties?.TAU === 0) ||
          pointsFeatures[0];

        if (trudyPt && trudyPt.geometry && trudyPt.geometry.type === 'Point') {
          const coords = trudyPt.geometry.coordinates;
          const props = trudyPt.properties || {};
          const maxKnots = props.maxwind || props.MAXWIND || 80;
          const gustKnots = props.gust || props.GUST || 100;
          const mslp = props.mslp || props.MSLP || 979;
          const headingDeg = props.tcdir || props.TCDIR || 335;
          const speedKt = props.tcspd || props.TCSPD || 5;

          onLiveStormData({
            lng: coords[0],
            lat: coords[1],
            windKmh: Math.round(maxKnots * 1.852),
            gustKmh: Math.round(gustKnots * 1.852),
            pressureHpa: mslp > 1100 ? 979 : mslp,
            category: props.ssnum ?? props.SSNUM ?? 1,
            advisoryNum: String(props.advisnum || props.ADVISNUM || '9A'),
            advisoryDate: String(props.advdate || props.ADVDATE || '12:00 PM CST (15 Oct)'),
            movement: `${headingDeg}°`,
            speedKmh: Math.round(speedKt * 1.852),
          });
        }
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString(isEn ? 'en-US' : 'es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdatedTime(timeStr);
      setStatusText(
        isEn
          ? `NOAA Live Sync Active · ${timeStr}`
          : `Capas NOAA sincronizadas · ${timeStr}`
      );
      setStatusDotColor('#2a9d72');
    } catch {
      setStatusText(
        isEn
          ? 'Official Trajectories Active (NOAA Standby)'
          : 'Capas oficiales activas (Servicio NOAA en espera)'
      );
      setStatusDotColor('#0D9488');
    } finally {
      setIsRefreshing(false);
    }
  }, [isEn, onLiveStormData]);

  // Render Multi-Storm Trajectories, Uncertainty Cones, Waypoints & Labels
  // Implements SMART DE-SATURATION, ABBREVIATIONS, AND ZOOM/MOBILE ADAPTABILITY
  const renderCustomStorms = useCallback(() => {
    const group = customStormsLayerGroupGroupRef();
    if (!group) return;
    group.clearLayers();
    waypointMarkersMapRef.current.clear();

    const isAllMode = selectedStormId === 'all';
    // Decide detail level: at low zoom or in mobile compact mode, abbreviate to prevent saturation
    const isCompactMode = labelDensity === 'compact' || (zoomLevel < 6.2 && isAllMode);

    stormProfiles.forEach((storm) => {
      const isSelected = selectedStormId === storm.id;
      // If a specific storm is chosen, dim the other storm so the map is never saturated
      const stormOpacity = isAllMode ? 1.0 : isSelected ? 1.0 : 0.35;
      const stormWeight = isSelected ? 4.5 : isAllMode ? 3.5 : 2.5;

      // 1. Cono de Incertidumbre Oficial (67% Probabilidad)
      if (showConeOfUncertainty) {
        const coneCoords = generateUncertaintyCone(storm.waypoints);
        if (coneCoords.length >= 3) {
          const conePolygon = L.polygon(coneCoords, {
            color: storm.coneStrokeColor,
            weight: isSelected ? 2.5 : 1.5,
            dashArray: '3, 4',
            fillColor: storm.coneFillColor,
            fillOpacity: isSelected ? 0.28 : isAllMode ? 0.18 : 0.08,
            opacity: stormOpacity,
          });

          const conePopupHtml = `
            <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.45;color:#252A2E;max-width:260px;">
              <div style="background:${storm.themeColor};color:#FFFFFF;padding:6px 10px;border-radius:4px 4px 0 0;margin:-13px -19px 8px -19px;">
                <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.9;">
                  ${isEn ? 'OFFICIAL UNCERTAINTY CONE' : 'CONO DE INCERTIDUMBRE OFICIAL'}
                </div>
                <div style="font-weight:800;font-size:13px;">${storm.cleanDisplayName}</div>
              </div>
              <p style="color:#64748B;font-size:11px;margin:0 0 6px 0;">
                ${
                  isEn
                    ? 'Represents probable path of tropical cyclone center (67% probability). Hazards extend well outside cone.'
                    : 'Representa la trayectoria probable del centro del ciclón (67% de probabilidad). Peligros de oleaje y lluvia rebasan el cono.'
                }
              </p>
              <div style="font-size:11px;color:${storm.themeColor};font-weight:700;">
                ${storm.cleanDisplayName} · ${storm.category > 0 ? `Cat. ${storm.category}` : 'DT'} (${storm.currentWindKmh} km/h)
              </div>
            </div>
          `;
          conePolygon.bindPopup(conePopupHtml);
          conePolygon.addTo(group);
        }
      }

      // 2. Trayectoria Pasada (Histórica)
      if (showPastTrack) {
        const pastPts = storm.waypoints
          .filter((pt) => pt.stage === 'histórico' || pt.stage === 'actual')
          .map((pt) => [pt.lat, pt.lng] as [number, number]);

        if (pastPts.length >= 2) {
          const pastPolyline = L.polyline(pastPts, {
            color: '#64748B',
            weight: 2.5,
            dashArray: '4, 4',
            opacity: isAllMode ? 0.75 : isSelected ? 0.85 : 0.25,
          });
          pastPolyline.bindPopup(`
            <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;">
              <strong>${storm.cleanDisplayName}</strong> — ${isEn ? 'Observed Past Track' : 'Trayectoria Observada (Histórico)'}
            </div>
          `);
          pastPolyline.addTo(group);
        }
      }

      // 3. Trayectoria Pronosticada Oficial
      if (showForecastTrack) {
        const forecastPts = storm.waypoints
          .filter((pt) => pt.stage === 'actual' || pt.stage === 'pronóstico')
          .map((pt) => [pt.lat, pt.lng] as [number, number]);

        if (forecastPts.length >= 2) {
          const forecastPolyline = L.polyline(forecastPts, {
            color: storm.themeColor,
            weight: stormWeight,
            opacity: stormOpacity,
          });
          forecastPolyline.bindPopup(`
            <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;">
              <div style="font-weight:800;color:${storm.themeColor};font-size:13px;">${storm.cleanDisplayName}</div>
              <div style="color:#252A2E;font-size:11px;margin-top:2px;">
                ${isEn ? 'Official Forecast Track' : 'Línea de Trayectoria Oficial Pronosticada'}
              </div>
              <div style="color:#64748B;font-size:11px;">${storm.category > 0 ? `Categoría ${storm.category}` : 'Depresión Tropical'} · ${storm.currentWindKmh} km/h</div>
            </div>
          `);
          forecastPolyline.addTo(group);
        }
      }

      // 4. Puntos de Pronóstico, Horarios e Intensidades Puntuales
      storm.waypoints.forEach((pt, wpIdx) => {
        const isCurrent = pt.stage === 'actual';

        // Centro Actual (Tau 0) — IDENTIFICACIÓN CRUCIAL DE CUAL ES CUAL
        if (isCurrent) {
          const shortName = storm.id === 'storm-simon' ? 'Simón' : 'DT 21-E';
          const catCode = storm.category > 0 ? `Cat ${storm.category}` : 'DT';

          // Rótulo de identificación claro y anti-saturación
          const badgeLabelText = isMobile
            ? `${shortName} · ${catCode} (${storm.currentWindKmh}k)`
            : `${storm.cleanDisplayName} · ${catCode} (${storm.currentWindKmh} km/h)`;

          const currentMarkerHtml = `
            <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
              ${
                showStormLabels
                  ? `<div style="background:${storm.themeColor};color:#FFFFFF;padding:2px 7px;border-radius:3px;font-size:${isMobile ? '10px' : '11px'};font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,0.35);border:1.5px solid #FFFFFF;white-space:nowrap;margin-bottom:3px;letter-spacing:0.02em;display:flex;align-items:center;gap:4px;">
                      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#FFFFFF;"></span>
                      <span>${badgeLabelText}</span>
                    </div>`
                  : ''
              }
              <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
                <div style="position:absolute;inset:0;border-radius:50%;background:${storm.themeColor};opacity:0.35;border:2px solid ${storm.themeColor};"></div>
                <div style="width:22px;height:22px;border-radius:50%;background:${storm.themeColor};border:2px solid #FFFFFF;box-shadow:0 2px 5px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-size:11px;font-weight:900;">
                  🌀
                </div>
              </div>
            </div>
          `;

          const currentIcon = L.divIcon({
            className: 'current-storm-center',
            html: currentMarkerHtml,
            iconSize: [210, 52],
            iconAnchor: [105, showStormLabels ? 38 : 15],
          });

          const currentMarker = L.marker([pt.lat, pt.lng], {
            icon: currentIcon,
            zIndexOffset: 1000,
          });

          const currentPopupHtml = `
            <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.45;color:#252A2E;min-width:250px;">
              <div style="background:${storm.themeColor};color:#FFFFFF;padding:7px 11px;border-radius:4px 4px 0 0;margin:-13px -19px 8px -19px;">
                <div style="font-size:9px;text-transform:uppercase;font-weight:700;letter-spacing:0.05em;opacity:0.9;">
                  ${isEn ? 'OFFICIAL EYE / CURRENT POSITION' : 'POSICIÓN ACTUAL DEL OJO / CENTRO'}
                </div>
                <div style="font-weight:800;font-size:14px;margin-top:1px;">${storm.cleanDisplayName}</div>
              </div>

              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:4px;padding:5px 8px;margin-bottom:7px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:800;color:${storm.themeColor};font-size:12px;">
                    ${isEn ? storm.categoryNameEn : storm.categoryNameEs}
                  </span>
                  <span style="font-size:11px;font-weight:700;color:#252A2E;background:#FFFFFF;border:1px solid #CBD5E1;padding:1px 5px;border-radius:3px;">
                    ${storm.currentPressureHpa} hPa
                  </span>
                </div>
                <div style="font-size:11px;color:#64748B;margin-top:2px;">${storm.coordinatesText}</div>
              </div>

              <div style="space-y:3px;font-size:11px;margin-bottom:7px;">
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Sustained Winds:' : 'Vientos Sostenidos:'}</strong>
                  <span style="font-weight:700;color:#252A2E;">${storm.currentWindKmh} km/h (${Math.round(storm.currentWindKmh / 1.852)} kt)</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Max Gusts:' : 'Rachas Máximas:'}</strong>
                  <span style="font-weight:700;color:#B84A45;">${storm.currentGustsKmh} km/h</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Movement:' : 'Desplazamiento:'}</strong>
                  <span style="font-weight:600;color:#252A2E;">${isEn ? storm.movementTextEn : storm.movementTextEs}</span>
                </div>
              </div>

              <div style="font-size:11px;color:#475569;background:#F1F5F9;padding:5px 7px;border-radius:4px;margin-bottom:5px;">
                📍 ${isEn ? storm.distanceReferenceEn : storm.distanceReferenceEs}
              </div>

              <div style="font-size:10px;color:#94A3B8;text-align:right;">
                ${storm.advisoryDate} • ${isEn ? 'Advisory' : 'Boletín'} #${storm.advisoryNum}
              </div>
            </div>
          `;

          currentMarker.bindPopup(currentPopupHtml);
          currentMarker.addTo(group);
          waypointMarkersMapRef.current.set(pt.id, currentMarker);
        } else if (showWaypointsAndLabels) {
          // Puntos de pronóstico (y puntos históricos)
          const isHistorical = pt.stage === 'histórico';
          const badgeBg = isHistorical
            ? '#64748B'
            : pt.category === 'C1' || pt.category === 'C2' || pt.category === 'C3' || pt.category === 'C4' || pt.category === 'C5'
            ? storm.themeColor
            : pt.category === 'TT'
            ? storm.accentColor
            : '#475569';

          // ABREVIACIÓN INTELIGENTE Y DESATURACIÓN SEGÚN ZOOM Y ESPACIO:
          // Si está en modo compacto (overview / zoom bajo):
          // Solo mostramos el circulo de categoría limpio y nítido.
          // Para hitos claves (+24h, +48h), agregamos una mini-etiqueta abreviada.
          const isMilestone = pt.hourOffset === 24 || pt.hourOffset === 48 || pt.hourOffset === 72 || pt.hourOffset === 96;
          const shouldShowLabel = !isCompactMode || isSelected || isMilestone;

          // Etiqueta abreviada según viewport
          const abbreviatedTime = pt.hourOffset > 0 ? `+${pt.hourOffset}h` : pt.timeLabel.split(' ')[0];
          const pillText = isCompactMode
            ? `${abbreviatedTime} · ${pt.windSpeedKmh}k`
            : `${pt.timeLabel} · ${pt.windSpeedKmh} km/h`;

          const waypointHtml = `
            <div style="display:flex;align-items:center;gap:4px;pointer-events:auto;white-space:nowrap;cursor:pointer;opacity:${stormOpacity};">
              <div style="width:16px;height:16px;border-radius:50%;background:${badgeBg};border:1.5px solid #FFFFFF;box-shadow:0 1px 3px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#FFFFFF;font-size:8px;font-weight:900;">
                ${pt.category}
              </div>
              ${
                shouldShowLabel
                  ? `<div style="background:rgba(255,255,255,0.94);border:1px solid #CBD5E1;box-shadow:0 1px 3px rgba(0,0,0,0.15);padding:1px 4px;border-radius:3px;font-size:9.5px;font-weight:700;color:#1E293B;backdrop-filter:blur(2px);">
                      <span style="color:${storm.themeColor};font-weight:800;">${pillText}</span>
                    </div>`
                  : ''
              }
            </div>
          `;

          const wpIcon = L.divIcon({
            className: 'storm-waypoint',
            html: waypointHtml,
            iconSize: shouldShowLabel ? [110, 18] : [16, 16],
            iconAnchor: [8, 9],
          });

          const wpMarker = L.marker([pt.lat, pt.lng], { icon: wpIcon });

          const wpPopupHtml = `
            <div style="font-family:Montserrat,Arial,sans-serif;font-size:12px;line-height:1.45;color:#252A2E;min-width:240px;">
              <div style="background:${storm.themeColor};color:#FFFFFF;padding:6px 10px;border-radius:4px 4px 0 0;margin:-13px -19px 8px -19px;">
                <div style="font-size:9px;text-transform:uppercase;color:#FFFFFF;opacity:0.9;">
                  ${storm.cleanDisplayName} • ${isHistorical ? (isEn ? 'Past Record' : 'Registro Pasado') : (isEn ? 'Forecast' : 'Pronóstico Oficial')}
                </div>
                <div style="font-weight:800;font-size:13px;">${pt.timeLabel}</div>
              </div>

              <div style="margin-bottom:6px;">
                <div style="font-weight:700;color:${storm.themeColor};font-size:12px;">
                  ${isEn ? pt.categoryLabelEn : pt.categoryLabelEs}
                </div>
                <div style="font-size:11px;color:#64748B;">${pt.dateLabel}</div>
              </div>

              <div style="space-y:3px;font-size:11px;margin-bottom:6px;">
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Sustained Winds:' : 'Vientos Previstos:'}</strong>
                  <span style="font-weight:700;color:#252A2E;">${pt.windSpeedKmh} km/h (${pt.windSpeedKt} kt)</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Peak Gusts:' : 'Rachas Previstas:'}</strong>
                  <span style="font-weight:700;color:#B84A45;">${pt.windGustsKmh} km/h</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Est. Central Pressure:' : 'Presión Estimada:'}</strong>
                  <span style="font-weight:700;color:#252A2E;">${pt.pressureHpa} hPa</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F1F5F9;">
                  <strong style="color:#64748B;">${isEn ? 'Position:' : 'Posición Geográfica:'}</strong>
                  <span style="font-weight:600;color:#252A2E;">${pt.lat.toFixed(1)}°N, ${Math.abs(pt.lng).toFixed(1)}°O</span>
                </div>
              </div>

              <p style="font-size:11px;color:#475569;background:#F8FAFC;padding:5px 7px;border-radius:4px;border:1px solid #E2E8F0;margin:0;">
                ${isEn ? pt.statusTextEn : pt.statusTextEs}
              </p>
            </div>
          `;

          wpMarker.bindPopup(wpPopupHtml);
          wpMarker.addTo(group);
          waypointMarkersMapRef.current.set(pt.id, wpMarker);
        }
      });
    });
  }, [
    selectedStormId,
    stormProfiles,
    showConeOfUncertainty,
    showPastTrack,
    showForecastTrack,
    showWaypointsAndLabels,
    showStormLabels,
    labelDensity,
    zoomLevel,
    isMobile,
    isEn,
  ]);

  const customStormsLayerGroupGroupRef = () => customStormsLayerGroupRef.current;

  // Center/Fly to specific storm or fit all
  const handleSelectStorm = (stormId: string) => {
    setSelectedStormId(stormId);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (stormId === 'all') {
      // Fit both Pacific systems
      const allLat = stormProfiles.flatMap((s) => s.waypoints.map((w) => w.lat));
      const allLng = stormProfiles.flatMap((s) => s.waypoints.map((w) => w.lng));
      if (allLat.length && allLng.length) {
        const minLat = Math.min(...allLat);
        const maxLat = Math.max(...allLat);
        const minLng = Math.min(...allLng);
        const maxLng = Math.max(...allLng);
        map.flyToBounds(
          [
            [minLat - 1.2, minLng - 1.2],
            [maxLat + 1.2, maxLng + 1.2],
          ],
          { padding: [25, 25], duration: 1.1 }
        );
      }
    } else {
      const storm = stormProfiles.find((s) => s.id === stormId);
      if (storm) {
        map.flyTo([storm.currentLat, storm.currentLng], 6.8, { duration: 1.1 });
      }
    }
  };

  // Center map onto specific waypoint and trigger its popup
  const handleFocusWaypoint = (wp: StormWaypoint, stormId: string) => {
    setSelectedStormId(stormId);
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([wp.lat, wp.lng], 7.5, { duration: 0.9 });
    setTimeout(() => {
      const marker = waypointMarkersMapRef.current.get(wp.id);
      if (marker) {
        marker.openPopup();
      }
    }, 950);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      center: [16.3, -104.8], // Centrado estratégicamente para ambos fenómenos reales (Trudy y Simon)
      zoom: 5.2,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: !isMapLockedForScroll,
      touchZoom: !isMapLockedForScroll,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Track zoom end to adapt label density dynamically
    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    // Official Basemaps
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
          setTileMsg(' · No cargan mapas base');
          return;
        }
        map.removeLayer(layer);
        baseMaps[nextName].addTo(map);
        tilesFailed = 0;
        setTileMsg(' · Cambiado a ' + nextName);
      });
    });

    // Custom multi-storm vector layer group (capa autoritativa única y sin duplicados)
    customStormsLayerGroupRef.current = L.layerGroup().addTo(map);

    // NOAA MapServer layers para consulta de datos en segundo plano (sin dibujar duplicados)
    noaaForecastLayerRef.current = L.geoJSON(null);
    noaaConeLayerRef.current = L.geoJSON(null);
    noaaPastLayerRef.current = L.geoJSON(null);
    noaaPointsLayerRef.current = L.geoJSON(null);

    // Alertas Costeras Oficiales de NOAA (Layer 8) - solo resalta avisos en línea de costa
    noaaWarningsLayerRef.current = L.geoJSON(null, {
      style: {
        color: '#DC2626',
        weight: 3,
        fillColor: '#EF4444',
        fillOpacity: 0.2,
      },
      onEachFeature: popupFeature,
    }).addTo(map);

    // Shelters Layer Group
    sheltersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Initial fetch of NOAA MapServer
    refreshNOAALayers();

    // Render multi-storm trajectories
    renderCustomStorms();

    const interval = setInterval(refreshNOAALayers, 5 * 60 * 1000);

    const onVisibilityChange = () => {
      if (!document.hidden) refreshNOAALayers();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Re-render custom storms whenever settings, selected storm, density, zoom, or profiles change
  useEffect(() => {
    renderCustomStorms();
  }, [renderCustomStorms]);

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
      map.scrollWheelZoom.disable();
    }
  }, [isMapLockedForScroll]);

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
        distanceStr = `<div style="color:#245A66;font-weight:600;margin-top:2px;">📍 ${formatDistance(d)} ${isEn ? 'from you' : 'de tu ubicación'}</div>`;
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
  }, [showShelters, selectedShelterId, userCoords, isEn, onSelectShelter]);

  // Re-sync when external refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      refreshNOAALayers();
    }
  }, [refreshTrigger, refreshNOAALayers]);

  return (
    <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[8px] overflow-hidden shadow-none flex flex-col">
      {/* 1. Barra de Encabezado con Estado NOAA y Controles de Acción */}
      <div className="p-3 sm:p-4 border-b border-[#DDE1DF] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: statusDotColor }}
            />
            <span className="font-bold text-sm sm:text-base text-[#193247]">
              {isEn
                ? 'Official Pacific Trajectory Cartography (Multi-System Tracking)'
                : 'Cartografía Oficial de Trayectoria • Cuenca del Pacífico'}
            </span>
          </div>
          <div className="text-xs text-[#607788] mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{statusText}</span>
            {tileMsg && <span className="text-[#c93c3c]">{tileMsg}</span>}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Density Mode Switcher (Compact / Detailed) to prevent saturation */}
          <button
            onClick={() => setLabelDensity((prev) => (prev === 'compact' ? 'detailed' : 'compact'))}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition border cursor-pointer ${
              labelDensity === 'compact'
                ? 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1] hover:bg-[#E2E8F0]'
                : 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1D4852]'
            }`}
            title={
              labelDensity === 'compact'
                ? 'Vista compacta (desaturada, abreviada para móvil).'
                : 'Vista detallada con horarios completos en cada punto.'
            }
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {labelDensity === 'compact'
                ? isEn
                  ? 'Compact Labels'
                  : 'Rótulos Compactos'
                : isEn
                ? 'Full Labels'
                : 'Rótulos Detallados'}
            </span>
          </button>

          {/* Scroll Lock Button for Mobile */}
          <button
            onClick={() => setIsMapLockedForScroll((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold transition border cursor-pointer ${
              isMapLockedForScroll
                ? 'bg-[#3F8063]/10 text-[#3F8063] border-[#3F8063]/30 hover:bg-[#3F8063]/20'
                : 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1D4852]'
            }`}
            title={
              isMapLockedForScroll
                ? 'El mapa está bloqueado para permitir deslizar la página en móvil sin atascos.'
                : 'El mapa está desbloqueado para interactuar con zoom y paneo.'
            }
          >
            {isMapLockedForScroll ? (
              <>
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isEn ? 'Scroll Locked' : 'Scroll Bloqueado'}</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isEn ? 'Map Unlocked' : 'Mapa Desbloqueado'}</span>
              </>
            )}
          </button>

          {/* Quick Center */}
          <button
            onClick={() => handleSelectStorm('all')}
            className="flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition cursor-pointer"
            title={isEn ? 'Fit both systems' : 'Centrar ambos sistemas'}
          >
            <Crosshair className="w-3.5 h-3.5 text-[#245A66]" />
            <span className="hidden sm:inline">{isEn ? 'Fit All' : 'Encuadrar Ambos'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={refreshNOAALayers}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Sync' : 'Actualizar'}</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Selección de Sistemas: Identificación Clara de Ambos Fenómenos */}
      <div className="bg-[#F8FAFC] border-b border-[#DDE1DF] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-1 hidden sm:inline">
            {isEn ? 'Select System to Inspect:' : 'Identificar Fenómeno:'}
          </span>

          {/* Botón: Ambos Sistemas */}
          <button
            onClick={() => handleSelectStorm('all')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              selectedStormId === 'all'
                ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-2xs'
                : 'bg-white hover:bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'
            }`}
          >
            <span>🌀</span>
            <span>{isEn ? `Both Systems (${stormProfiles.length})` : `Ver Ambos (${stormProfiles.length})`}</span>
          </button>

          {/* Pestañas individuales para cada ciclón/depresión con color distintivo y datos duros */}
          {stormProfiles.map((storm) => {
            const isSelected = selectedStormId === storm.id;
            return (
              <button
                key={storm.id}
                onClick={() => handleSelectStorm(storm.id)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'text-white shadow-xs ring-2 ring-offset-1'
                    : 'bg-white hover:bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]'
                }`}
                style={{
                  backgroundColor: isSelected ? storm.themeColor : undefined,
                  borderColor: isSelected ? storm.themeColor : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : storm.themeColor }}
                />
                <span className="font-extrabold tracking-tight">{storm.cleanDisplayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-black/25 text-white' : 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  {storm.category > 0 ? `Cat. ${storm.category}` : 'DT'} · {storm.currentWindKmh} km/h
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-[#64748B] font-medium hidden md:flex items-center gap-1 shrink-0">
          <span>{isEn ? 'Tap points on map or timeline to view punctual forecast' : 'Haz clic en los puntos del mapa o cronograma para ver horario e intensidad'}</span>
        </div>
      </div>

      {/* 3. Grid Principal: Lienzo Cartográfico Leaflet + Panel Lateral Informativo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[520px]">
        {/* Lienzo del Mapa (col-span-3 en desktop) */}
        <div className="lg:col-span-3 relative h-[480px] sm:h-[560px] lg:h-[650px] bg-[#dce9ef]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Banner Flotante de Leyenda de Sistemas Activos sobre el Mapa (Top-Left) */}
          <div className="absolute top-3 left-3 z-20 max-w-[calc(100%-24px)] pointer-events-none">
            <div className="bg-[#1E293B]/92 text-white p-2.5 sm:p-3 rounded-[6px] shadow-lg border border-white/20 backdrop-blur-xs space-y-1.5 pointer-events-auto">
              <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider flex items-center justify-between gap-3">
                <span>{isEn ? 'Active Tropical Systems in Pacific' : 'Sistemas Activos en el Pacífico'}</span>
                <span className="text-[#38BDF8] font-mono">{stormProfiles.length} en Monitoreo</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {stormProfiles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStorm(s.id)}
                    className="flex items-center justify-between sm:justify-start gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-[4px] text-xs font-semibold cursor-pointer transition text-left"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.themeColor }}
                    />
                    <span className="font-bold text-white truncate">{s.cleanDisplayName}:</span>
                    <span className="text-[#E2E8F0] text-[11px] font-mono">
                      {s.category > 0 ? `Cat. ${s.category}` : 'DT'} · {s.currentWindKmh} km/h
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Capa de Scroll Seguro con Botón de Desbloqueo en Móvil */}
          {isMapLockedForScroll && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-5 pointer-events-none">
              <button
                onClick={() => setIsMapLockedForScroll(false)}
                className="pointer-events-auto bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <Unlock className="w-4 h-4 text-[#48A9A6]" />
                <span>{isEn ? 'Tap to interact with map' : 'Toca para interactuar con el mapa'}</span>
              </button>
            </div>
          )}

          {/* Botón flotante para re-bloquear scroll */}
          {!isMapLockedForScroll && (
            <div className="absolute bottom-3 right-3 z-20">
              <button
                onClick={() => setIsMapLockedForScroll(true)}
                className="bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#3F8063]" />
                <span>{isEn ? 'Lock Scroll' : 'Bloquear Scroll'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Panel Lateral Ampliado (Fichas de Fenómenos, Horarios y Cronograma de Intensidad) */}
        <aside className="p-4 sm:p-5 bg-[#FFFFFF] border-t lg:border-t-0 lg:border-l border-[#DDE1DF] overflow-y-auto space-y-4 text-xs sm:text-sm max-h-[650px]">
          {/* Card: Tarjeta del Sistema Seleccionado con Datos Duros */}
          <div
            className="border-2 rounded-[6px] p-3.5 space-y-2.5 transition"
            style={{
              borderColor: activeStormForSidebar.themeColor,
              backgroundColor: '#FAFBF9',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white font-mono"
                style={{ backgroundColor: activeStormForSidebar.themeColor }}
              >
                {activeStormForSidebar.category > 0
                  ? isEn
                    ? `Category ${activeStormForSidebar.category}`
                    : `Categoría ${activeStormForSidebar.category}`
                  : isEn
                  ? 'Tropical Depression'
                  : 'Depresión Tropical'}
              </span>
              <button
                onClick={() => handleSelectStorm(activeStormForSidebar.id)}
                className="text-[11px] font-bold text-[#245A66] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Crosshair className="w-3 h-3" />
                <span>{isEn ? 'Focus Eye' : 'Enfocar Ojo'}</span>
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-[#252A2E] text-base leading-tight">
                {activeStormForSidebar.cleanDisplayName}
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                📍 {isEn ? activeStormForSidebar.distanceReferenceEn : activeStormForSidebar.distanceReferenceEs}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E2E8F0]">
              <div className="bg-white p-2 rounded border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1">
                  <Wind className="w-3 h-3 text-[#245A66]" />
                  <span>{isEn ? 'Wind Speed' : 'Vientos'}</span>
                </div>
                <div className="font-extrabold text-[#252A2E] text-sm mt-0.5">
                  {activeStormForSidebar.currentWindKmh}{' '}
                  <span className="text-[10px] text-[#64748B] font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-[#B84A45] font-semibold">
                  {isEn ? 'Gusts' : 'Rachas'} {activeStormForSidebar.currentGustsKmh} km/h
                </div>
              </div>

              <div className="bg-white p-2 rounded border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#245A66]" />
                  <span>{isEn ? 'Central Press.' : 'Presión'}</span>
                </div>
                <div className="font-extrabold text-[#252A2E] text-sm mt-0.5 font-mono">
                  {activeStormForSidebar.currentPressureHpa}{' '}
                  <span className="text-[10px] text-[#64748B] font-normal">hPa</span>
                </div>
                <div className="text-[10px] text-[#64748B] truncate">
                  {activeStormForSidebar.coordinatesText}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Cronograma de Horarios e Intensidad Pronosticada (Timeline Puntual Interactivo) */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#FFFFFF] space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#193247] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#245A66]" />
                <span>
                  {isEn
                    ? `Forecast Schedule • ${activeStormForSidebar.cleanDisplayName}`
                    : `Horarios y Pronóstico • ${activeStormForSidebar.cleanDisplayName}`}
                </span>
              </h3>
            </div>

            <p className="text-[11px] text-[#64748B] leading-tight">
              {isEn
                ? 'Chronological trajectory projection. Click any row to focus it on the map.'
                : 'Proyección cronológica puntual. Haz clic en cualquier horario para enfocarlo en el mapa.'}
            </p>

            <div className="space-y-1.5 pt-1 border-t border-[#E2E8F0]">
              {activeStormForSidebar.waypoints.map((wp) => {
                const isCurrent = wp.stage === 'actual';
                const isPast = wp.stage === 'histórico';
                return (
                  <button
                    key={wp.id}
                    onClick={() => handleFocusWaypoint(wp, activeStormForSidebar.id)}
                    className={`w-full text-left p-2 rounded-[4px] border text-xs transition cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/50 text-[#252A2E] ring-1 ring-amber-400'
                        : isPast
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75 hover:opacity-100 hover:border-[#CBD5E1]'
                        : 'bg-white border-[#E2E8F0] hover:border-[#245A66] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-extrabold text-[11px] flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isCurrent
                              ? activeStormForSidebar.themeColor
                              : isPast
                              ? '#94A3B8'
                              : activeStormForSidebar.accentColor,
                          }}
                        />
                        <span>{wp.timeLabel}</span>
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase font-mono"
                        style={{
                          backgroundColor:
                            wp.category === 'TT'
                              ? activeStormForSidebar.accentColor
                              : wp.category.startsWith('C')
                              ? activeStormForSidebar.themeColor
                              : '#64748B',
                          color: '#FFFFFF',
                        }}
                      >
                        {wp.category} · {wp.windSpeedKmh} km/h
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-0.5">
                      <span>{wp.dateLabel}</span>
                      <span className="font-mono text-[#252A2E]">
                        {wp.pressureHpa} hPa · Rachas {wp.windGustsKmh}k
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card: Selector de Capas Activas en el Mapa */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#F7F7F4] space-y-2.5">
            <h3 className="font-bold text-[#193247] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#245A66]" />
              <span>{isEn ? 'Map Layer Filters' : 'Filtros de Capas en Mapa'}</span>
            </h3>

            <div className="space-y-2 text-xs font-medium text-[#252A2E]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showForecastTrack}
                  onChange={(e) => setShowForecastTrack(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{isEn ? 'Official Forecast Tracks' : 'Líneas de trayectoria pronosticada'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showConeOfUncertainty}
                  onChange={(e) => setShowConeOfUncertainty(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{isEn ? 'Cones of Uncertainty (67%)' : 'Conos de incertidumbre (67%)'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showWaypointsAndLabels}
                  onChange={(e) => setShowWaypointsAndLabels(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{isEn ? 'Forecast Points & Schedules' : 'Puntos de pronóstico y horarios'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showStormLabels}
                  onChange={(e) => setShowStormLabels(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{isEn ? 'Storm Names & Center Badges' : 'Nombres y rótulos de fenómenos'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPastTrack}
                  onChange={(e) => setShowPastTrack(e.target.checked)}
                  className="rounded text-[#245A66] focus:ring-0 accent-[#245A66] w-4 h-4 cursor-pointer"
                />
                <span>{isEn ? 'Historical Observed Tracks' : 'Trayectoria observada (histórica)'}</span>
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
                    {isEn ? 'Temporary Shelters (272)' : 'Refugios temporales (272)'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Card: Simbología Oficial */}
          <div className="border border-[#DDE1DF] rounded-[6px] p-3.5 bg-[#FFFFFF] space-y-2 text-xs">
            <h3 className="font-bold text-[#193247] uppercase tracking-wider text-xs">
              {isEn ? 'Official Symbology' : 'Simbología Oficial por Sistema'}
            </h3>
            <div className="space-y-1.5 text-xs text-[#252A2E]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-2 bg-[#B84A45] rounded-xs inline-block" />
                  <span className="font-bold">Huracán Trudy:</span>
                </div>
                <span className="text-[#64748B] text-[11px]">Rojo Carmesí / Cono Ámbar</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-2 bg-[#0D9488] rounded-xs inline-block" />
                  <span className="font-bold">Tormenta Tropical Simon:</span>
                </div>
                <span className="text-[#64748B] text-[11px]">Verde Azulado / Cono Azul</span>
              </div>

              <div className="pt-1 mt-1 border-t border-[#E2E8F0] space-y-1 text-[11px] text-[#64748B]">
                <div>• <strong>DT:</strong> Depresión Tropical (Vientos &lt; 63 km/h)</div>
                <div>• <strong>TT:</strong> Tormenta Tropical (63 a 118 km/h)</div>
                <div>• <strong>C1 – C5:</strong> Huracán según Escala Saffir-Simpson (≥ 119 km/h)</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer del Mapa */}
      <div className="p-3 bg-[#F7F7F4] border-t border-[#DDE1DF] text-xs text-[#607788] flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#245A66]" />
          <span>
            {isEn
              ? 'Multi-system tracking powered by NOAA NHC & Conagua SMN bulletins. Projections update on official advisory issuance.'
              : 'Monitoreo multisistema coordinado con boletines oficiales del NHC/NOAA y SMN Conagua.'}
          </span>
        </span>
        {lastUpdatedTime && (
          <span className="font-bold text-[#193247] font-tabular">
            {isEn ? `Sync: ${lastUpdatedTime}` : `Sincronización: ${lastUpdatedTime}`}
          </span>
        )}
      </div>
    </div>
  );
};
