import React, { useState, useMemo } from 'react';
import { calculateDistanceKm, formatDistance } from '../utils/geo';
import { DynamicHurricaneStatus } from '../utils/hurricaneTracking';
import { ActiveStormSystem } from '../utils/noaaFeed';
import {
  ShieldAlert,
  ShieldCheck,
  Compass,
  Navigation,
  Wind,
  Gauge,
  MapPin,
  PlaneTakeoff,
  Anchor,
  RefreshCw,
  Radio,
  Waves,
  Camera,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LandfallAlertHeroProps {
  userCoords?: { lat: number; lng: number } | null;
  activeLocationLabel?: string | null;
  onScrollToMap?: () => void;
  onScrollToShelters?: () => void;
  lastUpdated?: Date;
  onRefreshNow?: () => void;
  isRefreshing?: boolean;
  dynamicStatus?: DynamicHurricaneStatus;
  hasActiveCyclone?: boolean;
  activeStormName?: string;
  onToggleViewMode?: () => void;
  viewMode?: 'auto' | 'calm' | 'cyclone';
  activeStorms?: ActiveStormSystem[];
  onSelectStorm?: (storm: ActiveStormSystem) => void;
}

export const LandfallAlertHero: React.FC<LandfallAlertHeroProps> = ({
  userCoords,
  activeLocationLabel,
  onScrollToShelters,
  onRefreshNow,
  isRefreshing = false,
  dynamicStatus,
  hasActiveCyclone = true,
  activeStormName,
  onToggleViewMode,
  viewMode = 'auto',
  activeStorms,
  onSelectStorm,
}) => {
  const { t, language } = useLanguage();
  const [selectedStormIndex, setSelectedStormIndex] = useState(0);

  // Lista normalizada de alertas activas (organizadas por mayor relevancia)
  const storms: ActiveStormSystem[] = useMemo(() => {
    if (activeStorms && activeStorms.length > 0) {
      return activeStorms;
    }
    // Fallback individual si no hay lista múltiple
    const fallbackCategory = dynamicStatus?.category ?? 1;
    const isCat = fallbackCategory >= 1;
    return [
      {
        id: 'system-primary',
        name: activeStormName || dynamicStatus?.name || 'Sistema en Seguimiento',
        cleanDisplayName: activeStormName || dynamicStatus?.name || 'Sistema en Seguimiento',
        stormType: isCat ? 'Hurricane' : 'Tropical Storm',
        category: fallbackCategory,
        categoryName: isCat ? `Huracán Cat. ${fallbackCategory}` : 'Sistema Tropical',
        classification: isCat ? 'Huracán' : 'Sistema Tropical',
        typeLabelEs: isCat ? (fallbackCategory >= 3 ? 'Huracán Mayor' : 'Huracán') : 'Sistema Tropical',
        typeLabelEn: isCat ? (fallbackCategory >= 3 ? 'Major Hurricane' : 'Hurricane') : 'Tropical System',
        badgeTextEs: isCat ? `Categoría ${fallbackCategory} (Saffir-Simpson)` : 'Vigilancia Preventiva',
        badgeTextEn: isCat ? `Category ${fallbackCategory} (Saffir-Simpson)` : 'Preventive Watch',
        badgeColorClass: isCat ? 'bg-amber-600 text-white' : 'bg-teal-700 text-white',
        windSpeedKmh: dynamicStatus?.windSpeedKmh ?? 150,
        windGustsKmh: dynamicStatus?.windGustsKmh ?? 185,
        windSpeedMph: Math.round((dynamicStatus?.windSpeedKmh ?? 150) * 0.621371),
        pressureHpa: dynamicStatus?.pressureHpa ?? 977,
        lat: dynamicStatus?.lat ?? 20.0,
        lng: dynamicStatus?.lng ?? -107.0,
        coordinatesText: dynamicStatus?.coordinatesText ?? '20.0°N, 107.0°O',
        distanceReference: dynamicStatus?.distanceReference ?? t.heroLocationSummary,
        movement: dynamicStatus?.movement ?? 'Rumbo 300°',
        movementSpeedKmh: dynamicStatus?.movementSpeedKmh ?? 10,
        movementSpeedMph: Math.round((dynamicStatus?.movementSpeedKmh ?? 10) * 0.621371),
        waveHeightMeters: '3.5 a 5.0 metros',
        rainAccumulation: 'Lluvias muy fuertes a intensas',
        advisoryNum: 'Oficial',
        advisoryDate: 'Actual',
        lastUpdate: dynamicStatus?.lastUpdate ?? 'Boletín Oficial',
        relevanceScore: 1000,
      },
    ];
  }, [activeStorms, dynamicStatus, activeStormName, t.heroLocationSummary]);

  // Asegurar índice válido
  const safeIndex = selectedStormIndex < storms.length ? selectedStormIndex : 0;
  const currentStorm = storms[safeIndex];

  // Distancia del usuario al centro del fenómeno seleccionado
  const userDistanceToEyeKm = useMemo(() => {
    if (!userCoords || !hasActiveCyclone || !currentStorm) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, currentStorm.lat, currentStorm.lng);
  }, [userCoords, hasActiveCyclone, currentStorm]);

  const handleSelectTab = (idx: number) => {
    setSelectedStormIndex(idx);
    if (onSelectStorm && storms[idx]) {
      onSelectStorm(storms[idx]);
    }
  };

  // VISTA 1: ALERTA VERDE (CUANDO NO HAY NINGÚN FENÓMENO ACTIVO)
  if (!hasActiveCyclone) {
    return (
      <div className="bg-[#FFFFFF] border border-emerald-500/30 rounded-[6px] overflow-hidden text-[#252A2E] shadow-none">
        {/* Barra Superior de Alerta Verde */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-800 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2]" />
              {t.heroGreenBadge}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-tabular ml-auto">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? '24/7 Live Radar' : 'Vigilancia 24/7'}</span>
            </span>

            {onToggleViewMode && (
              <button
                onClick={onToggleViewMode}
                className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-[3px] transition cursor-pointer"
                title="Alternar vista de prueba"
              >
                {viewMode === 'calm'
                  ? language === 'en'
                    ? 'Test Storm View'
                    : 'Ver Modo Ciclón'
                  : language === 'en'
                    ? 'Simulate Calm'
                    : 'Ver Modo Calma'}
              </button>
            )}

            <button
              onClick={() => onRefreshNow && onRefreshNow()}
              disabled={isRefreshing}
              className="bg-white hover:bg-[#F7F7F4] text-[#245A66] border border-[#DDE1DF] px-2.5 py-1 rounded-[3px] font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title={t.refreshNow}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t.refreshNow}</span>
            </button>
          </div>
        </div>

        {/* Panel Editorial Principal de Estado en Calma */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F7F7F4] border border-[#DDE1DF] p-4 sm:p-5 rounded-[6px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-[3px]">
                  {language === 'en'
                    ? 'Green Phase: Normal Marine Conditions'
                    : 'Fase Verde: Condiciones Normales'}
                </span>
                <span className="text-xs font-semibold text-[#687078]">
                  {language === 'en' ? 'Eastern Pacific Basin' : 'Pacífico Nororiental Mexicano'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252A2E] tracking-tight">
                {t.heroGreenTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#4A5568] mt-1 font-medium max-w-3xl leading-relaxed">
                {t.heroGreenSubtitle}
              </p>
            </div>

            {/* Badges de Estado Operativo */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
                <PlaneTakeoff className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Airports: 100% OPERATIONAL'
                    : 'Aeropuertos: 100% OPERATIVOS'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
                <Anchor className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'en' ? 'Ports: OPEN TO NAVIGATION' : 'Puertos: NAVEGACIÓN ABIERTA'}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Métricas de Vigilancia en Tiempo Real */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-emerald-600 rounded-[6px] p-3.5 sm:p-4 transition">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
                <span className="font-semibold">{t.calmMetricCyclone}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">
                {language === 'en' ? 'Calm' : 'Sin Ciclón'}
              </div>
              <div className="text-xs text-[#687078] mt-0.5 font-medium">
                {t.calmMetricCycloneVal}
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
                <span className="font-semibold">{t.calmMetricWind}</span>
                <Wind className="w-4 h-4 text-[#245A66]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#252A2E] font-tabular mt-1">
                15 – 30 <span className="text-xs font-normal text-[#687078]">km/h</span>
              </div>
              <div className="text-xs text-[#687078] mt-0.5 font-medium">
                {t.calmMetricWindVal}
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
                <span className="font-semibold">
                  {language === 'en' ? 'Marine Swell' : 'Oleaje Costero'}
                </span>
                <Waves className="w-4 h-4 text-[#245A66]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#252A2E] font-tabular mt-1">
                1.0 – 2.0 <span className="text-xs font-normal text-[#687078]">m</span>
              </div>
              <div className="text-xs text-[#687078] mt-0.5 font-medium">
                {language === 'en' ? 'Normal coastal surf' : 'Oleaje habitual de playa'}
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
                <span className="font-semibold">{t.calmMetricRadar}</span>
                <Camera className="w-4 h-4 text-[#245A66]" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#245A66] mt-1">GOES-19</div>
              <div className="text-xs text-[#687078] mt-0.5 font-medium">
                {t.calmMetricRadarVal}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: ALERTAS ACTIVAS DETECTADAS (CON PESTAÑAS ORGANIZADAS POR RELEVANCIA)
  const isEn = language === 'en';
  const typeLabel = isEn ? currentStorm.typeLabelEn : currentStorm.typeLabelEs;
  const badgeText = isEn ? currentStorm.badgeTextEn : currentStorm.badgeTextEs;

  return (
    <div className="bg-[#FFFFFF] border border-amber-500/30 rounded-[6px] overflow-hidden text-[#252A2E] shadow-none">
      {/* 1. Barra de Precaución Superior Oficial */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="font-bold text-amber-800 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 stroke-[2]" />
            {t.officialLiveAdvisory}
          </span>
          {storms.length > 1 && (
            <span className="bg-amber-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-[3px] ml-1 font-tabular">
              {storms.length} {isEn ? 'Alerts' : 'Alertas'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-tabular ml-auto">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>{t.activeMonitoring}</span>
          </span>

          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-[3px] transition cursor-pointer"
              title="Alternar vista de prueba"
            >
              {isEn ? 'Simulate Calm' : 'Ver Modo Calma'}
            </button>
          )}

          <button
            onClick={() => onRefreshNow && onRefreshNow()}
            disabled={isRefreshing}
            className="bg-white hover:bg-[#F7F7F4] text-[#245A66] border border-[#DDE1DF] px-2.5 py-1 rounded-[3px] font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title={t.refreshNow}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t.refreshNow}</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Pestañas de Alertas Organizadas por Relevancia */}
      {storms.length > 1 && (
        <div className="bg-[#FAFBF9] border-b border-[#DDE1DF] px-4 sm:px-6 pt-3 pb-2.5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-[#687078] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#245A66]" />
              <span>
                {isEn
                  ? `Active Pacific Systems (${storms.length} Detected • Ranked by Severity)`
                  : `Sistemas Activos en el Pacífico (${storms.length} Detectados • Mayor Relevancia Primero)`}
              </span>
            </span>
            <span className="text-[11px] text-[#687078] font-medium hidden sm:inline">
              {isEn ? 'Click tab to inspect system' : 'Haz clic en una pestaña para ver detalles'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {storms.map((stormItem, index) => {
              const isSelected = index === safeIndex;
              const isHighPriority = index === 0;
              const stormTypeLabel = isEn ? stormItem.typeLabelEn : stormItem.typeLabelEs;

              return (
                <button
                  key={stormItem.id || index}
                  onClick={() => handleSelectTab(index)}
                  className={`px-3 sm:px-4 py-2 rounded-[6px] text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#245A66] text-white border-[#245A66] shadow-sm ring-2 ring-[#245A66]/25'
                      : 'bg-[#FFFFFF] hover:bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF]'
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase font-tabular ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#245A66]/10 text-[#245A66]'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="font-extrabold tracking-tight truncate max-w-[170px] sm:max-w-none">
                    {stormItem.cleanDisplayName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isSelected ? 'bg-black/25 text-white' : stormItem.badgeColorClass
                    }`}
                  >
                    {stormTypeLabel} • {stormItem.windSpeedKmh} km/h
                  </span>
                  {isHighPriority && (
                    <span
                      className={`text-[9px] uppercase px-1 py-0.2 rounded font-extrabold tracking-wider ${
                        isSelected ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isEn ? 'Max Threat' : 'Prioridad'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Panel de la Tarjeta del Sistema Seleccionado */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Cabecera del Fenómeno con Clasificación Adecuada (NUNCA Huracán si es Depresión) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F7F7F4] border border-[#DDE1DF] p-4 sm:p-5 rounded-[6px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Etiqueta de Tipo Adecuado: Depresión Tropical / Tormenta Tropical / Huracán */}
              <span className="text-xs sm:text-sm font-extrabold text-[#245A66] uppercase tracking-wider">
                {typeLabel}
              </span>

              {/* Badge oficial con colorimetría y texto según intensidad */}
              <span className={`${currentStorm.badgeColorClass} font-bold text-xs px-2.5 py-0.5 rounded-[3px] shadow-2xs`}>
                {badgeText}
              </span>

              {storms.length > 1 && (
                <span className="bg-white border border-[#DDE1DF] text-[#687078] text-[11px] font-bold px-2 py-0.5 rounded-[3px] font-tabular">
                  {isEn ? `Alert ${safeIndex + 1} of ${storms.length}` : `Alerta ${safeIndex + 1} de ${storms.length}`}
                </span>
              )}
            </div>

            {/* Nombre Limpio del Fenómeno */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252A2E] tracking-tight">
              {currentStorm.cleanDisplayName}
            </h1>

            {/* Referencia Geográfica Precisa del Litoral del Pacífico */}
            <p className="text-sm sm:text-base text-[#4A5568] mt-1 font-medium leading-relaxed">
              {currentStorm.distanceReference}
            </p>
          </div>

          {/* Badges de Estado de Aeropuertos y Puertos acordes a la severidad del sistema */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <PlaneTakeoff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {currentStorm.category >= 1
                  ? t.airportsClosedBadge
                  : isEn
                    ? 'Coastal Airports: Normal Operations'
                    : 'Aeropuertos Costeros: Operando con Normalidad'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <Anchor className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {currentStorm.category >= 2
                  ? isEn
                    ? 'Ports: Severe Surf Precaution'
                    : 'Puertos Marítimos: Precaución por Fuerte Oleaje'
                  : currentStorm.category === 1
                    ? t.portsClosedBadge
                    : isEn
                      ? 'Ports: Small Craft Caution'
                      : 'Puertos: Precaución a Embarcaciones Menores'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Métricas Visuales Clave del Sistema Seleccionado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Vientos Sostenidos y Rachas */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.maxWinds}</span>
              <Wind className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-tabular mt-1">
              {currentStorm.windSpeedKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5 font-tabular">
              {t.gusts}{' '}
              <span className="text-amber-800 font-bold">{currentStorm.windGustsKmh} km/h</span>
              <span className="text-[#687078] text-[11px] ml-1">({currentStorm.windSpeedMph} mph)</span>
            </div>
          </div>

          {/* Card 2: Presión Central */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.centralPressure}</span>
              <Gauge className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {currentStorm.pressureHpa} <span className="text-sm font-normal text-[#687078]">hPa</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5 truncate">
              {currentStorm.pressureHpa < 980
                ? isEn
                  ? 'Intense low pressure center'
                  : 'Presión barométrica profunda'
                : isEn
                  ? 'Central barometric pressure'
                  : 'Presión barométrica central'}
            </div>
          </div>

          {/* Card 3: Rumbo y Desplazamiento */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.headingSpeed}</span>
              <Compass className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#245A66] font-tabular mt-1">
              {currentStorm.movementSpeedKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5 truncate font-tabular">
              {currentStorm.movement}
            </div>
          </div>

          {/* Card 4: Coordenadas del Centro */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.cycloneCenter}</span>
              <Navigation className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {currentStorm.coordinatesText}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5">
              {t.pacificCoast}
            </div>
          </div>
        </div>

        {/* Notificación de Distancia a la Ubicación del Usuario si está habilitada */}
        {userCoords && userDistanceToEyeKm !== null && (
          <div className="bg-[#245A66]/8 border border-[#245A66]/25 rounded-[4px] p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#245A66] shrink-0" />
              <span className="text-[#252A2E]">
                {t.yourLocation} ({activeLocationLabel || (isEn ? 'detected' : 'detectada')}):{' '}
                <strong className="text-[#245A66] font-bold font-tabular">
                  {formatDistance(userDistanceToEyeKm)}
                </strong>{' '}
                {isEn ? `from ${currentStorm.cleanDisplayName} center.` : `del centro de ${currentStorm.cleanDisplayName}.`}
              </span>
            </div>

            {onScrollToShelters && (
              <button
                onClick={onScrollToShelters}
                className="text-xs font-bold text-[#245A66] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t.viewNearbyShelters}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
