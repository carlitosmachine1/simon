import React, { useState } from 'react';
import {
  HURRICANE_CURRENT_STATUS,
  INFRASTRUCTURE_STATUS,
} from '../data/hurricaneData';
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
  Navigation,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const StatusOverview: React.FC = () => {
  const [activeInfraFilter, setActiveInfraFilter] = useState<'todos' | 'puerto' | 'carretera' | 'rio' | 'aeropuerto'>('todos');

  const filteredInfra = INFRASTRUCTURE_STATUS.filter((item) => {
    if (activeInfraFilter === 'todos') return true;
    return item.type === activeInfraFilter;
  });

  return (
    <section className="space-y-4">
      {/* Informative Meteorological Overview Header (Calm, authoritative, professional) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-200 border border-sky-500/40">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Monitoreo Ciclónico Activo
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                Cuenca Pacífico Nororiental
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {HURRICANE_CURRENT_STATUS.lastUpdate}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Huracán Simón
              </h1>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-600 text-amber-300 font-bold text-sm">
                Categoría 4 (Escala Saffir-Simpson)
              </span>
            </div>

            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              El sistema se desplaza lentamente con rumbo norte de forma paralela a las costas de Colima y Jalisco.
              Presenta vientos sostenidos de <strong className="text-white font-semibold">240 km/h</strong> y rachas de{' '}
              <strong className="text-white font-semibold">295 km/h</strong>. Se pronostican precipitaciones significativas y
              oleaje elevado de 6 a 8 metros en el litoral centro del Pacífico.
            </p>
          </div>

          {/* Calm Position Reference Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left sm:text-right shrink-0 w-full lg:w-auto">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Ubicación Referencial
            </div>
            <div className="text-xl font-bold text-white mt-0.5">95 km al SO de Manzanillo</div>
            <div className="text-xs text-slate-300">190 km al Sur de Puerto Vallarta</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Coordenadas: {HURRICANE_CURRENT_STATUS.coordinatesText}
            </div>
          </div>
        </div>

        {/* Civil Protection Advisories Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Suspensión Preventiva de Clases:</strong> Decretada en 22 municipios costeros y serranos de Jalisco, y en todos los niveles educativos en Colima y Nayarit.
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <Building2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Medidas en Zona Costera:</strong> Restricción de actividades turísticas y marítimas en playas. Evacuación preventiva hacia albergues en zonas bajas.
            </div>
          </div>
        </div>
      </div>

      {/* Meteorological Parameters Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Vientos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Vientos Máx.</span>
            <Wind className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{HURRICANE_CURRENT_STATUS.windSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span></div>
            <div className="text-[11px] text-amber-300 font-medium">Rachas: {HURRICANE_CURRENT_STATUS.windGustsKmh} km/h</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">150 mph sostenidos</div>
        </div>

        {/* Metric 2: Presión Central */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Presión Min.</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{HURRICANE_CURRENT_STATUS.pressureHpa} <span className="text-xs font-normal text-slate-400">hPa</span></div>
            <div className="text-[11px] text-slate-300">27.82 inHg</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Ojo bien estructurado</div>
        </div>

        {/* Metric 3: Desplazamiento */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Desplazamiento</span>
            <Compass className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">{HURRICANE_CURRENT_STATUS.movementSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span></div>
            <div className="text-[11px] text-teal-300">Rumbo Norte (355°)</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Velocidad constante</div>
        </div>

        {/* Metric 4: Oleaje */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Oleaje Previsto</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">6.0 a 8.0 <span className="text-xs font-normal text-slate-400">m</span></div>
            <div className="text-[11px] text-cyan-300 font-medium">Marea de tormenta</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Puertos en restricción</div>
        </div>

        {/* Metric 5: Lluvias */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lluvia Acum.</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">250 - 450 <span className="text-xs font-normal text-slate-400">mm</span></div>
            <div className="text-[11px] text-blue-300">Puntuales 650 mm</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Monitoreo de cuencas</div>
        </div>

        {/* Metric 6: Distancia */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Sector Costero</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-white">Colima / Jalisco</div>
            <div className="text-[11px] text-emerald-300">Borde costero</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Vigilancia SMN/NOAA</div>
        </div>
      </div>

      {/* Institutional SIAT-CT Alert System */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT)
          </h2>
          <span className="text-[11px] text-slate-400">Coordinación Nacional de Protección Civil</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {HURRICANE_CURRENT_STATUS.siatCtAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border ${alert.badgeBg} transition`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide">
                  {alert.level}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: alert.color }}
                />
              </div>
              <p className="text-xs text-white font-semibold mb-1 leading-snug">{alert.zones}</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">{alert.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REAL INFRASTRUCTURE STATUS (Ports, Roads, Rivers, Airports) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Anchor className="w-4 h-4 text-sky-400" />
              Estado de Puertos, Carreteras, Ríos y Aeropuertos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Información oficial reportada por Capitanías de Puerto, SEMAR, Guardia Nacional y CONAGUA.
            </p>
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(['todos', 'puerto', 'carretera', 'rio', 'aeropuerto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveInfraFilter(t)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                  activeInfraFilter === t
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between text-xs space-y-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{item.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Cerrado / Restringido'
                        ? 'bg-amber-950 text-amber-200 border border-amber-500/40'
                        : item.status === 'Precaución'
                        ? 'bg-orange-950 text-orange-200 border border-orange-500/40'
                        : 'bg-sky-950 text-sky-200 border border-sky-500/40'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{item.details}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.state}</span>
                <span className="font-medium text-slate-400">{item.authority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
