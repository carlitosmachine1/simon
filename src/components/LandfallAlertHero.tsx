import React, { useMemo } from 'react';
import { calculateDistanceKm, formatDistance } from '../utils/geo';
import { DynamicHurricaneStatus } from '../utils/hurricaneTracking';
import {
  ShieldAlert,
  Compass,
  Navigation,
  Wind,
  Gauge,
  MapPin,
  ArrowRight,
  PlaneTakeoff,
  Anchor,
  RefreshCw,
  Radio,
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
}

export const LandfallAlertHero: React.FC<LandfallAlertHeroProps> = ({
  userCoords,
  activeLocationLabel,
  onScrollToShelters,
  onRefreshNow,
  isRefreshing = false,
  dynamicStatus,
}) => {
  const { t, language } = useLanguage();

  const eyeLat = dynamicStatus ? dynamicStatus.lat : 19.4;
  const eyeLng = dynamicStatus ? dynamicStatus.lng : -105.4;
  const speedKmh = dynamicStatus ? dynamicStatus.movementSpeedKmh : 11;
  const heading = dynamicStatus ? dynamicStatus.movement : 'Nor-Noroeste (335°)';
  const windKmh = dynamicStatus ? dynamicStatus.windSpeedKmh : 205;
  const gustsKmh = dynamicStatus ? dynamicStatus.windGustsKmh : 250;
  const pressure = dynamicStatus ? dynamicStatus.pressureHpa : 952;
  const category = dynamicStatus ? dynamicStatus.category : 3;

  // Distancia del usuario al ojo
  const userDistanceToEyeKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, eyeLat, eyeLng);
  }, [userCoords, eyeLat, eyeLng]);

  return (
    <div className="bg-[#FFFFFF] border border-[#B84A45]/30 rounded-[6px] overflow-hidden text-[#252A2E] shadow-none">
      {/* 1. Barra de Alerta Superior */}
      <div className="bg-[#B84A45]/10 border-b border-[#B84A45]/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B84A45] animate-pulse shrink-0" />
          <span className="font-bold text-[#B84A45] uppercase text-xs sm:text-sm tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 stroke-[2]" />
            {t.officialLiveAdvisory}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-tabular ml-auto">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.activeMonitoring}</span>
          </span>
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

      {/* 2. Resumen Directo y Datos Críticos de Transporte */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F7F7F4] border border-[#DDE1DF] p-4 sm:p-5 rounded-[6px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-bold text-[#245A66] uppercase tracking-wide">
                {t.cycloneMajor}
              </span>
              <span className="bg-[#B84A45] text-white font-bold text-xs px-2 py-0.5 rounded-[3px]">
                {category === 3 ? t.category3 : (category === 4 ? t.category4 : `${t.categoryWord} ${category}`)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252A2E] tracking-tight">
              {t.hurricaneName}
            </h1>
            <p className="text-sm sm:text-base text-[#4A5568] mt-1 font-medium">
              {t.heroLocationSummary}
            </p>
          </div>

          {/* Badges de Cierre de Aeropuertos y Puertos */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-[#B84A45]/10 border border-[#B84A45]/30 text-[#B84A45] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <PlaneTakeoff className="w-4 h-4 shrink-0" />
              <span>{t.airportsClosedBadge}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#B84A45]/10 border border-[#B84A45]/30 text-[#B84A45] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <Anchor className="w-4 h-4 shrink-0" />
              <span>{t.portsClosedBadge}</span>
            </div>
          </div>
        </div>

        {/* 3. Métricas Visuales Clave (Grandes y Digeribles) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Vientos y Rachas */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.maxWinds}</span>
              <Wind className="w-4 h-4 text-[#B84A45]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#B84A45] font-tabular mt-1">
              {windKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5">
              {t.gusts} <span className="text-[#B84A45] font-bold">{gustsKmh} km/h</span>
            </div>
          </div>

          {/* Card 2: Presión Central */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.centralPressure}</span>
              <Gauge className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {pressure} <span className="text-sm font-normal text-[#687078]">hPa</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5">
              {t.pressureExtreme}
            </div>
          </div>

          {/* Card 3: Rumbo y Velocidad */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.headingSpeed}</span>
              <Compass className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#245A66] font-tabular mt-1">
              {speedKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5 truncate">
              {language === 'en' ? 'NNW (335°)' : heading}
            </div>
          </div>

          {/* Card 4: Coordenadas del Ojo */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">{t.cycloneCenter}</span>
              <Navigation className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {eyeLat.toFixed(1)}°N, {Math.abs(eyeLng).toFixed(1)}°{language === 'en' ? 'W' : 'O'}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5">
              {t.pacificCoast}
            </div>
          </div>
        </div>

        {/* 4. Notificación para la ubicación del usuario si está activa */}
        {userCoords && userDistanceToEyeKm !== null && (
          <div className="bg-[#245A66]/8 border border-[#245A66]/25 rounded-[4px] p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#245A66] shrink-0" />
              <span className="text-[#252A2E]">
                {t.yourLocation} ({activeLocationLabel || (language === 'en' ? 'detected' : 'detectada')}):{' '}
                <strong className="text-[#245A66] font-bold font-tabular">
                  {formatDistance(userDistanceToEyeKm)}
                </strong>{' '}
                {t.fromEye}
              </span>
            </div>
            {onScrollToShelters && (
              <button
                onClick={onScrollToShelters}
                className="text-[#245A66] hover:underline font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
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
