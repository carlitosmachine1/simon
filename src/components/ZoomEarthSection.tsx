import React, { useState } from 'react';
import {
  Wind,
  Maximize2,
  Minimize2,
  ExternalLink,
  RefreshCw,
  Compass,
  Radio,
} from 'lucide-react';

interface WindyMapSectionProps {
  externalRefreshTrigger?: number;
}

export const ZoomEarthSection: React.FC<WindyMapSectionProps> = ({
  externalRefreshTrigger,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const WINDY_EMBED_URL =
    'https://embed.windy.com/embed2.html?lat=20.278&lon=-105.317&zoom=7&level=surface&overlay=gust&product=icon&type=map&metricWind=default';

  const WINDY_EXTERNAL_URL =
    'https://www.windy.com/?gust,20.278,-105.317,7,i:pressure';

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <section id="mapa-viento-zoom" className="space-y-3">
      {/* Encabezado Conciso y Directo */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#245A66] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#245A66]"></span>
              </span>
              <span>MAPA EN VIVO DE RÁFAGAS DE VIENTO • WINDY (MODELO ICON)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              Visualizador de Viento y Ráfagas en Tiempo Real
            </h2>
            <p className="text-sm sm:text-base text-[#687078] mt-1">
              Simulación meteorológica de ráfagas superficiales frente a las costas de Colima, Jalisco y Nayarit.
            </p>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleReload}
              className="flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border border-[#DDE1DF] text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              title="Recargar mapa interactivo"
            >
              <RefreshCw className="w-4 h-4 text-[#245A66]" />
              <span>Recargar</span>
            </button>
            <a
              href={WINDY_EXTERNAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en Windy</span>
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border border-[#DDE1DF] text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-[#245A66]" />
                  <span>Reducir</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-[#245A66]" />
                  <span>Ampliar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contenedor del Iframe Embebido Oficial de Windy */}
        <div
          className={`mt-4 relative bg-[#1A1E24] rounded-[6px] overflow-hidden border border-[#DDE1DF] transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-4 z-50 shadow-2xl flex flex-col'
              : 'w-full h-[540px] sm:h-[620px]'
          }`}
        >
          {isFullscreen && (
            <div className="bg-[#252A2E] text-white px-4 py-2 flex items-center justify-between border-b border-[#3E454D]">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Wind className="w-4 h-4 text-[#48A9A6]" />
                <span>Windy • Ráfagas de Viento y Modelo ICON</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1 text-xs bg-[#3E454D] hover:bg-[#4E5660] text-white px-2.5 py-1 rounded transition cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Cerrar Pantalla Completa</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-[#1A1E24] flex flex-col items-center justify-center text-white z-10 gap-3">
              <div className="w-8 h-8 border-3 border-[#245A66] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-medium text-[#EAECE8]">
                Cargando mapa en vivo de Windy...
              </div>
            </div>
          )}

          <iframe
            key={reloadKey}
            src={WINDY_EMBED_URL}
            title="Windy - Mapa en Vivo de Ráfagas de Viento"
            className="w-full h-full border-0"
            allow="geolocation; fullscreen"
            loading="eager"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Barra de Datos Rápidos del Visor */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#687078] bg-[#F7F7F4] p-2.5 rounded-[4px] border border-[#DDE1DF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3F8063]" />
            <span className="font-medium text-[#252A2E]">
              Centro: 20.278°N, 105.317°O (Costa Jalisco / Bahía de Banderas / Nayarit)
            </span>
          </div>
          <div className="text-xs sm:text-sm text-[#245A66] font-medium font-tabular">
            Capa: Ráfagas (Gust) • Modelo: ICON
          </div>
        </div>
      </div>
    </section>
  );
};
