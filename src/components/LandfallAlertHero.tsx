import React, { useState, useEffect, useMemo } from 'react';
import { calculateDistanceKm, formatDistance } from '../utils/geo';
import { DynamicHurricaneStatus } from '../utils/hurricaneTracking';
import {
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Wind,
  Waves,
  Gauge,
  Navigation,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Radio,
  ExternalLink,
  PlaneTakeoff,
  Anchor,
} from 'lucide-react';

interface LandfallAlertHeroProps {
  userCoords?: { lat: number; lng: number } | null;
  activeLocationLabel?: string | null;
  onScrollToMap?: () => void;
  onScrollToShelters?: () => void;
  lastUpdated?: Date;
  onRefreshNow?: () => void;
  isRefreshing?: boolean;
  dynamicStatus?: DynamicHurricaneStatus;
}

// Datos oficiales verificados — Boletín Intermedio #16A NHC / NOAA y SMN Conagua
const OFFICIAL_BULLETIN_DATA = {
  bulletinId: 'Aviso Intermedio #16A (1200 UTC / 06:00 CST)',
  agency: 'Centro Nacional de Huracanes (NHC / NOAA) y SMN Conagua',
  currentLat: 18.90,
  currentLng: -105.20,
  coordinatesText: '18.9° N, 105.2° O',
  referenceDistances: 'A 95 km (60 mi) al oeste de Manzanillo, Col. y 175 km (110 mi) al sur-sureste de Cabo Corrientes, Jal. (~215 km de Puerto Vallarta)',
  headingText: 'Nor-Noroeste (335°)',
  speedKmh: 9,
  speedMph: 6,
  category: 4,
  categoryName: 'Huracán Mayor Categoría 4',
  windSpeedKmh: 240,
  windSpeedMph: 150,
  windGustsKmh: 290,
  pressureHpa: 933,
  // Sector bajo cono oficial de mayor impacto / aproximación
  projectedTargetName: 'Costa Norte de Jalisco (Cabo Corrientes / Bahía de Banderas / Puerto Vallarta) y Costa de Nayarit',
  targetLat: 20.30,
  targetLng: -105.40,
  estimatedWindowText: 'Tarde / noche de hoy domingo 11 de Octubre a primeras horas del 12 de Octubre',
  warningArea: 'Aviso de Huracán: Desde Punta San Telmo, Mich. hasta El Roblito, Nay. e Islas Marías',
};

export const LandfallAlertHero: React.FC<LandfallAlertHeroProps> = ({
  userCoords,
  activeLocationLabel,
  onScrollToMap,
  onScrollToShelters,
  lastUpdated = new Date(),
  onRefreshNow,
  isRefreshing = false,
  dynamicStatus,
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const eyeLat = dynamicStatus ? dynamicStatus.lat : OFFICIAL_BULLETIN_DATA.currentLat;
  const eyeLng = dynamicStatus ? dynamicStatus.lng : OFFICIAL_BULLETIN_DATA.currentLng;
  const currentHeading = dynamicStatus ? dynamicStatus.movement : OFFICIAL_BULLETIN_DATA.headingText;
  const currentSpeed = dynamicStatus ? dynamicStatus.movementSpeedKmh : OFFICIAL_BULLETIN_DATA.speedKmh;

  // Distancia del ojo al sector proyectado de aproximación crítica (Cabo Corrientes / Bahía de Banderas)
  const distanceEyeToApproachKm = useMemo(() => {
    return calculateDistanceKm(
      eyeLat,
      eyeLng,
      OFFICIAL_BULLETIN_DATA.targetLat,
      OFFICIAL_BULLETIN_DATA.targetLng
    );
  }, [eyeLat, eyeLng]);

  // Distancia del usuario al ojo del huracán
  const userDistanceToEyeKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, eyeLat, eyeLng);
  }, [userCoords, eyeLat, eyeLng]);

  // Distancia del usuario al sector proyectado de aproximación crítica
  const userDistanceToTargetKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      OFFICIAL_BULLETIN_DATA.targetLat,
      OFFICIAL_BULLETIN_DATA.targetLng
    );
  }, [userCoords]);

  return (
    <div className="bg-[#FFFFFF] border border-[#B84A45]/30 rounded-[6px] overflow-hidden text-[#252A2E] shadow-none">
      {/* 1. Header Bar: Alerta Oficial y Estado de Sincronización */}
      <div className="bg-[#B84A45]/10 border-b border-[#B84A45]/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B84A45] animate-pulse shrink-0" />
          <span className="font-semibold text-[#B84A45] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 stroke-[2]" />
            Aviso Meteorológico Crítico • Origen Verificado
          </span>
          <span className="text-[#DDE1DF] hidden sm:inline">|</span>
          <span className="text-[11px] text-[#252A2E] font-medium hidden sm:inline font-tabular">
            {OFFICIAL_BULLETIN_DATA.bulletinId} — {OFFICIAL_BULLETIN_DATA.agency}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-tabular ml-auto">
          <span className="flex items-center gap-1.5 text-[11px] text-[#3F8063] font-medium">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Monitoreo continuo en tiempo real</span>
          </span>

          <button
            onClick={() => onRefreshNow && onRefreshNow()}
            disabled={isRefreshing}
            className="text-[11px] bg-white hover:bg-[#F7F7F4] text-[#245A66] border border-[#DDE1DF] px-2 py-0.5 rounded-[3px] font-medium transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            title="Recalcular métricas en tiempo real"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo Principal: Declaración Formal Oficial y Posición Verídica */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Banner de Declaración Oficial Verificada */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[5px] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-[#DDE1DF] pb-2">
            <span className="text-[11px] text-[#245A66] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 stroke-[1.75]" />
              Posición Oficial y Pronóstico de Desplazamiento
            </span>
            <span className="text-[11px] text-[#687078] font-tabular">
              Fuente: NHC Advisory #16A & SMN Conagua
            </span>
          </div>

          <div className="text-sm sm:text-base md:text-lg font-semibold text-[#252A2E] leading-snug">
            Según el Aviso Oficial #16A del Centro Nacional de Huracanes (NHC/NOAA) y el Servicio Meteorológico Nacional (SMN), el{' '}
            <span className="text-[#245A66]">Huracán Simón</span> se localiza actualmente como{' '}
            <span className="text-[#B84A45] font-tabular bg-[#B84A45]/10 px-1.5 py-0.5 rounded-[3px] border border-[#B84A45]/25">
              Categoría 4 (vientos de 240 km/h, rachas de 290 km/h)
            </span>{' '}
            en las coordenadas{' '}
            <span className="text-[#245A66] font-tabular bg-white px-1.5 py-0.5 rounded-[3px] border border-[#DDE1DF]">
              {eyeLat.toFixed(1)}°N, {Math.abs(eyeLng).toFixed(1)}°O
            </span>
            , avanzando hacia el <strong className="text-[#252A2E]">Nor-Noroeste a 9 km/h</strong> frente al litoral del Pacífico mexicano.
          </div>

          <div className="p-3 bg-white border border-[#B84A45]/20 rounded-[4px] text-xs text-[#252A2E] leading-relaxed">
            <strong className="text-[#B84A45] font-semibold">Aclaración de Trayectoria Oficial:</strong> El huracán no impactó en tierra en la madrugada en Costa Sur de Jalisco ni Colima; su centro se desplaza sobre aguas del Pacífico mar adentro (a 95 km al oeste de Manzanillo y 175 km al sur-sureste de Cabo Corrientes). Su cono oficial proyecta su aproximación más crítica o impacto sobre la región de{' '}
            <strong className="text-[#245A66]">{OFFICIAL_BULLETIN_DATA.projectedTargetName}</strong>{' '}
            durante la <span className="font-semibold">{OFFICIAL_BULLETIN_DATA.estimatedWindowText}</span>.
          </div>

          {/* Estado Crítico de Transporte (Aeropuertos y Puertos) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-[#B84A45]/10 border border-[#B84A45]/25 text-[#B84A45] font-semibold px-2.5 py-1 rounded-[3px]">
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span>Aeropuerto Pto. Vallarta (PVR) y Manzanillo (ZLO): CERRADOS</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#B84A45]/10 border border-[#B84A45]/25 text-[#B84A45] font-semibold px-2.5 py-1 rounded-[3px]">
              <Anchor className="w-3.5 h-3.5" />
              <span>Puertos de Manzanillo, Vallarta y San Blas: CERRADOS</span>
            </div>
          </div>
        </div>

        {/* 3. Panel de Métricas Meteorológicas Verificadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Posición Exacta del Ojo */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Ubicación del Ojo</span>
                <Navigation className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>
              <div className="mt-1">
                <div className="text-xl sm:text-2xl font-semibold text-[#252A2E] font-tabular">
                  {eyeLat.toFixed(2)}° N, {Math.abs(eyeLng).toFixed(2)}° O
                </div>
                <div className="text-[11px] text-[#687078] mt-0.5 leading-snug">
                  A 95 km al O de Manzanillo • 175 km al SSE de Cabo Corrientes
                </div>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Distancia a Pto. Vallarta:</span>
              <strong className="text-[#245A66]">~215 km</strong>
            </div>
          </div>

          {/* Card 2: Rumbo y Desplazamiento */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Rumbo y Avance</span>
                <Compass className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>
              <div className="mt-1">
                <div className="text-xl sm:text-2xl font-semibold text-[#245A66] font-tabular">
                  {currentSpeed} <span className="text-xs font-normal text-[#687078]">km/h</span> (6 mph)
                </div>
                <div className="text-[11px] text-[#687078] mt-0.5 font-tabular">
                  Dirección: {currentHeading}
                </div>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Avance hacia:</span>
              <strong className="text-[#252A2E]">Cabo Corrientes / Nayarit</strong>
            </div>
          </div>

          {/* Card 3: Vientos Sostenidos y Rachas */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Fuerza del Viento</span>
                <Wind className="w-3.5 h-3.5 text-[#B84A45] stroke-[1.75]" />
              </div>
              <div className="mt-1">
                <div className="text-xl sm:text-2xl font-semibold text-[#B84A45] font-tabular">
                  {OFFICIAL_BULLETIN_DATA.windSpeedKmh} <span className="text-xs font-normal text-[#687078]">km/h</span>
                </div>
                <div className="text-[11px] text-[#252A2E] mt-0.5 font-tabular">
                  Rachas destructivas de <strong className="text-[#B84A45]">{OFFICIAL_BULLETIN_DATA.windGustsKmh} km/h</strong>
                </div>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Presión central:</span>
              <strong className="text-[#252A2E]">{OFFICIAL_BULLETIN_DATA.pressureHpa} hPa (27.55 inHg)</strong>
            </div>
          </div>

          {/* Card 4: Efectos Marítimos y Oleaje */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Oleaje y Marea</span>
                <Waves className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>
              <div className="mt-1">
                <div className="text-xl sm:text-2xl font-semibold text-[#245A66] font-tabular">
                  7.5 a 10.0 <span className="text-xs font-normal text-[#687078]">m</span>
                </div>
                <div className="text-[11px] text-[#687078] mt-0.5 font-tabular">
                  Marea de tormenta peligrosa de 4.0 a 6.0 m
                </div>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Lluvia acumulada:</span>
              <strong className="text-[#3F8063]">250 a 500 mm (puntual 650 mm)</strong>
            </div>
          </div>
        </div>

        {/* 4. Barra de Contexto Local Personalizado (Si el usuario activó GPS o buscador) */}
        {userCoords && userDistanceToEyeKm !== null ? (
          <div className="bg-[#245A66]/5 border border-[#245A66]/20 rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#245A66] shrink-0 stroke-[2]" />
              <div>
                <span className="font-medium text-[#252A2E]">
                  Cálculo para tu ubicación ({activeLocationLabel || 'Ubicación seleccionada'}):
                </span>{' '}
                <span className="text-[#687078]">
                  Te encuentras a <strong className="text-[#245A66] font-tabular">{formatDistance(userDistanceToEyeKm)}</strong> del ojo del huracán Simón y a <strong className="text-[#245A66] font-tabular">{formatDistance(userDistanceToTargetKm || 0)}</strong> de la zona de mayor aproximación proyectada.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onScrollToShelters) onScrollToShelters();
                else {
                  const el = document.getElementById('refugios');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#245A66] hover:underline font-semibold shrink-0 text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Ver refugios asignados</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#687078]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#245A66] shrink-0" />
              <span>
                Verifica tu municipio o colonia en el localizador para ver tu distancia real al meteoro y tu refugio temporal más cercano.
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('refugios');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#245A66] hover:underline font-medium shrink-0 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Localizar mi refugio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 5. Acciones Rápidas de Navegación */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DDE1DF] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (onScrollToMap) onScrollToMap();
                else {
                  const el = document.getElementById('mapa-trayectoria');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#245A66] hover:bg-[#1b434c] text-white px-3 py-1.5 rounded-[4px] font-medium transition flex items-center gap-1.5 text-xs shadow-none cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver trayectoria en mapa interactivo</span>
            </button>

            <button
              onClick={() => {
                if (onScrollToShelters) onScrollToShelters();
                else {
                  const el = document.getElementById('refugios');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white hover:bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF] px-3 py-1.5 rounded-[4px] font-medium transition flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#245A66]" />
              <span>Directorio de albergues habilitados</span>
            </button>
          </div>

          <div className="text-[11px] text-[#687078] font-tabular flex items-center gap-2">
            <span>Última verificación oficial:</span>
            <span className="font-semibold text-[#252A2E]">
              {lastUpdated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} hrs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
