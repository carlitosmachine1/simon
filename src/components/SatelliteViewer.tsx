import React, { useState } from 'react';
import { NOAA_SATELLITE_FEEDS } from '../data/hurricaneData';
import {
  Satellite,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle,
  Eye,
  Radio,
} from 'lucide-react';

export const SatelliteViewer: React.FC = () => {
  const [selectedFeedId, setSelectedFeedId] = useState<string>('geocolor');
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Satellite className="w-4 h-4" />
              NOAA NESDIS • Satélite GOES-18 (GOES-West)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Imágenes Satelitales Oficiales de NOAA
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Transmisión directa de los sensores ABI del satélite geoestacionario NOAA GOES-18 sobre el Océano Pacífico mexicano. Monitoreo constante del ojo y bandas espirales de Simón.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
              title="Recargar imagen desde los servidores de NOAA"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Actualizar Feed</span>
            </button>

            <a
              href="https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G18&sector=tpw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <span>Portal NOAA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Channel Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {NOAA_SATELLITE_FEEDS.map((feed) => (
            <button
              key={feed.id}
              onClick={() => {
                setSelectedFeedId(feed.id);
                setImgLoaded(false);
                setImgError(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                selectedFeedId === feed.id
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{feed.name}</span>
            </button>
          ))}
        </div>

        {/* Satellite Display Container */}
        <div className="mt-4 relative bg-black rounded-2xl overflow-hidden border border-slate-800 min-h-[380px] sm:min-h-[480px] flex items-center justify-center">
          {/* Loading overlay */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-cyan-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-2" />
              <div className="text-xs font-semibold text-slate-300">
                Conectando con NOAA STAR NESDIS...
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Cargando espectro {currentFeed.type}</div>
            </div>
          )}

          {imgError ? (
            <div className="p-8 text-center text-slate-400">
              <Radio className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-white">Transmisión NOAA temporalmente saturada</div>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Los servidores de NOAA reciben millones de consultas durante eventos categoría 4.
                Puedes visualizar el feed directamente en su sitio oficial.
              </p>
              <a
                href={currentFeed.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Ver en vivo en NOAA NESDIS
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <img
              src={fullImageUrl}
              alt={`Satélite NOAA GOES-18 Huracán Simón - ${currentFeed.name}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgLoaded(true);
                setImgError(true);
              }}
              className={`w-full max-h-[620px] object-contain transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Top image overlay tag */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{currentFeed.name}</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">• {currentFeed.frequency}</span>
          </div>

          {/* Fullscreen modal toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white p-2 rounded-xl border border-slate-700 backdrop-blur-md text-xs transition"
            title="Expandir imagen"
          >
            {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Meteorological interpretation footer */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>Cómo interpretar esta imagen:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {currentFeed.interpretation}
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Fuente oficial:</strong> U.S. National Oceanic and Atmospheric Administration (NOAA) / NESDIS / STAR
            </span>
            <a
              href="https://www.nhc.noaa.gov/?epac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>NHC Huracanes del Pacífico</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-lg"
          onClick={() => setIsZoomed(false)}
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white mb-2">
            <div className="text-sm font-bold flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span>{currentFeed.name} (Vista Ampliada)</span>
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Cerrar (Esc)
            </button>
          </div>
          <div className="max-w-5xl max-h-[85vh] overflow-auto rounded-xl border border-slate-800 bg-black p-1">
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
