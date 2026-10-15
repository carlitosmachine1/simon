import React, { useState } from 'react';
import {
  Wind,
  Maximize2,
  Minimize2,
  ExternalLink,
  RefreshCw,
  Lock,
  Unlock,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WindyMapSectionProps {
  externalRefreshTrigger?: number;
}

export const ZoomEarthSection: React.FC<WindyMapSectionProps> = ({
  externalRefreshTrigger,
}) => {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll protection: locked by default on mobile so user does not get trapped while scrolling
  const [isLockedForScroll, setIsLockedForScroll] = useState<boolean>(true);

  const WINDY_EMBED_URL =
    'https://embed.windy.com/embed2.html?lat=22.373&lon=-101.879&zoom=5&level=surface&overlay=wind&product=gfs&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1';

  const WINDY_EXTERNAL_URL =
    'https://www.windy.com/?gfs,22.373,-101.879,5';

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (externalRefreshTrigger) {
      handleReload();
    }
  }, [externalRefreshTrigger]);

  return (
    <section id="mapa-viento-zoom" className="space-y-3">
      {/* Encabezado Conciso y Directo */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              <Compass className="w-4 h-4 stroke-[2]" />
              <span>{t.windyBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              {t.windyTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#687078] mt-1">
              {t.windySubtitle}
            </p>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Botón de Protección de Scroll */}
            <button
              onClick={() => setIsLockedForScroll((prev) => !prev)}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-[4px] border transition cursor-pointer ${
                isLockedForScroll
                  ? 'bg-[#3F8063]/10 text-[#3F8063] border-[#3F8063]/30 hover:bg-[#3F8063]/20'
                  : 'bg-[#245A66] text-white border-[#245A66] hover:bg-[#1D4852]'
              }`}
              title={isLockedForScroll ? t.safeScrollLocked : t.safeScrollInteracting}
            >
              {isLockedForScroll ? (
                <>
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t.safeScrollLocked}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t.safeScrollInteracting}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReload}
              className="flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border border-[#DDE1DF] text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              title={t.reload}
            >
              <RefreshCw className="w-4 h-4 text-[#245A66]" />
              <span>{t.reload}</span>
            </button>

            <a
              href={WINDY_EXTERNAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.openInWindy}</span>
            </a>

            <button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                if (!isFullscreen) setIsLockedForScroll(false);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border border-[#DDE1DF] text-xs sm:text-sm font-medium px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              title={isFullscreen ? t.minimize : t.fullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-[#245A66]" />
                  <span>{t.minimize}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-[#245A66]" />
                  <span>{t.fullscreen}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contenedor del Iframe Embebido Oficial de Windy con Protección de Scroll */}
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
                <span>Windy • GFS</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1 text-xs bg-[#3E454D] hover:bg-[#4E5660] text-white px-2.5 py-1 rounded transition cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>{t.close}</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-[#1A1E24] flex flex-col items-center justify-center text-white z-10 gap-3">
              <div className="w-8 h-8 border-3 border-[#245A66] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-medium text-[#EAECE8]">
                Loading Windy live map...
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            key={reloadKey}
            src={WINDY_EMBED_URL}
            title="Windy - Live Wind Gusts Map"
            className={`w-full h-full border-0 ${
              isLockedForScroll && !isFullscreen ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
            allow="geolocation; fullscreen"
            loading="eager"
            onLoad={() => setIsLoading(false)}
          />

          {/* Capa de Scroll Seguro en Modo Bloqueado */}
          {isLockedForScroll && !isFullscreen && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-5 pointer-events-none">
              <button
                onClick={() => setIsLockedForScroll(false)}
                className="pointer-events-auto bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 transition active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <Unlock className="w-4 h-4 text-[#48A9A6]" />
                <span>{t.tapToInteractMap}</span>
              </button>
            </div>
          )}

          {/* Botón flotante para re-bloquear */}
          {!isLockedForScroll && !isFullscreen && (
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setIsLockedForScroll(true)}
                className="bg-[#252A2E]/90 hover:bg-[#252A2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer backdrop-blur-xs"
                title={t.lockScroll}
              >
                <Lock className="w-3.5 h-3.5 text-[#3F8063]" />
                <span>{t.lockScroll}</span>
              </button>
            </div>
          )}
        </div>

        {/* Barra de Datos Rápidos del Visor */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#687078] bg-[#F7F7F4] p-2.5 rounded-[4px] border border-[#DDE1DF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3F8063]" />
            <span className="font-medium text-[#252A2E]">
              {t.windyCenterCoords}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-[#245A66] font-medium font-tabular">
            {t.windyLayerInfo}
          </div>
        </div>
      </div>
    </section>
  );
};
