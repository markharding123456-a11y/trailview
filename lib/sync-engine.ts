/**
 * TrailView GPS-Video Sync Engine
 *
 * Takes a parsed GPX track (with timestamps) and a video duration,
 * produces a sync manifest: one {t, lat, lng, ele, spd} per second of video.
 */

export type SyncPoint = {
  t: number;    // second of video
  lat: number;
  lng: number;
  ele: number;  // meters
  spd: number;  // km/h
};

export type TimestampedPoint = {
  lat: number;
  lng: number;
  ele: number;
  time: number; // ms since epoch
};

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Parse GPX XML string into timestamped points.
 * Works both in browser (DOMParser) and can be adapted for Node.
 */
export function parseGpxWithTimestamps(xml: string): TimestampedPoint[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const trkpts = doc.querySelectorAll("trkpt");
  const points: TimestampedPoint[] = [];

  trkpts.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lng = parseFloat(pt.getAttribute("lon") || "0");
    const eleEl = pt.querySelector("ele");
    const timeEl = pt.querySelector("time");
    const ele = eleEl ? parseFloat(eleEl.textContent || "0") : 0;
    const time = timeEl ? new Date(timeEl.textContent || "").getTime() : 0;
    if (lat && lng) points.push({ lat, lng, ele, time });
  });

  return points;
}

/**
 * Core sync engine: generates a manifest mapping each second of video
 * to a GPS position along the trail.
 *
 * @param points - GPX trackpoints with timestamps
 * @param videoDurationSec - video length in seconds
 * @param offsetSec - manual offset adjustment (positive = GPS is ahead of video)
 * @returns Array of SyncPoints, one per second of video
 */
export function generateSyncManifest(
  points: TimestampedPoint[],
  videoDurationSec: number,
  offsetSec: number = 0
): SyncPoint[] {
  if (points.length < 2) return [];

  const hasTimestamps = points[0].time > 0 && points[points.length - 1].time > 0;

  // If GPX has timestamps, use time-based interpolation
  // If no timestamps, distribute points evenly across video duration
  const gpxStartMs = hasTimestamps ? points[0].time : 0;
  const gpxEndMs = hasTimestamps ? points[points.length - 1].time : videoDurationSec * 1000;
  const gpxDurationMs = gpxEndMs - gpxStartMs;

  const manifest: SyncPoint[] = [];

  for (let t = 0; t <= videoDurationSec; t++) {
    // Map video second to position in GPX track
    const videoFraction = t / videoDurationSec;
    let targetMs: number;

    if (hasTimestamps) {
      targetMs = gpxStartMs + videoFraction * gpxDurationMs + offsetSec * 1000;
    } else {
      targetMs = videoFraction * gpxDurationMs;
    }

    // Find the two bracketing GPX points
    let idx = 0;
    if (hasTimestamps) {
      for (let i = 0; i < points.length - 1; i++) {
        if (points[i + 1].time >= targetMs) { idx = i; break; }
        idx = i;
      }
    } else {
      // Evenly spaced: map fraction directly to point index
      const exactIdx = videoFraction * (points.length - 1);
      idx = Math.min(Math.floor(exactIdx), points.length - 2);
    }

    const p1 = points[idx];
    const p2 = points[Math.min(idx + 1, points.length - 1)];

    // Interpolation fraction between p1 and p2
    let frac: number;
    if (hasTimestamps) {
      const segDuration = p2.time - p1.time;
      frac = segDuration > 0 ? Math.max(0, Math.min(1, (targetMs - p1.time) / segDuration)) : 0;
    } else {
      const exactIdx = videoFraction * (points.length - 1);
      frac = exactIdx - idx;
    }

    const lat = lerp(p1.lat, p2.lat, frac);
    const lng = lerp(p1.lng, p2.lng, frac);
    const ele = lerp(p1.ele, p2.ele, frac);

    // Speed: distance from previous point / 1 second, converted to km/h
    let spd = 0;
    if (t > 0 && manifest.length > 0) {
      const prev = manifest[manifest.length - 1];
      const distKm = haversineKm(prev.lat, prev.lng, lat, lng);
      spd = Math.round(distKm * 3600 * 10) / 10; // km/h with 1 decimal
    }

    manifest.push({
      t,
      lat: Math.round(lat * 1000000) / 1000000,
      lng: Math.round(lng * 1000000) / 1000000,
      ele: Math.round(ele * 10) / 10,
      spd,
    });
  }

  return manifest;
}

/**
 * Quick helper: parse GPX XML and generate manifest in one step.
 */
export function gpxToManifest(gpxXml: string, videoDurationSec: number, offsetSec = 0): SyncPoint[] {
  const points = parseGpxWithTimestamps(gpxXml);
  return generateSyncManifest(points, videoDurationSec, offsetSec);
}
