import { COLIMA_OFFICIAL_SHELTERS } from './colimaOfficialShelters';
import { JALISCO_OFFICIAL_SHELTERS } from './jaliscoOfficialShelters';
import { NAYARIT_OFFICIAL_SHELTERS } from './nayaritOfficialShelters';

export interface Shelter {
  id: string;
  name: string;
  municipality: string;
  state: 'Jalisco' | 'Colima' | 'Nayarit' | 'Michoacán' | 'Baja California Sur';
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy?: number;
  status: 'Activo / Abierto' | 'Preventivo / Listo';
  petsAllowed: boolean;
  phone?: string;
  facilities: string[];
  notes?: string;
}

export interface TrajectoryPoint {
  id: string;
  timestamp: string;
  dateTimeFormatted: string;
  type: 'histórico' | 'actual' | 'pronóstico';
  lat: number;
  lng: number;
  category: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'TT' | 'DT';
  windSpeedKmh: number;
  windSpeedMph: number;
  pressureHpa: number;
  statusText: string;
}

export interface OfficialSource {
  id: string;
  name: string;
  agency: string;
  country: 'México' | 'Internacional' | 'Estatal' | 'Municipal';
  url: string;
  handle?: string;
  description: string;
  badge: 'Oficial' | 'Científico' | 'Protección Civil';
  updatedInterval: string;
}

export interface InfrastructureItem {
  id: string;
  type: 'puerto' | 'carretera' | 'rio' | 'aeropuerto';
  name: string;
  state: string;
  status: 'Cerrado / Restringido' | 'Precaución' | 'Monitoreo Activo' | 'Operativo';
  details: string;
  authority: string;
}

// Local coastal coordinates dictionary for fast, privacy-friendly, zero-API-key geocoding
export interface PredefinedLocation {
  name: string;
  municipality: string;
  state: string;
  lat: number;
  lng: number;
  category: 'Ciudad' | 'Playa' | 'Colonia' | 'Municipio';
}

export const COASTAL_LOCATIONS: PredefinedLocation[] = [
  // Jalisco
  { name: 'Puerto Vallarta (Centro)', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6534, lng: -105.2253, category: 'Ciudad' },
  { name: 'El Pitillal', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6620, lng: -105.2080, category: 'Colonia' },
  { name: 'Ixtapa (Vallarta)', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.7145, lng: -105.1980, category: 'Colonia' },
  { name: 'Marina Vallarta', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6650, lng: -105.2530, category: 'Colonia' },
  { name: 'Las Juntas', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6970, lng: -105.2340, category: 'Colonia' },
  { name: 'Mismaloya', municipality: 'Puerto Vallarta', state: 'Jalisco', lat: 20.5310, lng: -105.2920, category: 'Playa' },
  { name: 'Cihuatlán (Cabecera)', municipality: 'Cihuatlán', state: 'Jalisco', lat: 19.2384, lng: -104.5689, category: 'Municipio' },
  { name: 'Barra de Navidad', municipality: 'Cihuatlán', state: 'Jalisco', lat: 19.2087, lng: -104.6834, category: 'Playa' },
  { name: 'San Patricio Melaque', municipality: 'Cihuatlán', state: 'Jalisco', lat: 19.2220, lng: -104.7080, category: 'Playa' },
  { name: 'Tomatlán', municipality: 'Tomatlán', state: 'Jalisco', lat: 19.9365, lng: -105.2486, category: 'Municipio' },
  { name: 'La Huerta', municipality: 'La Huerta', state: 'Jalisco', lat: 19.4812, lng: -104.6432, category: 'Municipio' },
  { name: 'Chamela / Careyes', municipality: 'La Huerta', state: 'Jalisco', lat: 19.5310, lng: -105.0830, category: 'Playa' },
  { name: 'El Tuito (Cabo Corrientes)', municipality: 'Cabo Corrientes', state: 'Jalisco', lat: 20.3200, lng: -105.3280, category: 'Municipio' },
  { name: 'Autlán de Navarro', municipality: 'Autlán de Navarro', state: 'Jalisco', lat: 19.7710, lng: -104.3640, category: 'Ciudad' },

  // Colima
  { name: 'Manzanillo (Centro)', municipality: 'Manzanillo', state: 'Colima', lat: 19.0522, lng: -104.3160, category: 'Ciudad' },
  { name: 'Valle de las Garzas', municipality: 'Manzanillo', state: 'Colima', lat: 19.0880, lng: -104.3050, category: 'Colonia' },
  { name: 'Santiago (Manzanillo)', municipality: 'Manzanillo', state: 'Colima', lat: 19.1120, lng: -104.3480, category: 'Colonia' },
  { name: 'Salagua', municipality: 'Manzanillo', state: 'Colima', lat: 19.1010, lng: -104.3290, category: 'Colonia' },
  { name: 'El Chavarín', municipality: 'Manzanillo', state: 'Colima', lat: 19.2430, lng: -104.4570, category: 'Colonia' },
  { name: 'Tecomán (Centro)', municipality: 'Tecomán', state: 'Colima', lat: 18.9130, lng: -103.8740, category: 'Ciudad' },
  { name: 'Boca de Pascuales', municipality: 'Tecomán', state: 'Colima', lat: 18.8470, lng: -103.9580, category: 'Playa' },
  { name: 'Cerro de Ortega', municipality: 'Tecomán', state: 'Colima', lat: 18.8150, lng: -103.7140, category: 'Colonia' },
  { name: 'Armería', municipality: 'Armería', state: 'Colima', lat: 18.9356, lng: -103.9645, category: 'Municipio' },
  { name: 'Cuyutlán', municipality: 'Armería', state: 'Colima', lat: 18.9180, lng: -104.0720, category: 'Playa' },
  { name: 'El Paraíso', municipality: 'Armería', state: 'Colima', lat: 18.8540, lng: -103.9870, category: 'Playa' },
  { name: 'Colima Capital', municipality: 'Colima', state: 'Colima', lat: 19.2433, lng: -103.7250, category: 'Ciudad' },
  { name: 'Villa de Álvarez', municipality: 'Villa de Álvarez', state: 'Colima', lat: 19.2610, lng: -103.7380, category: 'Ciudad' },

  // Nayarit
  { name: 'Nuevo Nayarit / Nuevo Vallarta', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.7020, lng: -105.2970, category: 'Ciudad' },
  { name: 'Bucerías', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.7589, lng: -105.3341, category: 'Playa' },
  { name: 'San Vicente', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.7510, lng: -105.2340, category: 'Colonia' },
  { name: 'San Juan de Abajo', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.8120, lng: -105.1910, category: 'Colonia' },
  { name: 'Sayulita', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.8690, lng: -105.4410, category: 'Playa' },
  { name: 'Punta de Mita', municipality: 'Bahía de Banderas', state: 'Nayarit', lat: 20.7780, lng: -105.5260, category: 'Playa' },
  { name: 'Compostela', municipality: 'Compostela', state: 'Nayarit', lat: 21.2384, lng: -104.9012, category: 'Municipio' },
  { name: 'Rincón de Guayabitos', municipality: 'Compostela', state: 'Nayarit', lat: 20.0240, lng: -105.2890, category: 'Playa' },
  { name: 'San Blas', municipality: 'San Blas', state: 'Nayarit', lat: 21.5398, lng: -105.2845, category: 'Playa' },
  { name: 'Tepic Capital', municipality: 'Tepic', state: 'Nayarit', lat: 21.5040, lng: -104.8940, category: 'Ciudad' },

  // Michoacán
  { name: 'Lázaro Cárdenas', municipality: 'Lázaro Cárdenas', state: 'Michoacán', lat: 17.9621, lng: -102.2154, category: 'Ciudad' },
  { name: 'Playa Azul', municipality: 'Lázaro Cárdenas', state: 'Michoacán', lat: 17.9830, lng: -102.3530, category: 'Playa' },
  { name: 'Coahuayana', municipality: 'Coahuayana', state: 'Michoacán', lat: 18.7512, lng: -103.6812, category: 'Municipio' },
  { name: 'Aquila', municipality: 'Aquila', state: 'Michoacán', lat: 18.5980, lng: -103.5040, category: 'Municipio' },

  // Baja California Sur
  { name: 'Cabo San Lucas', municipality: 'Los Cabos', state: 'Baja California Sur', lat: 22.8905, lng: -109.9167, category: 'Ciudad' },
  { name: 'San José del Cabo', municipality: 'Los Cabos', state: 'Baja California Sur', lat: 23.0612, lng: -109.7045, category: 'Ciudad' },
  { name: 'La Paz', municipality: 'La Paz', state: 'Baja California Sur', lat: 24.1423, lng: -110.3124, category: 'Ciudad' },
];

export const HURRICANE_CURRENT_STATUS = {
  name: 'SIMÓN',
  basin: 'Pacífico Nororiental',
  category: 4,
  categoryName: 'Huracán Mayor Categoría 4',
  classification: 'Ciclón Tropical de Gran Intensidad',
  windSpeedKmh: 235,
  windGustsKmh: 285,
  windSpeedMph: 145,
  pressureHpa: 945,
  lat: 18.6,
  lng: -104.9,
  coordinatesText: '18.6° Norte, 104.9° Oeste',
  distanceReference: 'A 79 km al suroeste de Manzanillo, Col. y 71 km al sur-suroeste de Barra de Navidad, Jal.',
  movement: 'Hacia el Norte-Noroeste (345°)',
  movementSpeedKmh: 12,
  movementSpeedMph: 7,
  waveHeightMeters: '7.0 a 9.5 metros',
  rainAccumulation: 'Lluvias torrenciales a extraordinarias (250 a 450 mm con puntuales de hasta 650 mm)',
  lastUpdate: 'Boletín Oficial NHC Advisory #14 / SMN Conagua - 11 Octubre, 04:00 hrs UTC-6',
  siatCtAlerts: [
    {
      level: 'Alerta Roja (Fase de Máxima Atención)',
      color: '#b91c1c',
      badgeBg: 'bg-red-950/70 text-red-200 border-red-500/50',
      zones: 'Costa Norte y Sur de Jalisco (Puerto Vallarta, Cihuatlán, Tomatlán, Cabo Corrientes), Costas de Colima (Manzanillo, Tecomán, Armería).',
      action: 'Permanecer en resguardo seguro o acudir al refugio temporal más cercano. Evitar transitar en zonas costeras o cauces de ríos.',
    },
    {
      level: 'Alerta Naranja (Fase de Prevención Alta)',
      color: '#c2410c',
      badgeBg: 'bg-orange-950/70 text-orange-200 border-orange-500/50',
      zones: 'Costa Sur de Nayarit (Bahía de Banderas, Compostela), Costa de Michoacán (Coahuayana, Aquila, Lázaro Cárdenas).',
      action: 'Evacuación de comunidades en llanuras bajas costeras. Identificar refugios disponibles y preparar documentos.',
    },
    {
      level: 'Alerta Amarilla (Fase de Preparación)',
      color: '#b45309',
      badgeBg: 'bg-amber-950/70 text-amber-200 border-amber-500/50',
      zones: 'Centro y Norte de Nayarit, Sur de Sinaloa y extremo sur de Baja California Sur.',
      action: 'Revisar sistemas de desagüe, almacenar víveres básicos y agua potable. Asegurar objetos en patios y azoteas.',
    },
    {
      level: 'Alerta Verde (Fase Informativa)',
      color: '#15803d',
      badgeBg: 'bg-emerald-950/70 text-emerald-200 border-emerald-500/50',
      zones: 'Baja California Sur (Los Cabos, La Paz) y Sinaloa Centro.',
      action: 'Seguimiento continuo a los boletines oficiales emitidos por el Servicio Meteorológico Nacional.',
    },
  ],
};

export const INFRASTRUCTURE_STATUS: InfrastructureItem[] = [
  {
    id: 'inf-1',
    type: 'puerto',
    name: 'Puerto de Manzanillo, Colima',
    state: 'Colima',
    status: 'Cerrado / Restringido',
    details: 'Cierre total preventivo a la navegación para embarcaciones mayores y menores. Suspensión de maniobras en muelles turísticos y comerciales.',
    authority: 'Capitanía de Puerto / SEMAR',
  },
  {
    id: 'inf-2',
    type: 'puerto',
    name: 'Puerto de Puerto Vallarta, Jalisco',
    state: 'Jalisco',
    status: 'Cerrado / Restringido',
    details: 'Puerto cerrado a la navegación para embarcaciones menores, pesca ribereña y tours turísticos en toda la Bahía de Banderas.',
    authority: 'Capitanía de Puerto Regional',
  },
  {
    id: 'inf-3',
    type: 'puerto',
    name: 'Puerto de San Blas, Nayarit',
    state: 'Nayarit',
    status: 'Cerrado / Restringido',
    details: 'Restricción total a navegación menor. Retiro de embarcaciones a dársenas protegidas por oleaje elevado.',
    authority: 'Capitanía de Puerto San Blas',
  },
  {
    id: 'inf-4',
    type: 'puerto',
    name: 'Barra de Navidad y Bahía de Navidad',
    state: 'Jalisco',
    status: 'Cerrado / Restringido',
    details: 'Acceso a mar y laguna cerrado a toda actividad acuática. Alerta por marejada de fondo de hasta 7 metros.',
    authority: 'Protección Civil Jalisco / SEMAR',
  },
  {
    id: 'inf-5',
    type: 'carretera',
    name: 'Carretera Federal 200 (Costera)',
    state: 'Jalisco / Colima',
    status: 'Precaución',
    details: 'Monitoreo especial de deslaves en el tramo Melaque - Puerto Vallarta y Boca de Tomatlán. Circulación restringida a tránsito esencial.',
    authority: 'Guardia Nacional División Carreteras',
  },
  {
    id: 'inf-6',
    type: 'carretera',
    name: 'Autopista Colima - Manzanillo (54D)',
    state: 'Colima',
    status: 'Monitoreo Activo',
    details: 'Paso habilitado con reducción preventiva de velocidad por vientos cruzados y encharcamientos en tramo Tecomán.',
    authority: 'Protección Civil Estatal Colima',
  },
  {
    id: 'inf-7',
    type: 'rio',
    name: 'Río Marabasco (Límite Jalisco - Colima)',
    state: 'Jalisco / Colima',
    status: 'Monitoreo Activo',
    details: 'Nivel al 82% de capacidad. Brigadas de CONAGUA monitorean bordos de protección en ejidos de Cihuatlán y Manzanillo.',
    authority: 'CONAGUA Organismo de Cuenca Lerma-Santiago-Pacífico',
  },
  {
    id: 'inf-8',
    type: 'rio',
    name: 'Río Ameca y Río Cuale (Bahía de Banderas)',
    state: 'Jalisco / Nayarit',
    status: 'Monitoreo Activo',
    details: 'Supervisión de caudales que descienden de la Sierra Madre Occidental hacia el océano. Filtros preventivos en puentes.',
    authority: 'Protección Civil Puerto Vallarta / Bahía de Banderas',
  },
  {
    id: 'inf-9',
    type: 'aeropuerto',
    name: 'Aeropuerto Internacional de Puerto Vallarta (PVR)',
    state: 'Jalisco',
    status: 'Operativo',
    details: 'Operaciones comerciales sujetas a demoras meteorológicas. Se recomienda contactar directamente a la aerolínea.',
    authority: 'Grupo Aeroportuario del Pacífico (GAP)',
  },
  {
    id: 'inf-10',
    type: 'aeropuerto',
    name: 'Aeropuerto Internacional Playa de Oro Manzanillo (ZLO)',
    state: 'Colima',
    status: 'Precaución',
    details: 'Vuelos bajo evaluación técnica por ráfagas de viento y techos de nubes bajos. Verificación con aerolíneas.',
    authority: 'GAP / AFAC',
  },
];

export const TRAJECTORY_POINTS: TrajectoryPoint[] = [
  {
    id: 'p-1',
    timestamp: '2026-10-09T15:00:00Z',
    dateTimeFormatted: '09 Oct - 09:00 (Histórico NHC)',
    type: 'histórico',
    lat: 16.0,
    lng: -104.7,
    category: 'C2',
    windSpeedKmh: 165,
    windSpeedMph: 105,
    pressureHpa: 975,
    statusText: 'Ubicado a 335 km al sur de Manzanillo, intensificación rápida',
  },
  {
    id: 'p-2',
    timestamp: '2026-10-10T03:00:00Z',
    dateTimeFormatted: '09 Oct - 21:00 (Histórico NHC)',
    type: 'histórico',
    lat: 16.8,
    lng: -104.6,
    category: 'C3',
    windSpeedKmh: 205,
    windSpeedMph: 125,
    pressureHpa: 955,
    statusText: 'Ubicado a 245 km al sur de Manzanillo, avance continuo hacia el norte',
  },
  {
    id: 'p-3',
    timestamp: '2026-10-10T12:00:00Z',
    dateTimeFormatted: '10 Oct - 06:00 (Histórico NHC)',
    type: 'histórico',
    lat: 17.2,
    lng: -104.7,
    category: 'C4',
    windSpeedKmh: 230,
    windSpeedMph: 145,
    pressureHpa: 948,
    statusText: 'Alcanza Categoría 4, vientos destructivos y bandas cubren Colima y Michoacán',
  },
  {
    id: 'p-4',
    timestamp: '2026-10-10T18:00:00Z',
    dateTimeFormatted: '10 Oct - 12:00 (Histórico NHC)',
    type: 'histórico',
    lat: 17.6,
    lng: -104.8,
    category: 'C4',
    windSpeedKmh: 240,
    windSpeedMph: 150,
    pressureHpa: 942,
    statusText: 'A 197 km al SSO de Manzanillo; avance lento al norte (4 km/h)',
  },
  {
    id: 'p-5',
    timestamp: '2026-10-11T00:00:00Z',
    dateTimeFormatted: '10 Oct - 18:00 (Histórico NHC)',
    type: 'histórico',
    lat: 18.0,
    lng: -104.8,
    category: 'C4',
    windSpeedKmh: 240,
    windSpeedMph: 150,
    pressureHpa: 943,
    statusText: 'A 140 km al SSO de Manzanillo, acelerando desplazamiento rumbo a costas',
  },
  {
    id: 'p-6',
    timestamp: '2026-10-11T06:00:00Z',
    dateTimeFormatted: '11 Oct - 00:00 (Histórico NHC)',
    type: 'histórico',
    lat: 18.3,
    lng: -104.9,
    category: 'C4',
    windSpeedKmh: 235,
    windSpeedMph: 145,
    pressureHpa: 944,
    statusText: 'A 100 km al sur-suroeste de Manzanillo; bandas espirales azotan costa',
  },
  {
    id: 'p-current',
    timestamp: '2026-10-11T10:00:00Z',
    dateTimeFormatted: '11 Oct - 04:00 (Posición Actual NHC/SMN)',
    type: 'actual',
    lat: 18.6,
    lng: -104.9,
    category: 'C4',
    windSpeedKmh: 235,
    windSpeedMph: 145,
    pressureHpa: 945,
    statusText: 'A 79 km al SO de Manzanillo y 71 km al SSO de Barra de Navidad. Vientos de 235 km/h.',
  },
  {
    id: 'p-7',
    timestamp: '2026-10-11T13:00:00Z',
    dateTimeFormatted: '11 Oct - 07:00 (Impacto en Costa / Landfall)',
    type: 'pronóstico',
    lat: 19.3,
    lng: -104.9,
    category: 'C4',
    windSpeedKmh: 220,
    windSpeedMph: 140,
    pressureHpa: 950,
    statusText: 'Impacto directo en la costa (Bahía de Navidad / Cihuatlán / Chamela / La Huerta)',
  },
  {
    id: 'p-8',
    timestamp: '2026-10-11T18:00:00Z',
    dateTimeFormatted: '11 Oct - 12:00 (Pronóstico 6h post-impacto)',
    type: 'pronóstico',
    lat: 20.2,
    lng: -105.1,
    category: 'C3',
    windSpeedKmh: 180,
    windSpeedMph: 110,
    pressureHpa: 965,
    statusText: 'Bordeando Cabo Corrientes hacia Bahía de Banderas y Puerto Vallarta',
  },
  {
    id: 'p-9',
    timestamp: '2026-10-12T03:00:00Z',
    dateTimeFormatted: '11 Oct - 21:00 (Pronóstico 15h)',
    type: 'pronóstico',
    lat: 21.2,
    lng: -105.2,
    category: 'C2',
    windSpeedKmh: 150,
    windSpeedMph: 90,
    pressureHpa: 978,
    statusText: 'Avanzando sobre la costa y sur de Nayarit (Bahía de Banderas / Compostela / San Blas)',
  },
  {
    id: 'p-10',
    timestamp: '2026-10-12T15:00:00Z',
    dateTimeFormatted: '12 Oct - 09:00 (Pronóstico 27h)',
    type: 'pronóstico',
    lat: 22.4,
    lng: -105.5,
    category: 'TT',
    windSpeedKmh: 95,
    windSpeedMph: 60,
    pressureHpa: 994,
    statusText: 'Degradación a Tormenta Tropical sobre tierra (norte de Nayarit / sur de Sinaloa)',
  },
];

export const SHELTERS_DATA: Shelter[] = [
  // ESTADO DE JALISCO - Refugios Oficiales de Protección Civil Jalisco / Sistemas DIF Municipales
  // (Puerto Vallarta, Cabo Corrientes, Tomatlán, La Huerta, Cihuatlán)
  ...JALISCO_OFFICIAL_SHELTERS,

  // ESTADO DE COLIMA - 216 Refugios Oficiales extraídos de Sistema GIR / UEPC Colima
  // (refugios-proteccioncivil.col.gob.mx/refugios/publico)
  ...COLIMA_OFFICIAL_SHELTERS,

  // ESTADO DE NAYARIT - Refugios Oficiales de Protección Ciudadana y Bomberos Nayarit / Ayuntamientos
  // (Bahía de Banderas bahiadebanderas.gob.mx/refugios, Compostela, San Blas, Santiago Ixcuintla, Tecuala)
  ...NAYARIT_OFFICIAL_SHELTERS,

  // MICHOACÁN
  {
    id: 'mich-lc-01',
    name: 'Instituto Tecnológico de Lázaro Cárdenas',
    municipality: 'Lázaro Cárdenas',
    state: 'Michoacán',
    address: 'Av. Melchor Ocampo 2555, Lázaro Cárdenas, Mich.',
    lat: 17.9621,
    lng: -102.2154,
    capacity: 600,
    currentOccupancy: 110,
    status: 'Activo / Abierto',
    petsAllowed: true,
    phone: '753 537 1977',
    facilities: ['Comedor de SEDENA (Plan DN-III-E)', 'Planta generadora eléctrica', 'Pabellón canino/felino'],
    notes: 'Refugio principal en la desembocadura del Río Balsas.',
  },
  {
    id: 'mich-coah-01',
    name: 'Auditorio Municipal de Coahuayana',
    municipality: 'Coahuayana',
    state: 'Michoacán',
    address: 'Av. Morelos s/n, Coahuayana de Hidalgo, Mich.',
    lat: 18.7512,
    lng: -103.6812,
    capacity: 350,
    currentOccupancy: 90,
    status: 'Activo / Abierto',
    petsAllowed: false,
    phone: '313 327 0050',
    facilities: ['Abastecimiento de víveres', 'Atención médica', 'Vigilancia institucional'],
    notes: 'Atención a familias de la ribera del Río Coahuayana.',
  },

  // BAJA CALIFORNIA SUR
  {
    id: 'bcs-cab-01',
    name: 'Escuela Primaria Rosario Morales Romo',
    municipality: 'Los Cabos',
    state: 'Baja California Sur',
    address: 'Calle Forjadores esq. Tecnológico, San José del Cabo, BCS.',
    lat: 23.0612,
    lng: -109.7045,
    capacity: 400,
    currentOccupancy: 0,
    status: 'Preventivo / Listo',
    petsAllowed: true,
    phone: '624 142 3748',
    facilities: ['Cisternas verificadas', 'Personal asignado', 'Espacio para mascotas'],
    notes: 'Listo para recibir personas en caso de viraje hacia el sur de la península.',
  },
  {
    id: 'bcs-lp-01',
    name: 'Gimnasio Polideportivo La Paz',
    municipality: 'La Paz',
    state: 'Baja California Sur',
    address: 'Calle Félix Ortega esq. 5 de Febrero, La Paz, BCS.',
    lat: 24.1423,
    lng: -110.3124,
    capacity: 800,
    currentOccupancy: 0,
    status: 'Preventivo / Listo',
    petsAllowed: true,
    phone: '612 121 3634',
    facilities: ['Gran capacidad de recepción', 'Bodega humanitaria de DIF BCS'],
    notes: 'Punto de contingencia estatal.',
  },
];

export const NOAA_SATELLITE_FEEDS = [
  {
    id: 'geocolor',
    name: 'NOAA GOES-18 Pacífico (GeoColor)',
    type: 'Color Verdadero y Composición Nocturna',
    description: 'Imágenes compuestas de alta resolución que muestran la estructura ciclónica, el ojo del huracán y la cobertura nubosa en tiempo casi real.',
    imageUrl: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/tpw/GEOCOLOR/1000x1000.jpg',
    officialUrl: 'https://www.star.nesdis.noaa.gov/GOES/sector_band.php?sat=G18&sector=tpw&band=GEOCOLOR&length=24',
    frequency: 'Actualización cada 10 a 15 minutos',
    interpretation: 'Nubes densas brillantes indican convección profunda. Durante la noche se aprecian luces urbanas y la textura superior de las bandas espirales.',
  },
  {
    id: 'ir-band13',
    name: 'NOAA GOES-18 Infrarrojo Limpio (Banda 13 - 10.3 µm)',
    type: 'Temperatura de Topes Nubosos',
    description: 'Permite medir la temperatura de la parte superior de las tormentas alrededor del ojo. Las zonas rojas, moradas y blancas representan las tormentas con mayor actividad convectiva.',
    imageUrl: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/tpw/13/1000x1000.jpg',
    officialUrl: 'https://www.star.nesdis.noaa.gov/GOES/sector_band.php?sat=G18&sector=tpw&band=13&length=24',
    frequency: 'Transmisión continua 24 horas',
    interpretation: 'Colores rojo y violeta corresponden a temperaturas inferiores a -70°C, asociadas a lluvias intensas y descargas eléctricas.',
  },
  {
    id: 'wv-band08',
    name: 'NOAA GOES-18 Vapor de Agua (Banda 08 - Nivel Alto)',
    type: 'Humedad Atmosférica y Vientos Rectores',
    description: 'Visualiza la distribución de humedad en la troposfera media y alta, permitiendo observar las corrientes que guían la trayectoria del ciclón.',
    imageUrl: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/tpw/08/1000x1000.jpg',
    officialUrl: 'https://www.star.nesdis.noaa.gov/GOES/sector_band.php?sat=G18&sector=tpw&band=08&length=24',
    frequency: 'Actualización cada 15 minutos',
    interpretation: 'Zonas brillantes reflejan alta concentración de vapor que alimenta al sistema ciclónico.',
  },
];

export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: 'smn',
    name: 'Servicio Meteorológico Nacional (SMN / Conagua)',
    agency: 'Comisión Nacional del Agua - Gobierno de México',
    country: 'México',
    url: 'https://smn.conagua.gob.mx/es/pronosticos/avisos/aviso-de-ciclon-tropical-en-el-oceano-pacifico',
    handle: '@conagua_clima',
    description: 'Boletines hidrometeorológicos oficiales cada 3 horas, trayectorias técnicas y pronósticos de lluvia acumulada.',
    badge: 'Oficial',
    updatedInterval: 'Cada 3 horas',
  },
  {
    id: 'nhc',
    name: 'National Hurricane Center (NHC / NOAA)',
    agency: 'National Oceanic and Atmospheric Administration (EE.UU.)',
    country: 'Internacional',
    url: 'https://www.nhc.noaa.gov/?epac',
    handle: '@NHC_Pacific',
    description: 'Centro meteorológico regional especializado para el Pacífico Nororiental: cono de incertidumbre y avisos marítimos.',
    badge: 'Científico',
    updatedInterval: 'Cada 3 a 6 horas',
  },
  {
    id: 'cnpc',
    name: 'Coordinación Nacional de Protección Civil (CNPC)',
    agency: 'Secretaría de Seguridad y Protección Ciudadana',
    country: 'México',
    url: 'http://preparados.gob.mx/',
    handle: '@CNPC_MX',
    description: 'Emisión del Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT) y coordinación con Fuerzas Armadas.',
    badge: 'Protección Civil',
    updatedInterval: 'Continuo en contingencia',
  },
  {
    id: 'pc-jalisco',
    name: 'Protección Civil Jalisco (UEPCBJ)',
    agency: 'Unidad Estatal de Protección Civil y Bomberos / DIF Jalisco',
    country: 'Estatal',
    url: 'https://proteccioncivil.jalisco.gob.mx/',
    handle: '@PCJalisco',
    description: 'Directorio de Refugios Costa Norte (Puerto Vallarta, Cabo Corrientes) y Costa Sur (Cihuatlán, La Huerta, Tomatlán). Alerta Jalisco.',
    badge: 'Protección Civil',
    updatedInterval: 'Tiempo real',
  },
  {
    id: 'pc-colima',
    name: 'Protección Civil Estatal Colima (GIR)',
    agency: 'Gobierno del Estado de Colima',
    country: 'Estatal',
    url: 'https://refugios-proteccioncivil.col.gob.mx/refugios/publico',
    handle: '@PC_Colima',
    description: 'Sistema Oficial Geográfico de Refugios (GIR) con 216 inmuebles habilitados en Manzanillo, Tecomán, Armería y todo el estado.',
    badge: 'Protección Civil',
    updatedInterval: 'Tiempo real',
  },
  {
    id: 'pc-nayarit-bb',
    name: 'Protección Civil y Bomberos Bahía de Banderas',
    agency: 'H. Ayuntamiento de Bahía de Banderas, Nayarit',
    country: 'Municipal',
    url: 'https://bahiadebanderas.gob.mx/refugios/index.html',
    handle: '@PC_BahiaBanderas',
    description: 'Directorio oficial municipal en línea de albergues temporales en Punta de Mita, Bucerías, Mezcales, San Vicente y Valle.',
    badge: 'Protección Civil',
    updatedInterval: 'Tiempo real',
  },
  {
    id: 'pc-nayarit',
    name: 'Protección Ciudadana y Bomberos Nayarit',
    agency: 'Secretaría de Seguridad y Protección Ciudadana de Nayarit (SSPC)',
    country: 'Estatal',
    url: 'https://sspc.nayarit.gob.mx/',
    handle: '@sspcnayarit',
    description: 'Red estatal de 171 refugios temporales en Compostela, San Blas, Santiago Ixcuintla, Tecuala y costa norte nayarita.',
    badge: 'Protección Civil',
    updatedInterval: 'Tiempo real',
  },
  {
    id: 'atlas-cenapred',
    name: 'Atlas Nacional de Riesgos (CENAPRED)',
    agency: 'Centro Nacional de Prevención de Desastres',
    country: 'México',
    url: 'http://www.atlasnacionalderiesgos.gob.mx/',
    handle: '@CENAPRED.MX',
    description: 'Plataforma federal de monitoreo geoespacial y registro nacional de refugios temporales y zonas de inundación.',
    badge: 'Científico',
    updatedInterval: 'Continuo',
  },
  {
    id: 'semar-sedena',
    name: 'Plan Marina y Plan DN-III-E (SEMAR / SEDENA)',
    agency: 'Fuerzas Armadas de México',
    country: 'México',
    url: 'https://www.gob.mx/semar',
    handle: '@SEMAR_mx',
    description: 'Operativos de auxilio a la población, cocinas comunitarias móviles y plantas potabilizadoras.',
    badge: 'Oficial',
    updatedInterval: 'Operativo 24/7',
  },
  {
    id: 'cruz-roja',
    name: 'Cruz Roja Mexicana (Delegaciones Pacífico)',
    agency: 'Cruz Roja Mexicana I.A.P.',
    country: 'México',
    url: 'https://www.cruzrojamexicana.org.mx/',
    handle: '@CruzRoja_MX',
    description: 'Servicios de ambulancia y primeros auxilios en refugios temporales y comunidades costeras.',
    badge: 'Oficial',
    updatedInterval: '24 horas',
  },
];

export const EMERGENCY_CONTACTS = [
  {
    name: 'Emergencias Nacionales (C5)',
    number: '911',
    description: 'Atención médica inmediata, rescate, policía, bomberos y coordinación de refugios.',
    type: 'Nacional',
  },
  {
    name: 'Comisión Federal de Electricidad (CFE)',
    number: '071',
    description: 'Reporte de postes o cables de media/alta tensión caídos y fallas de suministro.',
    type: 'Servicios',
  },
  {
    name: 'Guardia Nacional (Auxilio Vial)',
    number: '088',
    description: 'Información y auxilio en tramos carreteros federales ante deslaves o cortes.',
    type: 'Seguridad',
  },
  {
    name: 'Protección Civil Jalisco (Base Central)',
    number: '3336753060',
    formatted: '(33) 3675-3060',
    description: 'Centro de Operaciones Costalegre y Puerto Vallarta.',
    type: 'Estatal',
  },
  {
    name: 'Protección Civil Colima',
    number: '3123130311',
    formatted: '(312) 313-0311',
    description: 'Comando Estatal de Emergencias Colima.',
    type: 'Estatal',
  },
  {
    name: 'Protección Civil Nayarit',
    number: '3111330381',
    formatted: '(311) 133-0381',
    description: 'Base Operativa Costa y Bahía de Banderas.',
    type: 'Estatal',
  },
  {
    name: 'Cruz Roja Puerto Vallarta',
    number: '3222221533',
    formatted: '(322) 222-1533',
    description: 'Base de ambulancias y paramédicos.',
    type: 'Médico',
  },
  {
    name: 'Cruz Roja Manzanillo',
    number: '3143320140',
    formatted: '(314) 332-0140',
    description: 'Atención prehospitalaria en puerto.',
    type: 'Médico',
  },
];

export const EMERGENCY_KIT_ITEMS = [
  {
    id: 'kit-1',
    category: 'Agua y Alimentos',
    title: 'Agua potable embotellada',
    desc: 'Mínimo 3 a 4 litros por persona al día (prever reserva para al menos 3 a 5 días).',
  },
  {
    id: 'kit-2',
    category: 'Agua y Alimentos',
    title: 'Alimentos no perecederos',
    desc: 'Enlatados con abre-fácil o abrelatas manual, barras energéticas y frutos secos.',
  },
  {
    id: 'kit-3',
    category: 'Documentos',
    title: 'Documentos personales en bolsa hermética',
    desc: 'Actas de nacimiento, identificaciones oficiales, escrituras, pólizas y cartillas de salud.',
  },
  {
    id: 'kit-4',
    category: 'Documentos',
    title: 'Respaldo digital en memoria USB o nube',
    desc: 'Fotografías de identificación y documentos importantes digitalizados.',
  },
  {
    id: 'kit-5',
    category: 'Salud y Botiquín',
    title: 'Medicamentos de uso continuo',
    desc: 'Dosis para al menos 7 días (medicamentos para hipertensión, diabetes, etc.).',
  },
  {
    id: 'kit-6',
    category: 'Salud y Botiquín',
    title: 'Botiquín de primeros auxilios',
    desc: 'Gasas, vendas, antiséptico, alcohol, tela adhesiva, analgésicos y termómetro.',
  },
  {
    id: 'kit-7',
    category: 'Tecnología y Energía',
    title: 'Radio portátil AM/FM de pilas o manivela',
    desc: 'Herramienta clave para sintonizar boletines si se interrumpe la red de telefonía.',
  },
  {
    id: 'kit-8',
    category: 'Tecnología y Energía',
    title: 'Linterna LED y pilas de repuesto',
    desc: 'Evite el uso de velas para prevenir riesgos de incendio ante posibles fugas de gas.',
  },
  {
    id: 'kit-9',
    category: 'Tecnología y Energía',
    title: 'Baterías externas (Power Banks) con carga completa',
    desc: 'Cables de carga protegidos en bolsa impermeable.',
  },
  {
    id: 'kit-10',
    category: 'Seguridad y Efectivo',
    title: 'Dinero en efectivo en billetes pequeños y monedas',
    desc: 'Los cajeros automáticos y terminales electrónicas pueden quedar fuera de servicio temporalmente.',
  },
  {
    id: 'kit-11',
    category: 'Seguridad y Efectivo',
    title: 'Silbato de auxilio e impermeable',
    desc: 'El silbato permite emitir señales audibles de rescate con mínimo esfuerzo físico.',
  },
  {
    id: 'kit-12',
    category: 'Mascotas',
    title: 'Kit para mascota (alimento, transportadora y correa)',
    desc: 'Ración para 5 días, plato plegable y correa obligatoria para ingreso a refugios.',
  },
];
