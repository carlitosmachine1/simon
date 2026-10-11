import React, { useState } from 'react';
import { NOAA_SATELLITE_FEEDS } from '../data/hurricaneData';
import {
  Satellite,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Info,
  Eye,
  Radio,
} from 'lucide-react';

interface SatelliteViewerProps {
  externalRefreshTrigger?: number;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({ externalRefreshTrigger }) => {
  const [selectedFeedId, setSelectedFeedId] = useState<string>('geocolor');
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Sync with global 5-minute auto-refresh
  React.useEffect(() => {
    if (externalRefreshTrigger) {
      setImgLoaded(false);
      setImgError(false);
      setCacheBuster(externalRefreshTrigger);
    }
  }, [externalRefreshTrigger]);

  const currentFeed =
    NOAA_SATELLITE_FEEDS.find((f) => f.id === selectedFeedId) || NOAA_SATELLITE_FEEDS[0];

  const handleRefresh = () => {
    setImgLoaded(false);
    setImgError(false);
    setCacheBuster(Date.now());
  };

  const fullImageUrl = `${currentFeed.imageUrl}?t=${cacheBuster}`;

  return (
    <section id="satelite" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5 stroke-[1.75]" />
              Sensores ABI • Satélite GOES-18 (NOAA NESDIS)
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#252A2E] mt-0.5">
              Imágenes Satelitales en Tiempo Casi Real
            </h2>
            <p className="text-xs text-[#687078] mt-0.5 max-w-2xl">
              Monitoreo directo del Pacífico nororiental mediante bandas geoestacionarias multiespectrales, infrarrojas y de vapor de agua.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] text-xs font-medium px-2.5 py-1.5 rounded-[4px] flex items-center gap-1.5 transition active:scale-98"
              title="Recargar transmisión satelital"
            >
              <RefreshCw className="w-3 h-3 text-[#245A66] stroke-[2]" />
              <span>Actualizar imagen</span>
            </button>

            <a
              href="https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G18&sector=tpw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#245A66] hover:bg-[#1b434c] text-white text-xs font-medium px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition"
            >
              <span>Portal NOAA</span>
              <ExternalLink className="w-3 h-3 stroke-[2]" />
            </a>
          </div>
        </div>

        {/* Channel Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {NOAA_SATELLITE_FEEDS.map((feed) => (
            <button
              key={feed.id}
              onClick={() => {
                setSelectedFeedId(feed.id);
                setImgLoaded(false);
                setImgError(false);
              }}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-medium flex items-center gap-1.5 transition ${
                selectedFeedId === feed.id
                  ? 'bg-[#245A66] text-white'
                  : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{feed.name}</span>
            </button>
          ))}
        </div>

        {/* Satellite Display Container */}
        <div className="relative bg-[#1A1E21] rounded-[4px] border border-[#DDE1DF] min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1A1E21]/80 text-[#DDE1DF] text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#7D9B8A]" />
              <div className="font-medium">Cargando transmisión NOAA STAR NESDIS...</div>
              <div className="text-[11px] text-[#687078] mt-0.5">{currentFeed.type}</div>
            </div>
          )}

          {imgError ? (
            <div className="p-6 text-center text-[#DDE1DF]">
              <Radio className="w-8 h-8 text-[#D99A38] mx-auto mb-2 stroke-[1.75]" />
              <div className="text-xs font-semibold text-white">Servidor de imagen temporalmente ocupado</div>
              <p className="text-[11px] text-[#687078] mt-1 max-w-sm mx-auto">
                Puede consultar la animación continua directamente en el portal oficial de NOAA STAR.
              </p>
              <a
                href={currentFeed.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 bg-[#245A66] text-white text-xs font-medium px-3 py-1.5 rounded-[3px]"
              >
                Abrir en NOAA STAR
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <img
              src={fullImageUrl}
              alt={`Satélite NOAA GOES-18 - ${currentFeed.name}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgLoaded(true);
                setImgError(true);
              }}
              className={`w-full max-h-[580px] object-contain transition-opacity duration-200 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Top image overlay metadata tag */}
          <div className="absolute top-2.5 left-2.5 bg-[#252A2E]/90 border border-[#DDE1DF]/20 rounded-[3px] px-2.5 py-1 text-[11px] text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F8063]" />
            <span className="font-medium">{currentFeed.name}</span>
            <span className="text-[#DDE1DF] text-[10px] hidden sm:inline">• {currentFeed.frequency}</span>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-2.5 right-2.5 bg-[#252A2E]/90 hover:bg-[#252A2E] text-white p-1.5 rounded-[3px] border border-[#DDE1DF]/20 transition"
            title="Ampliar imagen"
          >
            {isZoomed ? <Minimize2 className="w-3.5 h-3.5 stroke-[2]" /> : <Maximize2 className="w-3.5 h-3.5 stroke-[2]" />}
          </button>
        </div>

        {/* Technical Interpretation Footer */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3.5 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#245A66] font-semibold">
            <Info className="w-3.5 h-3.5 stroke-[2]" />
            <span>Guía de interpretación física:</span>
          </div>
          <p className="text-[#687078] leading-relaxed">
            {currentFeed.interpretation}
          </p>
          <div className="pt-1.5 border-t border-[#DDE1DF] text-[11px] text-[#687078] flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Fuente científica:</strong> NOAA NESDIS / Center for Satellite Applications and Research (STAR)
            </span>
            <span className="font-tabular text-[#245A66]">
              Actualización periódica programada
            </span>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-[#252A2E]/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="w-full max-w-4xl flex items-center justify-between text-white mb-2 text-xs">
            <span className="font-semibold">{currentFeed.name} (Vista Ampliada)</span>
            <button
              onClick={() => setIsZoomed(false)}
              className="bg-[#245A66] text-white px-2.5 py-1 rounded-[3px]"
            >
              Cerrar (Esc)
            </button>
          </div>
          <div className="max-w-4xl max-h-[85vh] overflow-auto bg-[#1A1E21] border border-[#DDE1DF]/20 rounded-[4px] p-1">
            <img
              src={fullImageUrl}
              alt="Satélite NOAA Zoom"
              className="w-full h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};
