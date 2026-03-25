"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTrailById, type Trail } from "@/lib/supabase";
import { sampleTrails, difficultyColors, difficultyLabels } from "@/lib/sample-trails";

// Demo trail fallback when no ID is provided
const demoTrail = sampleTrails[0];

export default function TrailDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading trail...</p>
        </div>
      </div>
    }>
      <TrailContent />
    </Suspense>
  );
}

function TrailContent() {
  const searchParams = useSearchParams();
  const trailId = searchParams.get("id");

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const pulseRef = useRef<any>(null);
  const progressLineRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [dbTrail, setDbTrail] = useState<Trail | null>(null);
  const [loadingTrail, setLoadingTrail] = useState(!!trailId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load trail from Supabase if ID provided
  useEffect(() => {
    if (!trailId) return;
    async function load() {
      try {
        const t = await getTrailById(trailId!);
        setDbTrail(t);
      } catch {
        console.error("Failed to load trail");
      } finally {
        setLoadingTrail(false);
      }
    }
    load();
  }, [trailId]);

  // Use DB trail if available, otherwise demo
  const isDemo = !trailId || !dbTrail;
  const coords: [number, number, number][] = isDemo
    ? demoTrail.coordinates
    : (dbTrail?.gpx_coordinates || []).map((p) => [p.lat, p.lng, p.ele]);
  const totalPoints = coords.length;
  const currentCoord = coords[currentIndex];
  const progress = totalPoints > 1 ? currentIndex / (totalPoints - 1) : 0;

  const trailName = isDemo ? demoTrail.name : dbTrail!.name;
  const trailRegion = isDemo ? demoTrail.region : dbTrail!.regions?.name || "";
  const trailDifficulty = (isDemo ? demoTrail.difficulty : dbTrail!.difficulty) as keyof typeof difficultyColors;
  const trailDistanceKm = isDemo ? demoTrail.distanceKm : Number(dbTrail!.distance_km) || 0;
  const trailElevationGainM = isDemo ? demoTrail.elevationGainM : dbTrail!.elevation_gain_m || 0;
  const trailDurationMin = isDemo ? demoTrail.durationMin : dbTrail!.duration_min || 10;
  const trailDescription = isDemo ? demoTrail.description : dbTrail!.description || "";
  const trailHighlights = isDemo ? demoTrail.highlights : dbTrail!.highlights || [];
  const trailActivityTypes = isDemo ? demoTrail.activityTypes : dbTrail!.activity_types;
  const trailSeason = isDemo ? demoTrail.season : dbTrail!.season || "";
  const videoUrl = isDemo ? null : dbTrail!.video_url;
  const contributorName = isDemo ? null : dbTrail!.contributor_name;

  const totalSec = videoDuration || trailDurationMin * 60;
  const elapsedSec = Math.round(progress * totalSec);
  const elapsedMin = Math.floor(elapsedSec / 60);
  const elapsedSecRem = elapsedSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const totalSecRem = Math.round(totalSec % 60);
  const distanceCovered = (progress * trailDistanceKm).toFixed(1);

  const getSpeed = useCallback((idx: number) => {
    if (idx <= 0 || idx >= totalPoints || totalPoints < 2) return 0;
    const [lat1, lng1] = coords[idx - 1];
    const [lat2, lng2] = coords[idx];
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const timePerStep = (videoDuration || trailDurationMin * 60) / totalPoints;
    return timePerStep > 0 ? Math.min((dist / timePerStep) * 3600, 80) : 0;
  }, [videoDuration, totalPoints, coords, trailDurationMin]);

  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => { setVideoDuration(video.duration); setVideoReady(true); };
    const onTime = () => {
      if (video.duration > 0 && totalPoints > 0) {
        setCurrentIndex(Math.min(Math.round((video.currentTime / video.duration) * (totalPoints - 1)), totalPoints - 1));
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => { setIsPlaying(false); setCurrentIndex(Math.max(0, totalPoints - 1)); };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnd);
    if (video.readyState >= 1) onMeta();
    return () => { video.removeEventListener("loadedmetadata", onMeta); video.removeEventListener("timeupdate", onTime); video.removeEventListener("play", onPlay); video.removeEventListener("pause", onPause); video.removeEventListener("ended", onEnd); };
  }, [totalPoints]);

  // Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || coords.length < 2) return;
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      const bounds: [[number, number], [number, number]] = coords.reduce<[[number, number], [number, number]]>(
        (b, [lat, lng]) => [[Math.min(b[0][0], lat), Math.min(b[0][1], lng)], [Math.max(b[1][0], lat), Math.max(b[1][1], lng)]],
        [[90, 180], [-90, -180]]
      );
      const map = L.map(mapRef.current!, { center: [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2], zoom: 13, zoomControl: false });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OSM", maxZoom: 18 }).addTo(map);
      map.fitBounds(bounds as any, { padding: [30, 30] });
      const color = difficultyColors[trailDifficulty];
      L.polyline(coords.map(([lat, lng]) => [lat, lng] as [number, number]), { color, weight: 4, opacity: 0.3, dashArray: "8 4" }).addTo(map);
      progressLineRef.current = L.polyline([], { color, weight: 4, opacity: 0.9 }).addTo(map);
      L.circleMarker([coords[0][0], coords[0][1]], { radius: 6, fillColor: "#22c55e", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map).bindTooltip("Start", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-green-500 !text-white !border-green-500 !rounded-lg !px-2" });
      L.circleMarker([coords[totalPoints - 1][0], coords[totalPoints - 1][1]], { radius: 6, fillColor: "#ef4444", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map).bindTooltip("End", { permanent: true, direction: "top", offset: [0, -8], className: "!text-xs !font-bold !bg-red-500 !text-white !border-red-500 !rounded-lg !px-2" });
      pulseRef.current = L.circleMarker([coords[0][0], coords[0][1]], { radius: 16, fillColor: color, color, weight: 2, fillOpacity: 0.15, opacity: 0.3 }).addTo(map);
      markerRef.current = L.circleMarker([coords[0][0], coords[0][1]], { radius: 8, fillColor: "#fff", color, weight: 3, fillOpacity: 1 }).addTo(map);
      mapInstanceRef.current = map;
    };
    initMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [coords.length, trailDifficulty]);

  // Sync marker
  useEffect(() => {
    if (!markerRef.current || !currentCoord) return;
    const [lat, lng] = currentCoord;
    markerRef.current.setLatLng([lat, lng]);
    if (pulseRef.current) pulseRef.current.setLatLng([lat, lng]);
    if (progressLineRef.current) progressLineRef.current.setLatLngs(coords.slice(0, currentIndex + 1).map(([lat, lng]) => [lat, lng]));
    if (mapInstanceRef.current && isPlaying) mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.3 });
    setSpeed(getSpeed(currentIndex));
  }, [currentIndex, currentCoord, isPlaying, getSpeed]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select from a temporary input
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) { video.pause(); } else {
      if (currentIndex >= totalPoints - 1) { video.currentTime = 0; setCurrentIndex(0); }
      video.play();
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentIndex(Math.round(pct * (totalPoints - 1)));
    if (video.duration > 0) video.currentTime = pct * video.duration;
  };

  if (loadingTrail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading trail...</p>
        </div>
      </div>
    );
  }

  if (trailId && !dbTrail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Trail Not Found</h2>
          <p className="text-gray-500 mb-4">This trail doesn&apos;t exist or was removed.</p>
          <Link href="/explore" className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2">Explore Trails</Link>
        </div>
      </div>
    );
  }

  const elevations = coords.map(([, , e]) => e);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleRange = maxEle - minEle || 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href="/explore" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 mb-2 focus-visible:text-white focus-visible:outline-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Explore
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: difficultyColors[trailDifficulty] }}>
                  {difficultyLabels[trailDifficulty]}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold">{trailName}</h1>
              </div>
              <p className="text-white/60">{trailRegion}</p>
              {contributorName && <p className="text-white/40 text-sm mt-1">Filmed by {contributorName}</p>}
              {isDemo && <span className="inline-block mt-2 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded font-semibold">DEMO TRAIL</span>}
            </div>
            <div className="flex flex-col items-end gap-3">
              {/* Share button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  aria-label="Share trail"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 w-56">
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    >
                      {copied ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-sm font-medium text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Copy link</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-6 text-center">
              <div><div className="text-2xl font-bold text-green-400">{trailDistanceKm}</div><div className="text-xs text-white/40">km</div></div>
              <div><div className="text-2xl font-bold text-blue-400">{trailElevationGainM}</div><div className="text-xs text-white/40">m elev</div></div>
              <div><div className="text-2xl font-bold text-amber-400">{trailDurationMin}</div><div className="text-xs text-white/40">min</div></div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Video */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video relative bg-black">
                {videoUrl ? (
                  <video ref={videoRef} aria-label="Trail video player" className="absolute inset-0 w-full h-full object-contain" preload="metadata" playsInline>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="mx-auto mb-3 opacity-20"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      <p className="text-white/30 text-sm">{isDemo ? "Demo — upload a real trail to see video" : "Video coming soon"}</p>
                    </div>
                  </div>
                )}

                {/* HUD overlays */}
                {coords.length > 0 && (
                  <>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Speed</div>
                      <div className="text-green-400 font-bold text-2xl">{isPlaying ? speed.toFixed(1) : "0.0"}<span className="text-sm text-white/30 ml-1">km/h</span></div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Elevation</div>
                      <div className="text-blue-400 font-bold text-2xl">{currentCoord ? currentCoord[2].toLocaleString() : "0"}<span className="text-sm text-white/30 ml-1">m</span></div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Distance</div>
                      <div className="text-amber-400 font-bold text-xl">{distanceCovered}<span className="text-sm text-white/30"> / {trailDistanceKm} km</span></div>
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30 flex items-center gap-2 pointer-events-none z-10">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-green-300 text-xs font-semibold">GPS SYNCED</span>
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              {videoUrl && (
                <div className="bg-black px-4 py-3 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} disabled={!videoReady} aria-label={isPlaying ? "Pause" : "Play"} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 flex-shrink-0">
                      {isPlaying ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>}
                    </button>
                    <div className="flex-1 h-8 flex items-center cursor-pointer group" onClick={handleScrub}>
                      <div className="w-full h-1.5 bg-white/10 group-hover:h-3 transition-all rounded-full">
                        <div className="h-full bg-green-500 rounded-full relative" style={{ width: `${progress * 100}%` }}>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40 font-mono flex-shrink-0 tabular-nums">{elapsedMin}:{elapsedSecRem.toString().padStart(2, "0")}<span className="text-white/20"> / {totalMin}:{totalSecRem.toString().padStart(2, "0")}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Elevation */}
            {coords.length > 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-4">
                <h3 className="font-semibold text-brand-dark text-sm mb-3">Elevation Profile</h3>
                <div className="relative h-24">
                  <svg viewBox={`0 0 ${totalPoints} 100`} className="w-full h-full" preserveAspectRatio="none">
                    <path d={`M0 100 ${elevations.map((e, i) => `L${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" ")} L${totalPoints - 1} 100 Z`} fill={difficultyColors[trailDifficulty]} fillOpacity="0.1" />
                    <path d={`M${elevations.map((e, i) => `${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" L")}`} fill="none" stroke={difficultyColors[trailDifficulty]} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <line x1={currentIndex} y1="0" x2={currentIndex} y2="100" stroke="#22c55e" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 2" />
                    <circle cx={currentIndex} cy={100 - ((elevations[currentIndex] - minEle) / eleRange) * 80} r="3" fill="#22c55e" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="absolute left-0 top-0 text-[10px] text-gray-400">{maxEle}m</div>
                  <div className="absolute left-0 bottom-0 text-[10px] text-gray-400">{minEle}m</div>
                  <div className="absolute right-0 bottom-0 text-[10px] text-gray-400">{trailDistanceKm} km</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {coords.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-xs font-semibold text-brand-dark">Live GPS Tracking</span></div>
                  <span className="text-[10px] text-gray-400">{currentCoord ? `${currentCoord[0].toFixed(4)}, ${currentCoord[1].toFixed(4)}` : ""}</span>
                </div>
                <div ref={mapRef} role="img" aria-label="Trail route map" style={{ height: 350 }} />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-brand-dark mb-3">About This Trail</h3>
              {trailDescription && <p className="text-sm text-gray-500 leading-relaxed mb-4">{trailDescription}</p>}
              {trailHighlights.length > 0 && (
                <><h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Highlights</h4><div className="flex flex-wrap gap-2 mb-4">{trailHighlights.map((h) => <span key={h} className="bg-gray-50 text-gray-600 text-xs px-3 py-1.5 rounded-lg border border-gray-100">{h}</span>)}</div></>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400">Activity</div><div className="font-semibold text-sm text-brand-dark">{trailActivityTypes.join(", ")}</div></div>
                {trailSeason && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400">Season</div><div className="font-semibold text-sm text-brand-dark">{trailSeason}</div></div>}
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400">Difficulty</div><div className="font-semibold text-sm" style={{ color: difficultyColors[trailDifficulty] }}>{difficultyLabels[trailDifficulty]}</div></div>
                <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400">Region</div><div className="font-semibold text-sm text-brand-dark">{trailRegion}</div></div>
              </div>
            </div>

            <div className="bg-brand-dark rounded-xl p-5 text-white text-center">
              <h3 className="font-bold mb-2">Want to film this trail?</h3>
              <p className="text-sm text-white/60 mb-4">Contributors earn up to $0.008 per view</p>
              <Link href="/signup/contributor" className="block w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-semibold transition-all">Become a Contributor</Link>
            </div>
          </div>
        </div>

        {/* More trails */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-brand-dark mb-6">More Trails to Explore</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {sampleTrails.slice(1, 5).map((t) => (
              <Link href="/trail" key={t.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
                <div className="aspect-[16/10] bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light relative flex items-end p-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="relative z-10">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: difficultyColors[t.difficulty] }}>{t.difficulty.toUpperCase()}</span>
                    <h4 className="text-white font-bold text-sm mt-1">{t.name}</h4>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500">{t.region}</div>
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
