"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sampleTrails, activityTypes, difficultyColors, difficultyLabels, type SampleTrail } from "@/lib/sample-trails";

export default function ExplorePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const linesRef = useRef<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<SampleTrail | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const filteredTrails = sampleTrails.filter((t) => {
    if (selectedActivity && !t.activityTypes.includes(selectedActivity)) return false;
    if (selectedDifficulty && t.difficulty !== selectedDifficulty) return false;
    return true;
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      leafletRef.current = L;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [49.8, -121.5],
        zoom: 7,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || !leafletRef.current) return;

    const L = leafletRef.current;
    const map = mapInstanceRef.current;

    // Clear old markers and lines
    markersRef.current.forEach((m) => map.removeLayer(m));
    linesRef.current.forEach((l) => map.removeLayer(l));
    markersRef.current = [];
    linesRef.current = [];

    filteredTrails.forEach((trail) => {
      const color = difficultyColors[trail.difficulty];

      // Draw trail line
      if (trail.coordinates.length > 1) {
        const latlngs = trail.coordinates.map(([lat, lng]) => [lat, lng]);
        const line = L.polyline(latlngs, {
          color,
          weight: 3,
          opacity: 0.7,
        }).addTo(map);
        linesRef.current.push(line);
      }

      // Add start marker
      const startCoord = trail.coordinates[0];
      const marker = L.circleMarker([startCoord[0], startCoord[1]], {
        radius: 8,
        fillColor: color,
        color: "#fff",
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.on("click", () => setSelectedTrail(trail));

      // Tooltip
      marker.bindTooltip(
        `<strong>${trail.name}</strong><br/>${trail.distanceKm} km &middot; ${difficultyLabels[trail.difficulty]}`,
        { direction: "top", offset: [0, -10] }
      );

      markersRef.current.push(marker);
    });
  }, [filteredTrails, mapReady]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <div className="w-full lg:w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <h1 className="text-xl font-bold text-brand-dark">Explore Trails</h1>
          <p className="text-sm text-gray-400">{filteredTrails.length} trails across British Columbia</p>

          {/* Activity filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedActivity(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedActivity ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              All Activities
            </button>
            {activityTypes.map((a) => (
              <button
                key={a}
                onClick={() => setSelectedActivity(selectedActivity === a ? null : a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedActivity === a ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2">
            {(["green", "blue", "black", "expert"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedDifficulty === d ? "ring-2 ring-offset-1 ring-brand-dark" : ""
                }`}
                style={{ backgroundColor: difficultyColors[d] + "20", color: difficultyColors[d] }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: difficultyColors[d] }} />
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Trail list */}
        <div className="flex-1 overflow-y-auto">
          {filteredTrails.map((trail) => (
            <button
              key={trail.id}
              onClick={() => {
                setSelectedTrail(trail);
                if (mapInstanceRef.current) {
                  const start = trail.coordinates[0];
                  mapInstanceRef.current.flyTo([start[0], start[1]], 13, { duration: 1.5 });
                }
              }}
              className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                selectedTrail?.id === trail.id ? "bg-blue-50 border-l-4 border-l-brand-light" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: difficultyColors[trail.difficulty] }}
                >
                  {trail.difficulty === "expert" ? "EX" : trail.difficulty[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-dark text-sm truncate">{trail.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{trail.region}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
                      {trail.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                      {trail.elevationGainM}m
                    </span>
                    <span>{trail.durationMin} min</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {trail.activityTypes.map((a) => (
                      <span key={a} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" style={{ minHeight: 400 }} />

        {/* Selected trail overlay */}
        {selectedTrail && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1000]">
            <div className="relative">
              {/* Trail preview banner */}
              <div className="h-32 bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light relative flex items-end p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedTrail(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: difficultyColors[selectedTrail.difficulty] }}>
                      {difficultyLabels[selectedTrail.difficulty]}
                    </span>
                    {selectedTrail.activityTypes.map(a => (
                      <span key={a} className="text-xs text-white/80 bg-white/15 px-2 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                  <h3 className="text-white font-bold text-xl">{selectedTrail.name}</h3>
                </div>
              </div>
              {/* Trail details */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">{selectedTrail.description}</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400">Distance</div>
                    <div className="font-bold text-brand-dark text-sm">{selectedTrail.distanceKm} km</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400">Elevation</div>
                    <div className="font-bold text-brand-dark text-sm">{selectedTrail.elevationGainM}m</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="font-bold text-brand-dark text-sm">{selectedTrail.durationMin}m</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400">Season</div>
                    <div className="font-bold text-brand-dark text-sm text-[11px]">{selectedTrail.season}</div>
                  </div>
                </div>
                <Link
                  href={`/trail?id=${selectedTrail.id}`}
                  className="block w-full bg-green-500 hover:bg-green-400 text-white text-center py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>
                    Watch Trail Video
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
