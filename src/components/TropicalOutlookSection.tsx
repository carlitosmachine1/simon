import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Radio,
  Eye,
  Info,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TropicalOutlookSectionProps {
  externalRefreshTrigger?: number;
}

export const TropicalOutlookSection: React.FC<TropicalOutlookSectionProps> = ({
  externalRefreshTrigger,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const NOAA_OUTLOOK_BASE_URL =
    'https://www.nhc.noaa.gov/xgtwo/resize/xgtwo_pac_7d0_w1024.png';
  const NOAA_EPAC_PORTAL = 'https://www.nhc.noaa.gov/?epac';

  const [cacheBuster, setCacheBuster] = useState<number>(() => Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(() => new Date());

  const imageUrl = `${NOAA_OUTLOOK_BASE_URL}?t=${cacheBuster}`;

  useEffect(() => {
    if (externalRefreshTrigger) {
      handleRefresh();
    }
  }, [externalRefreshTrigger]);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setCacheBuster(Date.now());
    setLastRefreshedAt(new Date());
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <section id="perspectiva-tropical" className="space-y-3">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] overflow-hidden shadow-none">
        {/* Cabecera Editorial Concisa */}
        <div className="p-4 sm:p-5 border-b border-[#DDE1DF] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-bold text-xs sm:text-sm uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#245A66] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#245A66]"></span>
              </span>
              <span>
                {isEn
                  ? '7-DAY TROPICAL OUTLOOK • NOAA NHC'
                  : 'PERSPECTIVA TROPICAL A 7 DÍAS • NOAA NHC'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              {isEn
                ? 'Eastern Pacific 7-Day Graphical Tropical Weather Outlook'
                : 'Pronóstico Gráfico de Ciclones y Perturbaciones (Pacífico Este)'}
            </h2>
            <p className="text-sm sm:text-base text-[#687078] mt-1 max-w-3xl leading-relaxed">
              {isEn
                ? 'Official 7-day tropical outlook issued by the National Hurricane Center (NOAA) delineating active storms, disturbances, and cyclogenesis probability zones across the Eastern Pacific basin.'
                : 'Carta oficial a 7 días emitida por el Centro Nacional de Huracanes (NOAA) que delimita ciclones activos, disturbios y áreas de potencial desarrollo ciclónico en la cuenca del Pacífico Oriental.'}
            </p>
          </div>

          {/* Acciones de la Tarjeta */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-[4px] border border-[#DDE1DF] bg-[#FFFFFF] hover:bg-[#F7F7F4] text-[#252A2E] flex items-center gap-1.5 transition cursor-pointer"
              title={isEn ? 'Enlarge image' : 'Ampliar imagen'}
            >
              <Maximize2 className="w-3.5 h-3.5 stroke-[2]" />
              <span>{isEn ? 'Enlarge' : 'Ampliar'}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-[4px] border border-[#DDE1DF] bg-[#FFFFFF] hover:bg-[#F7F7F4] text-[#245A66] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title={isEn ? 'Refresh graphic' : 'Actualizar gráfico'}
            >
              <RefreshCw className={`w-3.5 h-3.5 stroke-[2] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isEn ? 'Refresh' : 'Actualizar'}</span>
            </button>

            <a
              href={NOAA_EPAC_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-[4px] border border-[#245A66] bg-[#245A66] hover:bg-[#1D4852] text-white flex items-center gap-1.5 transition"
              title={isEn ? 'Open official NHC portal' : 'Abrir portal oficial NHC'}
            >
              <span>{isEn ? 'NOAA Portal' : 'Boletín NHC'}</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
            </a>
          </div>
        </div>

        {/* Marco Principal de la Imagen (Visualizador) */}
        <div
          className="relative bg-[#11161B] min-h-[300px] sm:min-h-[440px] flex items-center justify-center overflow-hidden group cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Indicador de Carga */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#11161B]/85 text-[#DDE1DF] p-4 gap-2">
              <RefreshCw className="w-8 h-8 animate-spin text-[#6DB1BD]" />
              <div className="text-sm font-medium">
                {isEn ? 'Loading NOAA 7-Day Outlook...' : 'Cargando perspectiva gráfica de la NOAA...'}
              </div>
            </div>
          )}

          {/* Mensaje de Error / Fallback */}
          {hasError ? (
            <div className="p-8 text-center text-[#DDE1DF] max-w-md mx-auto space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <div className="text-base font-bold text-white">
                {isEn ? 'Unable to load graphic from NOAA server' : 'No se pudo cargar la imagen del servidor NOAA'}
              </div>
              <p className="text-xs text-[#9EACB4]">
                {isEn
                  ? 'NOAA NHC servers may be updating bulletins. You can view the graphic directly at the official portal.'
                  : 'Los servidores del NHC pueden estar actualizando boletines. Puedes consultar la carta directamente en el portal oficial.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh();
                  }}
                  className="px-3 py-1.5 bg-[#245A66] text-white text-xs font-bold rounded-[4px] flex items-center gap-1.5 hover:bg-[#1D4852] transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Retry' : 'Reintentar'}</span>
                </button>
                <a
                  href={NOAA_OUTLOOK_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-[4px] flex items-center gap-1.5 transition"
                >
                  <span>{isEn ? 'Direct link' : 'Enlace directo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Imagen Oficial del NHC */}
              <img
                src={imageUrl}
                alt={
                  isEn
                    ? 'Eastern Pacific 7-Day Graphical Tropical Weather Outlook (NOAA NHC)'
                    : 'Perspectiva Gráfica de las Condiciones del Tiempo Tropical a 7 Días (NOAA NHC)'
                }
                referrerPolicy="no-referrer"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className={`w-full max-h-[560px] object-contain transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Botón Flotante "Clic para Ampliar" al pasar cursor */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <span className="bg-[#252A2E]/90 text-white text-xs sm:text-sm px-4 py-2 rounded-[4px] font-semibold flex items-center gap-2 shadow-lg backdrop-blur-xs">
                  <Maximize2 className="w-4 h-4" />
                  <span>{isEn ? 'Click to inspect full resolution' : 'Clic para inspeccionar en alta resolución'}</span>
                </span>
              </div>
            </>
          )}

          {/* Badge Informativo Inferior Izquierdo */}
          <div className="absolute bottom-3 left-3 bg-[#1A1E21]/90 backdrop-blur-xs text-white text-[11px] sm:text-xs px-2.5 py-1 rounded-[3px] border border-white/10 flex items-center gap-2 pointer-events-none font-tabular">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>NOAA / National Hurricane Center • Eastern Pacific</span>
          </div>

          {/* Badge de Última Consulta Inferior Derecho */}
          <div className="absolute bottom-3 right-3 bg-[#1A1E21]/90 backdrop-blur-xs text-[#CFE7EA] text-[10px] sm:text-[11px] px-2.5 py-1 rounded-[3px] border border-white/10 font-tabular pointer-events-none hidden xs:flex items-center gap-1">
            <span>{isEn ? 'Sync:' : 'Sincronizado:'}</span>
            <span>{lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hrs</span>
          </div>
        </div>

        {/* Barra de Leyenda Oficial de Probabilidades de Formación Ciclónica */}
        <div className="p-3.5 bg-[#FAFBF9] border-t border-[#DDE1DF] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-medium">
            <span className="text-[#687078] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#245A66]" />
              <span>{isEn ? 'Probabilities (7-Day):' : 'Probabilidades (7 Días):'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#252A2E]">
              <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600/40 inline-block"></span>
              <span>{isEn ? 'Low: < 40%' : 'Baja: < 40%'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#252A2E]">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-700/40 inline-block"></span>
              <span>{isEn ? 'Medium: 40 - 60%' : 'Media: 40 - 60%'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#252A2E]">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-red-800/40 inline-block"></span>
              <span>{isEn ? 'High: > 60%' : 'Alta: > 60%'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#252A2E]">
              <span className="text-base leading-none">🌀</span>
              <span>{isEn ? 'Active Cyclone' : 'Ciclón Tropical Activo'}</span>
            </span>
          </div>

          <div className="text-[11px] text-[#687078] font-tabular">
            {isEn
              ? 'Source: nhc.noaa.gov (Updated 4x Daily at 00, 06, 12, 18 UTC)'
              : 'Fuente: nhc.noaa.gov (Actualización oficial 4 veces al día: 00, 06, 12, 18 UTC)'}
          </div>
        </div>
      </div>

      {/* Modal de Alta Resolución / Fullscreen Lightbox */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#1A1E21] border border-white/20 rounded-[8px] max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Modal */}
            <div className="p-3 sm:p-4 bg-[#252A2E] border-b border-white/10 flex items-center justify-between text-white">
              <div className="min-w-0">
                <div className="text-xs text-[#6DB1BD] font-bold uppercase tracking-wider">
                  {isEn ? 'NOAA NHC 7-DAY OUTLOOK • FULL RESOLUTION' : 'PERSPECTIVA A 7 DÍAS NOAA NHC • ALTA RESOLUCIÓN'}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {isEn
                    ? 'Eastern Pacific Graphical Tropical Weather Outlook'
                    : 'Pronóstico Gráfico de Ciclones y Perturbaciones (Pacífico Este)'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={NOAA_OUTLOOK_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white transition text-xs font-semibold flex items-center gap-1"
                  title={isEn ? 'Open original file' : 'Abrir archivo original'}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">{isEn ? 'Original' : 'Original'}</span>
                </a>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title={isEn ? 'Close (Esc)' : 'Cerrar (Esc)'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Imagen Ampliada */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-[#11161B]">
              <img
                src={imageUrl}
                alt="NOAA 7-Day Graphical Tropical Weather Outlook Full Size"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-[4px]"
              />
            </div>

            {/* Pie del Modal con Leyenda */}
            <div className="p-3 bg-[#252A2E] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9EACB4]">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">● &lt;40% Baja</span>
                <span className="text-orange-400 font-bold">● 40-60% Media</span>
                <span className="text-red-500 font-bold">● &gt;60% Alta</span>
              </div>
              <div>
                {isEn ? 'Press ESC or click outside to close' : 'Presiona ESC o haz clic fuera para cerrar'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
