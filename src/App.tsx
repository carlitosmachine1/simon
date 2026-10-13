/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AlertBanner } from './components/AlertBanner';
import { Navbar } from './components/Navbar';
import { AutoRefreshBar } from './components/AutoRefreshBar';
import { LandfallAlertHero } from './components/LandfallAlertHero';
import { TropicalOutlookSection } from './components/TropicalOutlookSection';
import { ZoomEarthSection } from './components/ZoomEarthSection';
import { SatellitePhotosSection } from './components/SatellitePhotosSection';
import { WebcamsSection } from './components/WebcamsSection';
import { TrajectoryMap } from './components/TrajectoryMap';
import { HistoricalStats } from './components/HistoricalStats';
import { SheltersSection } from './components/SheltersSection';
import { EmergencyGuide } from './components/EmergencyGuide';
import { OfficialSources } from './components/OfficialSources';
import { Footer } from './components/Footer';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { ShareModal } from './components/ShareModal';
import { Shelter } from './data/hurricaneData';
import { getLiveHurricaneStatus } from './utils/hurricaneTracking';
import { fetchLiveNOAACyclone, LiveCycloneReport } from './utils/noaaFeed';
import { calculateDistanceKm, formatDistance } from './utils/geo';
import {
  MapPin,
  Phone,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

const DEFAULT_REFRESH_SECONDS = 120; // 2 minutos (< 5 min)

function AppContent() {
  const { t, language } = useLanguage();

  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // UX Requirement: Ocultar los refugios por defecto, mostrarlos solo a petición del usuario
  const [showSheltersSection, setShowSheltersSection] = useState(false);

  // Live NOAA MapServer real-time data received from GIS service
  const [liveNOAAData, setLiveNOAAData] = useState<{
    lat: number;
    lng: number;
    windKmh: number;
    gustKmh: number;
    pressureHpa: number;
    category: number;
    advisoryNum: string;
    advisoryDate: string;
    movement: string;
    speedKmh: number;
  } | null>(null);

  // Auto-refresh states (< 5 minutes rapid cycle, default 2 minutes)
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number>(DEFAULT_REFRESH_SECONDS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DEFAULT_REFRESH_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());

  // Dynamic live hurricane tracking and trajectory points, re-evaluated continuously
  const { status: liveStatus, trajectoryPoints: liveTrajectoryPoints } = useMemo(() => {
    return getLiveHurricaneStatus(lastUpdated);
  }, [lastUpdated]);

  // Reporte en tiempo real de presencia de fenómenos tropicales en NOAA MapServer
  const [liveCycloneReport, setLiveCycloneReport] = useState<LiveCycloneReport | null>(null);
  const [viewModeOverride, setViewModeOverride] = useState<'auto' | 'calm' | 'cyclone'>('auto');

  // Evaluar presencia de ciclón activo (en vivo o mediante alternador)
  const hasActiveCyclone = useMemo(() => {
    if (viewModeOverride === 'calm') return false;
    if (viewModeOverride === 'cyclone') return true;
    return liveCycloneReport ? liveCycloneReport.hasActiveCyclone : true;
  }, [viewModeOverride, liveCycloneReport]);

  const handleToggleViewMode = () => {
    setViewModeOverride((prev) => {
      if (prev === 'auto') return hasActiveCyclone ? 'calm' : 'cyclone';
      if (prev === 'calm') return 'cyclone';
      return 'auto';
    });
  };

  // Consultar resumen tropical oficial de NOAA periódicamente
  useEffect(() => {
    let isMounted = true;
    fetchLiveNOAACyclone().then((report) => {
      if (isMounted) {
        setLiveCycloneReport(report);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  // Merge live NOAA MapServer coordinates & intensity when available
  const effectiveStatus = useMemo(() => {
    const base = liveStatus;
    if (liveCycloneReport && liveCycloneReport.hasActiveCyclone) {
      return {
        ...base,
        name: liveCycloneReport.name,
        category: liveCycloneReport.category,
        categoryName: liveCycloneReport.categoryName,
        classification: liveCycloneReport.classification,
        windSpeedKmh: liveCycloneReport.windSpeedKmh,
        windGustsKmh: liveCycloneReport.windGustsKmh,
        pressureHpa: liveCycloneReport.pressureHpa,
        lat: liveCycloneReport.lat,
        lng: liveCycloneReport.lng,
        coordinatesText: liveCycloneReport.coordinatesText,
        distanceReference: liveCycloneReport.distanceReference,
        movement: liveCycloneReport.movement,
        movementSpeedKmh: liveCycloneReport.movementSpeedKmh,
        waveHeightMeters: liveCycloneReport.waveHeightMeters,
        lastUpdate: liveCycloneReport.lastUpdate,
      };
    }
    if (liveNOAAData) {
      return {
        ...base,
        lat: liveNOAAData.lat,
        lng: liveNOAAData.lng,
        windSpeedKmh: liveNOAAData.windKmh,
        windGustsKmh: liveNOAAData.gustKmh,
        pressureHpa: liveNOAAData.pressureHpa,
        category: liveNOAAData.category,
        movement: liveNOAAData.movement,
        movementSpeedKmh: liveNOAAData.speedKmh,
        coordinatesText: `${liveNOAAData.lat.toFixed(1)}°N, ${Math.abs(liveNOAAData.lng).toFixed(1)}°${language === 'en' ? 'W' : 'O'}`,
        lastUpdate: liveNOAAData.advisoryDate || base.lastUpdate,
      };
    }
    return base;
  }, [liveStatus, liveNOAAData, liveCycloneReport, language]);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    const now = new Date();
    setLastUpdated(now);
    setRefreshTrigger(now.getTime());
    setSecondsRemaining(refreshIntervalSeconds);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleChangeInterval = (newSeconds: number) => {
    setRefreshIntervalSeconds(newSeconds);
    setSecondsRemaining(newSeconds);
  };

  // Continuous auto-refresh interval timer (ticks down every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleRefreshAll();
          return refreshIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshIntervalSeconds]);

  const handleLocationResolved = (resolved: {
    lat: number;
    lng: number;
    label: string;
  }) => {
    setUserCoords({ lat: resolved.lat, lng: resolved.lng });
    setActiveLocationLabel(resolved.label);

    const distToEye = calculateDistanceKm(
      resolved.lat,
      resolved.lng,
      effectiveStatus.lat,
      effectiveStatus.lng
    );

    setLocationMessage(
      language === 'en'
        ? `Selected location (${resolved.label}): Distance to ${effectiveStatus.name} center: ${formatDistance(distToEye)}.`
        : `Ubicación seleccionada (${resolved.label}): Distancia al centro de ${effectiveStatus.name}: ${formatDistance(distToEye)}.`
    );
  };

  const handleSelectShelterOnMap = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setShowSheltersSection(true);
    const mapEl = document.getElementById('mapa-trayectoria');
    if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenShelters = () => {
    setShowSheltersSection(true);
    setTimeout(() => {
      const el = document.getElementById('refugios');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#252A2E] flex flex-col font-['Montserrat',sans-serif] text-base leading-relaxed">
      {/* 1. Aviso de Emergencia / Estado en Calma Superior */}
      <AlertBanner
        onOpenContacts={() => setIsContactsModalOpen(true)}
        hasActiveCyclone={hasActiveCyclone}
        activeStormName={effectiveStatus.name}
        activeCategory={effectiveStatus.category}
        activeStorms={liveCycloneReport?.activeStorms}
      />

      {/* 2. Barra de Navegación con Switch de Idioma y Botón Compartir */}
      <Navbar
        onOpenContacts={() => setIsContactsModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* 3. Barra de Sincronización Automática (< 5 minutos) */}
      <AutoRefreshBar
        lastUpdated={lastUpdated}
        secondsRemaining={secondsRemaining}
        isRefreshing={isRefreshing}
        onRefreshNow={handleRefreshAll}
        refreshIntervalSeconds={refreshIntervalSeconds}
        onChangeInterval={handleChangeInterval}
      />

      {/* Notificación de Selección Geográfica */}
      {locationMessage && (
        <div className="bg-[#FFFFFF] border-b border-[#DDE1DF] text-[#245A66] text-sm px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#3F8063] shrink-0 stroke-[2]" />
              <span>{locationMessage}</span>
            </span>
            <button
              onClick={() => setLocationMessage(null)}
              className="text-[#687078] hover:text-[#252A2E] text-sm px-1.5 font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Área Principal del Dashboard: Prioridad Visual y Datos Digeribles */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Panel de Datos Duros y Alerta de Ciclón / Estado en Calma */}
        <LandfallAlertHero
          userCoords={userCoords}
          activeLocationLabel={activeLocationLabel}
          onScrollToMap={() => {
            const el = document.getElementById('mapa-trayectoria');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onScrollToShelters={handleOpenShelters}
          lastUpdated={lastUpdated}
          onRefreshNow={handleRefreshAll}
          isRefreshing={isRefreshing}
          dynamicStatus={effectiveStatus}
          hasActiveCyclone={hasActiveCyclone}
          activeStormName={effectiveStatus.name}
          onToggleViewMode={handleToggleViewMode}
          viewMode={viewModeOverride}
          activeStorms={liveCycloneReport?.activeStorms}
        />

        {/* Perspectiva Tropical a 7 Días de la NOAA NHC (Pronóstico Gráfico de Ciclones y Perturbaciones) */}
        <TropicalOutlookSection externalRefreshTrigger={refreshTrigger} />

        {/* ORDEN SOLICITADO: 1. AL INICIO: Embed de Windy (Ráfagas de Viento y Radar) con Scroll Protegido */}
        <ZoomEarthSection externalRefreshTrigger={refreshTrigger} />

        {/* ORDEN SOLICITADO: 2. DESPUÉS: Fotos Satelitales Oficiales (GOES-19 y Cono NHC) */}
        <SatellitePhotosSection externalRefreshTrigger={refreshTrigger} />

        {/* ORDEN SOLICITADO: 3. ENSEGUIDA: Webcams en Vivo con Pestañas */}
        <WebcamsSection />

        {/* 4. Cartografía de Trayectoria Oficial (Refugios apagados por defecto para agilidad) */}
        <section id="mapa-trayectoria" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-2.5">
            <div>
              <div className="flex items-center gap-2 text-[#245A66] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4 stroke-[2]" />
                {t.trajBadge}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-0.5">
                {t.trajTitle}
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-[#245A66] font-bold bg-[#245A66]/10 px-3 py-1.5 rounded-[4px] font-tabular">
              {t.updatedText} {liveStatus.timeText} hrs ({t.twoMinCycle})
            </div>
          </div>

          <TrajectoryMap
            selectedShelterId={selectedShelter?.id}
            onSelectShelter={handleSelectShelterOnMap}
            userCoords={userCoords}
            dynamicStatus={effectiveStatus}
            dynamicTrajectoryPoints={liveTrajectoryPoints}
            refreshTrigger={refreshTrigger}
            onLiveStormData={setLiveNOAAData}
          />
        </section>

        {/* 5. Estadísticas Históricas de la Temporada con Recharts */}
        <HistoricalStats />

        {/* ORDEN SOLICITADO: 6. REFUGIOS: Ocultos por defecto, solo a petición del usuario */}
        <section id="refugios" className="space-y-3">
          <div className="bg-[#FFFFFF] border-2 border-[#DDE1DF] hover:border-[#245A66] rounded-[8px] p-5 sm:p-6 transition shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#245A66] font-bold text-xs sm:text-sm uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#3F8063]" />
                  <span>{t.sheltersBadge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E]">
                  {t.sheltersTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#687078]">
                  {showSheltersSection ? t.sheltersDescOpen : t.sheltersDescHidden}
                </p>
              </div>

              {/* Botón de Petición del Usuario */}
              <button
                onClick={() => setShowSheltersSection((prev) => !prev)}
                className="flex items-center gap-2 bg-[#245A66] hover:bg-[#1D4852] text-white font-bold text-sm sm:text-base px-5 py-3 rounded-[6px] shadow-sm transition active:scale-98 cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {showSheltersSection ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    <span>{t.btnHideShelters}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>{t.btnShowShelters}</span>
                  </>
                )}
              </button>
            </div>

            {/* Despliegue de Refugios solo a petición del usuario */}
            {showSheltersSection && (
              <div className="mt-6 pt-6 border-t border-[#DDE1DF] animate-in fade-in duration-200">
                <SheltersSection
                  onSelectShelterOnMap={handleSelectShelterOnMap}
                  userCoords={userCoords}
                  activeLocationLabel={activeLocationLabel}
                  onLocationResolved={handleLocationResolved}
                />
              </div>
            )}
          </div>
        </section>

        {/* 6. Protocolo de Actuación y Medidas Preventivas */}
        <EmergencyGuide />

        {/* 7. Directorio de Fuentes Oficiales */}
        <OfficialSources />
      </main>

      {/* 5. Pie de Página */}
      <Footer />

      {/* 6. Directorio Telefónico de Auxilio */}
      <EmergencyContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />

      {/* 7. Modal de Compartir en Redes Sociales */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Barra de Acceso Rápido Móvil */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-2 shadow-lg flex items-center gap-2">
          <button
            onClick={handleOpenShelters}
            className="flex-1 bg-[#245A66] hover:bg-[#1D4852] text-white font-bold py-2.5 px-3 rounded-[4px] text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <MapPin className="w-4 h-4 stroke-[2]" />
            <span>{t.mobileBtnShelters}</span>
          </button>
          <button
            onClick={() => setIsContactsModalOpen(true)}
            className="flex-1 bg-[#F7F7F4] hover:bg-[#EAEAE4] border border-[#DDE1DF] text-[#252A2E] font-bold py-2.5 px-3 rounded-[4px] text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#B84A45] stroke-[2.5]" />
            <span>{t.mobileBtn911}</span>
          </button>
        </div>
      </div>

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
