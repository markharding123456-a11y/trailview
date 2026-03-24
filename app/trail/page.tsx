"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { sampleTrails, difficultyColors, difficultyLabels } from "@/lib/sample-trails";

// Use "Top of the World" as the demo trail
const trail = sampleTrails[0];
const coords = trail.coordinates;
const totalPoints = coords.length;

export default function TrailDetailPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const pulseRef = useRef<any>(null);
  const progressLineRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentCoord = coords[currentIndex];
  const progress = currentIndex / (totalPoints - 1);
  const elapsedSec = Math.round(progress * trail.durationMin * 60);
  const elapsedMin = Math.floor(elapsedSec / 60);
  const elapsedSecRem = elapsedSec % 60;
  const distanceCovered = (progress * trail.distanceKm).toFixed(1);

  // Calculate speed from coordinate deltas
  const getSpeed = useCallback((idx: number) => {
    if (idx <= 0 || idx >= totalPoints) return 0;
    const [lat1, lng1] = coords[idx - 1];
    const [lat2, lng2] = coords[idx];
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const timePerStep = (trail.durationMin * 60) / totalPoints;
    const speedKmh = (dist / timePerStep) * 3600;
    return Math.min(speedKmh, 65) + Math.random() * 3;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const bounds: [[number, number], [number, number]] = coords.reduce<[[number, number], [number, number]]>(
        (b, [lat, lng]) => [
          [Math.min(b[0][0], lat), Math.min(b[0][1], lng)],
          [Math.max(b[1][0], lat), Math.max(b[1][1], lng)],
        ],
        [[90, 180], [-90, -180]]
      );

      const map = L.map(mapRef.current!, {
        center: [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OSM',
        maxZoom: 18,
      }).addTo(map);

      map.fitBounds(bounds as any, { padding: [30, 30] });

      // Draw full trail line
      const latlngs: [number, number][] = coords.map(([lat, lng]): [number, number] => [lat, lng]);
      L.polyline(latlngs, {
        color: difficultyColors[trail.difficulty],
        weight: 4,
        opacity: 0.3,
        dashArray: "8 4",
      }).addTo(map);

      // Progress line (solid, follows playback)
      progressLineRef.current = L.polyline([], {
        color: difficultyColors[trail.difficulty],
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      // Start marker
      L.circleMarker([coords[0][0], coords[0][1]], {
        radius: 6,
        fillColor: "#22c55e",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map).bindTooltip("Start", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-green-500 !text-white !border-green-500 !rounded-lg !px-2" });

      // End marker
      L.circleMarker([coords[totalPoints - 1][0], coords[totalPoints - 1][1]], {
        radius: 6,
        fillColor: "#ef4444",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map).bindTooltip("End", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-red-500 !text-white !border-red-500 !rounded-lg !px-2" });

      // Pulse ring
      pulseRef.current = L.circleMarker([coords[0][0], coords[0][1]], {
        radius: 16,
        fillColor: difficultyColors[trail.difficulty],
        color: difficultyColors[trail.difficulty],
        weight: 2,
        fillOpacity: 0.15,
        opacity: 0.3,
      }).addTo(map);

      // Current position marker
      markerRef.current = L.circleMarker([coords[0][0], coords[0][1]], {
        radius: 8,
        fillColor: "#fff",
        color: difficultyColors[trail.difficulty],
        weight: 3,
        fillOpacity: 1,
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

  // Update marker position
  useEffect(() => {
    if (!markerRef.current || !currentCoord) return;
    const [lat, lng] = currentCoord;
    markerRef.current.setLatLng([lat, lng]);
    if (pulseRef.current) pulseRef.current.setLatLng([lat, lng]);

    // Update progress line
    if (progressLineRef.current) {
      const progressCoords = coords.slice(0, currentIndex + 1).map(([lat, lng]) => [lat, lng]);
      progressLineRef.current.setLatLngs(progressCoords);
    }

    // Pan map to follow marker
    if (mapInstanceRef.current && isPlaying) {
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.3 });
    }

    setSpeed(getSpeed(currentIndex));
  }, [currentIndex, currentCoord, isPlaying, getSpeed]);

  // Play/pause
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= totalPoints - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (currentIndex >= totalPoints - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Elevation profile data
  const elevations = coords.map(([, , e]) => e);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleRange = maxEle - minEle || 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Trail Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/explore" className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back to Explore
                </Link>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: difficultyColors[trail.difficulty] }}>
                  {difficultyLabels[trail.difficulty]}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">{trail.name}</h1>
              </div>
              <p className="text-white/50">{trail.region}</p>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{trail.distanceKm}</div>
                <div className="text-xs text-white/40">km</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{trail.elevationGainM}</div>
                <div className="text-xs text-white/40">m elev</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{trail.durationMin}</div>
                <div className="text-xs text-white/40">min</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Video Player Simulation */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video relative bg-gradient-to-br from-gray-900 via-[#0d1f12] to-gray-900">
                {/* Simulated trail view background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 50% 80%, rgba(34,197,94,0.08) 0%, transparent 50%),
                    linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)
                  `
                }} />

                {/* Animated terrain lines when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-green-500/30"
                        style={{
                          left: `${10 + i * 12}%`,
                          top: 0,
                          bottom: 0,
                          width: '1px',
                          animation: `scanline ${1.5 + i * 0.2}s linear infinite`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Speed</div>
                  <div className="text-green-400 font-bold text-2xl hud-value">
                    {isPlaying ? speed.toFixed(1) : "0.0"}
                    <span className="text-sm text-white/30 ml-1">km/h</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Elevation</div>
                  <div className="text-blue-400 font-bold text-2xl hud-value">
                    {currentCoord ? currentCoord[2].toLocaleString() : "0"}
                    <span className="text-sm text-white/30 ml-1">m</span>
                  </div>
                </div>

                <div className="absolute bottom-16 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Distance</div>
                  <div className="text-amber-400 font-bold text-xl hud-value">
                    {distanceCovered}
                    <span className="text-sm text-white/30">/ {trail.distanceKm} km</span>
                  </div>
                </div>

                <div className="absolute bottom-16 right-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Time</div>
                  <div className="text-white font-bold text-xl hud-value">
                    {elapsedMin}:{elapsedSecRem.toString().padStart(2, "0")}
                    <span className="text-sm text-white/30">/ {trail.durationMin}:00</span>
                  </div>
                </div>

                {/* GPS sync badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 text-xs font-semibold">GPS SYNCED</span>
                </div>

                {/* Play/Pause button */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className={`w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all group-hover:bg-white/20 group-hover:scale-110 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                    {isPlaying ? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>
                    )}
                  </div>
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0">
                  {/* Clickable scrubber */}
                  <div
                    className="h-8 flex items-end cursor-pointer group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      setCurrentIndex(Math.round(pct * (totalPoints - 1)));
                    }}
                  >
                    <div className="w-full h-1.5 bg-white/10 group-hover:h-3 transition-all">
                      <div
                        className="h-full bg-green-500 transition-all relative"
                        style={{ width: `${progress * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevation Profile */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-4">
              <h3 className="font-semibold text-brand-dark text-sm mb-3">Elevation Profile</h3>
              <div className="relative h-24">
                <svg viewBox={`0 0 ${totalPoints} 100`} className="w-full h-full" preserveAspectRatio="none">
                  {/* Filled area */}
                  <path
                    d={`M0 100 ${elevations.map((e, i) => `L${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" ")} L${totalPoints - 1} 100 Z`}
                    fill={difficultyColors[trail.difficulty]}
                    fillOpacity="0.1"
                  />
                  {/* Line */}
                  <path
                    d={`M${elevations.map((e, i) => `${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" L")}`}
                    fill="none"
                    stroke={difficultyColors[trail.difficulty]}
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Current position indicator */}
                  <line
                    x1={currentIndex}
                    y1="0"
                    x2={currentIndex}
                    y2="100"
                    stroke="#22c55e"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="3 2"
                  />
                  <circle
                    cx={currentIndex}
                    cy={100 - ((elevations[currentIndex] - minEle) / eleRange) * 80}
                    r="3"
                    fill="#22c55e"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* Labels */}
                <div className="absolute left-0 top-0 text-[10px] text-gray-400">{maxEle}m</div>
                <div className="absolute left-0 bottom-0 text-[10px] text-gray-400">{minEle}m</div>
                <div className="absolute right-0 bottom-0 text-[10px] text-gray-400">{trail.distanceKm} km</div>
              </div>
            </div>
          </div>

          {/* Map + Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-brand-dark">Live GPS Tracking</span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {currentCoord ? `${currentCoord[0].toFixed(4)}, ${currentCoord[1].toFixed(4)}` : ""}
                </span>
              </div>
              <div ref={mapRef} style={{ height: 350 }} />
            </div>

            {/* Trail Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-brand-dark mb-3">About This Trail</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{trail.description}</p>

              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {trail.highlights.map((h) => (
                  <span key={h} className="bg-gray-50 text-gray-600 text-xs px-3 py-1.5 rounded-lg border border-gray-100">{h}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Activity</div>
                  <div className="font-semibold text-sm text-brand-dark">{trail.activityTypes.join(", ")}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Season</div>
                  <div className="font-semibold text-sm text-brand-dark">{trail.season}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Difficulty</div>
                  <div className="font-semibold text-sm" style={{ color: difficultyColors[trail.difficulty] }}>
                    {difficultyLabels[trail.difficulty]}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Region</div>
                  <div className="font-semibold text-sm text-brand-dark">{trail.region}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-brand-dark rounded-2xl p-5 text-white text-center">
              <h3 className="font-bold mb-2">Want to film this trail?</h3>
              <p className="text-sm text-white/50 mb-4">Contributors earn up to $0.008 per view</p>
              <Link href="/#contributors" className="block w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-semibold transition-all">
                Become a Contributor
              </Link>
            </div>
          </div>
        </div>

        {/* More Trails */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-brand-dark mb-6">More Trails to Explore</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {sampleTrails.slice(1, 5).map((t) => (
              <Link href="/trail" key={t.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
                <div className="aspect-[16/10] bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light relative flex items-end p-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="relative z-10">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: difficultyColors[t.difficulty] }}>
                      {t.difficulty.toUpperCase()}
                    </span>
                    <h4 className="text-white font-bold text-sm mt-1">{t.name}</h4>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-400">{t.region}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.distanceKm} km &middot; {t.elevationGainM}m elev</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
