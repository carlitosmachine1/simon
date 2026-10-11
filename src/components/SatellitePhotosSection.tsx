import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Maximize2,
  ExternalLink,
  RefreshCw,
  X,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SatellitePhotoItem {
  id: string;
  titleEs: string;
  titleEn: string;
  shortTitleEs: string;
  shortTitleEn: string;
  sensorEs: string;
  sensorEn: string;
  agency: string;
  badgeColor: string;
  url: string;
  formatEs: string;
  formatEn: string;
  frequencyEs: string;
  frequencyEn: string;
}

const SATELLITE_PHOTOS: SatellitePhotoItem[] = [
  {
    id: 'goes19-geocolor',
    titleEs: 'GOES-19 GeoColor • Sector México',
    titleEn: 'GOES-19 GeoColor • Mexico Sector',
    shortTitleEs: 'GeoColor Multiespectral',
    shortTitleEn: 'Multispectral GeoColor',
    sensorEs: 'Sensor ABI (Canales Multiespectrales)',
    sensorEn: 'ABI Sensor (Multispectral Channels)',
    agency: 'NOAA STAR NESDIS',
    badgeColor: 'bg-[#245A66]',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/GEOCOLOR/GOES19-MEX-GEOCOLOR-1000x1000.gif',
    formatEs: 'GIF Animado',
    formatEn: 'Animated GIF',
    frequencyEs: 'Transmisión continua (cada 10 min)',
    frequencyEn: 'Continuous stream (every 10 min)',
  },
  {
    id: 'goes19-band13',
    titleEs: 'GOES-19 Infrarrojo Térmico (Banda 13) • Sector México',
    titleEn: 'GOES-19 Clean Thermal IR (Band 13) • Mexico Sector',
    shortTitleEs: 'Infrarrojo Térmico 10.3 µm',
    shortTitleEn: 'Clean Thermal IR 10.3 µm',
    sensorEs: 'Sensor ABI (Banda 13 - Infrarrojo Limpio)',
    sensorEn: 'ABI Sensor (Band 13 - Clean Thermal IR)',
    agency: 'NOAA STAR NESDIS',
    badgeColor: 'bg-[#7A3632]',
    url: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif',
    formatEs: 'GIF Animado',
    formatEn: 'Animated GIF',
    frequencyEs: 'Transmisión continua 24 hrs',
    frequencyEn: '24/7 continuous stream',
  },
  {
    id: 'nhc-5day-cone',
    titleEs: 'Cono Oficial de Pronóstico a 5 Días • NHC EP20',
    titleEn: 'Official 5-Day Forecast Cone • NHC EP20',
    shortTitleEs: 'Cono de Trayectoria Oficial',
    shortTitleEn: 'Official Forecast Track Cone',
    sensorEs: 'Modelo de Pronóstico Oficial (Boletín)',
    sensorEn: 'Official Forecast Advisory Track',
    agency: 'National Hurricane Center (NOAA)',
    badgeColor: 'bg-[#2E6B4F]',
    url: 'https://www.nhc.noaa.gov/storm_graphics/EP20/refresh/EP202026_5day_cone+png/072039_5day_cone.png',
    formatEs: 'PNG Gráfica',
    formatEn: 'PNG Graphic',
    frequencyEs: 'Actualizado con cada boletín oficial',
    frequencyEn: 'Updated with each official advisory',
  },
];

interface SatellitePhotosSectionProps {
  externalRefreshTrigger?: number;
}

export const SatellitePhotosSection: React.FC<SatellitePhotosSectionProps> = ({
  externalRefreshTrigger,
}) => {
  const { t, language } = useLanguage();
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    'goes19-geocolor': true,
    'goes19-band13': true,
    'nhc-5day-cone': true,
  });
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});
  const [selectedModalPhoto, setSelectedModalPhoto] = useState<SatellitePhotoItem | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);

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
    }, 700);
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
    <section id="fotos-satelitales" className="space-y-4">
      {/* Encabezado Conciso */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              <Satellite className="w-4 h-4 stroke-[2]" />
              {t.satelliteBadge}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1 tracking-tight">
              {t.satelliteTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#687078] mt-1">
              {t.satelliteSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshingAll}
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] text-xs sm:text-sm font-medium px-3.5 py-2 rounded-[4px] flex items-center gap-1.5 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#245A66] ${
                  isRefreshingAll ? 'animate-spin' : ''
                }`}
              />
              <span>{t.updatePhotos}</span>
            </button>

            <a
              href="https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G19&sector=mex"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#245A66] hover:bg-[#1b434c] text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-[4px] flex items-center gap-1.5 transition"
            >
              <span>{t.noaaPortal}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Fotos en la Vista */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {SATELLITE_PHOTOS.map((photo) => {
            const isLoading = loadingMap[photo.id];
            const hasError = errorMap[photo.id];
            const photoUrl = `${photo.url}?t=${cacheBuster}`;
            const shortTitle = language === 'en' ? photo.shortTitleEn : photo.shortTitleEs;
            const fullTitle = language === 'en' ? photo.titleEn : photo.titleEs;
            const sensor = language === 'en' ? photo.sensorEn : photo.sensorEs;
            const format = language === 'en' ? photo.formatEn : photo.formatEs;
            const frequency = language === 'en' ? photo.frequencyEn : photo.frequencyEs;

            return (
              <div
                key={photo.id}
                className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] overflow-hidden flex flex-col transition hover:border-[#BAC2BF] shadow-xs"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="p-3 bg-[#F7F7F4] border-b border-[#DDE1DF] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3F8063] animate-pulse"></span>
                      <span className="text-xs font-bold text-[#245A66] uppercase tracking-wider">
                        {photo.agency}
                      </span>
                      <span className="text-xs text-[#687078]">• {format}</span>
                    </div>
                    <h3 className="font-bold text-[#252A2E] text-sm sm:text-base truncate mt-0.5" title={fullTitle}>
                      {shortTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelectedModalPhoto(photo)}
                      className="p-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] transition cursor-pointer"
                      title={t.clickToEnlarge}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRefreshSingle(photo.id)}
                      className="p-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#EAEAE4] text-[#245A66] border border-[#DDE1DF] transition cursor-pointer"
                      title={t.updatePhotos}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Marco de Imagen */}
                <div
                  className="relative bg-[#1A1E21] min-h-[320px] sm:min-h-[360px] flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedModalPhoto(photo)}
                >
                  {isLoading && !hasError && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1A1E21]/80 text-[#DDE1DF] p-4 gap-2">
                      <RefreshCw className="w-7 h-7 animate-spin text-[#7D9B8A]" />
                      <div className="text-sm font-medium text-center">Loading image...</div>
                    </div>
                  )}

                  {hasError ? (
                    <div className="p-6 text-center text-[#DDE1DF] max-w-xs mx-auto">
                      <Radio className="w-8 h-8 text-[#D99A38] mx-auto mb-2" />
                      <div className="text-sm font-semibold text-white">NOAA / NHC stream busy</div>
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 bg-[#F7F7F4] text-[#252A2E] text-xs font-semibold px-3 py-1.5 rounded-[4px]"
                      >
                        Direct link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <>
                      <img
                        src={photoUrl}
                        alt={fullTitle}
                        onLoad={() => handleImageLoaded(photo.id)}
                        onError={() => handleImageError(photo.id)}
                        className={`w-full h-[320px] sm:h-[360px] object-contain transition-opacity duration-300 ${
                          isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="bg-[#252A2E]/90 text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-[4px] font-medium flex items-center gap-1.5 shadow-md">
                          <Maximize2 className="w-4 h-4" />
                          {t.clickToEnlarge}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="absolute bottom-2 left-2 bg-[#252A2E]/85 text-white text-xs px-2.5 py-1 rounded-[3px] border border-white/10 font-tabular pointer-events-none">
                    {sensor}
                  </div>
                </div>

                {/* Pie de Foto Conciso */}
                <div className="p-3 bg-[#FFFFFF] border-t border-[#DDE1DF] flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-[#687078] font-medium font-tabular">
                    {frequency}
                  </span>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#245A66] hover:text-[#1b434c] font-bold flex items-center gap-1"
                  >
                    <span>{t.download}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Pantalla Completa */}
      {selectedModalPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setSelectedModalPhoto(null)}
        >
          <div
            className="flex items-center justify-between text-white max-w-6xl w-full mx-auto pb-3 border-b border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-xs text-[#A0AAB5] uppercase font-bold tracking-wider">
                {selectedModalPhoto.agency} • {language === 'en' ? selectedModalPhoto.sensorEn : selectedModalPhoto.sensorEs}
              </div>
              <h3 className="text-base sm:text-xl font-bold">
                {language === 'en' ? selectedModalPhoto.titleEn : selectedModalPhoto.titleEs}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={selectedModalPhoto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm px-3 py-1.5 rounded-[4px] flex items-center gap-1.5"
              >
                <span>{t.original}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedModalPhoto(null)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-[4px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${selectedModalPhoto.url}?t=${cacheBuster}`}
              alt={language === 'en' ? selectedModalPhoto.titleEn : selectedModalPhoto.titleEs}
              className="max-h-[82vh] max-w-full object-contain rounded-[4px] shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
