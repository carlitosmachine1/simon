/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertBanner } from './components/AlertBanner';
import { Navbar } from './components/Navbar';
import { AutoRefreshBar } from './components/AutoRefreshBar';
import { StatusOverview } from './components/StatusOverview';
import { TrajectoryMap } from './components/TrajectoryMap';
import { SheltersSection } from './components/SheltersSection';
import { SatelliteViewer } from './components/SatelliteViewer';
import { EmergencyGuide } from './components/EmergencyGuide';
import { EmergencyKit } from './components/EmergencyKit';
import { OfficialSources } from './components/OfficialSources';
import { Footer } from './components/Footer';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { Shelter, HURRICANE_CURRENT_STATUS } from './data/hurricaneData';
import { calculateDistanceKm, formatDistance } from './utils/geo';
import {
  MapPin,
  Phone,
  Compass,
  CheckCircle2,
} from 'lucide-react';

const REFRESH_INTERVAL_SECONDS = 300; // 5 minutos

export default function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Auto-refresh states (5 minutes cycle)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(REFRESH_INTERVAL_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    const now = new Date();
    setLastUpdated(now);
    setRefreshTrigger(now.getTime());
    setSecondsRemaining(REFRESH_INTERVAL_SECONDS);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // 5-minute auto-refresh interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleRefreshAll();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      HURRICANE_CURRENT_STATUS.lat,
      HURRICANE_CURRENT_STATUS.lng
    );

    setLocationMessage(
      `Ubicación seleccionada (${resolved.label}): Distancia al centro de Simón: ${formatDistance(
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

      {/* 3. Barra de Sincronización Automática (5 minutos) */}
      <AutoRefreshBar
        lastUpdated={lastUpdated}
        secondsRemaining={secondsRemaining}
        isRefreshing={isRefreshing}
        onRefreshNow={handleRefreshAll}
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
              className="text-[#687078] hover:text-[#252A2E] text-xs px-1 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Área Principal del Dashboard Meteorológico */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Resumen Principal y Variables Meteorológicas */}
        <StatusOverview />

        {/* Cartografía de Trayectoria y Radios de Viento */}
        <section id="mapa-trayectoria" className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DDE1DF] pb-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#245A66] text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 stroke-[1.75]" />
                Cartografía Meteorológica y Cono de Incertidumbre
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-[#252A2E] mt-0.5">
                Trayectoria Oficial Pronosticada y Red de Refugios
              </h2>
            </div>
            <div className="text-xs text-[#687078] font-tabular">
              Datos verificados: NHC Advisory / SMN Conagua
            </div>
          </div>

          <TrajectoryMap
            selectedShelterId={selectedShelter?.id}
            onSelectShelter={handleSelectShelterOnMap}
            userCoords={userCoords}
          />
        </section>

        {/* Localizador y Directorio de Refugios Temporales */}
        <SheltersSection
          onSelectShelterOnMap={handleSelectShelterOnMap}
          userCoords={userCoords}
          activeLocationLabel={activeLocationLabel}
          onLocationResolved={handleLocationResolved}
        />

        {/* Visor Satelital NOAA GOES-18 */}
        <SatelliteViewer externalRefreshTrigger={refreshTrigger} />

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
