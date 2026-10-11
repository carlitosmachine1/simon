import React, { useState, useMemo, useEffect } from 'react';
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
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Building,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  Users,
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
  // Navigation and Filter States
  const [selectedState, setSelectedState] = useState<string>('todos');
  const [selectedMun, setSelectedMun] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPets, setOnlyPets] = useState<boolean>(false);
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Accordion open/close state: key is `${state} — ${municipality}`
  // CRITICAL UX: Initially EMPTY object so ALL accordions start COLLAPSED!
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Expand limit per municipality (shows first 6, with "Ver más" button to prevent 60-card sprawl)
  const [expandedLimits, setExpandedLimits] = useState<Record<string, boolean>>({});

  // Copy address feedback
  const handleCopyAddress = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Add distance calculation to shelters if userCoords exist
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

  // Filtered shelters based on criteria
  const filteredShelters = useMemo(() => {
    return sheltersWithDistance.filter((s) => {
      // State Filter
      if (selectedState !== 'todos') {
        if (selectedState === 'Otras') {
          if (s.state !== 'Michoacán' && s.state !== 'Baja California Sur') return false;
        } else if (s.state !== selectedState) {
          return false;
        }
      }

      // Municipality Filter
      if (selectedMun !== 'todos' && s.municipality !== selectedMun) {
        return false;
      }

      // Pet Friendly Filter
      if (onlyPets && !s.petsAllowed) return false;

      // Active Only Filter
      if (onlyActive && s.status !== 'Activo / Abierto') return false;

      // Text Search Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const match =
          s.name.toLowerCase().includes(q) ||
          s.municipality.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [sheltersWithDistance, selectedState, selectedMun, onlyPets, onlyActive, searchQuery]);

  // Auto-expand behavior when filtering specifically:
  // 1. If user picks a specific municipality, auto-open just that municipality
  // 2. If user is actively searching, auto-open all matching groups
  // 3. Otherwise, maintain user collapsed state (or collapsed by default)
  useEffect(() => {
    if (selectedMun !== 'todos') {
      const targetState = SHELTERS_DATA.find((s) => s.municipality === selectedMun)?.state || '';
      const key = `${targetState} — ${selectedMun}`;
      setOpenGroups({ [key]: true });
    } else if (searchQuery.trim().length > 1) {
      // Auto-open all matching groups during active search
      const autoOpen: Record<string, boolean> = {};
      filteredShelters.forEach((s) => {
        autoOpen[`${s.state} — ${s.municipality}`] = true;
      });
      setOpenGroups(autoOpen);
    }
  }, [selectedMun, searchQuery, filteredShelters]);

  // Aggregate Counts for Metrics and Tabs
  const colimaCount = useMemo(() => SHELTERS_DATA.filter((s) => s.state === 'Colima').length, []);
  const jaliscoCount = useMemo(() => SHELTERS_DATA.filter((s) => s.state === 'Jalisco').length, []);
  const nayaritCount = useMemo(() => SHELTERS_DATA.filter((s) => s.state === 'Nayarit').length, []);
  const otherCount = useMemo(
    () => SHELTERS_DATA.filter((s) => s.state === 'Michoacán' || s.state === 'Baja California Sur').length,
    []
  );

  const totalCapacity = useMemo(() => {
    return filteredShelters.reduce((acc, curr) => acc + curr.capacity, 0);
  }, [filteredShelters]);

  const petFriendlyCount = useMemo(() => {
    return filteredShelters.filter((s) => s.petsAllowed).length;
  }, [filteredShelters]);

  // Group filtered shelters by municipality for Accordion
  const groupedByMunicipality = useMemo(() => {
    const groups: Record<
      string,
      {
        state: string;
        municipality: string;
        shelters: typeof filteredShelters;
        totalCapacity: number;
        petCount: number;
        minDistance: number | null;
      }
    > = {};

    filteredShelters.forEach((shelter) => {
      const key = `${shelter.state} — ${shelter.municipality}`;
      if (!groups[key]) {
        groups[key] = {
          state: shelter.state,
          municipality: shelter.municipality,
          shelters: [],
          totalCapacity: 0,
          petCount: 0,
          minDistance: null,
        };
      }
      groups[key].shelters.push(shelter);
      groups[key].totalCapacity += shelter.capacity;
      if (shelter.petsAllowed) groups[key].petCount += 1;
      if (shelter.distanceKm !== null) {
        if (groups[key].minDistance === null || shelter.distanceKm < groups[key].minDistance!) {
          groups[key].minDistance = shelter.distanceKm;
        }
      }
    });

    return Object.values(groups).sort((a, b) => {
      // Sort groups by distance if userCoords available, otherwise by shelter count descending
      if (userCoords && a.minDistance !== null && b.minDistance !== null) {
        return a.minDistance - b.minDistance;
      }
      if (a.state !== b.state) return a.state.localeCompare(b.state);
      return b.shelters.length - a.shelters.length;
    });
  }, [filteredShelters, userCoords]);

  // Toggle Accordion Group
  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Expand all / Collapse all groups
  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    groupedByMunicipality.forEach((g) => {
      allOpen[`${g.state} — ${g.municipality}`] = true;
    });
    setOpenGroups(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenGroups({});
  };

  // Toggle limit to show all shelters in a single municipality
  const toggleShowAllInMunicipality = (key: string) => {
    setExpandedLimits((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedState('todos');
    setSelectedMun('todos');
    setSearchQuery('');
    setOnlyPets(false);
    setOnlyActive(false);
    setOpenGroups({});
  };

  const hasActiveFilters =
    selectedState !== 'todos' ||
    selectedMun !== 'todos' ||
    searchQuery.trim() !== '' ||
    onlyPets ||
    onlyActive;

  return (
    <section id="refugios" className="space-y-4">
      {/* 1. Location Finder Panel (GPS / Localizador de colonia) */}
      <LocationFinder
        onLocationResolved={onLocationResolved}
        activeLocationLabel={activeLocationLabel}
        userCoords={userCoords}
        onSelectShelter={onSelectShelterOnMap}
      />

      {/* 2. Official Sources Link Banner */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-3 sm:p-4 text-xs text-[#252A2E] space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#245A66] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#245A66] stroke-[1.75]" />
                Directorio Oficial Georreferenciado
              </span>
              <span className="text-[#DDE1DF]">|</span>
              <span className="text-[11px] text-[#687078] font-tabular">
                {SHELTERS_DATA.length} Refugios Validados en Colima, Jalisco y Nayarit
              </span>
            </div>
            <p className="text-[11px] text-[#687078] max-w-2xl leading-relaxed">
              Consulta organizada en acordeón colapsable para una navegación ágil sin bloquear el resto del portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <a
              href="https://refugios-proteccioncivil.col.gob.mx/refugios/publico"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#245A66] border border-[#DDE1DF] font-medium px-2 py-1 rounded-[4px] text-[11px] flex items-center gap-1 transition"
            >
              <span>GIR Colima</span>
              <ExternalLink className="w-3 h-3 stroke-[2]" />
            </a>
            <a
              href="https://proteccioncivil.jalisco.gob.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#245A66] border border-[#DDE1DF] font-medium px-2 py-1 rounded-[4px] text-[11px] flex items-center gap-1 transition"
            >
              <span>PC Jalisco</span>
              <ExternalLink className="w-3 h-3 stroke-[2]" />
            </a>
            <a
              href="https://bahiadebanderas.gob.mx/refugios/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#245A66] border border-[#DDE1DF] font-medium px-2 py-1 rounded-[4px] text-[11px] flex items-center gap-1 transition"
            >
              <span>PC Bahía</span>
              <ExternalLink className="w-3 h-3 stroke-[2]" />
            </a>
          </div>
        </div>

        {/* State Quick Switch Segmented Tabs */}
        <div className="pt-2 border-t border-[#DDE1DF] flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#687078] font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#245A66]" />
            Entidad:
          </span>

          <button
            onClick={() => {
              setSelectedState('todos');
              setSelectedMun('todos');
            }}
            className={`text-[11px] font-tabular px-2.5 py-1 rounded-[4px] border transition flex items-center gap-1 ${
              selectedState === 'todos'
                ? 'bg-[#245A66] text-white border-[#245A66] font-medium'
                : 'bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAEAE4]'
            }`}
          >
            <span>Todos</span>
            <span className={`text-[10px] px-1 rounded-[2px] ${selectedState === 'todos' ? 'bg-white/20 text-white' : 'bg-white text-[#687078]'}`}>
              {SHELTERS_DATA.length}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedState('Colima');
              setSelectedMun('todos');
            }}
            className={`text-[11px] font-tabular px-2.5 py-1 rounded-[4px] border transition flex items-center gap-1 ${
              selectedState === 'Colima'
                ? 'bg-[#245A66] text-white border-[#245A66] font-medium'
                : 'bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAEAE4]'
            }`}
          >
            <span>Colima</span>
            <span className={`text-[10px] px-1 rounded-[2px] ${selectedState === 'Colima' ? 'bg-white/20 text-white' : 'bg-white text-[#687078]'}`}>
              {colimaCount}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedState('Jalisco');
              setSelectedMun('todos');
            }}
            className={`text-[11px] font-tabular px-2.5 py-1 rounded-[4px] border transition flex items-center gap-1 ${
              selectedState === 'Jalisco'
                ? 'bg-[#245A66] text-white border-[#245A66] font-medium'
                : 'bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAEAE4]'
            }`}
          >
            <span>Jalisco</span>
            <span className={`text-[10px] px-1 rounded-[2px] ${selectedState === 'Jalisco' ? 'bg-white/20 text-white' : 'bg-white text-[#687078]'}`}>
              {jaliscoCount}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedState('Nayarit');
              setSelectedMun('todos');
            }}
            className={`text-[11px] font-tabular px-2.5 py-1 rounded-[4px] border transition flex items-center gap-1 ${
              selectedState === 'Nayarit'
                ? 'bg-[#245A66] text-white border-[#245A66] font-medium'
                : 'bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAEAE4]'
            }`}
          >
            <span>Nayarit</span>
            <span className={`text-[10px] px-1 rounded-[2px] ${selectedState === 'Nayarit' ? 'bg-white/20 text-white' : 'bg-white text-[#687078]'}`}>
              {nayaritCount}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedState('Otras');
              setSelectedMun('todos');
            }}
            className={`text-[11px] font-tabular px-2.5 py-1 rounded-[4px] border transition flex items-center gap-1 ${
              selectedState === 'Otras'
                ? 'bg-[#245A66] text-white border-[#245A66] font-medium'
                : 'bg-[#F7F7F4] text-[#252A2E] border-[#DDE1DF] hover:bg-[#EAEAE4]'
            }`}
          >
            <span>Mich. / BCS</span>
            <span className={`text-[10px] px-1 rounded-[2px] ${selectedState === 'Otras' ? 'bg-white/20 text-white' : 'bg-white text-[#687078]'}`}>
              {otherCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Accordion Container */}
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-4 sm:p-5 shadow-none space-y-3.5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75]" />
              Red de Refugios Temporales Habilitados
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#252A2E] mt-0.5">
              Acordeón de Refugios por Municipio
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-tabular text-[#687078]">
            <span>
              <strong>{groupedByMunicipality.length}</strong> municipios registrados
            </span>
            <span>•</span>
            <span>
              <strong>{filteredShelters.length}</strong> refugios ({totalCapacity.toLocaleString()} lugares)
            </span>
          </div>
        </div>

        {/* Compact Filters & Search Bar */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[5px] p-2.5 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            {/* Search Input */}
            <div className="relative sm:col-span-6">
              <Search className="w-3.5 h-3.5 text-[#687078] absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.75]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por escuela, calle o colonia..."
                className="w-full bg-white border border-[#DDE1DF] rounded-[4px] pl-8 pr-6 py-1.5 text-xs text-[#252A2E] placeholder-[#687078] focus:outline-none focus:border-[#245A66]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#687078] hover:text-[#252A2E]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Direct Municipality Selector Dropdown */}
            <div className="sm:col-span-6">
              <select
                value={selectedMun}
                onChange={(e) => setSelectedMun(e.target.value)}
                className="w-full bg-white border border-[#DDE1DF] text-[#252A2E] text-xs rounded-[4px] px-2.5 py-1.5 focus:outline-none focus:border-[#245A66] font-tabular"
              >
                <option value="todos">Seleccionar Municipio (Ver todos colapsados)</option>
                
                {/* Colima */}
                {(selectedState === 'todos' || selectedState === 'Colima') && (
                  <optgroup label="Colima (216 oficial GIR)">
                    <option value="Manzanillo">Manzanillo (60 sedes)</option>
                    <option value="Tecomán">Tecomán (25 sedes)</option>
                    <option value="Minatitlán">Minatitlán (23 sedes)</option>
                    <option value="Cuauhtémoc">Cuauhtémoc (20 sedes)</option>
                    <option value="Armería">Armería (18 sedes)</option>
                    <option value="Coquimatlán">Coquimatlán (16 sedes)</option>
                    <option value="Ixtlahuacán">Ixtlahuacán (16 sedes)</option>
                    <option value="Colima">Colima Capital (15 sedes)</option>
                    <option value="Villa de Álvarez">Villa de Álvarez (12 sedes)</option>
                    <option value="Comala">Comala (11 sedes)</option>
                  </optgroup>
                )}

                {/* Jalisco */}
                {(selectedState === 'todos' || selectedState === 'Jalisco') && (
                  <optgroup label="Jalisco (26 UEPCBJ / DIF)">
                    <option value="Puerto Vallarta">Puerto Vallarta (8 sedes)</option>
                    <option value="La Huerta">La Huerta / Chamela (6 sedes)</option>
                    <option value="Cihuatlán">Cihuatlán / Melaque (6 sedes)</option>
                    <option value="Cabo Corrientes">Cabo Corrientes / Tuito (3 sedes)</option>
                    <option value="Tomatlán">Tomatlán (3 sedes)</option>
                  </optgroup>
                )}

                {/* Nayarit */}
                {(selectedState === 'todos' || selectedState === 'Nayarit') && (
                  <optgroup label="Nayarit (26 SSPC / Bahía)">
                    <option value="Bahía de Banderas">Bahía de Banderas (10 sedes)</option>
                    <option value="San Blas">San Blas (4 sedes)</option>
                    <option value="Compostela">Compostela (4 sedes)</option>
                    <option value="Santiago Ixcuintla">Santiago Ixcuintla (4 sedes)</option>
                    <option value="Tecuala">Tecuala (4 sedes)</option>
                  </optgroup>
                )}

                {/* Otras */}
                {(selectedState === 'todos' || selectedState === 'Otras') && (
                  <optgroup label="Michoacán y BCS">
                    <option value="Lázaro Cárdenas">Lázaro Cárdenas, Mich. (1 sede)</option>
                    <option value="Coahuayana">Coahuayana, Mich. (1 sede)</option>
                    <option value="Los Cabos">Los Cabos, BCS (1 sede)</option>
                    <option value="La Paz">La Paz, BCS (1 sede)</option>
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons & Global Collapse Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DDE1DF] text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setOnlyPets(!onlyPets)}
                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium flex items-center gap-1 transition ${
                  onlyPets
                    ? 'bg-[#245A66] text-white'
                    : 'bg-white text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
                }`}
              >
                <PawPrint className="w-3 h-3" />
                <span>Acepta Mascotas</span>
              </button>

              <button
                onClick={() => setOnlyActive(!onlyActive)}
                className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium flex items-center gap-1 transition ${
                  onlyActive
                    ? 'bg-[#245A66] text-white'
                    : 'bg-white text-[#687078] hover:text-[#252A2E] border border-[#DDE1DF]'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Solo Abiertos</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-2 py-0.5 rounded-[3px] text-[11px] text-[#B84A45] hover:bg-[#B84A45]/10 border border-[#B84A45]/30 flex items-center gap-1 transition"
                  title="Restablecer filtros"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* Accordion Expand / Collapse All Controls */}
            <div className="flex items-center gap-2 text-[11px] text-[#245A66] font-medium ml-auto">
              <button
                onClick={handleExpandAll}
                className="hover:underline"
              >
                Abrir todos
              </button>
              <span className="text-[#DDE1DF]">|</span>
              <button
                onClick={handleCollapseAll}
                className="hover:underline text-[#687078] hover:text-[#252A2E]"
              >
                Cerrar todos
              </button>
            </div>
          </div>
        </div>

        {/* 4. THE ACCORDION LIST (COMPACT, COLLAPSED BY DEFAULT) */}
        {groupedByMunicipality.length === 0 ? (
          <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-6 text-center text-xs text-[#687078] space-y-1.5">
            <AlertCircle className="w-5 h-5 mx-auto text-[#A66C19] stroke-[1.75]" />
            <p className="font-semibold text-[#252A2E]">No hay refugios con los filtros seleccionados.</p>
            <p>Pruebe limpiando el buscador o seleccionando otro estado.</p>
            <button
              onClick={handleResetFilters}
              className="mt-1 bg-[#245A66] text-white px-2.5 py-1 rounded-[3px] text-[11px] font-medium"
            >
              Restablecer
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {groupedByMunicipality.map((group) => {
              const groupKey = `${group.state} — ${group.municipality}`;
              const isOpen = !!openGroups[groupKey];
              const showAll = !!expandedLimits[groupKey];
              const displayLimit = showAll ? group.shelters.length : 6;
              const visibleShelters = group.shelters.slice(0, displayLimit);
              const hasMore = group.shelters.length > 6;

              return (
                <div
                  key={groupKey}
                  className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[4px] overflow-hidden transition"
                >
                  {/* Accordion Header Row (Slim, clickable, high density) */}
                  <div
                    onClick={() => toggleGroup(groupKey)}
                    className="cursor-pointer bg-[#F7F7F4] hover:bg-[#EFEFEA] px-3.5 py-2.5 flex items-center justify-between border-b border-[#DDE1DF]/70 transition select-none"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-semibold text-[#245A66] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[2px]">
                        {group.state}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#252A2E]">
                        {group.municipality}
                      </h3>
                      <span className="text-xs font-tabular text-[#687078]">
                        ({group.shelters.length} {group.shelters.length === 1 ? 'refugio' : 'refugios'})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 text-[11px] font-tabular text-[#687078]">
                        <span>Capacidad: <strong className="text-[#252A2E]">{group.totalCapacity.toLocaleString()}</strong></span>
                        {group.petCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[#3F8063] font-medium flex items-center gap-0.5">
                              <PawPrint className="w-2.5 h-2.5" />
                              {group.petCount} pet-friendly
                            </span>
                          </>
                        )}
                        {group.minDistance !== null && (
                          <>
                            <span>•</span>
                            <span className="text-[#245A66] font-medium flex items-center gap-0.5">
                              <Navigation className="w-2.5 h-2.5" />
                              a {formatDistance(group.minDistance)}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-[#245A66] bg-white p-1 rounded-[3px] border border-[#DDE1DF]">
                        {isOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 stroke-[2]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content (Only rendered if open) */}
                  {isOpen && (
                    <div className="p-3 bg-white space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {visibleShelters.map((shelter) => (
                          <CompactShelterCard
                            key={shelter.id}
                            shelter={shelter}
                            copiedId={copiedId}
                            onCopyAddress={handleCopyAddress}
                            onSelectShelterOnMap={onSelectShelterOnMap}
                          />
                        ))}
                      </div>

                      {/* Limit controller if municipality has many shelters (e.g. Manzanillo has 60) */}
                      {hasMore && (
                        <div className="pt-2 border-t border-[#DDE1DF] flex items-center justify-between text-xs text-[#687078]">
                          <span className="font-tabular">
                            Mostrando {visibleShelters.length} de {group.shelters.length} refugios en {group.municipality}
                          </span>
                          <button
                            onClick={() => toggleShowAllInMunicipality(groupKey)}
                            className="text-[#245A66] hover:underline font-semibold font-tabular text-xs"
                          >
                            {showAll ? 'Mostrar menos (primeros 6)' : `Ver todos los ${group.shelters.length} refugios de ${group.municipality}`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * Compact Shelter Card inside Accordion
 */
interface CompactShelterCardProps {
  shelter: Shelter & { distanceKm?: number | null };
  copiedId: string | null;
  onCopyAddress: (id: string, address: string) => void;
  onSelectShelterOnMap?: (shelter: Shelter) => void;
}

const CompactShelterCard: React.FC<CompactShelterCardProps> = ({
  shelter,
  copiedId,
  onCopyAddress,
  onSelectShelterOnMap,
}) => {
  const gmapsLink = getGoogleMapsDirectionsUrl(shelter.lat, shelter.lng, shelter.name);

  return (
    <div className="bg-[#F7F7F4] border border-[#DDE1DF] hover:border-[#245A66]/40 rounded-[4px] p-2.5 flex flex-col justify-between text-xs transition">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-semibold text-[#252A2E] text-xs leading-snug line-clamp-2">
            {shelter.name}
          </h4>

          {shelter.distanceKm !== null && shelter.distanceKm !== undefined && (
            <span className="text-[10px] font-semibold text-[#245A66] font-tabular bg-white border border-[#DDE1DF] px-1 py-0.5 rounded-[2px] flex items-center gap-0.5 shrink-0">
              <Navigation className="w-2.5 h-2.5 stroke-[2]" />
              {formatDistance(shelter.distanceKm)}
            </span>
          )}
        </div>

        <p className="text-[#687078] text-[11px] flex items-start gap-1 leading-tight line-clamp-2">
          <MapPin className="w-3 h-3 text-[#687078] shrink-0 mt-0.5 stroke-[1.75]" />
          <span>{shelter.address}</span>
        </p>

        {/* Status, Pets, Capacity in compact line */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5 text-[10px]">
          <span className="bg-white border border-[#DDE1DF] px-1 py-0.5 rounded-[2px] font-tabular text-[#252A2E]">
            Cap: {shelter.capacity} p.
          </span>
          {shelter.petsAllowed ? (
            <span className="bg-[#3F8063]/10 text-[#3F8063] border border-[#3F8063]/25 px-1 py-0.5 rounded-[2px] flex items-center gap-0.5 font-medium">
              <PawPrint className="w-2.5 h-2.5" />
              Mascotas
            </span>
          ) : (
            <span className="bg-white text-[#687078] border border-[#DDE1DF] px-1 py-0.5 rounded-[2px]">
              Sin mascotas
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 mt-1.5 border-t border-[#DDE1DF] flex items-center justify-between gap-1 text-[11px]">
        <div className="flex items-center gap-1">
          <a
            href={gmapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#245A66] hover:bg-[#1b434c] text-white px-2 py-0.5 rounded-[3px] font-medium flex items-center gap-1 transition"
          >
            <Navigation className="w-2.5 h-2.5" />
            <span>Ruta</span>
          </a>

          <button
            onClick={() => {
              if (onSelectShelterOnMap) onSelectShelterOnMap(shelter);
              const el = document.getElementById('mapa-trayectoria');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-1.5 py-0.5 rounded-[3px] font-medium flex items-center gap-1 transition"
          >
            <MapPin className="w-2.5 h-2.5 text-[#245A66]" />
            <span>Mapa</span>
          </button>
        </div>

        <button
          onClick={() => onCopyAddress(shelter.id, `${shelter.name}, ${shelter.address}`)}
          className="text-[#687078] hover:text-[#252A2E] flex items-center gap-0.5 transition"
          title="Copiar dirección"
        >
          {copiedId === shelter.id ? (
            <Check className="w-3 h-3 text-[#3F8063]" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};
