import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

export interface Translations {
  // Common
  langName: string;
  emergency911: string;
  close: string;
  cancel: string;
  copied: string;

  // Alert Banner
  alertSituation: string;
  alertRed: string;
  alertBannerText: string;
  alertGreenTitle: string;
  alertGreenBannerText: string;

  // Navbar
  brandTitle: string;
  basin: string;
  brandSubtitle: string;
  navWind: string;
  navOutlook: string;
  navSatellite: string;
  navWebcams: string;
  navTrajectory: string;
  navStats: string;
  navShelters: string;
  navSources: string;
  directory911: string;
  shareBtn: string;

  // Share Modal
  shareTitle: string;
  shareSubtitle: string;
  shareCopyUrl: string;
  shareCopiedSuccess: string;
  shareWhatsapp: string;
  shareX: string;
  shareFacebook: string;
  shareNative: string;
  shareTextMsg: string;

  // Auto Refresh Bar
  autoSyncTitle: string;
  nextSyncIn: string;
  refreshNow: string;
  updatedAt: string;
  emergencyCycle: string;

  // Landfall Alert Hero
  officialLiveAdvisory: string;
  activeMonitoring: string;
  cycloneMajor: string;
  cycloneCategory: string;
  category2: string;
  category3: string;
  category4: string;
  categoryWord: string;
  hurricaneName: string;
  heroLocationSummary: string;
  airportsClosedBadge: string;
  portsClosedBadge: string;
  maxWinds: string;
  gusts: string;
  centralPressure: string;
  pressureExtreme: string;
  headingSpeed: string;
  cycloneCenter: string;
  pacificCoast: string;
  yourLocation: string;
  fromEye: string;
  viewNearbyShelters: string;

  // Calm State (Alerta Verde)
  heroGreenBadge: string;
  heroGreenTitle: string;
  heroGreenSubtitle: string;
  calmMetricCyclone: string;
  calmMetricCycloneVal: string;
  calmMetricWind: string;
  calmMetricWindVal: string;
  calmMetricPorts: string;
  calmMetricPortsVal: string;
  calmMetricRadar: string;
  calmMetricRadarVal: string;
  simulationLive: string;
  simulationCalm: string;
  simulationActive: string;

  // Windy Section
  windyBadge: string;
  windyTitle: string;
  windySubtitle: string;
  safeScrollLocked: string;
  safeScrollInteracting: string;
  reload: string;
  openInWindy: string;
  tapToInteractMap: string;
  lockScroll: string;
  windyCenterCoords: string;
  windyLayerInfo: string;

  // Satellite Section
  satelliteBadge: string;
  satelliteTitle: string;
  satelliteSubtitle: string;
  updatePhotos: string;
  noaaPortal: string;
  clickToEnlarge: string;
  download: string;
  original: string;

  // Webcams Section
  webcamsBadge: string;
  webcamsTitle: string;
  liveBadge: string;
  onAirBadge: string;
  camerasCount: string;
  reloadPlayer: string;
  openYoutube: string;
  fullscreen: string;
  minimize: string;

  // Trajectory Map Section
  trajBadge: string;
  trajTitle: string;
  updatedText: string;
  twoMinCycle: string;
  scrollSafeLockedMap: string;
  scrollNavigatingMap: string;
  sheltersVisibleBtn: string;
  sheltersHiddenBtn: string;
  centerSimonBtn: string;
  baseOSM: string;
  baseSatellite: string;

  // Historical Stats Section
  statsBadge: string;
  statsTitle: string;
  statsSubtitle: string;
  statsMetricWind: string;
  statsMetricPressure: string;
  statsScopeSeason: string;
  statsScopeLifecycle: string;
  statsTotalNamed: string;
  statsMajorHurricanes: string;
  statsPeakWind: string;
  statsMinPressure: string;
  statsChartWindLabel: string;
  statsChartPressureLabel: string;
  statsCategoryThresholds: string;
  statsTableTitle: string;
  statsTableSystem: string;
  statsTableCategory: string;
  statsTablePeakWind: string;
  statsTableMinPressure: string;
  statsTableDates: string;
  statsTableStatus: string;

  // Shelters Section
  sheltersBadge: string;
  sheltersTitle: string;
  sheltersDescHidden: string;
  sheltersDescOpen: string;
  btnShowShelters: string;
  btnHideShelters: string;
  searchPlaceholder: string;
  filterAllStates: string;
  filterAllMun: string;
  filterPetsOnly: string;
  filterOpenOnly: string;
  directionsBtn: string;
  copyAddress: string;
  copiedAddress: string;
  phoneCall: string;
  petFriendlyTag: string;
  statusActiveTag: string;
  capacityTag: string;
  distanceFromYou: string;

  // Emergency Guide
  guideBadge: string;
  guideTitle: string;
  guideSubtitle: string;
  phaseBefore: string;
  phaseDuring: string;
  phaseAfter: string;

  // Official Sources
  sourcesBadge: string;
  sourcesTitle: string;
  sourcesSubtitle: string;
  sourceNHC: string;
  sourceNHCDesc: string;
  sourceSMN: string;
  sourceSMNDesc: string;
  sourceCNPC: string;
  sourceCNPCDesc: string;
  sourceNOAA: string;
  sourceNOAADesc: string;
  visitPortal: string;

  // Contacts Modal
  contactsTitle: string;
  contactsSubtitle: string;
  callFree: string;

  // Footer
  footerCopyright: string;
  footerSyncNotice: string;
  footerDisclaimer: string;
  footerDevelopedBy: string;

  // Mobile Bottom Bar
  mobileBtnShelters: string;
  mobileBtn911: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    langName: 'Español',
    emergency911: 'Emergencias 911',
    close: 'Cerrar',
    cancel: 'Cancelar',
    copied: 'Copiado',

    // Alert Banner
    alertSituation: 'Aviso Meteorológico de Precaución',
    alertRed: 'Aviso de Precaución • Ciclón Tropical Detectado',
    alertBannerText:
      'Monitoreo preventivo activo frente a costas del Pacífico. Consulta avisos de navegación y refugios habilitados.',
    alertGreenTitle: 'Alerta Verde • Pacífico en Calma',
    alertGreenBannerText:
      'Sin ciclones tropicales activos en aguas del Pacífico Mexicano. Vigilancia meteorológica, marítima y satelital 24/7.',

    // Navbar
    brandTitle: 'MONITOR PACÍFICO',
    basin: 'Pacífico',
    brandSubtitle: 'Vigilancia Tropical y Costera • Fuentes Oficiales',
    navWind: 'Viento en Vivo',
    navOutlook: 'Perspectiva 7D',
    navSatellite: 'Fotos Satelitales',
    navWebcams: 'Webcams en Vivo',
    navTrajectory: 'Trayectoria',
    navStats: 'Estadísticas',
    navShelters: 'Refugios',
    navSources: 'Fuentes Oficiales',
    directory911: 'Directorio 911',
    shareBtn: 'Compartir',

    // Share Modal
    shareTitle: 'Compartir Monitor Pacífico',
    shareSubtitle: 'Difunde el monitoreo meteorológico y costero en tiempo real.',
    shareCopyUrl: 'Copiar enlace',
    shareCopiedSuccess: '¡Enlace copiado al portapapeles!',
    shareWhatsapp: 'Compartir por WhatsApp',
    shareX: 'Compartir en X (Twitter)',
    shareFacebook: 'Compartir en Facebook',
    shareNative: 'Compartir mediante otra aplicación',
    shareTextMsg:
      '🌊 Monitor Pacífico: Monitoreo meteorológico en tiempo real, viento, satélite GOES-19, webcams costeras y red de refugios:',

    // Auto Refresh Bar
    autoSyncTitle: 'Actualización continua de fuentes oficiales',
    nextSyncIn: 'Próxima sincronización en',
    refreshNow: 'Actualizar ahora',
    updatedAt: 'Última verificación:',
    emergencyCycle: 'Ciclo rápido de 2 min',

    // Landfall Alert Hero
    officialLiveAdvisory: 'AVISO OFICIAL EN VIVO • NOAA NHC & SMN CONAGUA',
    activeMonitoring: 'Monitoreo Activo',
    cycloneMajor: 'Huracán Mayor',
    cycloneCategory: 'Huracán',
    category2: 'Categoría 2 (Saffir-Simpson)',
    category3: 'Categoría 3 (Saffir-Simpson)',
    category4: 'Categoría 4 (Saffir-Simpson)',
    categoryWord: 'Categoría',
    hurricaneName: 'Huracán en Seguimiento',
    heroLocationSummary:
      'Ciclón tropical bajo seguimiento en aguas del Pacífico Mexicano, desplazándose mar adentro.',
    airportsClosedBadge: 'Aeropuertos Costeros: Operando / Precaución',
    portsClosedBadge: 'Puertos Marítimos: Precaución por Oleaje',
    maxWinds: 'Vientos Máximos',
    gusts: 'Rachas:',
    centralPressure: 'Presión Central',
    pressureExtreme: 'Presión mínima extrema',
    headingSpeed: 'Avance y Rumbo',
    cycloneCenter: 'Centro del Ciclón',
    pacificCoast: 'Pacífico Mexicano',
    yourLocation: 'Tu ubicación',
    fromEye: 'del centro del sistema.',
    viewNearbyShelters: 'Ver refugios cercanos',

    // Calm State (Alerta Verde)
    heroGreenBadge: 'ALERTA VERDE • PACÍFICO MEXICANO EN CALMA',
    heroGreenTitle: 'Monitor Pacífico — Vigilancia Costera y Marítima Continua',
    heroGreenSubtitle:
      'El Servicio Meteorológico Nacional (SMN) y el Centro Nacional de Huracanes (NOAA/NHC) no reportan ciclones tropicales activos ni perturbaciones con amenaza directa en el litoral del Pacífico Mexicano.',
    calmMetricCyclone: 'Estatus Ciclónico',
    calmMetricCycloneVal: 'Sin Ciclón Activo (Fase Verde)',
    calmMetricWind: 'Viento Costero Promedio',
    calmMetricWindVal: '15 – 30 km/h (Brisa normal)',
    calmMetricPorts: 'Puertos y Aeropuertos',
    calmMetricPortsVal: '100% Operativos',
    calmMetricRadar: 'Vigilancia Satelital',
    calmMetricRadarVal: 'GOES-19 Activo 24/7',
    simulationLive: 'En Vivo (Automático)',
    simulationCalm: 'Ver Estado Calma (Alerta Verde)',
    simulationActive: 'Ver Fenómeno Detectado',

    // Windy Section
    windyBadge: 'MAPA EN VIVO DE RÁFAGAS DE VIENTO • WINDY (MODELO ICON)',
    windyTitle: 'Visualizador de Viento y Ráfagas en Tiempo Real',
    windySubtitle:
      'Simulación meteorológica de ráfagas superficiales frente a las costas de Colima, Jalisco y Nayarit.',
    safeScrollLocked: 'Scroll Seguro (Bloqueado)',
    safeScrollInteracting: 'Interactuando (Toca para Bloquear)',
    reload: 'Recargar',
    openInWindy: 'Abrir en Windy',
    tapToInteractMap: 'Toca para interactuar con el mapa',
    lockScroll: 'Bloquear Scroll',
    windyCenterCoords: 'Centro: 20.278°N, 105.317°O (Costa Jalisco / Bahía de Banderas / Nayarit)',
    windyLayerInfo: 'Capa: Ráfagas (Gust) • Modelo: ICON',

    // Satellite Section
    satelliteBadge: 'FOTOS SATELITALES EN VIVO • NOAA STAR & NHC',
    satelliteTitle: 'Imágenes Satelitales y Cono de Trayectoria Oficial',
    satelliteSubtitle:
      'Imágenes del satélite meteorológico GOES-19 y cono de incertidumbre del Centro Nacional de Huracanes.',
    updatePhotos: 'Actualizar fotos',
    noaaPortal: 'Portal NOAA',
    clickToEnlarge: 'Haz clic para ampliar',
    download: 'Descargar',
    original: 'Original',

    // Webcams Section
    webcamsBadge: 'WEBCAMS EN VIVO',
    webcamsTitle: 'Transmisiones en Vivo',
    liveBadge: 'EN VIVO',
    onAirBadge: 'EN DIRECTO',
    camerasCount: 'Cámaras',
    reloadPlayer: 'Recargar',
    openYoutube: 'YouTube',
    fullscreen: 'Ampliar',
    minimize: 'Reducir',

    // Trajectory Map Section
    trajBadge: 'Cartografía Meteorológica en Vivo • Radar y Trayectoria',
    trajTitle: 'Trayectoria Oficial Pronosticada',
    updatedText: 'Actualizado',
    twoMinCycle: 'Ciclo de 2 min',
    scrollSafeLockedMap: 'Scroll Seguro: Activo (Mapa Fijo)',
    scrollNavigatingMap: 'Navegando Mapa (Toca para Bloquear)',
    sheltersVisibleBtn: 'Refugios: Visibles',
    sheltersHiddenBtn: 'Refugios: Ocultos (Activar)',
    centerSimonBtn: 'Centrar en Sistema',
    baseOSM: 'Mapa Base OSM',
    baseSatellite: 'Satélite Esri',

    // Historical Stats Section
    statsBadge: 'ESTADÍSTICAS HISTÓRICAS DE LA TEMPORADA • PACÍFICO NORORIENTAL 2026',
    statsTitle: 'Tendencia Histórica y Comportamiento Ciclónico',
    statsSubtitle:
      'Análisis comparativo de los sistemas tropicales registrados en la temporada: intensidad del viento sostenido y profundidad de presión atmosférica.',
    statsMetricWind: 'Vientos Máximos (km/h)',
    statsMetricPressure: 'Presión Atmosférica (hPa)',
    statsScopeSeason: 'Ciclones de la Temporada',
    statsScopeLifecycle: 'Evolución del Ciclón (Simón)',
    statsTotalNamed: 'Sistemas Nombrados',
    statsMajorHurricanes: 'Huracanes Mayores (Cat 3+)',
    statsPeakWind: 'Viento Pico Registrado',
    statsMinPressure: 'Presión Mínima Récord',
    statsChartWindLabel: 'Viento Máximo Sostenido (km/h)',
    statsChartPressureLabel: 'Presión Atmosférica Mínima (hPa)',
    statsCategoryThresholds: 'Umbrales de Categoría Saffir-Simpson',
    statsTableTitle: 'Registro Oficial de Sistemas Tropicales 2026',
    statsTableSystem: 'Sistema',
    statsTableCategory: 'Categoría Pico',
    statsTablePeakWind: 'Viento Máx.',
    statsTableMinPressure: 'Presión Mín.',
    statsTableDates: 'Período Activo',
    statsTableStatus: 'Estatus',

    // Shelters Section
    sheltersBadge: 'REFUGIOS Y ALBERGUES TEMPORALES',
    sheltersTitle: 'Red de Refugios Habilitados (14 albergues verificados)',
    sheltersDescHidden:
      'Ocultos por defecto para que la página cargue más rápido. Haz clic en el botón para consultarlos.',
    sheltersDescOpen:
      'Listado y buscador de refugios activo. Puedes buscar por municipio o filtrar por mascotas.',
    btnShowShelters: 'Ver Refugios Temporales ▼',
    btnHideShelters: 'Ocultar Refugios ▲',
    searchPlaceholder: 'Buscar refugio por nombre, colonia o dirección...',
    filterAllStates: 'Todos los Estados',
    filterAllMun: 'Todos los Municipios',
    filterPetsOnly: 'Solo con Mascotas',
    filterOpenOnly: 'Solo Abiertos',
    directionsBtn: 'Cómo llegar (Maps)',
    copyAddress: 'Copiar Dirección',
    copiedAddress: '¡Copiado!',
    phoneCall: 'Llamar',
    petFriendlyTag: 'Acepta Mascotas',
    statusActiveTag: 'Activo / Abierto',
    capacityTag: 'Capacidad',
    distanceFromYou: 'de ti',

    // Emergency Guide
    guideBadge: 'Protocolos de Protección Civil',
    guideTitle: 'Protocolo de Actuación por Fases',
    guideSubtitle:
      'Instrucciones oficiales para salvaguardar la vida y el patrimonio antes, durante y después del impacto ciclónico.',
    phaseBefore: '1. Antes del Impacto',
    phaseDuring: '2. Durante el Huracán',
    phaseAfter: '3. Después del Paso',

    // Official Sources
    sourcesBadge: 'Canales de Información Verificados',
    sourcesTitle: 'Directorio de Fuentes Oficiales',
    sourcesSubtitle:
      'Consulta exclusivamente información de organismos oficiales. Evita la propagación de rumores en redes sociales.',
    sourceNHC: 'National Hurricane Center (NOAA)',
    sourceNHCDesc: 'Avisos oficiales de pronóstico, trayectorias y modelos numéricos en tiempo real.',
    sourceSMN: 'Servicio Meteorológico Nacional (CONAGUA)',
    sourceSMNDesc: 'Organismo oficial meteorológico de México; boletines y alertas de impacto costero.',
    sourceCNPC: 'Coordinación Nacional de Protección Civil',
    sourceCNPCDesc: 'Alertas tempranas del Sistema SIAT-CT y activación de protocolos de auxilio.',
    sourceNOAA: 'NOAA STAR Satellite Applications',
    sourceNOAADesc: 'Imágenes infrarrojas, vapor de agua y espectro visible del satélite GOES-19.',
    visitPortal: 'Visitar Portal',

    // Contacts Modal
    contactsTitle: 'Directorio Telefónico de Auxilio Inmediato',
    contactsSubtitle:
      'Líneas de emergencia gratuitas disponibles las 24 horas ante alertas y fenómenos meteorológicos en el Pacífico.',
    callFree: 'Llamada Gratuita 24/7',

    // Footer
    footerCopyright: 'Monitor Pacífico • Vigilancia Meteorológica y Costera',
    footerSyncNotice:
      'Datos sincronizados con boletines del National Hurricane Center (NHC/NOAA) y SMN CONAGUA.',
    footerDisclaimer:
      'Este portal recopila información pública de fuentes oficiales. En caso de evacuación, atiende puntualmente las indicaciones de Protección Civil.',
    footerDevelopedBy: 'Desarrollada por',

    // Mobile Bottom Bar
    mobileBtnShelters: 'Ver Refugios',
    mobileBtn911: 'Auxilio 911',
  },
  en: {
    langName: 'English',
    emergency911: '911 Emergency',
    close: 'Close',
    cancel: 'Cancel',
    copied: 'Copied',

    // Alert Banner
    alertSituation: 'Weather Precaution Advisory',
    alertRed: 'Precaution Advisory • Tropical Cyclone Detected',
    alertBannerText:
      'Precautionary tracking active off the Mexican Pacific coastline. Check marine navigation bulletins and shelters.',
    alertGreenTitle: 'Green Alert • Pacific Calm',
    alertGreenBannerText:
      'No active tropical cyclones in the Mexican Pacific basin. 24/7 continuous meteorological, marine, and satellite surveillance.',

    // Navbar
    brandTitle: 'PACIFIC MONITOR',
    basin: 'Pacific',
    brandSubtitle: 'Tropical & Coastal Surveillance • Official Sources',
    navWind: 'Live Wind',
    navOutlook: '7-Day Outlook',
    navSatellite: 'Satellite Images',
    navWebcams: 'Live Webcams',
    navTrajectory: 'Trajectory',
    navStats: 'Statistics',
    navShelters: 'Shelters',
    navSources: 'Official Sources',
    directory911: '911 Directory',
    shareBtn: 'Share',

    // Share Modal
    shareTitle: 'Share Pacific Monitor',
    shareSubtitle: 'Broadcast real-time Pacific weather & coastal monitoring.',
    shareCopyUrl: 'Copy Link',
    shareCopiedSuccess: 'Link copied to clipboard!',
    shareWhatsapp: 'Share via WhatsApp',
    shareX: 'Share on X (Twitter)',
    shareFacebook: 'Share on Facebook',
    shareNative: 'Share with device apps',
    shareTextMsg:
      '🌊 Pacific Monitor: Real-time tropical weather tracking, wind gusts, GOES-19 satellite, coastal webcams, and shelters:',

    // Auto Refresh Bar
    autoSyncTitle: 'Continuous sync from official agencies',
    nextSyncIn: 'Next sync in',
    refreshNow: 'Refresh now',
    updatedAt: 'Last verification:',
    emergencyCycle: '2-min emergency cycle',

    // Landfall Alert Hero
    officialLiveAdvisory: 'OFFICIAL LIVE ADVISORY • NOAA NHC & SMN CONAGUA',
    activeMonitoring: 'Active Monitoring',
    cycloneMajor: 'Major Hurricane',
    cycloneCategory: 'Hurricane',
    category2: 'Category 2 (Saffir-Simpson)',
    category3: 'Category 3 (Saffir-Simpson)',
    category4: 'Category 4 (Saffir-Simpson)',
    categoryWord: 'Category',
    hurricaneName: 'Active Cyclone',
    heroLocationSummary:
      'Active tropical system monitored in Mexican Pacific waters, moving offshore.',
    airportsClosedBadge: 'Coastal Airports: Operational / Precaution',
    portsClosedBadge: 'Maritime Ports: Marine Surf Precaution',
    maxWinds: 'Max Sustained Winds',
    gusts: 'Gusts:',
    centralPressure: 'Central Pressure',
    pressureExtreme: 'Extreme low pressure',
    headingSpeed: 'Track & Forward Speed',
    cycloneCenter: 'Cyclone Center',
    pacificCoast: 'Mexican Pacific',
    yourLocation: 'Your location',
    fromEye: 'from system center.',
    viewNearbyShelters: 'View nearby shelters',

    // Calm State (Green Alert)
    heroGreenBadge: 'GREEN ALERT • MEXICAN PACIFIC CALM',
    heroGreenTitle: 'Pacific Monitor — Continuous Coastal & Marine Surveillance',
    heroGreenSubtitle:
      'The National Hurricane Center (NOAA/NHC) and SMN report no active tropical cyclones or disturbances posing a threat to Mexican Pacific coastlines.',
    calmMetricCyclone: 'Cyclone Status',
    calmMetricCycloneVal: 'No Active Cyclone (Green Phase)',
    calmMetricWind: 'Avg. Coastal Wind',
    calmMetricWindVal: '15 – 30 km/h (Normal breeze)',
    calmMetricPorts: 'Ports & Airports',
    calmMetricPortsVal: '100% Operational',
    calmMetricRadar: 'Satellite Surveillance',
    calmMetricRadarVal: 'GOES-19 Active 24/7',
    simulationLive: 'Live Mode (Auto)',
    simulationCalm: 'View Calm State (Green Alert)',
    simulationActive: 'View Detected Phenomenon',

    // Windy Section
    windyBadge: 'LIVE WIND GUSTS MAP • WINDY (ICON MODEL)',
    windyTitle: 'Real-Time Wind & Gusts Visualizer',
    windySubtitle:
      'Surface wind gusts weather simulation off the coast of Colima, Jalisco and Nayarit.',
    safeScrollLocked: 'Safe Scroll (Locked)',
    safeScrollInteracting: 'Interacting (Tap to Lock)',
    reload: 'Reload',
    openInWindy: 'Open in Windy',
    tapToInteractMap: 'Tap to interact with map',
    lockScroll: 'Lock Scroll',
    windyCenterCoords: 'Center: 20.278°N, 105.317°W (Jalisco Coast / Banderas Bay / Nayarit)',
    windyLayerInfo: 'Layer: Gusts • Model: ICON',

    // Satellite Section
    satelliteBadge: 'LIVE SATELLITE IMAGERY • NOAA STAR & NHC',
    satelliteTitle: 'Satellite Images & Official Track Cone',
    satelliteSubtitle:
      'GOES-19 weather satellite imagery and National Hurricane Center uncertainty track cone.',
    updatePhotos: 'Update images',
    noaaPortal: 'NOAA Portal',
    clickToEnlarge: 'Click to enlarge',
    download: 'Download',
    original: 'Original',

    // Webcams Section
    webcamsBadge: 'LIVE WEBCAMS',
    webcamsTitle: 'Live Video Streams',
    liveBadge: 'LIVE',
    onAirBadge: 'ON AIR',
    camerasCount: 'Cameras',
    reloadPlayer: 'Reload',
    openYoutube: 'YouTube',
    fullscreen: 'Enlarge',
    minimize: 'Minimize',

    // Trajectory Map Section
    trajBadge: 'Live Meteorological Map • Radar & Track',
    trajTitle: 'Official Forecast Track',
    updatedText: 'Updated',
    twoMinCycle: '2-min cycle',
    scrollSafeLockedMap: 'Safe Scroll: Active (Map Fixed)',
    scrollNavigatingMap: 'Navigating Map (Tap to Lock)',
    sheltersVisibleBtn: 'Shelters: Visible',
    sheltersHiddenBtn: 'Shelters: Hidden (Enable)',
    centerSimonBtn: 'Center on System',
    baseOSM: 'OSM Base Map',
    baseSatellite: 'Esri Satellite',

    // Historical Stats Section
    statsBadge: 'HISTORICAL SEASON STATISTICS • EAST PACIFIC 2026',
    statsTitle: 'Historical Trends & Cyclone Behavior',
    statsSubtitle:
      'Comparative analysis of tropical systems recorded this season: sustained wind intensity and atmospheric pressure depth.',
    statsMetricWind: 'Peak Winds (km/h)',
    statsMetricPressure: 'Atmospheric Pressure (hPa)',
    statsScopeSeason: 'Season Cyclones',
    statsScopeLifecycle: 'Cyclone Lifecycle (Simon)',
    statsTotalNamed: 'Named Systems',
    statsMajorHurricanes: 'Major Hurricanes (Cat 3+)',
    statsPeakWind: 'Peak Recorded Wind',
    statsMinPressure: 'Record Low Pressure',
    statsChartWindLabel: 'Peak Sustained Wind (km/h)',
    statsChartPressureLabel: 'Minimum Atmospheric Pressure (hPa)',
    statsCategoryThresholds: 'Saffir-Simpson Category Thresholds',
    statsTableTitle: 'Official 2026 Tropical Systems Record',
    statsTableSystem: 'System',
    statsTableCategory: 'Peak Category',
    statsTablePeakWind: 'Peak Wind',
    statsTableMinPressure: 'Min Pressure',
    statsTableDates: 'Active Dates',
    statsTableStatus: 'Current Status',

    // Shelters Section
    sheltersBadge: 'TEMPORARY SHELTERS & REFUGES',
    sheltersTitle: 'Designated Shelter Network (14 verified facilities)',
    sheltersDescHidden:
      'Hidden by default for faster loading. Click the button to inspect addresses and distances.',
    sheltersDescOpen:
      'Active shelter directory. Search by municipality or filter pet-friendly facilities.',
    btnShowShelters: 'View Temporary Shelters ▼',
    btnHideShelters: 'Hide Shelters ▲',
    searchPlaceholder: 'Search shelter by name, neighborhood, or address...',
    filterAllStates: 'All States',
    filterAllMun: 'All Municipalities',
    filterPetsOnly: 'Pets Allowed Only',
    filterOpenOnly: 'Open / Active Only',
    directionsBtn: 'Get Directions (Maps)',
    copyAddress: 'Copy Address',
    copiedAddress: 'Copied!',
    phoneCall: 'Call',
    petFriendlyTag: 'Pet Friendly',
    statusActiveTag: 'Active / Open',
    capacityTag: 'Capacity',
    distanceFromYou: 'away from you',

    // Emergency Guide
    guideBadge: 'Civil Protection Protocols',
    guideTitle: 'Action Protocol by Phase',
    guideSubtitle:
      'Official instructions to safeguard lives and property before, during, and after tropical cyclone impact.',
    phaseBefore: '1. Before Landfall',
    phaseDuring: '2. During the Storm',
    phaseAfter: '3. After the Storm',

    // Official Sources
    sourcesBadge: 'Verified Information Channels',
    sourcesTitle: 'Official Sources Directory',
    sourcesSubtitle:
      'Check official government agencies exclusively. Avoid spreading unverified rumors on social media.',
    sourceNHC: 'National Hurricane Center (NOAA)',
    sourceNHCDesc: 'Official forecast advisories, track cones, and real-time numerical models.',
    sourceSMN: 'National Meteorological Service (CONAGUA)',
    sourceSMNDesc: "Mexico's official meteorological agency; bulletins and coastal impact warnings.",
    sourceCNPC: 'National Civil Protection Coordination',
    sourceCNPCDesc: 'Early warning alerts under SIAT-CT and disaster response mobilization.',
    sourceNOAA: 'NOAA STAR Satellite Applications',
    sourceNOAADesc: 'Infrared, water vapor, and true-color feeds from GOES-19 satellite.',
    visitPortal: 'Visit Portal',

    // Contacts Modal
    contactsTitle: 'Immediate Emergency Phone Directory',
    contactsSubtitle:
      'Free toll-free emergency hotlines available 24/7 during severe Pacific weather events.',
    callFree: 'Free Call 24/7',

    // Footer
    footerCopyright: 'Pacific Monitor • Meteorological & Coastal Surveillance Platform',
    footerSyncNotice:
      'Data synchronized with National Hurricane Center (NHC/NOAA) and SMN CONAGUA bulletins.',
    footerDisclaimer:
      'This portal aggregates public information from official sources. Follow Civil Protection evacuation orders without delay.',
    footerDevelopedBy: 'Developed by',

    // Mobile Bottom Bar
    mobileBtnShelters: 'View Shelters',
    mobileBtn911: '911 Emergency',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'es') return saved;
    } catch {
      // ignore
    }
    return 'es'; // default to Spanish
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
