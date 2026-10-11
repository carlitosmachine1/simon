import React, { useState } from 'react';
import {
  Video,
  ExternalLink,
  Maximize2,
  Minimize2,
  Plus,
  Radio,
  Tv,
  X,
  MapPin,
  RefreshCw,
  Info,
} from 'lucide-react';

export interface WebcamFeed {
  id: string;
  tabLabel: string;
  title: string;
  location: string;
  sourceUrl: string;
  youtubeId: string;
  badge: string;
}

// Extrae el ID de video de varios formatos de URL de YouTube
function extractYouTubeId(url: string): string | null {
  try {
    const cleanUrl = url.trim();
    const liveMatch = cleanUrl.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];

    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    const embedMatch = cleanUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }
    return null;
  } catch {
    return null;
  }
}

const INITIAL_WEBCAMS: WebcamFeed[] = [
  {
    id: 'cam-simon-1',
    tabLabel: 'Cámara 1',
    title: 'Cámara 1 • Monitoreo Costero',
    location: 'Costa del Pacífico • Manzanillo y Bahías',
    sourceUrl: 'https://www.youtube.com/live/V6Co4YdL25Q?si=w7iju0g6S1IhJrAG',
    youtubeId: 'V6Co4YdL25Q',
    badge: 'Manzanillo / Colima',
  },
  {
    id: 'cam-simon-2',
    tabLabel: 'Cámara 2',
    title: 'Cámara 2 • Transmisión en Vivo',
    location: 'Litoral del Pacífico Mexicano • Zona de Impacto',
    sourceUrl: 'https://www.youtube.com/live/ac5AU4B10ak?si=_W9OCI9Mbl37u0sJ',
    youtubeId: 'ac5AU4B10ak',
    badge: 'Zona de Impacto',
  },
  {
    id: 'cam-simon-3',
    tabLabel: 'Cámara 3',
    title: 'Cámara 3 • Monitoreo en Vivo',
    location: 'Costa del Pacífico • Oleaje y Viento',
    sourceUrl: 'https://www.youtube.com/live/HCcubKg_giA?si=cza-Re7_CoGDQbOx',
    youtubeId: 'HCcubKg_giA',
    badge: 'Oleaje y Marejada',
  },
  {
    id: 'cam-simon-4',
    tabLabel: 'Cámara 4',
    title: 'Cámara 4 • Transmisión en Vivo',
    location: 'Costa del Pacífico • Avance del Temporal',
    sourceUrl: 'https://www.youtube.com/live/NyLfXeGDYCY?si=dBCF5k52z8EI9dpZ',
    youtubeId: 'NyLfXeGDYCY',
    badge: 'Litoral Pacífico',
  },
];

export const WebcamsSection: React.FC = () => {
  const [webcams, setWebcams] = useState<WebcamFeed[]>(INITIAL_WEBCAMS);
  const [activeCamId, setActiveCamId] = useState<string>('cam-simon-1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Formulario para agregar más cámaras
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const activeCam = webcams.find((c) => c.id === activeCamId) || webcams[0];

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const videoId = extractYouTubeId(newUrl);
    if (!videoId) {
      setFormError(
        'Por favor ingresa un enlace válido de YouTube (ej. https://www.youtube.com/live/... o https://youtu.be/...)'
      );
      return;
    }

    const nextIndex = webcams.length + 1;
    const newFeed: WebcamFeed = {
      id: `cam-user-${Date.now()}`,
      tabLabel: `Cámara ${nextIndex}`,
      title: newTitle.trim() || `Cámara en Vivo #${nextIndex}`,
      location: newLocation.trim() || 'Costa del Pacífico',
      sourceUrl: newUrl.trim(),
      youtubeId: videoId,
      badge: newLocation.trim() || 'Nueva Cámara',
    };

    setWebcams((prev) => [...prev, newFeed]);
    setActiveCamId(newFeed.id);
    setNewUrl('');
    setNewTitle('');
    setNewLocation('');
    setShowAddModal(false);
  };

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
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B84A45] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B84A45]"></span>
              </span>
              <span>WEBCAMS EN VIVO • SEÑALES SIMULTÁNEAS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              Cámaras en Directo desde la Costa
            </h2>
            <p className="text-sm sm:text-base text-[#687078] mt-1">
              Selecciona una pestaña para ver la transmisión en directo. Una transmisión activa a la vez.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-[4px] shadow-xs transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Agregar transmisión</span>
            </button>
            <div className="text-xs sm:text-sm text-[#B84A45] font-bold bg-[#B84A45]/10 border border-[#B84A45]/20 px-2.5 py-1.5 rounded-[4px] flex items-center gap-1.5 font-tabular">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{webcams.length} Cámaras</span>
            </div>
          </div>
        </div>

        {/* Visualización Mejorada de Pestañas (Grandes, Claros y Táctiles) */}
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {webcams.map((cam, idx) => {
              const isActive = cam.id === activeCam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setActiveCamId(cam.id)}
                  className={`text-left p-3 rounded-[6px] border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? 'bg-[#245A66] text-white border-[#245A66] shadow-md ring-2 ring-[#245A66]/30'
                      : 'bg-[#F7F7F4] hover:bg-[#EAECE8] text-[#252A2E] border-[#DDE1DF] hover:border-[#CCD2CE]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] font-tabular ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#EAECE8] text-[#245A66]'
                      }`}
                    >
                      {cam.tabLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-[#FF6B6B] animate-ping' : 'bg-[#B84A45]'
                        }`}
                      />
                      <span className={isActive ? 'text-white' : 'text-[#B84A45]'}>
                        EN VIVO
                      </span>
                    </span>
                  </div>

                  <div className="mt-1">
                    <div
                      className={`text-sm sm:text-base font-bold truncate ${
                        isActive ? 'text-white' : 'text-[#252A2E]'
                      }`}
                    >
                      {cam.title}
                    </div>
                    <div
                      className={`text-xs truncate flex items-center gap-1 mt-0.5 ${
                        isActive ? 'text-white/80' : 'text-[#687078]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cam.badge}</span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-[#245A66] rounded-full" />
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
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#B84A45] px-2.5 py-1 rounded-[3px] shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>SEÑAL EN DIRECTO</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {activeCam.title}
                </div>
                <div className="text-xs text-[#A0AAB5] flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#48A9A6] shrink-0" />
                  <span className="truncate">{activeCam.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReloadPlayer}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white hover:text-white bg-[#2A303A] hover:bg-[#353D4A] px-3 py-1.5 rounded-[4px] transition cursor-pointer"
                title="Recargar reproductor"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recargar</span>
              </button>
              <a
                href={activeCam.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-[#48A9A6] hover:text-white bg-[#2A303A] hover:bg-[#353D4A] px-3 py-1.5 rounded-[4px] transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir YouTube</span>
              </a>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white bg-[#245A66] hover:bg-[#1D4852] px-3 py-1.5 rounded-[4px] transition cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Reducir</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ampliar</span>
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
                  {activeCam.title}
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
              title={activeCam.title}
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

      {/* Modal para Agregar más transmisiones */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-[#F7F7F4] border-b border-[#DDE1DF] px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#245A66]" />
                <h3 className="text-base font-bold text-[#252A2E]">
                  Agregar Transmisión en Vivo
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#687078] hover:text-[#252A2E] p-1 rounded hover:bg-[#EAEAE4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeed} className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#252A2E] mb-1">
                  Enlace de YouTube Live <span className="text-[#B84A45]">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/live/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] px-3 py-2 text-sm text-[#252A2E] focus:outline-none focus:border-[#245A66] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252A2E] mb-1">
                  Título de la Transmisión
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cámara Puerto de Manzanillo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] px-3 py-2 text-sm text-[#252A2E] focus:outline-none focus:border-[#245A66] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252A2E] mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  placeholder="Ej. Manzanillo, Colima"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] px-3 py-2 text-sm text-[#252A2E] focus:outline-none focus:border-[#245A66] transition"
                />
              </div>

              {formError && (
                <div className="text-xs text-[#B84A45] bg-[#B84A45]/10 border border-[#B84A45]/20 p-2.5 rounded-[4px]">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-sm font-medium text-[#687078] hover:text-[#252A2E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#245A66] hover:bg-[#1D4852] text-white text-sm font-medium px-4 py-2 rounded-[4px] shadow-xs transition cursor-pointer"
                >
                  Incorporar Transmisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
