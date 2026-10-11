import React, { useState, useEffect } from 'react';
import {
  Search,
  Navigation,
  MapPin,
  PawPrint,
  Car,
  Footprints,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SHELTERS_DATA, Shelter, COASTAL_LOCATIONS, PredefinedLocation } from '../data/hurricaneData';
import {
  calculateDistanceKm,
  formatDistance,
  estimateTravelTime,
  getGoogleMapsDirectionsUrl,
  geocodeUserLocation,
  searchLocalLocations,
} from '../utils/geo';

interface LocationFinderProps {
  onLocationResolved: (coords: { lat: number; lng: number; label: string }) => void;
  activeLocationLabel?: string | null;
  userCoords?: { lat: number; lng: number } | null;
  onSelectShelter?: (shelter: Shelter) => void;
}

export const LocationFinder: React.FC<LocationFinderProps> = ({
  onLocationResolved,
  activeLocationLabel,
  userCoords,
  onSelectShelter,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PredefinedLocation[]>([]);

  const closestShelter = React.useMemo(() => {
    if (!userCoords) return null;

    let nearest: { shelter: Shelter; distanceKm: number } | null = null;
    for (const shelter of SHELTERS_DATA) {
      const dist = calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        shelter.lat,
        shelter.lng
      );
      if (!nearest || dist < nearest.distanceKm) {
        nearest = { shelter, distanceKm: dist };
      }
    }
    return nearest;
  }, [userCoords]);

  useEffect(() => {
    if (inputText.trim().length >= 2) {
      const matches = searchLocalLocations(inputText);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputText]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setSuggestions([]);

    const result = await geocodeUserLocation(inputText);
    setIsSearching(false);

    if (result) {
      onLocationResolved({
        lat: result.lat,
        lng: result.lng,
        label: result.displayName,
      });
    } else {
      setErrorMessage(
        'No se encontró la ubicación específica. Por favor seleccione una de las opciones sugeridas o el municipio más cercano.'
      );
    }
  };

  const handleSelectPreset = (loc: PredefinedLocation) => {
    setInputText(loc.name);
    setSuggestions([]);
    setErrorMessage(null);
    onLocationResolved({
      lat: loc.lat,
      lng: loc.lng,
      label: `${loc.name}, ${loc.municipality}, ${loc.state}`,
    });
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Su navegador no admite geolocalización GPS.');
      return;
    }

    setIsGpsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        onLocationResolved({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Ubicación GPS del dispositivo',
        });
      },
      (err) => {
        setIsGpsLoading(false);
        setErrorMessage(
          'No se pudo obtener la señal GPS. Puede ingresar su colonia o municipio manualmente.'
        );
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
    );
  };

  const travelTimes = closestShelter
    ? estimateTravelTime(closestShelter.distanceKm)
    : null;

  return (
    <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-3">
        <div>
          <div className="text-[11px] font-semibold text-[#245A66] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
            Localizador Preventivo de Albergues
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#252A2E] mt-0.5">
            Identificación de Refugio por Ubicación
          </h3>
          <p className="text-xs text-[#687078] mt-0.5">
            Ingrese su municipio, colonia o active el GPS para ordenar los refugios por proximidad física.
          </p>
        </div>

        {activeLocationLabel && (
          <div className="flex items-center gap-2 bg-[#F7F7F4] border border-[#DDE1DF] px-2.5 py-1 rounded-[4px] text-xs text-[#252A2E] shrink-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F8063]" />
            <span className="truncate max-w-[220px]">{activeLocationLabel}</span>
          </div>
        )}
      </div>

      {/* Input & GPS Controls */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Autocomplete Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#687078] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escriba colonia o municipio (ej. El Pitillal, Manzanillo, Bucerías, Cihuatlán)..."
              className="w-full bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] pl-9 pr-20 py-2 text-xs sm:text-sm text-[#252A2E] placeholder-[#687078] focus:outline-none focus:border-[#245A66] focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isSearching || !inputText.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#245A66] hover:bg-[#1b434c] disabled:opacity-40 text-white font-medium text-xs px-2.5 py-1.5 rounded-[3px] transition"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] shadow-sm z-20 overflow-hidden divide-y divide-[#DDE1DF]">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(sug)}
                    className="w-full text-left px-3 py-2 text-xs text-[#252A2E] hover:bg-[#F7F7F4] flex items-center justify-between transition"
                  >
                    <div>
                      <span className="font-semibold">{sug.name}</span>
                      <span className="text-[#687078] text-[11px] ml-1.5">
                        ({sug.municipality}, {sug.state})
                      </span>
                    </div>
                    <span className="text-[10px] text-[#687078] bg-[#F7F7F4] px-1.5 py-0.5 rounded-[2px] border border-[#DDE1DF]">
                      {sug.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseGps}
            disabled={isGpsLoading}
            className="bg-[#F7F7F4] hover:bg-[#EAEAE4] border border-[#DDE1DF] text-[#252A2E] font-medium px-3.5 py-2 rounded-[4px] text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#245A66] stroke-[1.75] ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Consultando GPS...' : 'Usar GPS del dispositivo'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#687078]">
          <span className="text-[11px]">Zonas frecuentes:</span>
          {[
            'Puerto Vallarta (Centro)',
            'El Pitillal',
            'Manzanillo (Centro)',
            'Bucerías',
            'Barra de Navidad',
            'Cihuatlán (Cabecera)',
            'Tecomán (Centro)',
            'San Blas',
          ].map((presetName) => {
            const loc = COASTAL_LOCATIONS.find((l) => l.name === presetName);
            if (!loc) return null;
            return (
              <button
                key={presetName}
                type="button"
                onClick={() => handleSelectPreset(loc)}
                className="bg-[#F7F7F4] hover:bg-[#EAEAE4] border border-[#DDE1DF] text-[#252A2E] text-[11px] px-2 py-0.5 rounded-[3px] transition"
              >
                {loc.name.replace(/\s*\(.*\)/, '')}
              </button>
            );
          })}
        </div>
      </form>

      {errorMessage && (
        <div className="bg-[#A66C19]/10 border border-[#A66C19]/20 rounded-[4px] p-2.5 text-xs text-[#A66C19]">
          {errorMessage}
        </div>
      )}

      {/* RESULT PANEL: Closest Shelter */}
      {closestShelter && (
        <div className="bg-[#F7F7F4] border border-[#245A66]/30 rounded-[4px] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F8063]" />
              <span className="text-xs font-semibold text-[#245A66] uppercase tracking-wide">
                Refugio Más Próximo a su Posición
              </span>
            </div>

            <div className="text-xs font-semibold text-[#245A66] font-tabular bg-white border border-[#DDE1DF] px-2 py-0.5 rounded-[3px]">
              A {formatDistance(closestShelter.distanceKm)} de distancia
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:col-span-2 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#245A66] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[3px]">
                  {closestShelter.shelter.state} • {closestShelter.shelter.municipality}
                </span>
                <span className="text-[11px] text-[#687078] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[3px] font-tabular">
                  Capacidad: {closestShelter.shelter.capacity} pers.
                </span>
                {closestShelter.shelter.petsAllowed && (
                  <span className="text-[11px] font-medium text-[#3F8063] bg-[#3F8063]/10 border border-[#3F8063]/20 px-1.5 py-0.5 rounded-[3px] flex items-center gap-1">
                    <PawPrint className="w-3 h-3" />
                    Acepta Mascotas
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-[#252A2E]">
                {closestShelter.shelter.name}
              </h4>

              <p className="text-xs text-[#687078] flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#687078] shrink-0 mt-0.5 stroke-[1.75]" />
                <span>{closestShelter.shelter.address}</span>
              </p>

              {travelTimes && (
                <div className="flex items-center gap-4 text-xs text-[#687078] pt-1 font-tabular">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 stroke-[1.75]" />
                    A pie: ~{travelTimes.walking}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 stroke-[1.75]" />
                    En vehículo: ~{travelTimes.driving}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <a
                href={getGoogleMapsDirectionsUrl(
                  closestShelter.shelter.lat,
                  closestShelter.shelter.lng,
                  closestShelter.shelter.name
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#245A66] hover:bg-[#1b434c] text-white font-medium py-2 px-3 rounded-[4px] text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <Navigation className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Ruta en Google Maps</span>
              </a>

              {closestShelter.shelter.phone && (
                <a
                  href={`tel:${closestShelter.shelter.phone.replace(/\s+/g, '')}`}
                  className="bg-white hover:bg-[#F7F7F4] text-[#252A2E] font-medium py-2 px-3 rounded-[4px] text-xs flex items-center justify-center gap-1 border border-[#DDE1DF] transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#3F8063] stroke-[1.75]" />
                  <span>Teléfono: {closestShelter.shelter.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
