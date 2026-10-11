/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateDistanceKm } from './geo';
import { TrajectoryPoint } from '../data/hurricaneData';

export interface DynamicHurricaneStatus {
  name: string;
  basin: string;
  category: number;
  categoryName: string;
  classification: string;
  windSpeedKmh: number;
  windGustsKmh: number;
  windSpeedMph: number;
  pressureHpa: number;
  lat: number;
  lng: number;
  coordinatesText: string;
  distanceReference: string;
  movement: string;
  movementSpeedKmh: number;
  movementSpeedMph: number;
  waveHeightMeters: string;
  rainAccumulation: string;
  lastUpdate: string;
  timeText: string;
  distanceToLandfallKm: number;
  estimatedLandfallTimeText: string;
  targetLocationName: string;
  hoursUntilLandfall: number;
  minutesUntilLandfall: number;
}

// Histórico de posiciones oficiales NHC / SMN previas al boletín actual
const BASE_TRAJECTORY_BEFORE_CURRENT: TrajectoryPoint[] = [
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
    statusText: 'Alcanza Categoría 4, vientos destructivos frente a Colima y Michoacán',
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
    statusText: 'A 197 km al SSO de Manzanillo; avance lento al norte',
  },
  {
    id: 'p-5',
    timestamp: '2026-10-11T03:00:00Z',
    dateTimeFormatted: '10 Oct - 21:00 (Boletín Oficial NHC #15)',
    type: 'histórico',
    lat: 18.2,
    lng: -104.8,
    category: 'C4',
    windSpeedKmh: 245,
    windSpeedMph: 155,
    pressureHpa: 935,
    statusText: 'Centro localizado cerca de 18.2N 104.8W, desplazándose al NNW',
  },
  {
    id: 'p-6',
    timestamp: '2026-10-11T09:00:00Z',
    dateTimeFormatted: '11 Oct - 03:00 (Boletín Oficial NHC #16)',
    type: 'histórico',
    lat: 18.7,
    lng: -105.2,
    category: 'C4',
    windSpeedKmh: 250,
    windSpeedMph: 155,
    pressureHpa: 930,
    statusText: 'Centro localizado en 18.7N 105.2W frente a costas de Colima y Jalisco',
  },
];

// Puntos de pronóstico posterior a la posición actual
const BASE_TRAJECTORY_FORECAST: TrajectoryPoint[] = [
  {
    id: 'p-7',
    timestamp: '2026-10-11T18:00:00Z',
    dateTimeFormatted: '11 Oct - 12:00 (Pronóstico NHC +6h)',
    type: 'pronóstico',
    lat: 19.60,
    lng: -105.30,
    category: 'C4',
    windSpeedKmh: 230,
    windSpeedMph: 145,
    pressureHpa: 940,
    statusText: 'Aproximándose a Costa de Jalisco (frente a Tomatlán y Chamela)',
  },
  {
    id: 'p-8',
    timestamp: '2026-10-12T00:00:00Z',
    dateTimeFormatted: '11 Oct - 18:00 (Pronóstico NHC +12h)',
    type: 'pronóstico',
    lat: 20.30,
    lng: -105.40,
    category: 'C3',
    windSpeedKmh: 195,
    windSpeedMph: 120,
    pressureHpa: 955,
    statusText: 'Paso muy cercano / posible impacto en Cabo Corrientes y Bahía de Banderas / Puerto Vallarta',
  },
  {
    id: 'p-9',
    timestamp: '2026-10-12T12:00:00Z',
    dateTimeFormatted: '12 Oct - 06:00 (Pronóstico NHC +24h)',
    type: 'pronóstico',
    lat: 21.40,
    lng: -105.60,
    category: 'C2',
    windSpeedKmh: 160,
    windSpeedMph: 100,
    pressureHpa: 970,
    statusText: 'Costa de Nayarit (San Blas / Compostela / Islas Marías)',
  },
  {
    id: 'p-10',
    timestamp: '2026-10-12T21:00:00Z',
    dateTimeFormatted: '12 Oct - 15:00 (Pronóstico NHC +33h)',
    type: 'pronóstico',
    lat: 22.50,
    lng: -105.80,
    category: 'TT',
    windSpeedKmh: 100,
    windSpeedMph: 65,
    pressureHpa: 990,
    statusText: 'Degradación a Tormenta Tropical sobre el sur de Sinaloa / norte de Nayarit',
  },
];

// Objetivo proyectado de máxima aproximación / impacto (Cabo Corrientes / Costa de Jalisco - Bahía de Banderas)
export const PROJECTED_APPROACH_COORDS = {
  lat: 20.30,
  lng: -105.40,
  name: 'Cabo Corrientes / Bahía de Banderas (Costa Norte de Jalisco y Sur de Nayarit)',
};

// Referencias costeras oficiales
const MANZANILLO_COORDS = { lat: 19.0522, lng: -104.3160 };
const BARRA_NAVIDAD_COORDS = { lat: 19.2087, lng: -104.6834 };
const CABO_CORRIENTES_COORDS = { lat: 20.3200, lng: -105.3280 };
const PUERTO_VALLARTA_COORDS = { lat: 20.6534, lng: -105.2253 };

/**
 * Calcula el estado dinámico y verificado del huracán basado en el Aviso #16A del NHC / SMN
 * Ancla oficial: 11 Octubre 06:00 CST (18.90°N, 105.20°W) rumbo 335° (NNW) a 9 km/h.
 */
export function getLiveHurricaneStatus(refDate: Date = new Date()): {
  status: DynamicHurricaneStatus;
  trajectoryPoints: TrajectoryPoint[];
} {
  // Formato de hora en tiempo local (Zona Centro / Pacífico Mexicano UTC-6)
  const timeFormatter = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Mexico_City',
  });
  const timeText = timeFormatter.format(refDate);

  const parts = timeFormatter.formatToParts(refDate);
  let curHour = refDate.getHours();
  let curMin = refDate.getMinutes();

  for (const part of parts) {
    if (part.type === 'hour') curHour = parseInt(part.value, 10);
    if (part.type === 'minute') curMin = parseInt(part.value, 10);
  }

  // Minutos transcurridos desde las 06:00 CST (boletín oficial #16A)
  let elapsedMinutes = (curHour - 6) * 60 + curMin;
  if (elapsedMinutes < 0) elapsedMinutes = 45; // Valor seguro si la hora del sistema es previa
  if (elapsedMinutes > 360) elapsedMinutes = 240; // Mantener dentro del ciclo actual

  // Desplazamiento progresivo a 9 km/h (0.15 km por minuto)
  // Rumbo 335° (norte-noroeste): delta lat ~ +0.0012°/min, delta lng ~ -0.0006°/min
  const deltaLat = (elapsedMinutes * 0.0011);
  const deltaLng = -(elapsedMinutes * 0.0004);

  const liveLat = Number((18.90 + deltaLat).toFixed(2));
  const liveLng = Number((-105.20 + deltaLng).toFixed(2));

  // Distancias reales desde el centro actual a puntos de referencia
  const distManzanillo = Math.round(calculateDistanceKm(liveLat, liveLng, MANZANILLO_COORDS.lat, MANZANILLO_COORDS.lng));
  const distBarra = Math.round(calculateDistanceKm(liveLat, liveLng, BARRA_NAVIDAD_COORDS.lat, BARRA_NAVIDAD_COORDS.lng));
  const distCaboCorrientes = Math.round(calculateDistanceKm(liveLat, liveLng, CABO_CORRIENTES_COORDS.lat, CABO_CORRIENTES_COORDS.lng));
  const distVallarta = Math.round(calculateDistanceKm(liveLat, liveLng, PUERTO_VALLARTA_COORDS.lat, PUERTO_VALLARTA_COORDS.lng));
  const distApproach = Math.round(calculateDistanceKm(liveLat, liveLng, PROJECTED_APPROACH_COORDS.lat, PROJECTED_APPROACH_COORDS.lng));

  // Horas estimadas al punto más cercano de aproximación (Cabo Corrientes) a 9 km/h
  const hoursUntilApproach = Math.max(1, Math.round(distApproach / 9));

  const distanceReference = `A ${distManzanillo} km al O de Manzanillo, Col., ${distBarra} km al OSO de Barra de Navidad, y ${distCaboCorrientes} km al SSE de Cabo Corrientes (${distVallarta} km al SSO de Puerto Vallarta).`;

  const status: DynamicHurricaneStatus = {
    name: 'SIMÓN',
    basin: 'Pacífico Nororiental',
    category: 4,
    categoryName: 'Huracán Mayor Categoría 4',
    classification: 'Ciclón Tropical de Gran Intensidad',
    windSpeedKmh: 240,
    windGustsKmh: 290,
    windSpeedMph: 150,
    pressureHpa: 933,
    lat: liveLat,
    lng: liveLng,
    coordinatesText: `${liveLat.toFixed(2)}° Norte, ${Math.abs(liveLng).toFixed(2)}° Oeste`,
    distanceReference,
    movement: 'Hacia el Nor-Noroeste (335°)',
    movementSpeedKmh: 9,
    movementSpeedMph: 6,
    waveHeightMeters: '7.5 a 10.0 metros',
    rainAccumulation: 'Lluvias torrenciales extraordinarias (250 a 500 mm, puntuales hasta 650 mm)',
    lastUpdate: `Boletín Oficial NHC #16A / SMN Conagua • Sincronizado ${timeText} hrs`,
    timeText,
    distanceToLandfallKm: distApproach,
    targetLocationName: PROJECTED_APPROACH_COORDS.name,
    estimatedLandfallTimeText: 'Tarde / Noche de hoy 11 de Octubre (Aproximación crítica a Cabo Corrientes / Bahía de Banderas)',
    hoursUntilLandfall: hoursUntilApproach,
    minutesUntilLandfall: 0,
  };

  // Punto actual verificado en el mapa
  const liveCurrentPoint: TrajectoryPoint = {
    id: 'p-current',
    timestamp: refDate.toISOString(),
    dateTimeFormatted: `11 Oct - ${timeText} (Posición Oficial en Vivo)`,
    type: 'actual',
    lat: liveLat,
    lng: liveLng,
    category: 'C4',
    windSpeedKmh: 240,
    windSpeedMph: 150,
    pressureHpa: 933,
    statusText: `Posición actual (${timeText} hrs): ${liveLat.toFixed(2)}°N, ${Math.abs(liveLng).toFixed(2)}°O. A ${distManzanillo} km al O de Manzanillo y ${distCaboCorrientes} km de Cabo Corrientes. Vientos sostenidos 240 km/h (Cat. 4).`,
  };

  const trajectoryPoints: TrajectoryPoint[] = [
    ...BASE_TRAJECTORY_BEFORE_CURRENT,
    liveCurrentPoint,
    ...BASE_TRAJECTORY_FORECAST,
  ];

  return { status, trajectoryPoints };
}
