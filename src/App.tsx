/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AlertBanner } from './components/AlertBanner';
import { Navbar } from './components/Navbar';
import { AutoRefreshBar } from './components/AutoRefreshBar';
import { StatusOverview } from './components/StatusOverview';
import { LandfallAlertHero } from './components/LandfallAlertHero';
import { TrajectoryMap } from './components/TrajectoryMap';
import { SatellitePhotosSection } from './components/SatellitePhotosSection';
import { SheltersSection } from './components/SheltersSection';
import { EmergencyGuide } from './components/EmergencyGuide';
import { EmergencyKit } from './components/EmergencyKit';
import { OfficialSources } from './components/OfficialSources';
import { Footer } from './components/Footer';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { Shelter, HURRICANE_CURRENT_STATUS } from './data/hurricaneData';
import { getLiveHurricaneStatus } from './utils/hurricaneTracking';
import { calculateDistanceKm, formatDistance } from './utils/geo';
import {
  MapPin,
  Phone,
  Compass,
  CheckCircle2,
} from 'lucide-react';

const DEFAULT_REFRESH_SECONDS = 120; // 2 minutos (ciclo rápido de emergencia < 5 min)

export default function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

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
      liveStatus.lat,
      liveStatus.lng
    );

    setLocationMessage(
      `Ubicación seleccionada (${resolved.label}): Distancia al centro actual de Simón: ${formatDistance(
        distToEye
      )}. Albergues ordenados por cercanía.`
    );
  };

  const handleSelectShelterOnMap = (shelter: Shelter) => {
    setSelectedShelter(shelter);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#252A2E] flex flex-col font-['Montserrat',sans-serif]">
      {/* 1. Aviso de Situación Meteorológica (Alerta Sobria) */}
      <AlertBanner onOpenContacts={() => setIsContactsModalOpen(true)} />

      {/* 2. Barra Superior de Plataforma */}
      <Navbar onOpenContacts={() => setIsContactsModalOpen(true)} />

      {/* 3. Barra de Sincronización Automática (< 5 minutos, ciclo de 2 min) */}
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
        <div className="bg-[#FFFFFF] border-b border-[#DDE1DF] text-[#245A66] text-xs px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3F8063] shrink-0 stroke-[2]" />
              <span>{locationMessage}</span>
            </span>
            <button
              onClick={() => setLocationMessage(null)}
              className="text-[#687078] hover:text-[#252A2E] text-xs px-1 font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Área Principal del Dashboard Meteorológico */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Panel de Alerta de Impacto en Tierra (Landfall Warning) con Cálculos en Vivo */}
        <LandfallAlertHero
          userCoords={userCoords}
          activeLocationLabel={activeLocationLabel}
          onScrollToMap={() => {
            const el = document.getElementById('mapa-trayectoria');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onScrollToShelters={() => {
            const el = document.getElementById('refugios');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          lastUpdated={lastUpdated}
          onRefreshNow={handleRefreshAll}
          isRefreshing={isRefreshing}
          dynamicStatus={liveStatus}
        />

        {/* Resumen Principal y Variables Meteorológicas Actualizadas */}
        <StatusOverview dynamicStatus={liveStatus} />

        {/* Cartografía de Trayectoria y Radios de Viento en Vivo */}
        <section id="mapa-trayectoria" className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DDE1DF] pb-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#245A66] text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 stroke-[1.75]" />
                Cartografía Meteorológica en Vivo • Radar y Cono de Incertidumbre
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-[#252A2E] mt-0.5">
                Trayectoria Oficial Pronosticada y Red de Refugios
              </h2>
            </div>
            <div className="text-xs text-[#245A66] font-semibold bg-[#245A66]/8 px-2 py-1 rounded-[4px] font-tabular">
              Actualizado {liveStatus.timeText} hrs (Ciclo de 2 min)
            </div>
          </div>

          <TrajectoryMap
            selectedShelterId={selectedShelter?.id}
            onSelectShelter={handleSelectShelterOnMap}
            userCoords={userCoords}
            dynamicStatus={liveStatus}
            dynamicTrajectoryPoints={liveTrajectoryPoints}
            refreshTrigger={refreshTrigger}
          />
        </section>

        {/* Fotos Satelitales Oficiales (GOES-19 GeoColor, Infrarrojo Banda 13 y Cono Oficial NHC) */}
        <SatellitePhotosSection externalRefreshTrigger={refreshTrigger} />

        {/* Localizador y Directorio de Refugios Temporales */}
        <SheltersSection
          onSelectShelterOnMap={handleSelectShelterOnMap}
          userCoords={userCoords}
          activeLocationLabel={activeLocationLabel}
          onLocationResolved={handleLocationResolved}
        />

        {/* Protocolo de Actuación y Medidas Preventivas */}
        <EmergencyGuide />

        {/* Mochila de Emergencia de 72 Horas */}
        <EmergencyKit />

        {/* Directorio de Fuentes Oficiales */}
        <OfficialSources />
      </main>

      {/* 5. Pie de Página Editorial */}
      <Footer />

      {/* 6. Directorio Telefónico de Auxilio */}
      <EmergencyContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />

      {/* Barra de Acceso Rápido Móvil */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] p-1.5 shadow-md flex items-center gap-2">
          <a
            href="#refugios"
            className="flex-1 bg-[#245A66] text-white font-medium py-2 px-2.5 rounded-[3px] text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
          >
            <MapPin className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Refugio Cercano</span>
          </a>
          <button
            onClick={() => setIsContactsModalOpen(true)}
            className="flex-1 bg-[#F7F7F4] hover:bg-[#EAEAE4] border border-[#DDE1DF] text-[#252A2E] font-medium py-2 px-2.5 rounded-[3px] text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 text-[#B84A45] stroke-[2]" />
            <span>Auxilio 911</span>
          </button>
        </div>
      </div>
    </div>
  );
}
