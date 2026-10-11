import React, { useState, useEffect } from 'react';
import {
  Search,
  Navigation,
  MapPin,
  PawPrint,
  Clock,
  Car,
  Footprints,
  CheckCircle2,
  Phone,
  RotateCcw,
  Sparkles,
  ShieldCheck,
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

  // Find the closest shelter if userCoords are available
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

  // Handle live suggestions as user types
  useEffect(() => {
    if (inputText.trim().length >= 2) {
      const matches = searchLocalLocations(inputText);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputText]);

  // Handle Search submit
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
        'No encontramos esa ubicación específica. Elige una de las sugerencias o selecciona tu municipio más cercano.'
      );
    }
  };

  // Handle Select Preset or Suggestion
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

  // Handle Device GPS
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Tu navegador no admite geolocalización GPS.');
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
          label: 'Ubicación GPS actual del dispositivo',
        });
      },
      (err) => {
        setIsGpsLoading(false);
        setErrorMessage(
          'No se pudo obtener la señal GPS (permiso denegado). Puedes escribir tu colonia o municipio en el campo de texto.'
        );
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
    );
  };

  const travelTimes = closestShelter
    ? estimateTravelTime(closestShelter.distanceKm)
    : null;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Title & Informative Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Localizador Preventivo de Albergues
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Encuentra tu refugio más cercano
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Ingresa tu ubicación o activa el GPS para ordenar los refugios por proximidad y calcular tiempos de traslado.
          </p>
        </div>

        {activeLocationLabel && (
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="truncate max-w-[200px]">{activeLocationLabel}</span>
          </div>
        )}
      </div>

      {/* Input Form & GPS Button */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Text Input with Autocomplete */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu colonia, municipio o código postal (ej. El Pitillal, Manzanillo, Bucerías)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
            <button
              type="submit"
              disabled={isSearching || !inputText.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden divide-y divide-slate-800">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(sug)}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-850 hover:text-white flex items-center justify-between transition"
                  >
                    <div>
                      <span className="font-semibold text-white">{sug.name}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">
                        ({sug.municipality}, {sug.state})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
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
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
          >
            <Navigation className={`w-4 h-4 text-sky-400 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Obteniendo GPS...' : 'Usar GPS de mi dispositivo'}</span>
          </button>
        </div>

        {/* Quick Location Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px]">Zonas rápidas:</span>
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
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg transition"
              >
                {loc.name.replace(/\s*\(.*\)/, '')}
              </button>
            );
          })}
        </div>
      </form>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 text-xs text-amber-200">
          {errorMessage}
        </div>
      )}

      {/* RESULT CARD: Closest Shelter Found */}
      {closestShelter && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-sky-600/60 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Refugio más próximo a tu ubicación
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white bg-sky-950 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
                A {formatDistance(closestShelter.distanceKm)} de distancia
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Shelter Details */}
            <div className="lg:col-span-2 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {closestShelter.shelter.state} • {closestShelter.shelter.municipality}
                </span>
                <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  Capacidad: {closestShelter.shelter.capacity} pers.
                </span>
                {closestShelter.shelter.petsAllowed && (
                  <span className="text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 font-semibold">
                    <PawPrint className="w-3 h-3 text-amber-400" />
                    Acepta Mascotas
                  </span>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white">
                {closestShelter.shelter.name}
              </h4>

              <p className="text-xs text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{closestShelter.shelter.address}</span>
              </p>

              {travelTimes && (
                <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-slate-400" />
                    A pie: ~{travelTimes.walking}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    En auto: ~{travelTimes.driving}
                  </span>
                </div>
              )}
            </div>

            {/* Direct Navigation & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full">
              <a
                href={getGoogleMapsDirectionsUrl(
                  closestShelter.shelter.lat,
                  closestShelter.shelter.lng,
                  closestShelter.shelter.name
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Cómo Llegar (Google Maps)</span>
              </a>

              {closestShelter.shelter.phone && (
                <a
                  href={`tel:${closestShelter.shelter.phone.replace(/\s+/g, '')}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Llamar: {closestShelter.shelter.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
