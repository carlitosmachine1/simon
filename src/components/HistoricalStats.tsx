import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Wind,
  Gauge,
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  PACIFIC_SEASON_CYCLONES,
  SIMON_LIFECYCLE_TIMELINE,
  SeasonCycloneItem,
} from '../data/seasonHistoricalData';

type MetricType = 'wind' | 'pressure';
type ScopeType = 'season' | 'lifecycle';

// Colores según intensidad de categoría Saffir-Simpson
const getCategoryColor = (catNum: number) => {
  switch (catNum) {
    case 5:
      return '#881337'; // Rose 900 / Púrpura profundo Cat 5
    case 4:
      return '#B84A45'; // Rojo alerta Cat 4
    case 3:
      return '#D97706'; // Ámbar intenso Cat 3
    case 2:
      return '#EAB308'; // Amarillo Cat 2
    case 1:
      return '#245A66'; // Teal Cat 1
    default:
      return '#0284C7'; // Azul celeste Tormenta Tropical
  }
};

export const HistoricalStats: React.FC = () => {
  const { t, language } = useLanguage();
  const [metric, setMetric] = useState<MetricType>('wind');
  const [scope, setScope] = useState<ScopeType>('season');
  const [selectedCycloneId, setSelectedCycloneId] = useState<string | null>(null);

  // KPIs de la temporada
  const totalNamed = PACIFIC_SEASON_CYCLONES.length;
  const majorCount = PACIFIC_SEASON_CYCLONES.filter((c) => c.categoryNum >= 3).length;

  const peakWindCyclone = useMemo(() => {
    return [...PACIFIC_SEASON_CYCLONES].sort((a, b) => b.maxWindKmh - a.maxWindKmh)[0];
  }, []);

  const lowestPressureCyclone = useMemo(() => {
    return [...PACIFIC_SEASON_CYCLONES].sort((a, b) => a.minPressureHpa - b.minPressureHpa)[0];
  }, []);

  // Formato para la gráfica de temporada
  const seasonChartData = useMemo(() => {
    return PACIFIC_SEASON_CYCLONES.map((item) => ({
      ...item,
      chartLabel: item.name,
      windValue: item.maxWindKmh,
      pressureValue: item.minPressureHpa,
      color: getCategoryColor(item.categoryNum),
    }));
  }, []);

  // Formato para la gráfica de ciclo de vida de Simón
  const lifecycleChartData = useMemo(() => {
    return SIMON_LIFECYCLE_TIMELINE.map((point) => ({
      ...point,
      label: language === 'en' ? point.timeLabelEn : point.timeLabel,
      windValue: point.windKmh,
      pressureValue: point.pressureHpa,
      stageLabel: language === 'en' ? point.stageEn : point.stage,
      color: getCategoryColor(point.categoryNum),
    }));
  }, [language]);

  // Tooltip personalizado para la temporada
  const CustomSeasonTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: SeasonCycloneItem = payload[0].payload;
    const isEn = language === 'en';

    return (
      <div className="bg-[#1C2024] text-white p-3 rounded-[6px] shadow-lg border border-[#3E454D] text-xs space-y-1.5 max-w-[240px]">
        <div className="flex items-center justify-between gap-2 border-b border-[#3E454D] pb-1.5">
          <span className="font-bold text-sm tracking-wide text-white">
            {data.name}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white font-tabular"
            style={{ backgroundColor: getCategoryColor(data.categoryNum) }}
          >
            {isEn ? data.categoryLabelEn : data.categoryLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5 font-tabular">
          <div>
            <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">
              {isEn ? 'Max Wind' : 'Viento Máx.'}
            </span>
            <span className="font-bold text-amber-300 text-sm">
              {data.maxWindKmh} km/h
            </span>
            <span className="text-[#9CA3AF] text-[10px] block">
              ({data.maxWindMph} mph)
            </span>
          </div>

          <div>
            <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">
              {isEn ? 'Min Pressure' : 'Presión Mín.'}
            </span>
            <span className="font-bold text-sky-300 text-sm">
              {data.minPressureHpa} hPa
            </span>
            <span className="text-[#9CA3AF] text-[10px] block">
              {isEn ? 'Deep low' : 'Mín. central'}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#D1D5DB] pt-1 border-t border-[#3E454D]/80 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#9CA3AF]" />
          <span>{isEn ? data.datesEn : data.dates}</span>
        </div>

        {data.landfall && (
          <div className="bg-amber-900/50 border border-amber-600/50 text-amber-200 px-2 py-1 rounded text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{isEn ? data.landfallDetailsEn : data.landfallDetails}</span>
          </div>
        )}
      </div>
    );
  };

  // Tooltip personalizado para el ciclo de vida
  const CustomLifecycleTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0].payload;
    const isEn = language === 'en';

    return (
      <div className="bg-[#1C2024] text-white p-3 rounded-[6px] shadow-lg border border-[#3E454D] text-xs space-y-1.5 max-w-[220px]">
        <div className="flex items-center justify-between border-b border-[#3E454D] pb-1">
          <span className="font-bold text-white text-xs">{pt.label}</span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
            style={{ backgroundColor: getCategoryColor(pt.categoryNum) }}
          >
            {pt.stageLabel}
          </span>
        </div>
        <div className="space-y-1 font-tabular">
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF]">{isEn ? 'Wind:' : 'Viento:'}</span>
            <span className="font-bold text-amber-300">{pt.windKmh} km/h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF]">{isEn ? 'Pressure:' : 'Presión:'}</span>
            <span className="font-bold text-sky-300">{pt.pressureHpa} hPa</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="estadisticas" className="space-y-4">
      {/* 1. Encabezado de la Sección */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 stroke-[2]" />
              <span>{t.statsBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-0.5">
              {t.statsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#687078] mt-1 max-w-3xl">
              {t.statsSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F7F7F4] border border-[#DDE1DF] p-1 rounded-[6px]">
            <button
              onClick={() => setScope('season')}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                scope === 'season'
                  ? 'bg-[#245A66] text-white shadow-xs'
                  : 'text-[#687078] hover:text-[#252A2E]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.statsScopeSeason}</span>
            </button>
            <button
              onClick={() => setScope('lifecycle')}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                scope === 'lifecycle'
                  ? 'bg-[#245A66] text-white shadow-xs'
                  : 'text-[#687078] hover:text-[#252A2E]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.statsScopeLifecycle}</span>
            </button>
          </div>
        </div>

        {/* 2. Tarjetas de Resumen KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3">
            <span className="text-[11px] font-semibold text-[#687078] uppercase block">
              {t.statsTotalNamed}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#252A2E] font-tabular">
                {totalNamed}
              </span>
              <span className="text-xs text-[#245A66] font-semibold">
                {language === 'en' ? 'cyclones' : 'ciclones'}
              </span>
            </div>
            <span className="text-[11px] text-[#687078] block mt-0.5">
              {language === 'en' ? 'Season 2026' : 'Temporada 2026'}
            </span>
          </div>

          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3">
            <span className="text-[11px] font-semibold text-[#687078] uppercase block">
              {t.statsMajorHurricanes}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#B84A45] font-tabular">
                {majorCount}
              </span>
              <span className="text-xs text-[#B84A45] font-semibold">
                (27%)
              </span>
            </div>
            <span className="text-[11px] text-[#687078] block mt-0.5">
              Gilma, John, Kristy, Simón
            </span>
          </div>

          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3">
            <span className="text-[11px] font-semibold text-[#687078] uppercase block">
              {t.statsPeakWind}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D97706] font-tabular">
                {peakWindCyclone.maxWindKmh}
              </span>
              <span className="text-xs font-bold text-[#687078]">km/h</span>
            </div>
            <span className="text-[11px] text-[#687078] block mt-0.5 truncate">
              {peakWindCyclone.name} ({language === 'en' ? 'Cat 5' : 'Cat 5'})
            </span>
          </div>

          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3">
            <span className="text-[11px] font-semibold text-[#687078] uppercase block">
              {t.statsMinPressure}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0284C7] font-tabular">
                {lowestPressureCyclone.minPressureHpa}
              </span>
              <span className="text-xs font-bold text-[#687078]">hPa</span>
            </div>
            <span className="text-[11px] text-[#687078] block mt-0.5 truncate">
              {lowestPressureCyclone.name} ({lowestPressureCyclone.dates})
            </span>
          </div>
        </div>

        {/* 3. Selector de Métrica: Viento vs Presión */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-[#F7F7F4] border border-[#DDE1DF] p-2.5 rounded-[6px]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#252A2E]">
              {language === 'en' ? 'Metric:' : 'Métrica:'}
            </span>
            <div className="inline-flex rounded-[4px] p-0.5 bg-[#FFFFFF] border border-[#DDE1DF]">
              <button
                onClick={() => setMetric('wind')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold transition cursor-pointer ${
                  metric === 'wind'
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-[#687078] hover:text-[#252A2E]'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{t.statsMetricWind}</span>
              </button>
              <button
                onClick={() => setMetric('pressure')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold transition cursor-pointer ${
                  metric === 'pressure'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-[#687078] hover:text-[#252A2E]'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{t.statsMetricPressure}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-[#687078] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#245A66] shrink-0" />
            <span>
              {metric === 'wind'
                ? language === 'en'
                  ? 'Higher bar = more severe sustained wind speed'
                  : 'Mayor altura = mayor velocidad de viento sostenido'
                : language === 'en'
                  ? 'Lower pressure = more intense and deep hurricane center'
                  : 'Menor presión = ojo del ciclón más profundo e intenso'}
            </span>
          </div>
        </div>

        {/* 4. Contenedor de la Gráfica Recharts */}
        <div className="mt-4 pt-2">
          <div className="h-72 sm:h-84 w-full">
            {scope === 'season' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={seasonChartData}
                  margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="chartLabel"
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis
                    tick={{ fill: '#4B5563', fontSize: 11 }}
                    domain={
                      metric === 'wind'
                        ? [0, 280]
                        : [910, 1015]
                    }
                    unit={metric === 'wind' ? ' km/h' : ' hPa'}
                  />
                  <Tooltip content={<CustomSeasonTooltip />} />

                  {/* Líneas de referencia para categorías Saffir-Simpson en vientos */}
                  {metric === 'wind' && (
                    <>
                      <ReferenceLine
                        y={119}
                        stroke="#245A66"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Cat 1 (119)',
                          fill: '#245A66',
                          fontSize: 10,
                          position: 'right',
                        }}
                      />
                      <ReferenceLine
                        y={178}
                        stroke="#D97706"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Cat 3 (178)',
                          fill: '#D97706',
                          fontSize: 10,
                          position: 'right',
                        }}
                      />
                      <ReferenceLine
                        y={252}
                        stroke="#881337"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Cat 5 (252)',
                          fill: '#881337',
                          fontSize: 10,
                          position: 'right',
                        }}
                      />
                    </>
                  )}

                  {/* Línea de referencia para presión normal */}
                  {metric === 'pressure' && (
                    <>
                      <ReferenceLine
                        y={1013}
                        stroke="#687078"
                        strokeDasharray="3 3"
                        label={{
                          value: language === 'en' ? 'Normal (1013)' : 'Presión Normal (1013)',
                          fill: '#687078',
                          fontSize: 10,
                          position: 'insideTopRight',
                        }}
                      />
                      <ReferenceLine
                        y={950}
                        stroke="#B84A45"
                        strokeDasharray="4 4"
                        label={{
                          value: language === 'en' ? 'Intense (<950)' : 'Severo (<950)',
                          fill: '#B84A45',
                          fontSize: 10,
                          position: 'insideBottomRight',
                        }}
                      />
                    </>
                  )}

                  <Bar
                    dataKey={metric === 'wind' ? 'windValue' : 'pressureValue'}
                    radius={[4, 4, 0, 0]}
                    animationDuration={600}
                  >
                    {seasonChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={
                          metric === 'wind'
                            ? entry.color
                            : entry.pressureValue < 950
                              ? '#B84A45'
                              : entry.pressureValue < 980
                                ? '#D97706'
                                : '#0284C7'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              /* Gráfica de Línea/Área: Evolución de Simón */
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={lifecycleChartData}
                  margin={{ top: 20, right: 15, left: -10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 600 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis
                    tick={{ fill: '#4B5563', fontSize: 11 }}
                    domain={metric === 'wind' ? [40, 270] : [920, 1015]}
                    unit={metric === 'wind' ? ' km/h' : ' hPa'}
                  />
                  <Tooltip content={<CustomLifecycleTooltip />} />

                  {metric === 'wind' && (
                    <>
                      <ReferenceLine
                        y={250}
                        stroke="#B84A45"
                        strokeDasharray="4 4"
                        label={{
                          value: language === 'en' ? 'Peak Simón (250 km/h)' : 'Pico Simón (250 km/h)',
                          fill: '#B84A45',
                          fontSize: 10,
                          position: 'top',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="windValue"
                        stroke="#D97706"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorWind)"
                      />
                    </>
                  )}

                  {metric === 'pressure' && (
                    <>
                      <ReferenceLine
                        y={930}
                        stroke="#0284C7"
                        strokeDasharray="4 4"
                        label={{
                          value: language === 'en' ? 'Record Low (930 hPa)' : 'Mínimo Simón (930 hPa)',
                          fill: '#0284C7',
                          fontSize: 10,
                          position: 'bottom',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pressureValue"
                        stroke="#0284C7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorPressure)"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 5. Leyenda de Categorías Saffir-Simpson */}
        <div className="mt-4 pt-3 border-t border-[#DDE1DF] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#252A2E]">
            {t.statsCategoryThresholds}:
          </span>
          <div className="flex flex-wrap items-center gap-2 font-tabular">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              TT (63-118 km/h)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
              <span className="w-2 h-2 rounded-full bg-[#245A66]" />
              Cat 1 (119-153)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              Cat 2 (154-177)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              Cat 3 (178-208)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
              <span className="w-2 h-2 rounded-full bg-[#B84A45]" />
              Cat 4 (209-251)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#881337]" />
              Cat 5 (≥252)
            </span>
          </div>
        </div>
      </div>

      {/* 6. Tabla Desplegable de Datos Históricos */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-[#DDE1DF] bg-[#F7F7F4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#245A66]" />
            <h3 className="font-bold text-[#252A2E] text-sm sm:text-base">
              {t.statsTableTitle}
            </h3>
          </div>
          <span className="text-xs text-[#687078] font-bold">
            15 {language === 'en' ? 'recorded storms' : 'sistemas registrados'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFFFFF] text-[#687078] border-b border-[#DDE1DF] text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">{t.statsTableSystem}</th>
                <th className="px-4 py-3">{t.statsTableCategory}</th>
                <th className="px-4 py-3">{t.statsTablePeakWind}</th>
                <th className="px-4 py-3">{t.statsTableMinPressure}</th>
                <th className="px-4 py-3">{t.statsTableDates}</th>
                <th className="px-4 py-3 text-right">{t.statsTableStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE1DF] font-tabular">
              {PACIFIC_SEASON_CYCLONES.map((cyclone) => {
                const isSelected = selectedCycloneId === cyclone.id;
                const isEn = language === 'en';
                const catColor = getCategoryColor(cyclone.categoryNum);

                return (
                  <tr
                    key={cyclone.id}
                    onClick={() =>
                      setSelectedCycloneId(isSelected ? null : cyclone.id)
                    }
                    className={`hover:bg-[#F7F7F4] transition cursor-pointer ${
                      isSelected ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-bold text-[#252A2E] flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: catColor }}
                      />
                      <span>{cyclone.name}</span>
                      {cyclone.landfall && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-1.5 py-0.2 rounded font-semibold ml-1">
                          {isEn ? 'Landfall' : 'Impacto'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: catColor }}
                      >
                        {isEn ? cyclone.categoryLabelEn : cyclone.categoryLabel}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-[#252A2E]">
                      {cyclone.maxWindKmh} km/h{' '}
                      <span className="text-[#687078] text-xs font-normal">
                        ({cyclone.maxWindMph} mph)
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-[#252A2E]">
                      {cyclone.minPressureHpa} hPa
                    </td>
                    <td className="px-4 py-2.5 text-[#687078]">
                      {isEn ? cyclone.datesEn : cyclone.dates}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          cyclone.status === 'Activo'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : cyclone.status === 'En degradación'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isEn ? cyclone.statusEn : cyclone.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
