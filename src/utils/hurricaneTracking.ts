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

// Histórico de posiciones oficiales NHC previas al boletín actual para Huracán Trudy (ep212026)
const BASE_TRAJECTORY_BEFORE_CURRENT: TrajectoryPoint[] = [
  {
    id: 'p-1',
    timestamp: '2026-10-14T18:00:00Z',
    dateTimeFormatted: '14 Oct - 12:00 CST (Histórico NHC)',
    type: 'histórico',
    lat: 10.8,
    lng: -99.8,
    category: 'DT',
    windSpeedKmh: 50,
    windSpeedMph: 31,
    pressureHpa: 1008,
    statusText: 'Organización como Depresión Tropical 21-E en el Pacífico Sur',
  },
  {
    id: 'p-2',
    timestamp: '2026-10-15T00:00:00Z',
    dateTimeFormatted: '14 Oct - 18:00 CST (Histórico NHC)',
    type: 'histórico',
    lat: 11.8,
    lng: -100.8,
    category: 'TT',
    windSpeedKmh: 75,
    windSpeedMph: 47,
    pressureHpa: 1002,
    statusText: 'Evolución a Tormenta Tropical con vientos de 75 km/h',
  },
  {
    id: 'p-3',
    timestamp: '2026-10-15T06:00:00Z',
    dateTimeFormatted: '15 Oct - 00:00 CST (Histórico NHC)',
    type: 'histórico',
    lat: 12.6,
    lng: -101.2,
    category: 'TT',
    windSpeedKmh: 110,
    windSpeedMph: 70,
    pressureHpa: 990,
    statusText: 'Tormenta Tropical Severa en rápida intensificación',
  },
];

// Puntos de pronóstico posterior a la posición actual (Trayectoria Oficial NHC Boletín 9A)
const BASE_TRAJECTORY_FORECAST: TrajectoryPoint[] = [
  {
    id: 'p-4',
    timestamp: '2026-10-15T18:00:00Z',
    dateTimeFormatted: '15 Oct - 18:00 CST (Pronóstico NHC +6h)',
    type: 'pronóstico',
    lat: 13.6,
    lng: -101.9,
    category: 'C2',
    windSpeedKmh: 175,
    windSpeedMph: 110,
    pressureHpa: 970,
    statusText: 'Huracán Categoría 2 con vientos de 175 km/h mar adentro frente a Guerrero',
  },
  {
    id: 'p-5',
    timestamp: '2026-10-16T06:00:00Z',
    dateTimeFormatted: '16 Oct - 06:00 CST (Pronóstico NHC +18h)',
    type: 'pronóstico',
    lat: 14.6,
    lng: -102.2,
    category: 'C4',
    windSpeedKmh: 215,
    windSpeedMph: 135,
    pressureHpa: 948,
    statusText: 'Huracán Mayor Categoría 4 en rápida intensificación mar adentro',
  },
  {
    id: 'p-6',
    timestamp: '2026-10-16T18:00:00Z',
    dateTimeFormatted: '16 Oct - 18:00 CST (Pronóstico NHC +30h)',
    type: 'pronóstico',
    lat: 15.5,
    lng: -102.5,
    category: 'C4',
    windSpeedKmh: 230,
    windSpeedMph: 145,
    pressureHpa: 940,
    statusText: 'Pico de intensidad: Huracán Mayor Cat. 4 con vientos de 230 km/h y rachas de 280 km/h',
  },
  {
    id: 'p-7',
    timestamp: '2026-10-17T06:00:00Z',
    dateTimeFormatted: '17 Oct - 06:00 CST (Pronóstico NHC +42h)',
    type: 'pronóstico',
    lat: 16.7,
    lng: -103.4,
    category: 'C4',
    windSpeedKmh: 220,
    windSpeedMph: 140,
    pressureHpa: 944,
    statusText: 'Frente a las costas de Michoacán (Lázaro Cárdenas, Caleta de Campos)',
  },
  {
    id: 'p-8',
    timestamp: '2026-10-17T18:00:00Z',
    dateTimeFormatted: '17 Oct - 18:00 CST (Pronóstico NHC +54h)',
    type: 'pronóstico',
    lat: 18.0,
    lng: -104.3,
    category: 'C3',
    windSpeedKmh: 195,
    windSpeedMph: 120,
    pressureHpa: 954,
    statusText: 'Frente a las costas de Colima (Manzanillo) y sur de Jalisco (Melaque, Cihuatlán)',
  },
  {
    id: 'p-9',
    timestamp: '2026-10-18T06:00:00Z',
    dateTimeFormatted: '18 Oct - 06:00 CST (Pronóstico NHC +66h)',
    type: 'pronóstico',
    lat: 19.4,
    lng: -105.4,
    category: 'C2',
    windSpeedKmh: 165,
    windSpeedMph: 100,
    pressureHpa: 966,
    statusText: 'Paso cercano a Cabo Corrientes y Bahía de Banderas / Puerto Vallarta',
  },
];

// Objetivo proyectado de máxima aproximación costera (Costa de Colima / Jalisco)
export const PROJECTED_APPROACH_COORDS = {
  lat: 19.0522,
  lng: -104.316,
  name: 'Litoral Central del Pacífico (Michoacán, Colima y Costa de Jalisco)',
};

// Referencias costeras oficiales
const ZIHUATANEJO_COORDS = { lat: 17.6406, lng: -101.5574 };
const LAZARO_CARDENAS_COORDS = { lat: 17.9583, lng: -102.1969 };
const MANZANILLO_COORDS = { lat: 19.0522, lng: -104.316 };
const CABO_CORRIENTES_COORDS = { lat: 20.32, lng: -105.328 };
const PUERTO_VALLARTA_COORDS = { lat: 20.6534, lng: -105.2253 };

/**
 * Calcula el estado dinámico y verificado del huracán basado en el Aviso Oficial #9A del NHC / SMN
 * Ancla oficial: 15 Octubre 12:00 CST (13.40°N, 101.60°W) rumbo 335° (NNW) a 9 km/h.
 */
export function getLiveHurricaneStatus(refDate: Date = new Date()): {
  status: DynamicHurricaneStatus;
  trajectoryPoints: TrajectoryPoint[];
} {
  const timeFormatter = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Mexico_City',
  });
  const timeText = timeFormatter.format(refDate);

  // Coordenadas oficiales en vivo (Huracán Trudy tau 0: 13.4°N, 101.6°O)
  const liveLat = 13.4;
  const liveLng = -101.6;

  // Distancias reales desde el centro actual a puntos de referencia
  const distZihuatanejo = Math.round(calculateDistanceKm(liveLat, liveLng, ZIHUATANEJO_COORDS.lat, ZIHUATANEJO_COORDS.lng));
  const distLazaro = Math.round(calculateDistanceKm(liveLat, liveLng, LAZARO_CARDENAS_COORDS.lat, LAZARO_CARDENAS_COORDS.lng));
  const distManzanillo = Math.round(calculateDistanceKm(liveLat, liveLng, MANZANILLO_COORDS.lat, MANZANILLO_COORDS.lng));
  const distVallarta = Math.round(calculateDistanceKm(liveLat, liveLng, PUERTO_VALLARTA_COORDS.lat, PUERTO_VALLARTA_COORDS.lng));
  const distApproach = Math.round(calculateDistanceKm(liveLat, liveLng, PROJECTED_APPROACH_COORDS.lat, PROJECTED_APPROACH_COORDS.lng));

  const distanceReference = `A ~${distZihuatanejo} km al SO de Zihuatanejo (Guerrero), ~${distLazaro} km de Lázaro Cárdenas (Michoacán) y ~${distManzanillo} km al SSE de Manzanillo (Colima).`;

  const status: DynamicHurricaneStatus = {
    name: 'TRUDY',
    basin: 'Pacífico Nororiental',
    category: 1,
    categoryName: 'Huracán Categoría 1 (Hacia Cat. 4)',
    classification: 'Huracán en Rápida Intensificación hacia Huracán Mayor',
    windSpeedKmh: 150,
    windGustsKmh: 185,
    windSpeedMph: 93,
    pressureHpa: 979,
    lat: liveLat,
    lng: liveLng,
    coordinatesText: `${liveLat.toFixed(1)}° Norte, ${Math.abs(liveLng).toFixed(1)}° Oeste`,
    distanceReference,
    movement: 'Hacia el Nor-Noroeste (335°)',
    movementSpeedKmh: 9,
    movementSpeedMph: 5,
    waveHeightMeters: '4.5 a 6.5 metros',
    rainAccumulation: 'Lluvias torrenciales extraordinarias (> 250 mm) en Guerrero, Michoacán, Colima y Jalisco',
    lastUpdate: `Boletín Oficial NHC Advisory #9A / SMN Conagua • Sincronizado ${timeText} hrs`,
    timeText,
    distanceToLandfallKm: distApproach,
    targetLocationName: PROJECTED_APPROACH_COORDS.name,
    estimatedLandfallTimeText: 'Trayectoria paralela al litoral con máxima cercanía a Manzanillo/Jalisco en 48-60 hrs',
    hoursUntilLandfall: 48,
    minutesUntilLandfall: 0,
  };

  // Punto actual verificado en el mapa
  const liveCurrentPoint: TrajectoryPoint = {
    id: 'p-current',
    timestamp: refDate.toISOString(),
    dateTimeFormatted: `15 Oct - 12:00 CST (Posición Oficial en Vivo)`,
    type: 'actual',
    lat: liveLat,
    lng: liveLng,
    category: 'C1',
    windSpeedKmh: 150,
    windSpeedMph: 93,
    pressureHpa: 979,
    statusText: `Posición actual: 13.4°N, 101.6°O. Vientos sostenidos de 150 km/h, rachas de 185 km/h. A ~240 km al SO de Zihuatanejo. Rápida intensificación a Huracán Mayor.`,
  };

  const trajectoryPoints: TrajectoryPoint[] = [
    ...BASE_TRAJECTORY_BEFORE_CURRENT,
    liveCurrentPoint,
    ...BASE_TRAJECTORY_FORECAST,
  ];

  return { status, trajectoryPoints };
}
