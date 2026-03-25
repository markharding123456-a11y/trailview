"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrails, type Trail } from "@/lib/supabase";
import { sampleTrails, difficultyColors, type SampleTrail } from "@/lib/sample-trails";

interface RegionData {
  name: string;
  trailCount: number;
  totalDistanceKm: number;
  activityTypes: string[];
  trails: SampleTrail[];
}

export default function RegionsPage() {
  const [regions, setRegions] = useState<Record<string, RegionData>>({});
  const [loading, setLoading] = useState(true);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrails() {
      setLoading(true);
      let trails: SampleTrail[] = [];

      // Try loading from Supabase first, fall back to sample trails
      try {
        const dbTrails = await getTrails();
        if (dbTrails.length > 0) {
          trails = dbTrails.map((t: Trail) => ({
            id: t.id,
            name: t.name,
            region: t.regions?.name || "Unknown",
            regionSlug: t.regions?.slug || "unknown",
            difficulty: t.difficulty,
            activityTypes: t.activity_types || [],
            distanceKm: t.distance_km || 0,
            elevationGainM: t.elevation_gain_m || 0,
            durationMin: t.duration_min || 0,
            description: t.description || "",
            highlights: t.highlights || [],
            season: t.season || "",
            coordinates: [],
          }));
        }
      } catch {
        // Supabase unavailable, fall through to sample data
      }

      if (trails.length === 0) {
        trails = sampleTrails;
      }

      // Group by region
      const grouped: Record<string, RegionData> = {};
      trails.forEach((trail) => {
        if (!grouped[trail.region]) {
          grouped[trail.region] = {
            name: trail.region,
            trailCount: 0,
            totalDistanceKm: 0,
            activityTypes: [],
            trails: [],
          };
        }
        const r = grouped[trail.region];
        r.trailCount++;
        r.totalDistanceKm += trail.distanceKm;
        r.trails.push(trail);
        trail.activityTypes.forEach((a) => {
          if (!r.activityTypes.includes(a)) r.activityTypes.push(a);
        });
      });

      setRegions(grouped);
      setLoading(false);
    }

    loadTrails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading regions...</p>
        </div>
      </div>
    );
  }

  const regionList = Object.values(regions).sort((a, b) => b.trailCount - a.trailCount);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse by Region</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explore trails across British Columbia's most iconic outdoor regions.
          </p>
          <div className="flex justify-center gap-6 mt-8 text-sm">
            <div className="bg-white/10 rounded-xl px-5 py-3">
              <div className="text-2xl font-bold text-green-400">{regionList.length}</div>
              <div className="text-white/60">Regions</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3">
              <div className="text-2xl font-bold text-green-400">
                {regionList.reduce((sum, r) => sum + r.trailCount, 0)}
              </div>
              <div className="text-white/60">Trails</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(regionList.reduce((sum, r) => sum + r.totalDistanceKm, 0))} km
              </div>
              <div className="text-white/60">Total Distance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionList.map((region) => (
            <div key={region.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover shadow-sm">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-brand-dark to-brand-mid p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">{region.name}</h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span>{region.trailCount} trail{region.trailCount !== 1 ? "s" : ""}</span>
                  <span>{Math.round(region.totalDistanceKm)} km total</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Activity types */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Activities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.activityTypes.map((a) => (
                      <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{a}</span>
                    ))}
                  </div>
                </div>

                {/* Trail list preview */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Trails</p>
                  <div className="space-y-1.5">
                    {region.trails.slice(0, expandedRegion === region.name ? undefined : 3).map((trail) => (
                      <div key={trail.id} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: difficultyColors[trail.difficulty] }} />
                        <span className="text-brand-dark truncate">{trail.name}</span>
                        <span className="text-gray-400 text-xs ml-auto flex-shrink-0">{trail.distanceKm} km</span>
                      </div>
                    ))}
                  </div>
                  {region.trails.length > 3 && (
                    <button
                      onClick={() => setExpandedRegion(expandedRegion === region.name ? null : region.name)}
                      className="text-xs text-green-500 hover:text-green-600 mt-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    >
                      {expandedRegion === region.name ? "Show less" : `+${region.trails.length - 3} more`}
                    </button>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/explore?region=${encodeURIComponent(region.name)}`}
                  className="block w-full text-center bg-green-500 hover:bg-green-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                >
                  Explore {region.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
