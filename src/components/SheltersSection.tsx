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
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertCircle,
  Filter,
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

  // Calculate distances if user coordinates are known
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

  // Filtered and sorted shelters
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
    <section id="refugios" className="space-y-6">
      {/* 1. Dedicated Location & Nearest Shelter Finder */}
      <div id="localizador-refugios">
        <LocationFinder
          onLocationResolved={onLocationResolved}
          activeLocationLabel={activeLocationLabel}
          userCoords={userCoords}
          onSelectShelter={onSelectShelterOnMap}
        />
      </div>

      {/* 2. Shelter Directory Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Directorio de Protección Civil
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Directorio de Refugios Temporales
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consulte la red oficial de inmuebles listos para recepción de familias y mascotas en los municipios costeros de Jalisco, Colima, Nayarit y Michoacán.
            </p>
          </div>

          {/* Quick API Key / Architecture clarity pill */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 flex items-start gap-2 max-w-sm">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong>Acceso Abierto:</strong> No requiere API Keys comerciales ni pagos. Funciona con GPS estándar y bases oficiales de Protección Civil.
            </div>
          </div>
        </div>

        {/* Shelter Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 font-medium">Refugios Registrados</div>
            <div className="text-xl font-bold text-white mt-0.5">{SHELTERS_DATA.length} sedes</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 font-medium">Capacidad Total Estimada</div>
            <div className="text-xl font-bold text-sky-400 mt-0.5">
              {totalCapacity.toLocaleString()} personas
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 font-medium">Refugios Pet-Friendly</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {petFriendlyCount} con mascotas
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 font-medium">Estados con Cobertura</div>
            <div className="text-xl font-bold text-teal-400 mt-0.5">5 Estados</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por municipio, colonia, escuela o calle..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* State Select */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Jalisco">Jalisco (Puerto Vallarta / Costalegre)</option>
              <option value="Colima">Colima (Manzanillo / Tecomán / Armería)</option>
              <option value="Nayarit">Nayarit (Bahía de Banderas / San Blas)</option>
              <option value="Michoacán">Michoacán (Lázaro Cárdenas / Coahuayana)</option>
              <option value="Baja California Sur">Baja California Sur (Los Cabos / La Paz)</option>
            </select>
          </div>

          {/* Quick toggle chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyPets(!onlyPets)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                onlyPets
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>Acepta Mascotas ({petFriendlyCount})</span>
            </button>

            <button
              onClick={() => setOnlyActive(!onlyActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                onlyActive
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
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
                className="text-xs text-sky-400 hover:underline px-2 py-1"
              >
                Restablecer filtros
              </button>
            )}

            <span className="text-xs text-slate-400 ml-auto font-medium">
              Mostrando {filteredShelters.length} de {SHELTERS_DATA.length} albergues
              {userCoords && ' (ordenados por cercanía)'}
            </span>
          </div>
        </div>

        {/* Shelter Cards Grid */}
        {filteredShelters.length === 0 ? (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-base">No hay refugios con los filtros seleccionados</h3>
            <p className="text-slate-400 text-xs mt-1">
              Prueba a restablecer los filtros para ver todos los albergues de la región.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShelters.map((shelter) => {
              const gmapsLink = getGoogleMapsDirectionsUrl(
                shelter.lat,
                shelter.lng,
                shelter.name
              );

              return (
                <div
                  key={shelter.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-md flex flex-col justify-between transition group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-sky-300 bg-sky-950/80 border border-sky-500/30 px-2 py-0.5 rounded-md">
                          {shelter.state}
                        </span>
                        <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                          {shelter.municipality}
                        </span>
                      </div>

                      {shelter.distanceKm !== null && (
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <Navigation className="w-3 h-3 text-emerald-400" />
                          A {formatDistance(shelter.distanceKm)}
                        </span>
                      )}
                    </div>

                    {/* Shelter Name */}
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-sky-300 transition">
                      {shelter.name}
                    </h3>

                    {/* Address */}
                    <p className="text-slate-400 text-xs mt-1.5 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{shelter.address}</span>
                    </p>

                    {/* Status & Pet Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 my-3">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          shelter.status === 'Activo / Abierto'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            shelter.status === 'Activo / Abierto'
                              ? 'bg-emerald-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        {shelter.status}
                      </span>

                      {shelter.petsAllowed ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-200 border border-amber-500/30 flex items-center gap-1">
                          <PawPrint className="w-3 h-3 text-amber-400" />
                          Acepta Mascotas
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          Sin mascotas
                        </span>
                      )}
                    </div>

                    {/* Capacity Bar */}
                    <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 mb-3 text-xs">
                      <div className="flex justify-between items-center text-slate-400 mb-1">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Users className="w-3 h-3 text-slate-400" />
                          Ocupación registrada
                        </span>
                        <span className="text-white font-semibold">
                          {shelter.currentOccupancy || 0} / {shelter.capacity} personas
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((shelter.currentOccupancy || 0) / shelter.capacity) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Facilities list */}
                    {shelter.facilities && shelter.facilities.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                          Servicios disponibles:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {shelter.facilities.map((fac, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-850 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                            >
                              ✓ {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {shelter.notes && (
                      <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 mb-3 leading-relaxed">
                        ℹ️ {shelter.notes}
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Google Maps Directions */}
                      <a
                        href={gmapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Cómo Llegar</span>
                      </a>

                      {/* Ver en Mapa */}
                      <button
                        onClick={() => {
                          if (onSelectShelterOnMap) {
                            onSelectShelterOnMap(shelter);
                          }
                          const mapElem = document.getElementById('mapa-trayectoria');
                          if (mapElem) {
                            mapElem.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-200 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-700"
                      >
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>Ver en Mapa</span>
                      </button>
                    </div>

                    {/* Copy Address & Phone */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => handleCopyAddress(shelter.id, shelter.address)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition"
                      >
                        {copiedId === shelter.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Dirección copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar dirección</span>
                          </>
                        )}
                      </button>

                      {shelter.phone && (
                        <a
                          href={`tel:${shelter.phone.replace(/\s+/g, '')}`}
                          className="text-sky-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Phone className="w-3 h-3" />
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
