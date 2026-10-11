import React, { useState, useEffect, useMemo } from 'react';
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
  onScrollToMap,
  onScrollToShelters,
  lastUpdated = new Date(),
  onRefreshNow,
  isRefreshing = false,
  dynamicStatus,
}) => {
  const eyeLat = dynamicStatus ? dynamicStatus.lat : 18.9;
  const eyeLng = dynamicStatus ? dynamicStatus.lng : -105.2;
  const speedKmh = dynamicStatus ? dynamicStatus.movementSpeedKmh : 9;
  const heading = dynamicStatus ? dynamicStatus.movement : 'Nor-Noroeste (335°)';
  const windKmh = dynamicStatus ? dynamicStatus.windSpeedKmh : 240;
  const gustsKmh = dynamicStatus ? dynamicStatus.windGustsKmh : 290;
  const pressure = dynamicStatus ? dynamicStatus.pressureHpa : 933;

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
            AVISO OFICIAL EN VIVO • NHC ADVISORY #16A & SMN CONAGUA
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-tabular ml-auto">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Monitoreo Activo</span>
          </span>
          <button
            onClick={() => onRefreshNow && onRefreshNow()}
            disabled={isRefreshing}
            className="bg-white hover:bg-[#F7F7F4] text-[#245A66] border border-[#DDE1DF] px-2.5 py-1 rounded-[3px] font-medium transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Recalcular métricas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* 2. Resumen Directo y Datos Críticos de Transporte */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F7F7F4] border border-[#DDE1DF] p-4 sm:p-5 rounded-[6px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-bold text-[#245A66] uppercase tracking-wide">
                Ciclón Tropical de Gran Intensidad
              </span>
              <span className="bg-[#B84A45] text-white font-bold text-xs px-2 py-0.5 rounded-[3px]">
                Categoría 4 (Saffir-Simpson)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252A2E] tracking-tight">
              Huracán Simón
            </h1>
            <p className="text-sm sm:text-base text-[#4A5568] mt-1 font-medium">
              Ubicado a 95 km al oeste de Manzanillo y 175 km al sur-sureste de Cabo Corrientes (~215 km de Pto. Vallarta). Desplazamiento mar adentro frente al litoral.
            </p>
          </div>

          {/* Badges de Cierre de Aeropuertos y Puertos */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-[#B84A45]/10 border border-[#B84A45]/30 text-[#B84A45] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <PlaneTakeoff className="w-4 h-4 shrink-0" />
              <span>Aeropuertos PVR y ZLO: CERRADOS</span>
            </div>
            <div className="flex items-center gap-2 bg-[#B84A45]/10 border border-[#B84A45]/30 text-[#B84A45] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-[4px]">
              <Anchor className="w-4 h-4 shrink-0" />
              <span>Puertos de Manzanillo y Vallarta: CERRADOS</span>
            </div>
          </div>
        </div>

        {/* 3. Métricas Visuales Clave (Grandes y Digeribles) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Vientos y Rachas */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">Vientos Máximos</span>
              <Wind className="w-4 h-4 text-[#B84A45]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#B84A45] font-tabular mt-1">
              {windKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5">
              Rachas: <span className="text-[#B84A45] font-bold">{gustsKmh} km/h</span>
            </div>
          </div>

          {/* Card 2: Presión Central */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">Presión Central</span>
              <Gauge className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {pressure} <span className="text-sm font-normal text-[#687078]">hPa</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5">
              Presión mínima extrema
            </div>
          </div>

          {/* Card 3: Rumbo y Velocidad */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">Avance y Rumbo</span>
              <Compass className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#245A66] font-tabular mt-1">
              {speedKmh} <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#252A2E] mt-0.5 truncate">
              {heading}
            </div>
          </div>

          {/* Card 4: Coordenadas del Ojo */}
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[6px] p-3.5 sm:p-4 transition">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#687078]">
              <span className="font-semibold">Centro del Ciclón</span>
              <Navigation className="w-4 h-4 text-[#245A66]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#252A2E] font-tabular mt-1">
              {eyeLat.toFixed(1)}°N, {Math.abs(eyeLng).toFixed(1)}°O
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#687078] mt-0.5">
              Pacífico Mexicano
            </div>
          </div>
        </div>

        {/* 4. Notificación para la ubicación del usuario si está activa */}
        {userCoords && userDistanceToEyeKm !== null && (
          <div className="bg-[#245A66]/8 border border-[#245A66]/25 rounded-[4px] p-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#245A66] shrink-0" />
              <span className="text-[#252A2E]">
                Tu ubicación ({activeLocationLabel || 'detectada'}): A{' '}
                <strong className="text-[#245A66] font-bold font-tabular">
                  {formatDistance(userDistanceToEyeKm)}
                </strong>{' '}
                del ojo del huracán.
              </span>
            </div>
            {onScrollToShelters && (
              <button
                onClick={onScrollToShelters}
                className="text-[#245A66] hover:underline font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Ver refugios cercanos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
