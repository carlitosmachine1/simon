/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertBanner } from './components/AlertBanner';
import { Navbar } from './components/Navbar';
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
  Navigation,
  Phone,
  Compass,
  Radio,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Handle location resolved either from manual search or GPS
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
      `Ubicación establecida (${resolved.label}): Te encuentras a aprox. ${formatDistance(
        distToEye
      )} del centro de Simón. Albergues ordenados por cercanía.`
    );
  };

  const handleSelectShelterOnMap = (shelter: Shelter) => {
    setSelectedShelter(shelter);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Critical Top Alert Strip (Calm and informative) */}
      <AlertBanner onOpenContacts={() => setIsContactsModalOpen(true)} />

      {/* 2. Main Navigation Header */}
      <Navbar onOpenContacts={() => setIsContactsModalOpen(true)} />

      {/* Location notification banner if active */}
      {locationMessage && (
        <div className="bg-sky-950/90 border-b border-sky-500/40 text-sky-200 text-xs px-4 py-2.5 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{locationMessage}</span>
            </span>
            <button
              onClick={() => setLocationMessage(null)}
              className="text-sky-300 hover:text-white font-bold ml-2 px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Content Portal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Metric and Alert Level Overview (with Ports, Roads, Rivers, Airports status) */}
        <StatusOverview />

        {/* Interactive Trajectory and Forecast Map */}
        <section id="mapa-trayectoria" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                Vigilancia Hidrometeorológica y Costera
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ruta Pronosticada, Radio de Vientos y Red de Albergues
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Monitoreo Oficial (Actualizado con boletín NHC / SMN)</span>
            </div>
          </div>

          <TrajectoryMap
            selectedShelterId={selectedShelter?.id}
            onSelectShelter={handleSelectShelterOnMap}
            userCoords={userCoords}
          />
        </section>

        {/* Shelters Directory & Dedicated Location Finder ("Pon tu ubicación o usa tu GPS") */}
        <SheltersSection
          onSelectShelterOnMap={handleSelectShelterOnMap}
          userCoords={userCoords}
          activeLocationLabel={activeLocationLabel}
          onLocationResolved={handleLocationResolved}
        />

        {/* NOAA Satellite Viewer */}
        <SatelliteViewer />

        {/* What to do Emergency Action Guide */}
        <EmergencyGuide />

        {/* 72h Emergency Kit Checklist */}
        <EmergencyKit />

        {/* Verified Official Sources */}
        <OfficialSources />
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Emergency Contacts Modal */}
      <EmergencyContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
          <a
            href="#localizador-refugios"
            className="flex-1 bg-sky-600 active:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <MapPin className="w-4 h-4" />
            <span>Refugio Cercano</span>
          </a>
          <button
            onClick={() => setIsContactsModalOpen(true)}
            className="flex-1 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Directorio 911</span>
          </button>
        </div>
      </div>
    </div>
  );
}
