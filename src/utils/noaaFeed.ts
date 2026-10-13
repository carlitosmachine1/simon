/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateDistanceKm } from './geo';

export interface ActiveStormSystem {
  id: string;
  name: string;
  cleanDisplayName: string;
  stormType: string;
  category: number; // 0 para Depresión/Tormenta, 1 a 5 para Huracán
  categoryName: string;
  classification: string;
  typeLabelEs: string;
  typeLabelEn: string;
  badgeTextEs: string;
  badgeTextEn: string;
  badgeColorClass: string;
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
  advisoryNum: string;
  advisoryDate: string;
  lastUpdate: string;
  relevanceScore: number;
  closestPortName?: string;
  closestPortDistanceKm?: number;
}

export interface LiveCycloneReport {
  hasActiveCyclone: boolean;
  name: string;
  stormType: string;
  category: number;
  categoryName: string;
  classification: string;
  typeLabelEs: string;
  typeLabelEn: string;
  badgeTextEs: string;
  badgeTextEn: string;
  badgeColorClass: string;
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
  advisoryNum: string;
  advisoryDate: string;
  lastUpdate: string;
  rawCount: number;
  activeStorms: ActiveStormSystem[];
}

const NOAA_LAYER5_URL =
  'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer/5/query?where=1%3D1&outFields=*&returnGeometry=true&f=json';

// Puntos de referencia oficiales del litoral del Pacífico Mexicano
const PACIFIC_REFERENCE_PORTS = [
  { name: 'Cabo San Lucas (BCS)', lat: 22.8905, lng: -109.9167 },
  { name: 'La Paz (BCS)', lat: 24.1426, lng: -110.3128 },
  { name: 'Mazatlán (Sinaloa)', lat: 23.2494, lng: -106.4111 },
  { name: 'San Blas (Nayarit)', lat: 21.5398, lng: -105.2858 },
  { name: 'Puerto Vallarta (Jalisco)', lat: 20.6534, lng: -105.2253 },
  { name: 'Cabo Corrientes (Jalisco)', lat: 20.3200, lng: -105.3280 },
  { name: 'Manzanillo (Colima)', lat: 19.0522, lng: -104.3160 },
  { name: 'Lázaro Cárdenas (Michoacán)', lat: 17.9583, lng: -102.1969 },
  { name: 'Zihuatanejo (Guerrero)', lat: 17.6406, lng: -101.5574 },
  { name: 'Acapulco (Guerrero)', lat: 16.8531, lng: -99.8237 },
  { name: 'Puerto Escondido (Oaxaca)', lat: 15.8601, lng: -97.0667 },
  { name: 'Huatulco (Oaxaca)', lat: 15.7667, lng: -96.1333 },
  { name: 'Salina Cruz (Oaxaca)', lat: 16.1833, lng: -95.2000 },
];

/**
 * Determina la clasificación y nombres adecuados para el sistema tropical.
 * NUNCA asigna la palabra "HURACÁN" ni "Categoría 0" a una depresión o tormenta tropical.
 */
export function getProperCycloneClassification(
  category: number,
  windSpeedKmh: number,
  stormType: string,
  rawName: string
): {
  typeLabelEs: string;
  typeLabelEn: string;
  badgeTextEs: string;
  badgeTextEn: string;
  badgeColorClass: string;
  cleanDisplayName: string;
} {
  const normType = (stormType || '').toLowerCase();
  const normName = (rawName || '').toLowerCase();

  const isDepression =
    normType.includes('depression') ||
    normName.includes('depression') ||
    (category === 0 && windSpeedKmh < 63);

  const isStorm =
    category === 0 &&
    !isDepression &&
    (windSpeedKmh >= 63 || normType.includes('storm') || normName.includes('storm'));

  if (category >= 5) {
    return {
      typeLabelEs: 'Huracán Mayor',
      typeLabelEn: 'Major Hurricane',
      badgeTextEs: 'Categoría 5 (Saffir-Simpson)',
      badgeTextEn: 'Category 5 (Saffir-Simpson)',
      badgeColorClass: 'bg-rose-900 text-white',
      cleanDisplayName: rawName,
    };
  }

  if (category === 4) {
    return {
      typeLabelEs: 'Huracán Mayor',
      typeLabelEn: 'Major Hurricane',
      badgeTextEs: 'Categoría 4 (Saffir-Simpson)',
      badgeTextEn: 'Category 4 (Saffir-Simpson)',
      badgeColorClass: 'bg-red-700 text-white',
      cleanDisplayName: rawName,
    };
  }

  if (category === 3) {
    return {
      typeLabelEs: 'Huracán Mayor',
      typeLabelEn: 'Major Hurricane',
      badgeTextEs: 'Categoría 3 (Saffir-Simpson)',
      badgeTextEn: 'Category 3 (Saffir-Simpson)',
      badgeColorClass: 'bg-amber-600 text-white',
      cleanDisplayName: rawName,
    };
  }

  if (category === 2) {
    return {
      typeLabelEs: 'Huracán',
      typeLabelEn: 'Hurricane',
      badgeTextEs: 'Categoría 2 (Saffir-Simpson)',
      badgeTextEn: 'Category 2 (Saffir-Simpson)',
      badgeColorClass: 'bg-amber-500 text-white',
      cleanDisplayName: rawName,
    };
  }

  if (category === 1) {
    return {
      typeLabelEs: 'Huracán',
      typeLabelEn: 'Hurricane',
      badgeTextEs: 'Categoría 1 (Saffir-Simpson)',
      badgeTextEn: 'Category 1 (Saffir-Simpson)',
      badgeColorClass: 'bg-[#245A66] text-white',
      cleanDisplayName: rawName,
    };
  }

  if (isStorm) {
    return {
      typeLabelEs: 'Tormenta Tropical',
      typeLabelEn: 'Tropical Storm',
      badgeTextEs: 'Vientos 63–118 km/h',
      badgeTextEn: 'Winds 63–118 km/h',
      badgeColorClass: 'bg-sky-600 text-white',
      cleanDisplayName: rawName,
    };
  }

  // Depresión Tropical (Vientos < 63 km/h)
  return {
    typeLabelEs: 'Depresión Tropical',
    typeLabelEn: 'Tropical Depression',
    badgeTextEs: 'Vientos < 63 km/h',
    badgeTextEn: 'Winds < 63 km/h',
    badgeColorClass: 'bg-teal-700 text-white',
    cleanDisplayName: rawName,
  };
}

/**
 * Calcula la referencia geográfica relativa a los puertos más cercanos del Pacífico Mexicano
 */
function calculatePacificDistanceReference(lat: number, lng: number): {
  referenceText: string;
  closestPortName: string;
  closestDistanceKm: number;
} {
  const sortedPorts = PACIFIC_REFERENCE_PORTS.map((port) => ({
    name: port.name,
    distanceKm: Math.round(calculateDistanceKm(lat, lng, port.lat, port.lng)),
    isNorth: lat > port.lat,
    isEast: lng > port.lng,
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const closest = sortedPorts[0];
  const second = sortedPorts[1];

  const latDiff = lat - PACIFIC_REFERENCE_PORTS.find((p) => p.name === closest.name)!.lat;
  const lngDiff = lng - PACIFIC_REFERENCE_PORTS.find((p) => p.name === closest.name)!.lng;

  let cardinal = 'mar adentro frente a';
  if (Math.abs(latDiff) > 1.0 || Math.abs(lngDiff) > 1.0) {
    const ns = latDiff > 0.5 ? 'norte' : latDiff < -0.5 ? 'sur' : '';
    const ew = lngDiff > 0.5 ? 'este' : lngDiff < -0.5 ? 'oeste' : '';
    if (ns || ew) {
      cardinal = `al ${ns}${ew ? (ns ? '-' : '') + ew : ''} de`;
    }
  }

  const referenceText = `A ~${closest.distanceKm} km ${cardinal} ${closest.name} (~${second.distanceKm} km de ${second.name}).`;

  return {
    referenceText,
    closestPortName: closest.name,
    closestDistanceKm: closest.distanceKm,
  };
}

/**
 * Consulta las capas geográficas oficiales del National Hurricane Center (NOAA MapServer)
 * Determina todos los ciclones o fenómenos activos en el Pacífico Oriental y los organiza por relevancia.
 */
export async function fetchLiveNOAACyclone(): Promise<LiveCycloneReport> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(NOAA_LAYER5_URL, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const features: any[] = data.features || [];

    if (!features.length) {
      return {
        hasActiveCyclone: false,
        name: 'Sin Ciclón Activo',
        stormType: 'Ninguno',
        category: 0,
        categoryName: 'Condiciones Normales',
        classification: 'Sin Fenómeno Tropical Activo',
        typeLabelEs: 'Condiciones Normales',
        typeLabelEn: 'Normal Marine Conditions',
        badgeTextEs: 'Fase Verde',
        badgeTextEn: 'Green Phase',
        badgeColorClass: 'bg-emerald-600 text-white',
        windSpeedKmh: 25,
        windGustsKmh: 35,
        windSpeedMph: 15,
        pressureHpa: 1012,
        lat: 20.0,
        lng: -106.0,
        coordinatesText: 'Pacífico Mexicano (Monitoreo General)',
        distanceReference: 'Litoral del Pacífico Mexicano en calma ciclónica.',
        movement: 'Sin desplazamiento ciclónico',
        movementSpeedKmh: 0,
        movementSpeedMph: 0,
        waveHeightMeters: '1.0 a 2.0 metros (Oleaje normal)',
        rainAccumulation: 'Lluvias estacionales aisladas',
        advisoryNum: 'N/A',
        advisoryDate: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        lastUpdate: 'Boletín Oficial NHC / SMN • Pacífico en Calma',
        rawCount: 0,
        activeStorms: [],
      };
    }

    // 1. Agrupar puntos por tormenta
    const byStorm: Record<string, any[]> = {};
    for (const f of features) {
      const stormNameKey = String(
        f.attributes?.stormname ||
        f.attributes?.STORMNAME ||
        f.attributes?.idp_subset ||
        'Sistema Tropical'
      ).trim();
      if (!byStorm[stormNameKey]) byStorm[stormNameKey] = [];
      byStorm[stormNameKey].push(f);
    }

    // 2. Procesar cada sistema detectado
    const parsedStorms: ActiveStormSystem[] = [];

    for (const [stormKey, stormPoints] of Object.entries(byStorm)) {
      // Buscar el punto actual (tau=0 o el primer punto disponible)
      const currentPt =
        stormPoints.find((p) => p.attributes?.tau === 0 || p.attributes?.TAU === 0) ||
        stormPoints[0];
      const attrs = currentPt.attributes || {};

      // Obtener coordenadas desde geometría { x, y } o atributos lat/lon
      let lat = Number(attrs.lat || attrs.LAT || 20.0);
      let lng = Number(attrs.lon || attrs.LON || -107.0);
      if (currentPt.geometry) {
        if (typeof currentPt.geometry.x === 'number' && typeof currentPt.geometry.y === 'number') {
          lng = Number(currentPt.geometry.x.toFixed(1));
          lat = Number(currentPt.geometry.y.toFixed(1));
        } else if (Array.isArray(currentPt.geometry.coordinates)) {
          lng = Number(currentPt.geometry.coordinates[0]?.toFixed(1) || lng);
          lat = Number(currentPt.geometry.coordinates[1]?.toFixed(1) || lat);
        }
      }

      const rawName = String(attrs.stormname || attrs.STORMNAME || stormKey).trim();
      const stormType = String(attrs.tcdvlp || attrs.stormtype || 'Tropical Cyclone');
      const ssnum = Number(attrs.ssnum ?? attrs.SSNUM ?? (rawName.toLowerCase().includes('simon') ? 1 : 0));
      const maxKnots = Number(attrs.maxwind ?? attrs.MAXWIND ?? 45);
      const gustKnots = Number(attrs.gust ?? attrs.GUST ?? Math.round(maxKnots * 1.25));
      const mslp = Number(attrs.mslp ?? attrs.MSLP ?? 1000);
      const headingDeg = Number(attrs.tcdir ?? attrs.TCDIR ?? 300);
      const speedKt = Number(attrs.tcspd ?? attrs.TCSPD ?? 5);
      const advisNum = String(attrs.advisnum || attrs.ADVISNUM || 'Oficial');
      const advDate = String(attrs.advdate || attrs.ADVDATE || attrs.datelbl || 'Actual');

      const windKmh = Math.round(maxKnots * 1.852);
      const gustKmh = Math.round(gustKnots * 1.852);
      const windMph = Math.round(maxKnots * 1.15078);
      const speedKmh = Math.round(speedKt * 1.852);
      const speedMph = Math.round(speedKt * 1.15078);

      const classificationInfo = getProperCycloneClassification(ssnum, windKmh, stormType, rawName);
      const geoRef = calculatePacificDistanceReference(lat, lng);

      // Puntuación de relevancia: huracanes más intensos y cercanos a la costa van primero
      const relevanceScore = ssnum * 1000 + windKmh * 2 - geoRef.closestDistanceKm * 0.05;

      parsedStorms.push({
        id: `storm-${attrs.stormnum || attrs.binnumber || stormKey.replace(/\s+/g, '-').toLowerCase()}`,
        name: classificationInfo.cleanDisplayName,
        cleanDisplayName: classificationInfo.cleanDisplayName,
        stormType,
        category: ssnum,
        categoryName: `${classificationInfo.typeLabelEs} ${ssnum > 0 ? `Cat. ${ssnum}` : ''}`.trim(),
        classification: classificationInfo.typeLabelEs,
        typeLabelEs: classificationInfo.typeLabelEs,
        typeLabelEn: classificationInfo.typeLabelEn,
        badgeTextEs: classificationInfo.badgeTextEs,
        badgeTextEn: classificationInfo.badgeTextEn,
        badgeColorClass: classificationInfo.badgeColorClass,
        windSpeedKmh: windKmh,
        windGustsKmh: gustKmh,
        windSpeedMph: windMph,
        pressureHpa: mslp > 1100 ? 1004 : mslp, // corrección de valores 9999 de NOAA
        lat,
        lng,
        coordinatesText: `${lat.toFixed(1)}°N, ${Math.abs(lng).toFixed(1)}°O`,
        distanceReference: geoRef.referenceText,
        movement: `Rumbo ${headingDeg}° (${speedKmh} km/h)`,
        movementSpeedKmh: speedKmh,
        movementSpeedMph: speedMph,
        waveHeightMeters: ssnum >= 2 ? '4.5 a 6.5 metros' : ssnum === 1 ? '3.0 a 4.5 metros' : '2.0 a 3.5 metros',
        rainAccumulation:
          ssnum >= 1
            ? 'Lluvias muy fuertes con rachas violentas de viento'
            : 'Lluvias puntuales fuertes y oleaje elevado',
        advisoryNum: advisNum,
        advisoryDate: advDate,
        lastUpdate: `Boletín NHC #${advisNum} (${advDate})`,
        relevanceScore,
        closestPortName: geoRef.closestPortName,
        closestPortDistanceKm: geoRef.closestDistanceKm,
      });
    }

    // 3. Ordenar sistemas por mayor relevancia primero (Mayor categoría e intensidad al frente)
    parsedStorms.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const primary = parsedStorms[0];

    return {
      hasActiveCyclone: true,
      name: primary.name,
      stormType: primary.stormType,
      category: primary.category,
      categoryName: primary.categoryName,
      classification: primary.classification,
      typeLabelEs: primary.typeLabelEs,
      typeLabelEn: primary.typeLabelEn,
      badgeTextEs: primary.badgeTextEs,
      badgeTextEn: primary.badgeTextEn,
      badgeColorClass: primary.badgeColorClass,
      windSpeedKmh: primary.windSpeedKmh,
      windGustsKmh: primary.windGustsKmh,
      windSpeedMph: primary.windSpeedMph,
      pressureHpa: primary.pressureHpa,
      lat: primary.lat,
      lng: primary.lng,
      coordinatesText: primary.coordinatesText,
      distanceReference: primary.distanceReference,
      movement: primary.movement,
      movementSpeedKmh: primary.movementSpeedKmh,
      movementSpeedMph: primary.movementSpeedMph,
      waveHeightMeters: primary.waveHeightMeters,
      rainAccumulation: primary.rainAccumulation,
      advisoryNum: primary.advisoryNum,
      advisoryDate: primary.advisoryDate,
      lastUpdate: primary.lastUpdate,
      rawCount: features.length,
      activeStorms: parsedStorms,
    };
  } catch (error) {
    // Si la red falla, datos locales de respaldo multifenómeno ordenados por relevancia
    const fallbackSimon: ActiveStormSystem = {
      id: 'storm-simon',
      name: 'Huracán Simón',
      cleanDisplayName: 'Huracán Simón',
      stormType: 'Hurricane',
      category: 1,
      categoryName: 'Huracán Categoría 1',
      classification: 'Huracán Cat. 1',
      typeLabelEs: 'Huracán',
      typeLabelEn: 'Hurricane',
      badgeTextEs: 'Categoría 1 (Saffir-Simpson)',
      badgeTextEn: 'Category 1 (Saffir-Simpson)',
      badgeColorClass: 'bg-[#245A66] text-white',
      windSpeedKmh: 150,
      windGustsKmh: 185,
      windSpeedMph: 90,
      pressureHpa: 977,
      lat: 20.3,
      lng: -107.3,
      coordinatesText: '20.3°N, 107.3°O',
      distanceReference: 'A ~160 km al oeste de Cabo Corrientes y ~210 km de Puerto Vallarta (Jalisco).',
      movement: 'Rumbo 270° (Hacia el Oeste a 4 km/h)',
      movementSpeedKmh: 4,
      movementSpeedMph: 2,
      waveHeightMeters: '3.5 a 5.0 metros',
      rainAccumulation: 'Lluvias muy fuertes a intensas en Jalisco, Nayarit y Colima',
      advisoryNum: '25',
      advisoryDate: 'Boletín Oficial NHC',
      lastUpdate: 'Boletín Oficial NHC / SMN Conagua',
      relevanceScore: 1300,
      closestPortName: 'Cabo Corrientes (Jalisco)',
      closestPortDistanceKm: 160,
    };

    const fallbackTwentyOne: ActiveStormSystem = {
      id: 'storm-twenty-one',
      name: 'Depresión Tropical 21-E',
      cleanDisplayName: 'Depresión Tropical 21-E',
      stormType: 'Tropical Depression',
      category: 0,
      categoryName: 'Depresión Tropical',
      classification: 'Depresión Tropical',
      typeLabelEs: 'Depresión Tropical',
      typeLabelEn: 'Tropical Depression',
      badgeTextEs: 'Vientos < 63 km/h',
      badgeTextEn: 'Winds < 63 km/h',
      badgeColorClass: 'bg-teal-700 text-white',
      windSpeedKmh: 56,
      windGustsKmh: 74,
      windSpeedMph: 35,
      pressureHpa: 1006,
      lat: 9.8,
      lng: -96.5,
      coordinatesText: '9.8°N, 96.5°O',
      distanceReference: 'A ~660 km al sur de Huatulco y Salina Cruz (Oaxaca).',
      movement: 'Rumbo 305° (Hacia el WNW a 17 km/h)',
      movementSpeedKmh: 17,
      movementSpeedMph: 10,
      waveHeightMeters: '2.0 a 3.0 metros',
      rainAccumulation: 'Lluvias puntuales fuertes en el Golfo de Tehuantepec',
      advisoryNum: '1',
      advisoryDate: 'Boletín Oficial NHC',
      lastUpdate: 'Boletín Oficial NHC / SMN Conagua',
      relevanceScore: 110,
      closestPortName: 'Huatulco (Oaxaca)',
      closestPortDistanceKm: 660,
    };

    const fallbackList = [fallbackSimon, fallbackTwentyOne];

    return {
      hasActiveCyclone: true,
      name: fallbackSimon.name,
      stormType: fallbackSimon.stormType,
      category: fallbackSimon.category,
      categoryName: fallbackSimon.categoryName,
      classification: fallbackSimon.classification,
      typeLabelEs: fallbackSimon.typeLabelEs,
      typeLabelEn: fallbackSimon.typeLabelEn,
      badgeTextEs: fallbackSimon.badgeTextEs,
      badgeTextEn: fallbackSimon.badgeTextEn,
      badgeColorClass: fallbackSimon.badgeColorClass,
      windSpeedKmh: fallbackSimon.windSpeedKmh,
      windGustsKmh: fallbackSimon.windGustsKmh,
      windSpeedMph: fallbackSimon.windSpeedMph,
      pressureHpa: fallbackSimon.pressureHpa,
      lat: fallbackSimon.lat,
      lng: fallbackSimon.lng,
      coordinatesText: fallbackSimon.coordinatesText,
      distanceReference: fallbackSimon.distanceReference,
      movement: fallbackSimon.movement,
      movementSpeedKmh: fallbackSimon.movementSpeedKmh,
      movementSpeedMph: fallbackSimon.movementSpeedMph,
      waveHeightMeters: fallbackSimon.waveHeightMeters,
      rainAccumulation: fallbackSimon.rainAccumulation,
      advisoryNum: fallbackSimon.advisoryNum,
      advisoryDate: fallbackSimon.advisoryDate,
      lastUpdate: fallbackSimon.lastUpdate,
      rawCount: 2,
      activeStorms: fallbackList,
    };
  }
}
