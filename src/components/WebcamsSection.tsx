import React, { useState } from 'react';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Radio,
  X,
  RefreshCw,
  Video,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface WebcamFeed {
  id: string;
  label: string;
  sourceUrl: string;
  youtubeId: string;
}

const WEBCAMS: WebcamFeed[] = [
  {
    id: 'webcam-1',
    label: 'Webcam 1',
    sourceUrl: 'https://www.youtube.com/live/V6Co4YdL25Q?si=w7iju0g6S1IhJrAG',
    youtubeId: 'V6Co4YdL25Q',
  },
  {
    id: 'webcam-2',
    label: 'Webcam 2',
    sourceUrl: 'https://www.youtube.com/live/ac5AU4B10ak?si=_W9OCI9Mbl37u0sJ',
    youtubeId: 'ac5AU4B10ak',
  },
  {
    id: 'webcam-3',
    label: 'Webcam 3',
    sourceUrl: 'https://www.youtube.com/live/HCcubKg_giA?si=cza-Re7_CoGDQbOx',
    youtubeId: 'HCcubKg_giA',
  },
  {
    id: 'webcam-4',
    label: 'Webcam 4',
    sourceUrl: 'https://www.youtube.com/live/NyLfXeGDYCY?si=dBCF5k52z8EI9dpZ',
    youtubeId: 'NyLfXeGDYCY',
  },
];

export const WebcamsSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeCamId, setActiveCamId] = useState<string>('webcam-1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const activeCam = WEBCAMS.find((c) => c.id === activeCamId) || WEBCAMS[0];

  const handleReloadPlayer = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section id="webcams" className="space-y-4">
      {/* Encabezado Editorial Limpio */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#B84A45] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              <Video className="w-4 h-4 stroke-[2]" />
              <span>{t.webcamsBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              {t.webcamsTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="text-xs sm:text-sm text-[#B84A45] font-bold bg-[#B84A45]/10 border border-[#B84A45]/20 px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 font-tabular">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{WEBCAMS.length} {t.camerasCount}</span>
            </div>
          </div>
        </div>

        {/* Pestañas de Selección: Solo Webcam 1, Webcam 2, etc. */}
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {WEBCAMS.map((cam) => {
              const isActive = cam.id === activeCam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setActiveCamId(cam.id)}
                  className={`text-left p-3.5 rounded-[6px] border-2 transition-all cursor-pointer relative flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#245A66] text-white border-[#245A66] shadow-md ring-2 ring-[#245A66]/30'
                      : 'bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border-[#DDE1DF] hover:border-[#CCD2CE]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        isActive ? 'text-white' : 'text-[#252A2E]'
                      }`}
                    >
                      {cam.label}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-[#FF6B6B] animate-ping' : 'bg-[#B84A45]'
                      }`}
                    />
                    <span className={isActive ? 'text-white' : 'text-[#B84A45]'}>
                      {t.liveBadge}
                    </span>
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-[#245A66] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reproductor de Video */}
        <div className="mt-4 bg-[#111315] border border-[#DDE1DF] rounded-[6px] overflow-hidden shadow-sm">
          {/* Barra de título de la cámara activa */}
          <div className="bg-[#1A1E24] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#2C323B]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#B84A45] px-2.5 py-1 rounded-[3px] shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{t.onAirBadge}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white truncate">
                {activeCam.label}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReloadPlayer}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white hover:text-white bg-[#2A303A] hover:bg-[#353D4A] px-3 py-1.5 rounded-[4px] transition cursor-pointer"
                title={t.reloadPlayer}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.reloadPlayer}</span>
              </button>
              <a
                href={activeCam.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-[#48A9A6] hover:text-white bg-[#2A303A] hover:bg-[#353D4A] px-3 py-1.5 rounded-[4px] transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t.openYoutube}</span>
              </a>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white bg-[#245A66] hover:bg-[#1D4852] px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{t.minimize}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.fullscreen}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Iframe 16:9 */}
          <div
            className={`relative bg-black transition-all ${
              isFullscreen
                ? 'fixed inset-0 z-50 flex flex-col justify-center bg-black/95 p-4 sm:p-8'
                : 'w-full aspect-video min-h-[300px] sm:min-h-[460px]'
            }`}
          >
            {isFullscreen && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span className="text-white text-sm font-semibold bg-black/70 px-3 py-1.5 rounded">
                  {activeCam.label}
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-[4px] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <iframe
              key={`${activeCam.youtubeId}-${refreshKey}`}
              src={`https://www.youtube-nocookie.com/embed/${activeCam.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
              title={activeCam.label}
              className={`w-full h-full border-0 ${
                isFullscreen
                  ? 'max-h-[85vh] max-w-6xl mx-auto rounded-[6px] shadow-2xl'
                  : ''
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};
