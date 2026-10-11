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
  CloudRain,
  Navigation,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Radio,
  ExternalLink,
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

// Coordenadas oficiales y datos de pronóstico del punto de impacto (Landfall) según modelo oficial NHC / SMN
const LANDFALL_DATA = {
  locationName: 'Costa Sur de Jalisco / Límite con Colima',
  sublocation: 'Entre Barra de Navidad, Cihuatlán y Chamela (Bahía de Navidad - Careyes)',
  lat: 19.30,
  lng: -104.90,
  coordinatesText: '19.30° N, 104.90° O',
  // Landfall estimado: 11 de Octubre a las 07:00 hrs UTC-6 (13:00 UTC)
  targetTimestampIso: '2026-10-11T07:00:00-06:00',
  targetDateFormatted: 'Domingo 11 de Octubre',
  targetTimeFormatted: '07:00 hrs (Ventana estimada: 06:00 a 08:30 hrs UTC-6)',
  category: 4,
  categoryName: 'Categoría 4 (Saffir-Simpson)',
  expectedWindSpeedKmh: 220,
  expectedWindGustsKmh: 275,
  expectedPressureHpa: 950,
  expectedStormSurgeMeters: '4.5 a 6.0 metros',
  expectedWaveHeightMeters: '7.0 a 9.5 metros',
  expectedRainfallMm: '250 a 450 mm (extraordinarias hasta 650 mm)',
  confidenceProbability: '95%',
  // Posición actual del ojo del huracán para cálculos dinámicos (Actualizado 04:00 AM)
  currentEyeLat: 18.60,
  currentEyeLng: -104.90,
  currentSpeedKmh: 12.0,
  currentHeadingText: 'Norte-Noroeste (345°)',
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
  // Real-time dynamic clock & countdown updated every 1 second
  const [now, setNow] = useState<Date>(new Date());
  const [calculationPulse, setCalculationPulse] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentEyeLat = dynamicStatus ? dynamicStatus.lat : LANDFALL_DATA.currentEyeLat;
  const currentEyeLng = dynamicStatus ? dynamicStatus.lng : LANDFALL_DATA.currentEyeLng;
  const currentMovementText = dynamicStatus ? dynamicStatus.movement : LANDFALL_DATA.currentHeadingText;
  const currentSpeed = dynamicStatus ? dynamicStatus.movementSpeedKmh : LANDFALL_DATA.currentSpeedKmh;

  // Landfall Target Time
  const targetTime = useMemo(() => {
    return new Date(LANDFALL_DATA.targetTimestampIso).getTime();
  }, []);

  // Time remaining calculation in real-time
  const { hoursRemaining, minutesRemaining, secondsRemaining, isPassed, totalSecondsRemaining } = useMemo(() => {
    const diffMs = targetTime - now.getTime();
    if (diffMs <= 0) {
      return {
        hoursRemaining: 0,
        minutesRemaining: 0,
        secondsRemaining: 0,
        isPassed: true,
        totalSecondsRemaining: 0,
      };
    }
    const totalSecs = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return {
      hoursRemaining: hrs,
      minutesRemaining: mins,
      secondsRemaining: secs,
      isPassed: false,
      totalSecondsRemaining: totalSecs,
    };
  }, [now, targetTime]);

  // Real-time calculation of distance from Hurricane Eye to Landfall
  const distanceEyeToLandfallKm = useMemo(() => {
    return calculateDistanceKm(
      currentEyeLat,
      currentEyeLng,
      LANDFALL_DATA.lat,
      LANDFALL_DATA.lng
    );
  }, [currentEyeLat, currentEyeLng]);

  // Dynamic user distance to landfall if user location is resolved
  const userDistanceToLandfallKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      LANDFALL_DATA.lat,
      LANDFALL_DATA.lng
    );
  }, [userCoords]);

  // Dynamic user distance to current hurricane eye
  const userDistanceToEyeKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      currentEyeLat,
      currentEyeLng
    );
  }, [userCoords, currentEyeLat, currentEyeLng]);

  // Estimated arrival of tropical storm-force winds (prior to the eye)
  const tropicalStormArrivalHours = useMemo(() => {
    // Tropical storm winds extend ~240 km from center
    // As the eye is 189 km away, coastal sectors are already entering the outer bands
    return Math.max(0, hoursRemaining - 2);
  }, [hoursRemaining]);

  // Formatter for two digits
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const handleRefresh = () => {
    setCalculationPulse((prev) => prev + 1);
    if (onRefreshNow) onRefreshNow();
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#B84A45]/30 rounded-[6px] overflow-hidden text-[#252A2E] shadow-none">
      {/* 1. Header Bar: Alerta Oficial y Estado de Cálculo Continuo */}
      <div className="bg-[#B84A45]/10 border-b border-[#B84A45]/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B84A45] animate-pulse shrink-0" />
          <span className="font-semibold text-[#B84A45] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 stroke-[2]" />
            Alerta de Impacto en Tierra (Landfall Warning)
          </span>
          <span className="text-[#DDE1DF] hidden sm:inline">|</span>
          <span className="text-[11px] text-[#687078] hidden sm:inline font-tabular">
            Modelo de Ensamblado Numérico NHC / SMN Conagua • Ciclo 18:00Z
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-tabular ml-auto">
          <span className="flex items-center gap-1.5 text-[11px] text-[#3F8063] font-medium">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Cálculos refrescados continuamente</span>
          </span>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-[11px] bg-white hover:bg-[#F7F7F4] text-[#245A66] border border-[#DDE1DF] px-2 py-0.5 rounded-[3px] font-medium transition flex items-center gap-1 disabled:opacity-50"
            title="Recalcular métricas en tiempo real"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalcular</span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo Principal: Declaración Formal de Impacto y Cronómetro */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Frase Central Solicitada con Jerarquía Editorial */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[5px] p-4 sm:p-5">
          <div className="text-[11px] text-[#245A66] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 stroke-[1.75]" />
            Estimación Oficial de Trayectoria y Arribo a la Costa
          </div>

          <div className="text-base sm:text-lg md:text-xl font-semibold text-[#252A2E] leading-snug">
            Según la información oficial modelada hasta el momento, el{' '}
            <span className="text-[#245A66]">Huracán Simón</span> va a tocar tierra en{' '}
            <span className="text-[#B84A45] underline decoration-[#B84A45]/40 decoration-2 underline-offset-4">
              {LANDFALL_DATA.locationName}
            </span>
            , a la hora{' '}
            <span className="text-[#245A66] font-tabular bg-white px-1.5 py-0.5 rounded-[3px] border border-[#DDE1DF]">
              {LANDFALL_DATA.targetTimeFormatted}
            </span>
            , con una fuerza de{' '}
            <span className="text-[#B84A45] font-tabular bg-[#B84A45]/10 px-1.5 py-0.5 rounded-[3px] border border-[#B84A45]/25">
              {LANDFALL_DATA.categoryName}
            </span>
            .
          </div>

          <div className="text-xs text-[#687078] mt-2 pt-2 border-t border-[#DDE1DF] flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Sector crítico:</strong> {LANDFALL_DATA.sublocation} ({LANDFALL_DATA.coordinatesText}).
            </span>
            <span className="font-tabular text-[#245A66] font-medium">
              Probabilidad en el cono: {LANDFALL_DATA.confidenceProbability}
            </span>
          </div>
        </div>

        {/* 3. Panel de Métricas de Cálculo en Tiempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Cuenta Regresiva al Impacto (Live Countdown) */}
          <div className="bg-[#FFFFFF] border border-[#245A66]/30 rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Tiempo Restante para Impacto</span>
                <Clock className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>

              {isPassed ? (
                <div className="text-xl font-semibold text-[#B84A45] mt-1 font-tabular">
                  Fase de Impacto en Curso
                </div>
              ) : (
                <div className="mt-1">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#245A66] font-tabular tracking-tight">
                    {pad(hoursRemaining)}h {pad(minutesRemaining)}m{' '}
                    <span className="text-lg text-[#687078]">{pad(secondsRemaining)}s</span>
                  </div>
                  <div className="text-[11px] text-[#687078] font-tabular mt-0.5">
                    Impacto previsto: {LANDFALL_DATA.targetDateFormatted}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Vientos de tormenta:</span>
              <strong className="text-[#A66C19]">En ~{tropicalStormArrivalHours} hrs</strong>
            </div>
          </div>

          {/* Card 2: Distancia Actual del Ojo al Punto de Tierra */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Distancia Ojo a Costa</span>
                <Navigation className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>

              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-semibold text-[#252A2E] font-tabular">
                  {formatDistance(distanceEyeToLandfallKm)}
                </div>
                <div className="text-[11px] text-[#687078] mt-0.5 font-tabular">
                  Rumbo: {currentMovementText} a {currentSpeed} km/h
                </div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Posición actual del ojo:</span>
              <strong className="text-[#245A66] font-semibold">
                {currentEyeLat.toFixed(2)}° N, {Math.abs(currentEyeLng).toFixed(2)}° O
              </strong>
            </div>
          </div>

          {/* Card 3: Fuerza Esperada al Tocar Tierra */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Vientos en Línea de Costa</span>
                <Wind className="w-3.5 h-3.5 text-[#B84A45] stroke-[1.75]" />
              </div>

              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-semibold text-[#B84A45] font-tabular">
                  {LANDFALL_DATA.expectedWindSpeedKmh}{' '}
                  <span className="text-sm font-normal text-[#687078]">km/h</span>
                </div>
                <div className="text-[11px] text-[#252A2E] mt-0.5 font-tabular">
                  Rachas extremas de <strong>{LANDFALL_DATA.expectedWindGustsKmh} km/h</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Presión central:</span>
              <strong className="text-[#252A2E]">{LANDFALL_DATA.expectedPressureHpa} hPa</strong>
            </div>
          </div>

          {/* Card 4: Efectos Marítimos y de Inundación */}
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#687078]">
                <span className="font-medium">Marea de Tormenta y Oleaje</span>
                <Waves className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
              </div>

              <div className="mt-1">
                <div className="text-2xl sm:text-3xl font-semibold text-[#245A66] font-tabular">
                  {LANDFALL_DATA.expectedStormSurgeMeters}
                </div>
                <div className="text-[11px] text-[#687078] mt-0.5 font-tabular">
                  Oleaje rompiente de hasta {LANDFALL_DATA.expectedWaveHeightMeters}
                </div>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex items-center justify-between font-tabular">
              <span>Lluvia acumulada:</span>
              <strong className="text-[#3F8063]">250 a 450 mm</strong>
            </div>
          </div>
        </div>

        {/* 4. Barra de Contexto Local Personalizado (Si el usuario activó GPS o buscador) */}
        {userCoords && userDistanceToLandfallKm !== null ? (
          <div className="bg-[#245A66]/5 border border-[#245A66]/20 rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#245A66] shrink-0 stroke-[2]" />
              <div>
                <span className="font-medium text-[#252A2E]">
                  Cálculo para tu ubicación ({activeLocationLabel || 'Ubicación Georreferenciada'}):
                </span>{' '}
                <span className="text-[#687078]">
                  Te encuentras a <strong className="text-[#245A66] font-tabular">{formatDistance(userDistanceToLandfallKm)}</strong> del punto proyectado de impacto en tierra y a <strong className="text-[#245A66] font-tabular">{formatDistance(userDistanceToEyeKm || 0)}</strong> del ojo actual.
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
              className="text-[#245A66] hover:underline font-semibold shrink-0 text-xs flex items-center gap-1"
            >
              <span>Ver refugios más cercanos a ti</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#687078]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#245A66] shrink-0" />
              <span>
                ¿Deseas saber a qué distancia estás del punto de impacto? Usa el localizador para ver tu riesgo específico y tus refugios asignados.
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('refugios');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#245A66] hover:underline font-medium shrink-0 text-[11px] flex items-center gap-1"
            >
              <span>Localizar mi municipio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 5. Acciones Rápidas de Emergencia y Navegación */}
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
              className="bg-[#245A66] hover:bg-[#1b434c] text-white px-3 py-1.5 rounded-[4px] font-medium transition flex items-center gap-1.5 text-xs shadow-none"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver punto de impacto en el mapa interactivo</span>
            </button>

            <button
              onClick={() => {
                if (onScrollToShelters) onScrollToShelters();
                else {
                  const el = document.getElementById('refugios');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white hover:bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF] px-3 py-1.5 rounded-[4px] font-medium transition flex items-center gap-1.5 text-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#245A66]" />
              <span>Refugios de evacuación en Costa Sur</span>
            </button>
          </div>

          <div className="text-[11px] text-[#687078] font-tabular flex items-center gap-2">
            <span>Última corrida del modelo:</span>
            <span className="font-medium text-[#252A2E]">
              {lastUpdated.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
