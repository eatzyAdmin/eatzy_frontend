/**
 * Calculates the distance between two points in meters using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Gets the actual driving distance between two points using Mapbox Directions API
 * @returns distance in meters, or null if error
 */
export async function getRouteDistance(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  token: string
): Promise<number | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${token}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.routes && json.routes.length > 0) {
      return json.routes[0].distance; // distance is in meters
    }
    return null;
  } catch (error) {
    console.error("Mapbox route error:", error);
    return null;
  }
}
