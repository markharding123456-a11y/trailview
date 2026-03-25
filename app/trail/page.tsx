"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTrailById, type Trail } from "@/lib/supabase";
import { sampleTrails, difficultyColors, difficultyLabels } from "@/lib/sample-trails";
import VideoPlayer from "@/app/components/video-player";
import TrailMap from "@/app/components/trail-map";
import ElevationChart from "@/app/components/elevation-chart";

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

  // Update speed when currentIndex changes
  useEffect(() => {
    setSpeed(getSpeed(currentIndex));
  }, [currentIndex, getSpeed]);

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
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              isDemo={isDemo}
              isPlaying={isPlaying}
              videoReady={videoReady}
              progress={progress}
              speed={speed}
              currentElevation={currentCoord ? currentCoord[2] : null}
              distanceCovered={distanceCovered}
              totalDistanceKm={trailDistanceKm}
              elapsedMin={elapsedMin}
              elapsedSecRem={elapsedSecRem}
              totalMin={totalMin}
              totalSecRem={totalSecRem}
              hasCoords={coords.length > 0}
              onPlayPause={togglePlay}
              onScrub={handleScrub}
            />

            {/* Elevation */}
            {coords.length > 2 && (
              <ElevationChart
                elevations={elevations}
                currentIndex={currentIndex}
                minEle={minEle}
                maxEle={maxEle}
                totalDistanceKm={trailDistanceKm}
                difficulty={trailDifficulty}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {coords.length > 0 && (
              <TrailMap
                coordinates={coords}
                currentIndex={currentIndex}
                isPlaying={isPlaying}
                difficulty={trailDifficulty}
                mapContainerRef={() => {}}
              />
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
              <Link href="/signup/contributor" className="block w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2">Become a Contributor</Link>
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
