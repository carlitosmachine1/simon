import { COASTAL_LOCATIONS, PredefinedLocation } from '../data/hurricaneData';

/**
 * Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function estimateTravelTime(km: number): { walking: string; driving: string } {
  // Average speeds: walking 4.5 km/h, driving 35 km/h in urban/rain conditions
  const walkMinutes = Math.round((km / 4.5) * 60);
  const driveMinutes = Math.max(3, Math.round((km / 35) * 60));

  const formatMins = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs} h ${rem} min` : `${hrs} h`;
  };

  return {
    walking: formatMins(walkMinutes),
    driving: formatMins(driveMinutes),
  };
}

export function getGoogleMapsDirectionsUrl(lat: number, lng: number, placeName?: string): string {
  if (placeName) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeName + ', ' + lat + ',' + lng)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Fast local geocoding helper (zero API keys required, works 100% offline)
 */
export function searchLocalLocations(query: string): PredefinedLocation[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  return COASTAL_LOCATIONS.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.municipality.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q)
    );
  });
}

/**
 * Free geocoding using OpenStreetMap Nominatim with local dictionary fallback
 */
export async function geocodeUserLocation(
  query: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // 1. Try local dictionary first (instant & reliable)
  const localMatches = searchLocalLocations(trimmed);
  if (localMatches.length > 0) {
    const best = localMatches[0];
    return {
      lat: best.lat,
      lng: best.lng,
      displayName: `${best.name}, ${best.municipality}, ${best.state}`,
    };
  }

  // 2. Query OpenStreetMap Nominatim for Mexican addresses (no API key required)
  try {
    const encoded = encodeURIComponent(`${trimmed}, Mexico`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=mx&limit=1&q=${encoded}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HuracanSimonInfoPortal/1.0',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name.split(',').slice(0, 3).join(','),
        };
      }
    }
  } catch (err) {
    console.warn('Nominatim geocode failed or offline, returning fallback', err);
  }

  return null;
}
