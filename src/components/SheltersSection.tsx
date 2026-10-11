import React, { useState, useMemo } from 'react';
import { SHELTERS_DATA, Shelter } from '../data/hurricaneData';
import { LocationFinder } from './LocationFinder';
import { calculateDistanceKm, formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';
import {
  MapPin,
  PawPrint,
  Navigation,
  Phone,
  Search,
  Copy,
  Check,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertCircle,
  Info,
} from 'lucide-react';

interface SheltersSectionProps {
  onSelectShelterOnMap?: (shelter: Shelter) => void;
  userCoords?: { lat: number; lng: number } | null;
  activeLocationLabel?: string | null;
  onLocationResolved: (coords: { lat: number; lng: number; label: string }) => void;
}

export const SheltersSection: React.FC<SheltersSectionProps> = ({
  onSelectShelterOnMap,
  userCoords,
  activeLocationLabel,
  onLocationResolved,
}) => {
  const [selectedState, setSelectedState] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPets, setOnlyPets] = useState<boolean>(false);
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sheltersWithDistance = useMemo(() => {
    return SHELTERS_DATA.map((shelter) => {
      let distanceKm: number | null = null;
      if (userCoords) {
        distanceKm = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          shelter.lat,
          shelter.lng
        );
      }
      return {
        ...shelter,
        distanceKm,
      };
    });
  }, [userCoords]);

  const filteredShelters = useMemo(() => {
    return sheltersWithDistance
      .filter((s) => {
        if (selectedState !== 'todos' && s.state !== selectedState) return false;
        if (onlyPets && !s.petsAllowed) return false;
        if (onlyActive && s.status !== 'Activo / Abierto') return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const match =
            s.name.toLowerCase().includes(q) ||
            s.municipality.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.state.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        return 0;
      });
  }, [sheltersWithDistance, selectedState, onlyPets, onlyActive, searchQuery]);

  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalCapacity = useMemo(() => {
    return SHELTERS_DATA.reduce((acc, curr) => acc + curr.capacity, 0);
  }, []);

  const petFriendlyCount = useMemo(() => {
    return SHELTERS_DATA.filter((s) => s.petsAllowed).length;
  }, []);

  return (
    <section id="refugios" className="space-y-4">
      {/* 1. Location Finder Panel */}
      <LocationFinder
        onLocationResolved={onLocationResolved}
        activeLocationLabel={activeLocationLabel}
        userCoords={userCoords}
        onSelectShelter={onSelectShelterOnMap}
      />

      {/* 2. Shelter Directory Panel */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75]" />
              Red de Albergues de Protección Civil
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#252A2E] mt-0.5">
              Directorio de Refugios Temporales Habilitados
            </h2>
            <p className="text-xs text-[#687078] mt-0.5 max-w-2xl">
              Inmuebles listos para recepción de personas y animales de compañía en Colima, Jalisco, Nayarit, Michoacán y BCS.
            </p>
          </div>

          <div className="text-[11px] text-[#687078] bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] px-2.5 py-1.5 flex items-center gap-1.5 shrink-0">
            <Info className="w-3.5 h-3.5 text-[#245A66] shrink-0 stroke-[1.75]" />
            <span>Datos provistos por las Unidades Estatales de Protección Civil</span>
          </div>
        </div>

        {/* Aggregate Metadata Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-2.5">
            <div className="text-[#687078] text-[11px]">Sedes Registradas</div>
            <div className="text-lg font-semibold text-[#252A2E] font-tabular mt-0.5">{SHELTERS_DATA.length}</div>
          </div>
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-2.5">
            <div className="text-[#687078] text-[11px]">Capacidad Total Estimada</div>
            <div className="text-lg font-semibold text-[#245A66] font-tabular mt-0.5">
              {totalCapacity.toLocaleString()} personas
            </div>
          </div>
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-2.5">
            <div className="text-[#687078] text-[11px]">Sedes Pet-Friendly</div>
            <div className="text-lg font-semibold text-[#A66C19] font-tabular mt-0.5">
              {petFriendlyCount}
            </div>
          </div>
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-2.5">
            <div className="text-[#687078] text-[11px]">Estados con Cobertura</div>
            <div className="text-lg font-semibold text-[#7D9B8A] font-tabular mt-0.5">5 Estados</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#687078] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por municipio, colonia o nombre de escuela..."
                className="w-full bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] pl-8 pr-4 py-1.5 text-xs text-[#252A2E] placeholder-[#687078] focus:outline-none focus:border-[#245A66] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#687078] hover:text-[#252A2E]"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-[#F7F7F4] border border-[#DDE1DF] text-[#252A2E] text-xs rounded-[4px] px-2.5 py-1.5 focus:outline-none focus:border-[#245A66]"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Jalisco">Jalisco (Puerto Vallarta / Costalegre)</option>
              <option value="Colima">Colima (Manzanillo / Tecomán / Armería)</option>
              <option value="Nayarit">Nayarit (Bahía de Banderas / San Blas)</option>
              <option value="Michoacán">Michoacán (Lázaro Cárdenas / Coahuayana)</option>
              <option value="Baja California Sur">Baja California Sur (Los Cabos / La Paz)</option>
            </select>
          </div>

          {/* Quick Toggle Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <button
              onClick={() => setOnlyPets(!onlyPets)}
              className={`px-2.5 py-1 rounded-[3px] text-xs font-medium flex items-center gap-1 transition ${
                onlyPets
                  ? 'bg-[#245A66] text-white'
                  : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
              }`}
            >
              <PawPrint className="w-3 h-3" />
              <span>Acepta Mascotas ({petFriendlyCount})</span>
            </button>

            <button
              onClick={() => setOnlyActive(!onlyActive)}
              className={`px-2.5 py-1 rounded-[3px] text-xs font-medium flex items-center gap-1 transition ${
                onlyActive
                  ? 'bg-[#245A66] text-white'
                  : 'bg-[#F7F7F4] text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Solo Abiertos / Habilitados</span>
            </button>

            {(selectedState !== 'todos' || searchQuery || onlyPets || onlyActive) && (
              <button
                onClick={() => {
                  setSelectedState('todos');
                  setSearchQuery('');
                  setOnlyPets(false);
                  setOnlyActive(false);
                }}
                className="text-xs text-[#245A66] hover:underline px-2 py-0.5 font-medium"
              >
                Restablecer filtros
              </button>
            )}

            <span className="text-xs text-[#687078] ml-auto font-tabular">
              Mostrando {filteredShelters.length} de {SHELTERS_DATA.length} sedes
              {userCoords && ' (ordenados por distancia)'}
            </span>
          </div>
        </div>

        {/* Shelter Cards Grid */}
        {filteredShelters.length === 0 ? (
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-6 text-center text-xs text-[#687078]">
            <AlertCircle className="w-6 h-6 text-[#A66C19] mx-auto mb-1.5 stroke-[1.75]" />
            <div className="text-sm font-semibold text-[#252A2E]">No se encontraron albergues</div>
            <p className="mt-0.5">Pruebe restableciendo los filtros de estado o término de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredShelters.map((shelter) => {
              const gmapsLink = getGoogleMapsDirectionsUrl(
                shelter.lat,
                shelter.lng,
                shelter.name
              );

              return (
                <div
                  key={shelter.id}
                  className="bg-[#F7F7F4] border border-[#DDE1DF] hover:border-[#245A66]/40 rounded-[4px] p-3.5 flex flex-col justify-between transition"
                >
                  <div className="space-y-1.5">
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-semibold text-[#245A66] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[2px]">
                          {shelter.state}
                        </span>
                        <span className="text-[10px] text-[#687078] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[2px]">
                          {shelter.municipality}
                        </span>
                      </div>

                      {shelter.distanceKm !== null && (
                        <span className="text-[10px] font-semibold text-[#245A66] font-tabular bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5 shrink-0">
                          <Navigation className="w-2.5 h-2.5 stroke-[2]" />
                          {formatDistance(shelter.distanceKm)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#252A2E] text-xs leading-snug">
                      {shelter.name}
                    </h3>

                    <p className="text-[#687078] text-[11px] flex items-start gap-1 leading-tight">
                      <MapPin className="w-3 h-3 text-[#687078] shrink-0 mt-0.5 stroke-[1.75]" />
                      <span>{shelter.address}</span>
                    </p>

                    {/* Status & Pet Policy */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] bg-white border border-[#DDE1DF] text-[#252A2E]">
                        {shelter.status}
                      </span>
                      {shelter.petsAllowed ? (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] bg-[#3F8063]/10 text-[#3F8063] border border-[#3F8063]/25 flex items-center gap-1">
                          <PawPrint className="w-2.5 h-2.5" />
                          Acepta mascotas
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#687078] px-1.5 py-0.5 rounded-[2px] bg-white border border-[#DDE1DF]">
                          Sin mascotas
                        </span>
                      )}
                    </div>

                    {/* Capacity Line */}
                    <div className="bg-white border border-[#DDE1DF] rounded-[3px] p-2 text-[11px] font-tabular space-y-1">
                      <div className="flex justify-between text-[#687078]">
                        <span>Ocupación registrada:</span>
                        <span className="font-medium text-[#252A2E]">
                          {shelter.currentOccupancy || 0} / {shelter.capacity} personas
                        </span>
                      </div>
                      <div className="w-full bg-[#DDE1DF] h-1 rounded-[1px] overflow-hidden">
                        <div
                          className="bg-[#245A66] h-1 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((shelter.currentOccupancy || 0) / shelter.capacity) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {shelter.notes && (
                      <p className="text-[10px] text-[#687078] bg-white border border-[#DDE1DF] p-1.5 rounded-[2px] leading-tight">
                        {shelter.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2.5 mt-2 border-t border-[#DDE1DF] space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={gmapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#245A66] hover:bg-[#1b434c] text-white font-medium py-1.5 px-2 rounded-[3px] text-[11px] flex items-center justify-center gap-1 transition"
                      >
                        <Navigation className="w-3 h-3 stroke-[1.75]" />
                        <span>Cómo llegar</span>
                      </a>

                      <button
                        onClick={() => {
                          if (onSelectShelterOnMap) onSelectShelterOnMap(shelter);
                          const mapEl = document.getElementById('mapa-trayectoria');
                          if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white hover:bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF] font-medium py-1.5 px-2 rounded-[3px] text-[11px] flex items-center justify-center gap-1 transition"
                      >
                        <MapPin className="w-3 h-3 text-[#245A66] stroke-[1.75]" />
                        <span>Ver en mapa</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <button
                        onClick={() => handleCopyAddress(shelter.id, shelter.address)}
                        className="text-[#687078] hover:text-[#252A2E] flex items-center gap-1 transition"
                      >
                        {copiedId === shelter.id ? (
                          <span className="text-[#3F8063] font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copiado
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-3 h-3 stroke-[1.75]" /> Copiar dirección
                          </span>
                        )}
                      </button>

                      {shelter.phone && (
                        <a
                          href={`tel:${shelter.phone.replace(/\s+/g, '')}`}
                          className="text-[#245A66] hover:underline font-medium font-tabular flex items-center gap-0.5"
                        >
                          <Phone className="w-3 h-3 stroke-[1.75]" />
                          <span>{shelter.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
