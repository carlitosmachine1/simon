import React, { useState } from 'react';
import {
  Video,
  ExternalLink,
  Maximize2,
  Minimize2,
  Plus,
  Radio,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  X,
  MapPin,
} from 'lucide-react';

export interface WebcamFeed {
  id: string;
  title: string;
  location: string;
  sourceUrl: string;
  youtubeId: string;
  description: string;
  isDefault?: boolean;
}

// Extrae el ID de video de varios formatos de URL de YouTube
function extractYouTubeId(url: string): string | null {
  try {
    const cleanUrl = url.trim();
    // https://www.youtube.com/live/VIDEO_ID
    const liveMatch = cleanUrl.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];

    // https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // https://youtu.be/VIDEO_ID
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = cleanUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    // Si ya es un ID de 11 caracteres alfanuméricos
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
    title: 'Cámara 1 • Monitoreo Costero',
    location: 'Costa del Pacífico • Manzanillo / Bahías de Colima y Jalisco',
    sourceUrl: 'https://www.youtube.com/live/V6Co4YdL25Q?si=w7iju0g6S1IhJrAG',
    youtubeId: 'V6Co4YdL25Q',
    description:
      'Transmisión continua en tiempo real que documenta la aproximación del huracán, marejada ciclónica, visibilidad costera y evolución del temporal.',
    isDefault: true,
  },
  {
    id: 'cam-simon-2',
    title: 'Cámara 2 • Transmisión en Vivo',
    location: 'Litoral del Pacífico Mexicano • Zona de Impacto',
    sourceUrl: 'https://www.youtube.com/live/ac5AU4B10ak?si=_W9OCI9Mbl37u0sJ',
    youtubeId: 'ac5AU4B10ak',
    description:
      'Señal en directo de alta definición para monitoreo de condiciones meteorológicas, viento e inundaciones en costa.',
  },
  {
    id: 'cam-simon-3',
    title: 'Cámara 3 • Monitoreo en Vivo',
    location: 'Costa del Pacífico • Monitoreo Meteorológico',
    sourceUrl: 'https://www.youtube.com/live/HCcubKg_giA?si=cza-Re7_CoGDQbOx',
    youtubeId: 'HCcubKg_giA',
    description:
      'Transmisión en directo enfocada en el oleaje, comportamiento de marejada ciclónica y rachas de viento.',
  },
  {
    id: 'cam-simon-4',
    title: 'Cámara 4 • Transmisión en Vivo',
    location: 'Costa del Pacífico • Monitoreo Costero',
    sourceUrl: 'https://www.youtube.com/live/NyLfXeGDYCY?si=dBCF5k52z8EI9dpZ',
    youtubeId: 'NyLfXeGDYCY',
    description:
      'Transmisión en tiempo real para seguimiento del avance de las bandas de lluvia y condiciones del viento.',
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

    const newFeed: WebcamFeed = {
      id: `cam-user-${Date.now()}`,
      title: newTitle.trim() || `Cámara en Vivo #${webcams.length + 1}`,
      location: newLocation.trim() || 'Costa del Pacífico',
      sourceUrl: newUrl.trim(),
      youtubeId: videoId,
      description: 'Transmisión en directo incorporada por el operador para monitoreo meteorológico.',
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
    <section id="webcams" className="space-y-3 pt-2">
      {/* Encabezado Editorial de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-2">
        <div>
          <div className="flex items-center gap-1.5 text-[#B84A45] text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B84A45] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B84A45]"></span>
            </span>
            <span>WEBCAMS EN VIVO • Monitoreo Costero</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[#252A2E] mt-0.5">
            Transmisiones en Tiempo Real de la Costa
          </h2>
          <p className="text-xs text-[#687078] mt-0.5">
            Cámaras meteorológicas y transmisiones en vivo del Pacífico Mexicano frente al embate de Simón.
          </p>
        </div>

        {/* Acciones del encabezado */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white text-xs font-medium px-3 py-1.5 rounded-[4px] shadow-sm transition active:scale-98 cursor-pointer"
            title="Agregar otra transmisión en vivo"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Agregar transmisión</span>
          </button>
          <div className="text-xs text-[#B84A45] font-semibold bg-[#B84A45]/10 border border-[#B84A45]/20 px-2 py-1 rounded-[4px] flex items-center gap-1 font-tabular">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{webcams.length} {webcams.length === 1 ? 'Cámara' : 'Cámaras'}</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Selección de Transmisiones (solo una transmisión activa a la vez) */}
      <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[6px] p-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {webcams.map((cam, idx) => {
            const isActive = cam.id === activeCam.id;
            return (
              <button
                key={cam.id}
                onClick={() => setActiveCamId(cam.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-[4px] border transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#245A66] text-white border-[#245A66] shadow-sm font-semibold'
                    : 'bg-[#FFFFFF] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAECE8] hover:border-[#CCD2CE]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Tv className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#245A66]'}`} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B84A45] ring-2 ring-[#245A66] animate-pulse" />
                  )}
                </div>
                <span>{cam.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-tabular font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAECE8] text-[#555E68]'
                  }`}
                >
                  Pestaña {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenedor Principal del Reproductor */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] shadow-sm overflow-hidden">
        {/* Barra de estado del reproductor */}
        <div className="bg-[#F7F7F4] border-b border-[#DDE1DF] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B84A45] bg-[#B84A45]/10 px-2 py-0.5 rounded-[3px] border border-[#B84A45]/20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#B84A45] animate-ping" />
              <span>EN VIVO</span>
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-[#252A2E] truncate">
                {activeCam.title}
              </div>
              <div className="text-[11px] text-[#687078] flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#245A66] shrink-0" />
                <span className="truncate">{activeCam.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReloadPlayer}
              className="flex items-center gap-1 text-[11px] text-[#687078] hover:text-[#252A2E] bg-white border border-[#DDE1DF] px-2 py-1 rounded-[3px] transition hover:bg-[#F7F7F4] cursor-pointer"
              title="Recargar reproductor"
            >
              <RefreshCw className="w-3 h-3 stroke-[2]" />
              <span className="hidden sm:inline">Recargar</span>
            </button>
            <a
              href={activeCam.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-[#245A66] font-medium bg-[#245A66]/8 hover:bg-[#245A66]/15 border border-[#245A66]/20 px-2 py-1 rounded-[3px] transition"
              title="Abrir en YouTube en pestaña nueva"
            >
              <ExternalLink className="w-3 h-3 stroke-[2]" />
              <span>Ver en YouTube</span>
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1 text-[11px] text-[#252A2E] bg-white border border-[#DDE1DF] px-2 py-1 rounded-[3px] transition hover:bg-[#F7F7F4] cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Reducir</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Ampliar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Embed 16:9 */}
        <div
          className={`relative bg-black transition-all ${
            isFullscreen
              ? 'fixed inset-0 z-50 flex flex-col justify-center bg-black/95 p-4 sm:p-8'
              : 'w-full aspect-video'
          }`}
        >
          {isFullscreen && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">
                {activeCam.title}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-[4px] transition cursor-pointer"
                title="Cerrar pantalla completa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <iframe
            key={`${activeCam.youtubeId}-${refreshKey}`}
            src={`https://www.youtube-nocookie.com/embed/${activeCam.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
            title={activeCam.title}
            className={`w-full h-full border-0 ${isFullscreen ? 'max-h-[85vh] max-w-6xl mx-auto rounded-[6px] shadow-2xl' : ''}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Pie de Información del Reproductor */}
        <div className="p-3 sm:p-4 bg-[#FFFFFF] border-t border-[#DDE1DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-[#687078] flex items-start sm:items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#245A66] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              {activeCam.description}
            </span>
          </div>
          <div className="text-[11px] text-[#687078] font-medium shrink-0 bg-[#F7F7F4] px-2 py-1 rounded-[3px] border border-[#DDE1DF]">
            Inicia con audio silenciado (desmutea en los controles del video)
          </div>
        </div>
      </div>

      {/* Nota preventiva técnica */}
      <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-[4px] p-2.5 text-xs text-[#5D4037] flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#F57F17] shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="font-semibold text-[#3E2723]">Aviso de transmisiones costeras:</strong> Las webcams públicas dependen de la red eléctrica y conectividad local. Si una transmisión experimenta interrupciones o cortes por rachas de viento en la zona de impacto, el reproductor puede pausarse. Consulta también las fotos satelitales y el cono oficial de trayectoria.
        </div>
      </div>

      {/* Modal para Agregar más transmisiones */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] max-w-md w-full shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-[#F7F7F4] border-b border-[#DDE1DF] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#245A66]" />
                <h3 className="text-sm font-semibold text-[#252A2E]">
                  Agregar Transmisión en Vivo
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="text-[#687078] hover:text-[#252A2E] p-1 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeed} className="p-4 space-y-3">
              <p className="text-xs text-[#687078]">
                Pega el enlace de una transmisión de YouTube en directo (ejemplo de Webcams de México, canales oficiales o monitoreo meteorológico).
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#252A2E] mb-1">
                  Enlace o URL de YouTube *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/live/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-[#DDE1DF] rounded-[4px] focus:outline-none focus:border-[#245A66]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#252A2E] mb-1">
                  Título de la Transmisión (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Bahía de Manzanillo / Malecón"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-[#DDE1DF] rounded-[4px] focus:outline-none focus:border-[#245A66]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#252A2E] mb-1">
                  Ubicación geográfica (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Manzanillo, Colima"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-[#DDE1DF] rounded-[4px] focus:outline-none focus:border-[#245A66]"
                />
              </div>

              {formError && (
                <div className="text-xs text-[#B84A45] bg-[#B84A45]/10 border border-[#B84A45]/20 p-2 rounded-[4px]">
                  {formError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#DDE1DF]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                  className="px-3 py-1.5 text-xs text-[#687078] hover:text-[#252A2E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-[#245A66] hover:bg-[#1D4852] text-white rounded-[4px] shadow-sm transition cursor-pointer"
                >
                  Agregar Cámara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
