/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StormWaypoint {
  id: string;
  hourOffset: number; // e.g. -24, -12, 0, 12, 24, 36, 48, 60, 72, 96, 120
  timeLabel: string; // e.g. "Hoy 12:00h", "Vie 06:00h"
  dateLabel: string; // e.g. "15 Oct, 12:00 CST"
  stage: 'histórico' | 'actual' | 'pronóstico';
  lat: number;
  lng: number;
  category: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'TT' | 'DT' | 'SUB';
  categoryLabelEs: string;
  categoryLabelEn: string;
  windSpeedKmh: number;
  windGustsKmh: number;
  windSpeedKt: number;
  pressureHpa: number;
  statusTextEs: string;
  statusTextEn: string;
}

export interface StormTrajectoryProfile {
  id: string;
  stormName: string;
  cleanDisplayName: string;
  typeLabelEs: string;
  typeLabelEn: string;
  category: number;
  categoryNameEs: string;
  categoryNameEn: string;
  currentWindKmh: number;
  currentGustsKmh: number;
  currentPressureHpa: number;
  currentLat: number;
  currentLng: number;
  coordinatesText: string;
  movementTextEs: string;
  movementTextEn: string;
  movementSpeedKmh: number;
  distanceReferenceEs: string;
  distanceReferenceEn: string;
  advisoryNum: string;
  advisoryDate: string;
  // Visual identity
  themeColor: string; // Primary track color
  accentColor: string; // Secondary badge/cone color
  coneFillColor: string;
  coneStrokeColor: string;
  tagColor: string;
  waypoints: StormWaypoint[];
}

/**
 * DATOS OFICIALES REALES DEL PACÍFICO NORORIENTAL (NOAA NHC / SMN CONAGUA)
 * 1. Huracán Trudy (ep212026 - Boletín 9A): Huracán Cat. 1 en rápida intensificación a Cat. 4 frente a costas mexicanas
 * 2. Tormenta Tropical Simon (ep202026 - Boletín 33): Tormenta Tropical en fase de debilitamiento mar adentro
 */
export const OFFICIAL_PACIFIC_STORMS: StormTrajectoryProfile[] = [
  {
    id: 'storm-trudy',
    stormName: 'TRUDY',
    cleanDisplayName: 'Huracán Trudy',
    typeLabelEs: 'Huracán Mayor',
    typeLabelEn: 'Major Hurricane',
    category: 1,
    categoryNameEs: 'Huracán Cat. 1 (Hacia Cat. 4)',
    categoryNameEn: 'Hurricane Cat. 1 (Towards Cat. 4)',
    currentWindKmh: 150,
    currentGustsKmh: 185,
    currentPressureHpa: 979,
    currentLat: 13.4,
    currentLng: -101.6,
    coordinatesText: '13.4°N, 101.6°O',
    movementTextEs: 'Rumbo Nor-Noroeste (335°) a 9 km/h',
    movementTextEn: 'Heading NNW (335°) at 9 km/h',
    movementSpeedKmh: 9,
    distanceReferenceEs: 'A ~240 km al SO de Zihuatanejo (Guerrero) y ~450 km al SSE de Manzanillo (Colima). En rápida intensificación.',
    distanceReferenceEn: '~240 km SW of Zihuatanejo (Guerrero) & ~450 km SSE of Manzanillo (Colima). Rapidly intensifying.',
    advisoryNum: '9A',
    advisoryDate: 'Boletín Oficial NHC 12:00 PM CST (15 Oct)',
    themeColor: '#B84A45', // Crimson Red
    accentColor: '#D97706', // Warm Amber
    coneFillColor: '#F59E0B',
    coneStrokeColor: '#D97706',
    tagColor: 'bg-[#B84A45] text-white',
    waypoints: [
      {
        id: 'trudy-hist-1',
        hourOffset: -12,
        timeLabel: 'Mié 18:00',
        dateLabel: '14 Oct, 18:00 CST',
        stage: 'histórico',
        lat: 11.8,
        lng: -100.8,
        category: 'DT',
        categoryLabelEs: 'Depresión Tropical 21-E',
        categoryLabelEn: 'Tropical Depression 21-E',
        windSpeedKmh: 56,
        windGustsKmh: 75,
        windSpeedKt: 30,
        pressureHpa: 1006,
        statusTextEs: 'Fase de formación como Depresión Tropical 21-E en el Pacífico Sur.',
        statusTextEn: 'Formative stage as Tropical Depression 21-E in the South Pacific.',
      },
      {
        id: 'trudy-now',
        hourOffset: 0,
        timeLabel: 'Hoy 12:00 (Actual)',
        dateLabel: '15 Oct, 12:00 CST',
        stage: 'actual',
        lat: 13.4,
        lng: -101.6,
        category: 'C1',
        categoryLabelEs: 'Huracán Cat. 1',
        categoryLabelEn: 'Hurricane Cat. 1',
        windSpeedKmh: 150,
        windGustsKmh: 185,
        windSpeedKt: 80,
        pressureHpa: 979,
        statusTextEs: 'Centro actual: 13.4°N, 101.6°O. Vientos de 150 km/h. A 240 km al SO de Zihuatanejo. Oleaje de 4 a 6 m.',
        statusTextEn: 'Current center: 13.4°N, 101.6°W. Winds 150 km/h. 240 km SW of Zihuatanejo. 4-6 m surf.',
      },
      {
        id: 'trudy-fc-12',
        hourOffset: 12,
        timeLabel: 'Hoy 18:00 (+12h)',
        dateLabel: '15 Oct, 18:00 CST',
        stage: 'pronóstico',
        lat: 13.6,
        lng: -101.9,
        category: 'C2',
        categoryLabelEs: 'Huracán Cat. 2',
        categoryLabelEn: 'Hurricane Cat. 2',
        windSpeedKmh: 175,
        windGustsKmh: 215,
        windSpeedKt: 95,
        pressureHpa: 970,
        statusTextEs: 'Intensificación a Categoría 2. Desprendimientos nubosos con lluvias torrenciales en Guerrero y Michoacán.',
        statusTextEn: 'Strengthening to Category 2. Heavy cloud bands bringing torrential rain to Guerrero & Michoacán.',
      },
      {
        id: 'trudy-fc-24',
        hourOffset: 24,
        timeLabel: 'Vie 06:00 (+24h)',
        dateLabel: '16 Oct, 06:00 CST',
        stage: 'pronóstico',
        lat: 14.6,
        lng: -102.2,
        category: 'C4',
        categoryLabelEs: 'Huracán Mayor Cat. 4',
        categoryLabelEn: 'Major Hurricane Cat. 4',
        windSpeedKmh: 215,
        windGustsKmh: 260,
        windSpeedKt: 115,
        pressureHpa: 948,
        statusTextEs: 'Rápida intensificación a Huracán Mayor Cat. 4 mar adentro. Vientos destructivos en el semicírculo oriental.',
        statusTextEn: 'Rapid intensification to Major Hurricane Cat. 4 offshore. Severe winds in eastern eyewall.',
      },
      {
        id: 'trudy-fc-36',
        hourOffset: 36,
        timeLabel: 'Vie 18:00 (+36h)',
        dateLabel: '16 Oct, 18:00 CST',
        stage: 'pronóstico',
        lat: 15.5,
        lng: -102.5,
        category: 'C4',
        categoryLabelEs: 'Huracán Mayor Cat. 4 (Pico)',
        categoryLabelEn: 'Major Hurricane Cat. 4 (Peak)',
        windSpeedKmh: 230,
        windGustsKmh: 280,
        windSpeedKt: 125,
        pressureHpa: 940,
        statusTextEs: 'Pico de intensidad: Cat. 4 con vientos sostenidos de 230 km/h. Oleaje superior a 7 metros hacia costas de Michoacán.',
        statusTextEn: 'Peak intensity: Cat. 4 with 230 km/h winds. Dangerous storm surf exceeding 7 meters.',
      },
      {
        id: 'trudy-fc-48',
        hourOffset: 48,
        timeLabel: 'Sáb 06:00 (+48h)',
        dateLabel: '17 Oct, 06:00 CST',
        stage: 'pronóstico',
        lat: 16.7,
        lng: -103.4,
        category: 'C4',
        categoryLabelEs: 'Huracán Mayor Cat. 4',
        categoryLabelEn: 'Major Hurricane Cat. 4',
        windSpeedKmh: 220,
        windGustsKmh: 270,
        windSpeedKt: 120,
        pressureHpa: 944,
        statusTextEs: 'Frente a las costas de Michoacán y Colima. Máxima alerta por impacto de bandas espirales y vientos de tormenta.',
        statusTextEn: 'Off Michoacán & Colima coasts. High alert for outer convective rainbands.',
      },
      {
        id: 'trudy-fc-60',
        hourOffset: 60,
        timeLabel: 'Sáb 18:00 (+60h)',
        dateLabel: '17 Oct, 18:00 CST',
        stage: 'pronóstico',
        lat: 18.0,
        lng: -104.3,
        category: 'C3',
        categoryLabelEs: 'Huracán Mayor Cat. 3',
        categoryLabelEn: 'Major Hurricane Cat. 3',
        windSpeedKmh: 195,
        windGustsKmh: 240,
        windSpeedKt: 105,
        pressureHpa: 954,
        statusTextEs: 'Aproximándose frente a Manzanillo (Colima) y costas del sur de Jalisco.',
        statusTextEn: 'Approaching offshore waters off Manzanillo (Colima) and south Jalisco.',
      },
      {
        id: 'trudy-fc-72',
        hourOffset: 72,
        timeLabel: 'Dom 06:00 (+72h)',
        dateLabel: '18 Oct, 06:00 CST',
        stage: 'pronóstico',
        lat: 19.4,
        lng: -105.4,
        category: 'C2',
        categoryLabelEs: 'Huracán Cat. 2',
        categoryLabelEn: 'Hurricane Cat. 2',
        windSpeedKmh: 165,
        windGustsKmh: 205,
        windSpeedKt: 90,
        pressureHpa: 966,
        statusTextEs: 'Punto más cercano a Cabo Corrientes y Bahía de Banderas (Puerto Vallarta). Fuerte marea de tormenta.',
        statusTextEn: 'Closest approach to Cabo Corrientes and Banderas Bay (Puerto Vallarta).',
      },
      {
        id: 'trudy-fc-96',
        hourOffset: 96,
        timeLabel: 'Lun 06:00 (+96h)',
        dateLabel: '19 Oct, 06:00 CST',
        stage: 'pronóstico',
        lat: 20.2,
        lng: -107.4,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical',
        categoryLabelEn: 'Tropical Storm',
        windSpeedKmh: 100,
        windGustsKmh: 125,
        windSpeedKt: 55,
        pressureHpa: 992,
        statusTextEs: 'Alejándose mar adentro hacia el oeste de las costas mexicanas en degradación progresiva.',
        statusTextEn: 'Moving further offshore west of Mexican coast in gradual transition.',
      },
      {
        id: 'trudy-fc-120',
        hourOffset: 120,
        timeLabel: 'Mar 06:00 (+120h)',
        dateLabel: '20 Oct, 06:00 CST',
        stage: 'pronóstico',
        lat: 20.3,
        lng: -108.4,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical Remanente',
        categoryLabelEn: 'Remnant Tropical Storm',
        windSpeedKmh: 93,
        windGustsKmh: 110,
        windSpeedKt: 50,
        pressureHpa: 998,
        statusTextEs: 'En aguas abiertas del Pacífico sin riesgo directo a tierra.',
        statusTextEn: 'Over open Pacific waters with no direct mainland threat.',
      },
    ],
  },
  {
    id: 'storm-simon',
    stormName: 'SIMON',
    cleanDisplayName: 'Tormenta Tropical Simon',
    typeLabelEs: 'Tormenta Tropical',
    typeLabelEn: 'Tropical Storm',
    category: 0,
    categoryNameEs: 'Tormenta Tropical (En Degradación)',
    categoryNameEn: 'Tropical Storm (Weakening)',
    currentWindKmh: 93,
    currentGustsKmh: 111,
    currentPressureHpa: 996,
    currentLat: 19.2,
    currentLng: -108.1,
    coordinatesText: '19.2°N, 108.1°O',
    movementTextEs: 'Rumbo Norte (360°) a 0 km/h (Casi Estacionario)',
    movementTextEn: 'Heading North (360°) at 0 km/h (Quasi-Stationary)',
    movementSpeedKmh: 0,
    distanceReferenceEs: 'A ~320 km al OSO de Cabo Corrientes y ~420 km al sur de Los Cabos (BCS), mar adentro.',
    distanceReferenceEn: '~320 km WSW of Cabo Corrientes & ~420 km south of Los Cabos (BCS), offshore.',
    advisoryNum: '33',
    advisoryDate: 'Boletín Oficial NHC 8:00 AM MST (15 Oct)',
    themeColor: '#0D9488', // Deep Teal
    accentColor: '#0284C7', // Sky Azure
    coneFillColor: '#0EA5E9',
    coneStrokeColor: '#0284C7',
    tagColor: 'bg-[#0D9488] text-white',
    waypoints: [
      {
        id: 'simon-hist-1',
        hourOffset: -24,
        timeLabel: 'Mié 08:00',
        dateLabel: '14 Oct, 08:00 MST',
        stage: 'histórico',
        lat: 18.5,
        lng: -107.5,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical',
        categoryLabelEn: 'Tropical Storm',
        windSpeedKmh: 110,
        windGustsKmh: 135,
        windSpeedKt: 60,
        pressureHpa: 990,
        statusTextEs: 'Al oeste de las costas de Jalisco mar adentro.',
        statusTextEn: 'West of Jalisco coast offshore.',
      },
      {
        id: 'simon-now',
        hourOffset: 0,
        timeLabel: 'Hoy 08:00 (Actual)',
        dateLabel: '15 Oct, 08:00 MST',
        stage: 'actual',
        lat: 19.2,
        lng: -108.1,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical',
        categoryLabelEn: 'Tropical Storm',
        windSpeedKmh: 93,
        windGustsKmh: 111,
        windSpeedKt: 50,
        pressureHpa: 996,
        statusTextEs: 'Centro actual: 19.2°N, 108.1°O. A 320 km al OSO de Cabo Corrientes. Vientos de 93 km/h.',
        statusTextEn: 'Current center: 19.2°N, 108.1°W. 320 km WSW of Cabo Corrientes. Winds 93 km/h.',
      },
      {
        id: 'simon-fc-12',
        hourOffset: 12,
        timeLabel: 'Hoy 17:00 (+12h)',
        dateLabel: '15 Oct, 17:00 MST',
        stage: 'pronóstico',
        lat: 19.5,
        lng: -108.1,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical',
        categoryLabelEn: 'Tropical Storm',
        windSpeedKmh: 85,
        windGustsKmh: 102,
        windSpeedKt: 45,
        pressureHpa: 998,
        statusTextEs: 'Perdiendo fuerza gradualmente mar adentro sobre temperaturas oceánicas menores.',
        statusTextEn: 'Gradually weakening offshore over cooler sea surface temperatures.',
      },
      {
        id: 'simon-fc-24',
        hourOffset: 24,
        timeLabel: 'Vie 05:00 (+24h)',
        dateLabel: '16 Oct, 05:00 MST',
        stage: 'pronóstico',
        lat: 20.2,
        lng: -108.8,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical',
        categoryLabelEn: 'Tropical Storm',
        windSpeedKmh: 85,
        windGustsKmh: 102,
        windSpeedKt: 45,
        pressureHpa: 1000,
        statusTextEs: 'Desplazamiento lento hacia el noroeste mar adentro.',
        statusTextEn: 'Slow northwestward track in open waters.',
      },
      {
        id: 'simon-fc-36',
        hourOffset: 36,
        timeLabel: 'Vie 17:00 (+36h)',
        dateLabel: '16 Oct, 17:00 MST',
        stage: 'pronóstico',
        lat: 21.1,
        lng: -110.0,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical Moderada',
        categoryLabelEn: 'Moderate Tropical Storm',
        windSpeedKmh: 75,
        windGustsKmh: 93,
        windSpeedKt: 40,
        pressureHpa: 1002,
        statusTextEs: 'Al sur de la península de Baja California sin riesgo de impacto en tierra.',
        statusTextEn: 'South of Baja California peninsula with no landfall risk.',
      },
      {
        id: 'simon-fc-48',
        hourOffset: 48,
        timeLabel: 'Sáb 05:00 (+48h)',
        dateLabel: '17 Oct, 05:00 MST',
        stage: 'pronóstico',
        lat: 21.9,
        lng: -111.3,
        category: 'TT',
        categoryLabelEs: 'Tormenta Tropical Débil',
        categoryLabelEn: 'Weak Tropical Storm',
        windSpeedKmh: 65,
        windGustsKmh: 83,
        windSpeedKt: 35,
        pressureHpa: 1004,
        statusTextEs: 'Próxima a degradarse a depresión tropical mar adentro.',
        statusTextEn: 'Approaching depression stage offshore.',
      },
      {
        id: 'simon-fc-60',
        hourOffset: 60,
        timeLabel: 'Sáb 17:00 (+60h)',
        dateLabel: '17 Oct, 17:00 MST',
        stage: 'pronóstico',
        lat: 22.9,
        lng: -112.6,
        category: 'DT',
        categoryLabelEs: 'Depresión Tropical',
        categoryLabelEn: 'Tropical Depression',
        windSpeedKmh: 55,
        windGustsKmh: 74,
        windSpeedKt: 30,
        pressureHpa: 1006,
        statusTextEs: 'Degradada a depresión tropical en aguas del Pacífico abiertas.',
        statusTextEn: 'Downgraded to tropical depression in open Pacific waters.',
      },
      {
        id: 'simon-fc-72',
        hourOffset: 72,
        timeLabel: 'Dom 05:00 (+72h)',
        dateLabel: '18 Oct, 05:00 MST',
        stage: 'pronóstico',
        lat: 24.0,
        lng: -113.6,
        category: 'SUB',
        categoryLabelEs: 'Depresión Subtropical',
        categoryLabelEn: 'Subtropical Depression',
        windSpeedKmh: 45,
        windGustsKmh: 65,
        windSpeedKt: 25,
        pressureHpa: 1008,
        statusTextEs: 'Remanente subtropical sin afectaciones.',
        statusTextEn: 'Subtropical remnant with no impacts.',
      },
      {
        id: 'simon-fc-96',
        hourOffset: 96,
        timeLabel: 'Lun 05:00 (+96h)',
        dateLabel: '19 Oct, 05:00 MST',
        stage: 'pronóstico',
        lat: 26.8,
        lng: -114.4,
        category: 'SUB',
        categoryLabelEs: 'Baja Remanente',
        categoryLabelEn: 'Remnant Low',
        windSpeedKmh: 35,
        windGustsKmh: 55,
        windSpeedKt: 20,
        pressureHpa: 1010,
        statusTextEs: 'Disipación final en el océano.',
        statusTextEn: 'Final dissipation over ocean.',
      },
    ],
  },
];

/**
 * Genera el polígono del cono de incertidumbre (67% de probabilidad) a lo largo de los puntos de pronóstico.
 */
export function generateUncertaintyCone(
  waypoints: StormWaypoint[]
): [number, number][] {
  const forecastPts = waypoints.filter(
    (pt) => pt.stage === 'actual' || pt.stage === 'pronóstico'
  );

  if (forecastPts.length < 2) return [];

  const leftPoints: [number, number][] = [];
  const rightPoints: [number, number][] = [];

  for (let i = 0; i < forecastPts.length; i++) {
    const curr = forecastPts[i];
    const prev = forecastPts[Math.max(0, i - 1)];
    const next = forecastPts[Math.min(forecastPts.length - 1, i + 1)];

    // Ángulo de desplazamiento local
    const dLng = (next.lng - prev.lng) * Math.cos((curr.lat * Math.PI) / 180);
    const dLat = next.lat - prev.lat;
    const heading = Math.atan2(dLng, dLat); // radianes respecto al norte

    // Radio de incertidumbre en km según el desfase de tiempo (estándar NHC)
    const hours = Math.max(0, curr.hourOffset);
    const radiusKm = 28 + (hours / 12) * 26 + Math.pow(hours / 48, 2) * 25;

    // Desplazamiento perpendicular (± 90 grados = ± π/2)
    const angleLeft = heading + Math.PI / 2;
    const angleRight = heading - Math.PI / 2;

    const latDeltaLeft = (radiusKm / 111.32) * Math.cos(angleLeft);
    const lngDeltaLeft =
      (radiusKm / (111.32 * Math.cos((curr.lat * Math.PI) / 180))) *
      Math.sin(angleLeft);

    const latDeltaRight = (radiusKm / 111.32) * Math.cos(angleRight);
    const lngDeltaRight =
      (radiusKm / (111.32 * Math.cos((curr.lat * Math.PI) / 180))) *
      Math.sin(angleRight);

    leftPoints.push([curr.lat + latDeltaLeft, curr.lng + lngDeltaLeft]);
    rightPoints.push([curr.lat + latDeltaRight, curr.lng + lngDeltaRight]);
  }

  // Generar arco en el extremo final del cono
  const lastPt = forecastPts[forecastPts.length - 1];
  const prevPt = forecastPts[forecastPts.length - 2];
  const lastHeading = Math.atan2(
    (lastPt.lng - prevPt.lng) * Math.cos((lastPt.lat * Math.PI) / 180),
    lastPt.lat - prevPt.lat
  );
  const finalRadiusKm =
    28 + (lastPt.hourOffset / 12) * 26 + Math.pow(lastPt.hourOffset / 48, 2) * 25;

  const tipArc: [number, number][] = [];
  const steps = 8;
  for (let s = 1; s < steps; s++) {
    const arcAngle = lastHeading + Math.PI / 2 - (s / steps) * Math.PI;
    const arcLatDelta = (finalRadiusKm / 111.32) * Math.cos(arcAngle);
    const arcLngDelta =
      (finalRadiusKm / (111.32 * Math.cos((lastPt.lat * Math.PI) / 180))) *
      Math.sin(arcAngle);
    tipArc.push([lastPt.lat + arcLatDelta, lastPt.lng + arcLngDelta]);
  }

  // Polígono cerrado: lado izquierdo -> arco final -> lado derecho de regreso -> cerrar
  return [...leftPoints, ...tipArc, ...rightPoints.reverse()];
}
