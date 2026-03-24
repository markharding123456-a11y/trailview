"use client";

import { useState } from "react";
import { deleteTrail, type Trail } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  not_filmed: { label: "Planned", color: "bg-gray-200 text-gray-600" },
  filmed: { label: "Filmed", color: "bg-yellow-100 text-yellow-800" },
  uploaded: { label: "Uploaded", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800" },
  live: { label: "Live", color: "bg-green-100 text-green-800" },
};

const DIFF_BADGES: Record<string, { color: string }> = {
  green: { color: "bg-trail-green text-white" },
  blue: { color: "bg-trail-blue text-white" },
  black: { color: "bg-trail-black text-white" },
  expert: { color: "bg-trail-red text-white" },
};

export default function TrailList({ trails }: { trails: Trail[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState({ region: "", status: "", activity: "" });
  const [sortBy, setSortBy] = useState<"name" | "date" | "distance">("date");

  const filtered = trails.filter((t) => {
    if (filter.region && t.region_id !== filter.region) return false;
    if (filter.status && t.video_status !== filter.status) return false;
    if (filter.activity && !t.activity_types.includes(filter.activity)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "distance") return (Number(b.distance_km) || 0) - (Number(a.distance_km) || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTrail(id);
      router.refresh();
    } catch (err) {
      alert("Failed to delete trail.");
      console.error(err);
    }
  };

  const regions = [...new Set(trails.map((t) => t.regions?.name).filter(Boolean))];
  const activities = [...new Set(trails.flatMap((t) => t.activity_types))];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filter.region}
          onChange={(e) => setFilter((f) => ({ ...f, region: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Regions</option>
          {trails.map((t) => t.regions).filter((r, i, a) => r && a.findIndex((x) => x?.id === r.id) === i).map((r) => (
            <option key={r!.id} value={r!.id}>{r!.name}</option>
          ))}
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_BADGES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filter.activity}
          onChange={(e) => setFilter((f) => ({ ...f, activity: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Activities</option>
          {activities.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="date">Sort: Newest</option>
          <option value="name">Sort: Name</option>
          <option value="distance">Sort: Longest</option>
        </select>
        <span className="px-3 py-2 text-sm text-gray-500">
          {sorted.length} trail{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Trail Cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No trails yet</p>
          <p className="text-sm">Log your first trail to see it here</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((trail) => {
            const status = STATUS_BADGES[trail.video_status] || STATUS_BADGES.not_filmed;
            const diff = DIFF_BADGES[trail.difficulty] || DIFF_BADGES.blue;
            return (
              <div key={trail.id} className="bg-white rounded-xl p-4 shadow border border-gray-100 flex items-center gap-4">
                {/* Difficulty badge */}
                <div className={`${diff.color} w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0`}>
                  {trail.difficulty === "expert" ? "EX" : trail.difficulty[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-brand-dark truncate">{trail.name}</div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                    {trail.regions?.name && <span>{trail.regions.name}</span>}
                    {trail.distance_km && <span>{trail.distance_km} km</span>}
                    {trail.elevation_gain_m && <span>{trail.elevation_gain_m}m</span>}
                    {trail.activity_types.map((a) => (
                      <span key={a} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{a}</span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <span className={`${status.color} px-3 py-1 rounded-full text-xs font-semibold shrink-0`}>
                  {status.label}
                </span>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(trail.id, trail.name)}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0 text-lg"
                  title="Delete trail"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
