import React, { useState } from 'react';
import {
  HURRICANE_CURRENT_STATUS,
  INFRASTRUCTURE_STATUS,
} from '../data/hurricaneData';
import { DynamicHurricaneStatus } from '../utils/hurricaneTracking';
import {
  Wind,
  Compass,
  Gauge,
  Waves,
  CloudRain,
  MapPin,
  Clock,
  Radio,
  Building2,
  GraduationCap,
  Anchor,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface StatusOverviewProps {
  dynamicStatus?: DynamicHurricaneStatus;
  hasActiveCyclone?: boolean;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  dynamicStatus,
  hasActiveCyclone = true,
}) => {
  const [activeInfraFilter, setActiveInfraFilter] = useState<'todos' | 'puerto' | 'carretera' | 'rio' | 'aeropuerto'>('todos');

  const status = dynamicStatus || {
    ...HURRICANE_CURRENT_STATUS,
    timeText: '05:45',
  };

  const filteredInfra = INFRASTRUCTURE_STATUS.filter((item) => {
    if (activeInfraFilter === 'todos') return true;
    return item.type === activeInfraFilter;
  });

  return (
    <section id="resumen" className="space-y-4">
      {/* Nivel 1 — Panel Principal: Datos Meteorológicos Clave */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 sm:p-6 shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#DDE1DF]">
          {/* Main Meteorological Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#245A66] uppercase tracking-wider">
                {hasActiveCyclone
                  ? 'Ciclón Tropical Activo • Pacífico Nororiental'
                  : 'Vigilancia Continua • Océano Pacífico Mexicano'}
              </span>
              <span className="text-[#DDE1DF]">|</span>
              <span className="text-[11px] text-[#245A66] font-semibold bg-[#245A66]/8 px-2 py-0.5 rounded-[3px] font-tabular">
                {status.lastUpdate}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#252A2E] tracking-tight">
                {hasActiveCyclone ? (status.name || 'Ciclón Tropical') : 'Monitor Pacífico'}
              </h1>
              {hasActiveCyclone ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-[3px] bg-amber-500/10 text-amber-800 border border-amber-500/30">
                  Categoría {status.category} (Saffir-Simpson)
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-[3px] bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
                  Alerta Verde (Sin Ciclón Activo)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#687078] max-w-2xl leading-relaxed">
              {hasActiveCyclone
                ? `Ojo ciclónico estructurado ${status.distanceReference.toLowerCase()}, desplazándose ${status.movement.toLowerCase()} a ${status.movementSpeedKmh} km/h. Se registran vientos de ${status.windSpeedKmh} km/h (rachas de ${status.windGustsKmh} km/h) y oleaje de ${status.waveHeightMeters}.`
                : 'Sin ciclones tropicales activos ni perturbaciones con amenaza directa en el litoral de Colima, Jalisco, Nayarit, Michoacán ni Baja California Sur. Viento de brisa costera y condiciones marítimas bajo vigilancia continua 24/7.'}
            </p>
          </div>

          {/* Featured Primary Number: Viento Máximo Sostenido */}
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-4 lg:text-right shrink-0 min-w-[240px]">
            <div className="text-[11px] font-medium text-[#687078] uppercase tracking-wide">
              {hasActiveCyclone ? 'Viento Máximo Sostenido' : 'Viento Costero Promedio'}
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-[#245A66] font-tabular mt-0.5">
              {hasActiveCyclone ? status.windSpeedKmh : 25}{' '}
              <span className="text-sm font-normal text-[#687078]">km/h</span>
            </div>
            <div className="text-xs text-[#252A2E] font-tabular mt-0.5">
              Rachas de{' '}
              <strong className={`font-semibold ${hasActiveCyclone ? 'text-amber-800' : 'text-[#245A66]'}`}>
                {hasActiveCyclone ? status.windGustsKmh : 35} km/h
              </strong>{' '}
              ({hasActiveCyclone ? status.windSpeedMph : 22} mph)
            </div>
            <div className="text-[11px] text-[#687078] font-tabular mt-1 pt-1.5 border-t border-[#DDE1DF]">
              {hasActiveCyclone ? (
                <>
                  Posición actual: <strong className="text-[#245A66]">{status.coordinatesText}</strong>
                </>
              ) : (
                'Zona: Aguas Nacionales y Costeras del Pacífico'
              )}
            </div>
          </div>
        </div>

        {/* Nivel 2 — Indicadores Meteorológicos Específicos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          {/* Indicador 1: Presión Barométrica */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#687078]">
              <span className="font-medium">Presión Central</span>
              <Gauge className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-[#252A2E] font-tabular">
              {status.pressureHpa} <span className="text-xs font-normal text-[#687078]">hPa</span>
            </div>
            {/* Fine scale indicator */}
            <div className="w-full bg-[#DDE1DF] h-1 rounded-[1px] overflow-hidden">
              <div className="bg-[#245A66] h-1" style={{ width: '92%' }} />
            </div>
            <div className="text-[11px] text-[#687078]">27.55 inHg (presión mínima extrema)</div>
          </div>

          {/* Indicador 2: Desplazamiento */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#687078]">
              <span className="font-medium">Rumbo y Velocidad</span>
              <Compass className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-[#252A2E] font-tabular">
              {status.movementSpeedKmh} <span className="text-xs font-normal text-[#687078]">km/h</span>
            </div>
            <div className="w-full bg-[#DDE1DF] h-1 rounded-[1px] overflow-hidden">
              <div className="bg-[#7D9B8A] h-1" style={{ width: '35%' }} />
            </div>
            <div className="text-[11px] text-[#687078]">{status.movement} (6 mph)</div>
          </div>

          {/* Indicador 3: Oleaje */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#687078]">
              <span className="font-medium">Oleaje Costero</span>
              <Waves className="w-3.5 h-3.5 text-[#A66C19] stroke-[1.75]" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-[#252A2E] font-tabular">
              {status.waveHeightMeters}
            </div>
            <div className="w-full bg-[#DDE1DF] h-1 rounded-[1px] overflow-hidden">
              <div className="bg-[#A66C19] h-1" style={{ width: '90%' }} />
            </div>
            <div className="text-[11px] text-[#687078]">Marea de tormenta peligrosa de 4 a 6 m</div>
          </div>

          {/* Indicador 4: Precipitación acumulada */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#687078]">
              <span className="font-medium">Lluvia Acumulada</span>
              <CloudRain className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-[#252A2E] font-tabular">
              250 – 500 <span className="text-xs font-normal text-[#687078]">mm</span>
            </div>
            <div className="w-full bg-[#DDE1DF] h-1 rounded-[1px] overflow-hidden">
              <div className="bg-[#245A66] h-1" style={{ width: '85%' }} />
            </div>
            <div className="text-[11px] text-[#687078]">Puntuales extraordinarias hasta 650 mm</div>
          </div>
        </div>
      </div>

      {/* Nivel 3 — Panel de Niveles de Alerta Oficial SIAT-CT */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-3">
        <div className="flex items-center justify-between border-b border-[#DDE1DF] pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#245A66] stroke-[1.75]" />
            <h2 className="text-sm font-semibold text-[#252A2E]">
              Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT)
            </h2>
          </div>
          <span className="text-[11px] text-[#687078] hidden sm:inline">
            Coordinación Nacional de Protección Civil
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {HURRICANE_CURRENT_STATUS.siatCtAlerts.map((alert, idx) => {
            const isRed = alert.color === '#b91c1c';
            const isOrange = alert.color === '#c2410c';
            const isYellow = alert.color === '#b45309';

            return (
              <div
                key={idx}
                className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      alert.color === '#d97706' || alert.color === '#b91c1c'
                        ? 'text-amber-800'
                        : isOrange || alert.color === '#ea580c'
                        ? 'text-[#C2410C]'
                        : isYellow || alert.color === '#ca8a04'
                        ? 'text-[#A66C19]'
                        : 'text-[#3F8063]'
                    }`}
                  >
                    {alert.level}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{ backgroundColor: alert.color }}
                  />
                </div>
                <p className="text-xs text-[#252A2E] font-medium leading-snug">
                  {alert.zones}
                </p>
                <p className="text-[11px] text-[#687078] leading-relaxed">
                  {alert.action}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nivel 3 — Panel de Monitoreo de Infraestructura Operativa */}
      <div id="infraestructura" className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#252A2E] flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#245A66] stroke-[1.75]" />
              Monitoreo Operativo de Puertos, Carreteras, Ríos y Aeropuertos
            </h3>
            <p className="text-xs text-[#687078] mt-0.5">
              Reportes verificados de Capitanías de Puerto, SEMAR, Guardia Nacional y CONAGUA.
            </p>
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {(['todos', 'puerto', 'carretera', 'rio', 'aeropuerto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveInfraFilter(t)}
                className={`px-2.5 py-1 rounded-[4px] capitalize text-xs font-medium transition ${
                  activeInfraFilter === t
                    ? 'bg-[#245A66] text-white'
                    : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
                }`}
              >
                {t === 'todos' ? 'Todos' : t + 's'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {filteredInfra.map((item) => (
            <div
              key={item.id}
              className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3.5 flex flex-col justify-between text-xs space-y-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-[#252A2E] text-xs sm:text-sm">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-[3px] border ${
                      item.status === 'Cerrado / Restringido'
                        ? 'bg-amber-500/15 text-amber-900 border-amber-500/30'
                        : item.status === 'Precaución'
                        ? 'bg-[#A66C19]/10 text-[#A66C19] border-[#A66C19]/20'
                        : 'bg-[#245A66]/10 text-[#245A66] border-[#245A66]/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[#687078] text-xs leading-relaxed">{item.details}</p>
              </div>

              <div className="pt-2 border-t border-[#DDE1DF] flex items-center justify-between text-[11px] text-[#687078]">
                <span>{item.state}</span>
                <span className="font-medium text-[#252A2E]">{item.authority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
