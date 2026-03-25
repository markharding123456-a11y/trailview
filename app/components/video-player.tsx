"use client";

import { forwardRef } from "react";

interface VideoPlayerProps {
  videoUrl: string | null;
  isDemo: boolean;
  isPlaying: boolean;
  videoReady: boolean;
  progress: number;
  speed: number;
  currentElevation: number | null;
  distanceCovered: string;
  totalDistanceKm: number;
  elapsedMin: number;
  elapsedSecRem: number;
  totalMin: number;
  totalSecRem: number;
  hasCoords: boolean;
  onPlayPause: () => void;
  onScrub: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer(
  {
    videoUrl,
    isDemo,
    isPlaying,
    videoReady,
    progress,
    speed,
    currentElevation,
    distanceCovered,
    totalDistanceKm,
    elapsedMin,
    elapsedSecRem,
    totalMin,
    totalSecRem,
    hasCoords,
    onPlayPause,
    onScrub,
  },
  ref
) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
      <div className="aspect-video relative bg-black">
        {videoUrl ? (
          <video ref={ref} aria-label="Trail video player" className="absolute inset-0 w-full h-full object-contain" preload="metadata" playsInline>
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
        {hasCoords && (
          <>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Speed</div>
              <div className="text-green-400 font-bold text-2xl">{isPlaying ? speed.toFixed(1) : "0.0"}<span className="text-sm text-white/30 ml-1">km/h</span></div>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Elevation</div>
              <div className="text-blue-400 font-bold text-2xl">{currentElevation != null ? currentElevation.toLocaleString() : "0"}<span className="text-sm text-white/30 ml-1">m</span></div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-none z-10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Distance</div>
              <div className="text-amber-400 font-bold text-xl">{distanceCovered}<span className="text-sm text-white/30"> / {totalDistanceKm} km</span></div>
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
            <button onClick={onPlayPause} disabled={!videoReady} aria-label={isPlaying ? "Pause" : "Play"} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
              {isPlaying ? <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>}
            </button>
            <div className="flex-1 h-8 flex items-center cursor-pointer group" onClick={onScrub}>
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
  );
});

export default VideoPlayer;
