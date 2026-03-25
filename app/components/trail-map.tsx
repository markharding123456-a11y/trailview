"use client";

import { useEffect, useRef } from "react";
import { difficultyColors } from "@/lib/sample-trails";

interface TrailMapProps {
  coordinates: [number, number, number][];
  currentIndex: number;
  isPlaying: boolean;
  difficulty: keyof typeof difficultyColors;
  mapContainerRef: (el: HTMLDivElement | null) => void;
}

export default function TrailMap({ coordinates, currentIndex, isPlaying, difficulty, mapContainerRef }: TrailMapProps) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const pulseRef = useRef<any>(null);
  const progressLineRef = useRef<any>(null);

  const totalPoints = coordinates.length;
  const currentCoord = coordinates[currentIndex];

  // Initialize map
  useEffect(() => {
    if (!mapElRef.current || mapInstanceRef.current || coordinates.length < 2) return;
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      const bounds: [[number, number], [number, number]] = coordinates.reduce<[[number, number], [number, number]]>(
        (b, [lat, lng]) => [[Math.min(b[0][0], lat), Math.min(b[0][1], lng)], [Math.max(b[1][0], lat), Math.max(b[1][1], lng)]],
        [[90, 180], [-90, -180]]
      );
      const map = L.map(mapElRef.current!, { center: [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2], zoom: 13, zoomControl: false });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OSM", maxZoom: 18 }).addTo(map);
      map.fitBounds(bounds as any, { padding: [30, 30] });
      const color = difficultyColors[difficulty];
      L.polyline(coordinates.map(([lat, lng]) => [lat, lng] as [number, number]), { color, weight: 4, opacity: 0.3, dashArray: "8 4" }).addTo(map);
      progressLineRef.current = L.polyline([], { color, weight: 4, opacity: 0.9 }).addTo(map);
      L.circleMarker([coordinates[0][0], coordinates[0][1]], { radius: 6, fillColor: "#22c55e", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map).bindTooltip("Start", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-green-500 !text-white !border-green-500 !rounded-lg !px-2" });
      L.circleMarker([coordinates[totalPoints - 1][0], coordinates[totalPoints - 1][1]], { radius: 6, fillColor: "#ef4444", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map).bindTooltip("End", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-red-500 !text-white !border-red-500 !rounded-lg !px-2" });
      pulseRef.current = L.circleMarker([coordinates[0][0], coordinates[0][1]], { radius: 16, fillColor: color, color, weight: 2, fillOpacity: 0.15, opacity: 0.3 }).addTo(map);
      markerRef.current = L.circleMarker([coordinates[0][0], coordinates[0][1]], { radius: 8, fillColor: "#fff", color, weight: 3, fillOpacity: 1 }).addTo(map);
      mapInstanceRef.current = map;
    };
    initMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [coordinates.length, difficulty]);

  // Sync marker position
  useEffect(() => {
    if (!markerRef.current || !currentCoord) return;
    const [lat, lng] = currentCoord;
    markerRef.current.setLatLng([lat, lng]);
    if (pulseRef.current) pulseRef.current.setLatLng([lat, lng]);
    if (progressLineRef.current) progressLineRef.current.setLatLngs(coordinates.slice(0, currentIndex + 1).map(([lat, lng]) => [lat, lng]));
    if (mapInstanceRef.current && isPlaying) mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.3 });
  }, [currentIndex, currentCoord, isPlaying, coordinates]);

  // Ref callback to set both internal ref and parent callback
  const setRef = (el: HTMLDivElement | null) => {
    mapElRef.current = el;
    mapContainerRef(el);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-xs font-semibold text-brand-dark">Live GPS Tracking</span></div>
        <span className="text-[10px] text-gray-400">{currentCoord ? `${currentCoord[0].toFixed(4)}, ${currentCoord[1].toFixed(4)}` : ""}</span>
      </div>
      <div ref={setRef} role="img" aria-label="Trail route map" style={{ height: 350 }} />
    </div>
  );
}
