export type GpxPoint = { lat: number; lng: number; ele: number };

export type GpxResult = {
  coordinates: GpxPoint[];
  distance_km: number;
  elevation_gain_m: number;
  start_lat: number;
  start_lng: number;
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parseGpx(xmlString: string): GpxResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const trkpts = doc.querySelectorAll("trkpt");

  const coordinates: GpxPoint[] = [];
  trkpts.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lng = parseFloat(pt.getAttribute("lon") || "0");
    const eleEl = pt.querySelector("ele");
    const ele = eleEl ? parseFloat(eleEl.textContent || "0") : 0;
    coordinates.push({ lat, lng, ele });
  });

  let distance_km = 0;
  let elevation_gain_m = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    distance_km += haversine(prev.lat, prev.lng, curr.lat, curr.lng);
    const eleDiff = curr.ele - prev.ele;
    if (eleDiff > 0) elevation_gain_m += eleDiff;
  }

  return {
    coordinates,
    distance_km: Math.round(distance_km * 100) / 100,
    elevation_gain_m: Math.round(elevation_gain_m),
    start_lat: coordinates[0]?.lat || 0,
    start_lng: coordinates[0]?.lng || 0,
  };
}
