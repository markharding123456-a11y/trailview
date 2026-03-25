"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrails, type Trail } from "@/lib/supabase";

type ContributorStats = {
  name: string;
  trailCount: number;
  totalKm: number;
  regions: string[];
};

export default function LeaderboardPage() {
  const [contributors, setContributors] = useState<ContributorStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await getTrails();
        const liveTrails = all.filter(
          (t) => t.video_status === "live" && t.contributor_name
        );

        // Group by contributor_name
        const grouped = new Map<string, Trail[]>();
        for (const trail of liveTrails) {
          const name = trail.contributor_name!;
          if (!grouped.has(name)) grouped.set(name, []);
          grouped.get(name)!.push(trail);
        }

        // Build stats
        const stats: ContributorStats[] = [];
        for (const [name, trails] of grouped) {
          const totalKm = trails.reduce(
            (sum, t) => sum + (Number(t.distance_km) || 0),
            0
          );
          const regions = [
            ...new Set(
              trails.map((t) => t.regions?.name).filter(Boolean) as string[]
            ),
          ];
          stats.push({ name, trailCount: trails.length, totalKm, regions });
        }

        // Sort by trail count descending, then totalKm descending
        stats.sort(
          (a, b) => b.trailCount - a.trailCount || b.totalKm - a.totalKm
        );

        setContributors(stats);
      } catch {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const medalColors: Record<number, { bg: string; text: string; border: string }> = {
    0: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    1: { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" },
    2: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  };

  const medalEmoji: Record<number, string> = {
    0: "\u{1F947}",
    1: "\u{1F948}",
    2: "\u{1F949}",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            TrailView Leaderboard
          </h1>
          <p className="text-white/50 text-lg">Top Contributors</p>
          <p className="text-white/30 text-sm mt-2">
            Ranked by number of live trails published
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {contributors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No contributors yet</p>
            <Link
              href="/signup/contributor"
              className="text-green-500 font-semibold hover:text-green-400"
            >
              Be the first contributor
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {contributors.map((c, idx) => {
              const isMedal = idx < 3;
              const colors = medalColors[idx];

              return (
                <Link
                  key={c.name}
                  href={`/contributor?name=${encodeURIComponent(c.name)}`}
                  className={`block rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-md ${
                    isMedal && colors
                      ? `${colors.bg} ${colors.border}`
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {isMedal ? (
                        <span className="text-2xl">{medalEmoji[idx]}</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-300">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                        isMedal && colors
                          ? `${colors.text} bg-white border-2 ${colors.border}`
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {c.name[0].toUpperCase()}
                    </div>

                    {/* Name & regions */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-bold text-lg truncate ${
                          isMedal && colors ? colors.text : "text-brand-dark"
                        }`}
                      >
                        {c.name}
                      </div>
                      {c.regions.length > 0 && (
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {c.regions.join(", ")}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-500">
                          {c.trailCount}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Trails
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-500">
                          {c.totalKm.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                          km
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-500">
                          {c.regions.length}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Regions
                        </div>
                      </div>
                    </div>

                    {/* Mobile stats */}
                    <div className="flex sm:hidden items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">
                          {c.trailCount}
                        </div>
                        <div className="text-[9px] text-gray-400">trails</div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-300 flex-shrink-0"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-brand-dark rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Join the Leaderboard</h3>
          <p className="text-white/50 mb-6">
            Film trails, share them with the community, and climb the ranks.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/signup/contributor"
              className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Become a Contributor
            </Link>
            <Link
              href="/explore"
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-colors border border-white/20"
            >
              Explore Trails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
