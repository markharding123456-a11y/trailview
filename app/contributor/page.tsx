"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTrails, type Trail } from "@/lib/supabase";
import { difficultyColors, difficultyLabels } from "@/lib/sample-trails";

export default function ContributorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading contributor...</p>
        </div>
      </div>
    }>
      <ContributorContent />
    </Suspense>
  );
}

function ContributorContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await getTrails();
        const filtered = name
          ? all.filter((t) => t.contributor_name === name)
          : all.filter((t) => t.contributor_name);
        setTrails(filtered);
      } catch {
        console.error("Failed to load trails");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [name]);

  const contributorTrails = trails.filter((t) => t.video_status === "live");
  const totalDistance = contributorTrails.reduce((sum, t) => sum + (Number(t.distance_km) || 0), 0);
  const totalElevation = contributorTrails.reduce((sum, t) => sum + (t.elevation_gain_m || 0), 0);
  const regions = [...new Set(contributorTrails.map((t) => t.regions?.name).filter(Boolean))];
  const activities = [...new Set(contributorTrails.flatMap((t) => t.activity_types))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading contributor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {(name || "C")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{name || "All Contributors"}</h1>
              <p className="text-white/60 mt-1">TrailView Contributor</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{contributorTrails.length}</div>
              <div className="text-xs text-white/40 mt-1">Trails Published</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{totalDistance.toFixed(1)}</div>
              <div className="text-xs text-white/40 mt-1">Total km</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{totalElevation.toLocaleString()}</div>
              <div className="text-xs text-white/40 mt-1">Total Elevation (m)</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{regions.length}</div>
              <div className="text-xs text-white/40 mt-1">Regions Covered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Activities & Regions tags */}
        {(activities.length > 0 || regions.length > 0) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {activities.map((a) => (
              <span key={a} className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium border border-green-100">{a}</span>
            ))}
            {regions.map((r) => (
              <span key={r} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-100">{r}</span>
            ))}
          </div>
        )}

        {/* Trail grid */}
        <h2 className="text-xl font-bold text-brand-dark mb-4">Published Trails</h2>
        {contributorTrails.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No published trails yet</p>
            <Link href="/upload" className="text-green-500 font-semibold hover:text-green-400">Upload your first trail</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributorTrails.map((trail) => {
              const diff = trail.difficulty as keyof typeof difficultyColors;
              return (
                <Link
                  key={trail.id}
                  href={`/trail?id=${trail.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  {/* Thumbnail / gradient placeholder */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light relative flex items-end p-3">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {trail.video_url && (
                      <div className="absolute top-3 right-3 bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-semibold">
                        HAS VIDEO
                      </div>
                    )}
                    <div className="relative z-10">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: difficultyColors[diff] }}>
                        {difficultyLabels[diff]}
                      </span>
                      <h3 className="text-white font-bold text-sm mt-1">{trail.name}</h3>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-500">{trail.regions?.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {trail.distance_km && <span>{trail.distance_km} km</span>}
                      {trail.elevation_gain_m && <span>{trail.elevation_gain_m}m elev</span>}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {trail.activity_types.slice(0, 3).map((a) => (
                        <span key={a} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-brand-dark rounded-xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
          <p className="text-white/60 mb-6">Film trails, share them with the community, and earn per view.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup/contributor" className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-xl font-semibold transition-colors">
              Sign Up as Contributor
            </Link>
            <Link href="/contribute" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-colors border border-white/20">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
