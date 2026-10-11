import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Maximize2,
  ExternalLink,
  RefreshCw,
  X,
  Radio,
  Eye,
  Layers,
  Compass,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface SatellitePhotoItem {
  id: string;
  title: string;
  shortTitle: string;
  sensor: string;
  agency: string;
  badgeColor: string;
  url: string;
  officialPortalUrl: string;
  format: 'GIF Animado' | 'PNG Gráfica';
  description: string;
  interpretationGuide: string;
  frequency: string;
}

const SATELLITE_PHOTOS: SatellitePhotoItem[] = [
  {
    id: 'goes19-geocolor',
    title: 'GOES-19 GeoColor • Sector México',
    shortTitle: 'GeoColor Multiespectral',
    sensor: 'Sensor ABI (Canales Multiespectrales)',
    agency: 'NOAA STAR NESDIS',
    badgeColor: 'bg-[#245A66]',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/GEOCOLOR/GOES19-MEX-GEOCOLOR-1000x1000.gif',
    officialPortalUrl: 'https://www.star.nesdis.noaa.gov/GOES/sector_band.php?sat=G19&sector=mex&band=GEOCOLOR&length=24',
    format: 'GIF Animado',
    description: 'Animación continua multiespectral en tiempo casi real. Combina color verdadero diurno con composición nocturna infrarroja para apreciar la rotación y estructura del ojo de Simón.',
    interpretationGuide: 'Bancos nubosos blancos y compactos indican convección densa. De noche resalta la textura superior de las bandas espirales.',
    frequency: 'Transmisión continua (actualiza cada 10-15 min)',
  },
  {
    id: 'goes19-band13',
    title: 'GOES-19 Infrarrojo Limpio (Banda 13) • Sector México',
    shortTitle: 'Infrarrojo Térmico 10.3 µm',
    sensor: 'Sensor ABI (Banda 13 - Infrarrojo Limpio)',
    agency: 'NOAA STAR NESDIS',
    badgeColor: 'bg-[#7A3632]',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif',
    officialPortalUrl: 'https://www.star.nesdis.noaa.gov/GOES/sector_band.php?sat=G19&sector=mex&band=13&length=24',
    format: 'GIF Animado',
    description: 'Animación termográfica de topes de nubes. Permite cuantificar la intensidad convectiva y la fuerza de las bandas de lluvia torrencial alrededor del vórtice.',
    interpretationGuide: 'Colores rojos, morados y blancos señalan temperaturas inferiores a -70°C, indicando tormentas violentas y descargas eléctricas.',
    frequency: 'Transmisión continua 24 horas',
  },
  {
    id: 'nhc-5day-cone',
    title: 'Cono Oficial de Pronóstico a 5 Días • NHC EP20',
    shortTitle: 'Cono de Trayectoria Oficial',
    sensor: 'Modelo de Pronóstico Oficial (Advisory)',
    agency: 'National Hurricane Center (NOAA)',
    badgeColor: 'bg-[#2E6B4F]',
    url: 'https://www.nhc.noaa.gov/storm_graphics/EP20/refresh/EP202026_5day_cone+png/072039_5day_cone.png',
    officialPortalUrl: 'https://www.nhc.noaa.gov/?epac',
    format: 'PNG Gráfica',
    description: 'Gráfica oficial emitida por los especialistas del NHC mostrando el cono de incertidumbre de la trayectoria del centro de Simón y las alertas de impacto costero.',
    interpretationGuide: 'El cono representa el rango de incertidumbre probable (67%) del centro. El peligro de vientos y oleaje se extiende fuera del cono.',
    frequency: 'Actualizado con cada boletín oficial del NHC',
  },
];

interface SatellitePhotosSectionProps {
  externalRefreshTrigger?: number;
}

export const SatellitePhotosSection: React.FC<SatellitePhotosSectionProps> = ({
  externalRefreshTrigger,
}) => {
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    'goes19-geocolor': true,
    'goes19-band13': true,
    'nhc-5day-cone': true,
  });
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});
  const [selectedModalPhoto, setSelectedModalPhoto] = useState<SatellitePhotoItem | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);

  // Sync with global 5-minute auto refresh
  useEffect(() => {
    if (externalRefreshTrigger) {
      setCacheBuster(externalRefreshTrigger);
      setLoadingMap({
        'goes19-geocolor': true,
        'goes19-band13': true,
        'nhc-5day-cone': true,
      });
      setErrorMap({});
    }
  }, [externalRefreshTrigger]);

  const handleRefreshAll = () => {
    setIsRefreshingAll(true);
    const newTs = Date.now();
    setCacheBuster(newTs);
    setLoadingMap({
      'goes19-geocolor': true,
      'goes19-band13': true,
      'nhc-5day-cone': true,
    });
    setErrorMap({});
    setTimeout(() => {
      setIsRefreshingAll(false);
    }, 800);
  };

  const handleRefreshSingle = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    setErrorMap((prev) => ({ ...prev, [id]: false }));
    setCacheBuster(Date.now());
  };

  const handleImageLoaded = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
    setErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  // Keyboard escape for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedModalPhoto) {
        setSelectedModalPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModalPhoto]);

  return (
    <section id="fotos-satelitales" className="space-y-3">
      {/* Section Header */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5 stroke-[1.75]" />
              Transmisiones en Vivo • NOAA STAR NESDIS & National Hurricane Center
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#252A2E] mt-0.5 tracking-tight">
              Fotos Satelitales
            </h2>
            <p className="text-xs text-[#687078] mt-1 max-w-2xl leading-relaxed">
              Imágenes y animaciones satelitales en tiempo casi real del satélite GOES-19 y el cono oficial de pronóstico a 5 días del NHC, permanentemente visibles para seguimiento continuo.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshingAll}
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] text-xs font-medium px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition active:scale-98 disabled:opacity-50"
              title="Recargar fotos con la transmisión más reciente"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#245A66] stroke-[2] ${
                  isRefreshingAll ? 'animate-spin' : ''
                }`}
              />
              <span>Actualizar fotos en vivo</span>
            </button>

            <a
              href="https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G19&sector=mex"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#245A66] hover:bg-[#1b434c] text-white text-xs font-medium px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition"
            >
              <span>Portal NOAA G19</span>
              <ExternalLink className="w-3 h-3 stroke-[2]" />
            </a>
          </div>
        </div>

        {/* 3 Photos In Plain Sight (Que estén a la vista) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {SATELLITE_PHOTOS.map((photo) => {
            const isLoading = loadingMap[photo.id];
            const hasError = errorMap[photo.id];
            const photoUrl = `${photo.url}?t=${cacheBuster}`;

            return (
              <div
                key={photo.id}
                className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] overflow-hidden flex flex-col transition hover:border-[#BAC2BF]"
              >
                {/* Photo Card Header */}
                <div className="p-3 border-b border-[#DDE1DF] bg-[#F7F7F4] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#3F8063] animate-pulse"></span>
                      <span className="text-[10px] font-bold text-[#245A66] uppercase tracking-wider">
                        {photo.agency}
                      </span>
                      <span className="text-[10px] text-[#687078]">• {photo.format}</span>
                    </div>
                    <h3 className="font-bold text-[#252A2E] text-xs sm:text-sm truncate" title={photo.title}>
                      {photo.shortTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelectedModalPhoto(photo)}
                      className="p-1 rounded-[3px] bg-[#FFFFFF] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] transition"
                      title="Ampliar en pantalla completa"
                      aria-label="Ampliar imagen"
                    >
                      <Maximize2 className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                    <button
                      onClick={() => handleRefreshSingle(photo.id)}
                      className="p-1 rounded-[3px] bg-[#FFFFFF] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] transition"
                      title="Recargar esta foto"
                      aria-label="Recargar foto"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#245A66] stroke-[2]" />
                    </button>
                  </div>
                </div>

                {/* Photo Image Frame (Always Visible) */}
                <div
                  className="relative bg-[#1A1E21] min-h-[300px] sm:min-h-[340px] flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedModalPhoto(photo)}
                  title="Haz clic para ver en tamaño completo"
                >
                  {isLoading && !hasError && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1A1E21]/80 text-[#DDE1DF] text-xs p-4">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#7D9B8A]" />
                      <div className="font-medium text-center">Cargando foto satelital en vivo...</div>
                      <div className="text-[10px] text-[#A4B0B7] mt-1 text-center font-tabular">
                        {photo.sensor}
                      </div>
                    </div>
                  )}

                  {hasError ? (
                    <div className="p-6 text-center text-[#DDE1DF] max-w-xs mx-auto">
                      <Radio className="w-8 h-8 text-[#D99A38] mx-auto mb-2 stroke-[1.75]" />
                      <div className="text-xs font-semibold text-white">Servidor NOAA/NHC temporalmente ocupado</div>
                      <p className="text-[11px] text-[#A4B0B7] mt-1">
                        Puedes abrir la imagen directamente en el servidor oficial.
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefreshSingle(photo.id);
                          }}
                          className="bg-[#245A66] text-white text-xs px-2.5 py-1 rounded-[3px] flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Reintentar
                        </button>
                        <a
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#F7F7F4] text-[#252A2E] text-xs px-2.5 py-1 rounded-[3px] flex items-center gap-1 border border-[#DDE1DF]"
                        >
                          Abrir URL directa <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={photoUrl}
                        alt={photo.title}
                        onLoad={() => handleImageLoaded(photo.id)}
                        onError={() => handleImageError(photo.id)}
                        className={`w-full h-[320px] sm:h-[360px] object-contain transition-opacity duration-300 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                      />

                      {/* Click overlay hint */}
                      <div className="absolute inset-0 bg-[#000000]/0 group-hover:bg-[#000000]/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="bg-[#252A2E]/90 text-white text-xs px-3 py-1.5 rounded-[4px] font-medium flex items-center gap-1.5 shadow-md">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Haz clic para ampliar
                        </span>
                      </div>
                    </>
                  )}

                  {/* Corner tag with sensor */}
                  <div className="absolute bottom-2 left-2 bg-[#252A2E]/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-[3px] border border-white/10 font-tabular pointer-events-none">
                    {photo.sensor}
                  </div>
                </div>

                {/* Photo Card Description & Controls */}
                <div className="p-3 bg-[#FFFFFF] flex-1 flex flex-col justify-between space-y-2 text-xs">
                  <div>
                    <p className="text-[11px] text-[#687078] leading-relaxed">
                      {photo.description}
                    </p>
                    <div className="mt-2 bg-[#F7F7F4] border border-[#DDE1DF] p-2 rounded-[4px] text-[11px]">
                      <div className="font-semibold text-[#252A2E] flex items-center gap-1 mb-0.5">
                        <Info className="w-3 h-3 text-[#245A66] shrink-0" />
                        <span>Cómo interpretar:</span>
                      </div>
                      <p className="text-[#687078] leading-tight">
                        {photo.interpretationGuide}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DDE1DF] flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-[#687078] font-medium font-tabular">
                      {photo.frequency}
                    </span>
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#245A66] hover:text-[#1b434c] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <span>Descargar / Abrir</span>
                      <ExternalLink className="w-3 h-3 stroke-[2]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Resolution Modal / Lightbox */}
      {selectedModalPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#0F1214]/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedModalPhoto(null)}
        >
          <div
            className="bg-[#FFFFFF] rounded-[6px] max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-[#DDE1DF]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 bg-[#F7F7F4] border-b border-[#DDE1DF] flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3F8063] animate-pulse"></span>
                  <span className="text-[10px] font-bold text-[#245A66] uppercase">
                    {selectedModalPhoto.agency} • {selectedModalPhoto.format}
                  </span>
                </div>
                <h3 className="font-bold text-[#252A2E] text-sm sm:text-base">
                  {selectedModalPhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedModalPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#245A66] text-white text-xs px-2.5 py-1.5 rounded-[4px] font-medium flex items-center gap-1 hover:bg-[#1b434c] transition"
                >
                  <span>Archivo Original</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
                </a>

                <button
                  onClick={() => setSelectedModalPhoto(null)}
                  className="p-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] transition"
                  aria-label="Cerrar modal"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="bg-[#1A1E21] flex-1 flex items-center justify-center p-2 overflow-auto max-h-[70vh]">
              <img
                src={`${selectedModalPhoto.url}?t=${cacheBuster}`}
                alt={selectedModalPhoto.title}
                className="max-h-[68vh] max-w-full object-contain rounded-[2px]"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FFFFFF] border-t border-[#DDE1DF] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[#687078] text-[11px] max-w-2xl">
                <strong>Descripción:</strong> {selectedModalPhoto.description}
              </p>
              <div className="text-[11px] text-[#245A66] font-medium shrink-0 font-tabular">
                {selectedModalPhoto.frequency}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
