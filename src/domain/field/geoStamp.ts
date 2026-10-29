/**
 * Coarse Geo-Stamping for Field Associates
 * Privacy-preserving location capture:
 * - Strictly rounded to 2 decimal places (~1.1 km precision)
 * - Single point capture only at activity save
 * - Zero continuous GPS tracking, zero path trails, zero map rendering
 */

export interface CoarseGeoStamp {
  latitude: number;
  longitude: number;
  areaLabel: string;
  isCoarse: true;
  accuracyMeters: number;
  capturedAt: string;
}

export function createCoarseGeoStamp(
  rawLat: number,
  rawLng: number,
  areaLabel: string
): CoarseGeoStamp {
  // Round to 2 decimal places (~1.1 km at the equator)
  const coarseLat = Math.round(rawLat * 100) / 100;
  const coarseLng = Math.round(rawLng * 100) / 100;

  return {
    latitude: coarseLat,
    longitude: coarseLng,
    areaLabel: areaLabel.trim(),
    isCoarse: true,
    accuracyMeters: 1000,
    capturedAt: new Date().toISOString(),
  };
}

export function formatCoarseCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lng).toFixed(2)}° ${lngDir} (±1 km)`;
}

/**
 * Chapter representative coordinates for coarse geo-stamping simulation
 */
export const CHAPTER_COARSE_POINTS: Record<string, { lat: number; lng: number; area: string }> = {
  'HUB-PUN': { lat: 18.52, lng: 73.85, area: 'Shivajinagar, Pune' },
  'HUB-NSK': { lat: 20.00, lng: 73.78, area: 'Gangapur, Nashik' },
  'HUB-NAG': { lat: 21.14, lng: 79.08, area: 'Dharampeth, Nagpur' },
  'HUB-IND': { lat: 22.71, lng: 75.85, area: 'Vijay Nagar, Indore' },
  'HUB-BLR': { lat: 12.97, lng: 77.59, area: 'Malleshwaram, Bengaluru' },
  'HUB-MYS': { lat: 12.30, lng: 76.65, area: 'Kuvempunagar, Mysuru' },
  'HUB-CHE': { lat: 13.08, lng: 80.27, area: 'Mylapore, Chennai' },
  'HUB-JAI': { lat: 26.91, lng: 75.78, area: 'C-Scheme, Jaipur' },
  'HUB-LUK': { lat: 26.84, lng: 80.94, area: 'Gomti Nagar, Lucknow' },
};
