"use client";

import { useState } from "react";
import Link from "next/link";
import { sampleTrails, activityTypes, difficultyColors, difficultyLabels } from "@/lib/sample-trails";

const activityMeta: Record<string, { emoji: string; description: string }> = {
  "Mountain Biking": {
    emoji: "\u{1F6B5}",
    description: "Singletrack, flow trails, and bike park descents across BC's world-class mountain biking terrain.",
  },
  "Motorcycle": {
    emoji: "\u{1F3CD}\uFE0F",
    description: "Backcountry logging roads, technical singletrack, and adventure riding routes through remote BC wilderness.",
  },
  "ATV/UTV": {
    emoji: "\u{1F699}",
    description: "Off-road trails and forest service roads for side-by-sides and ATVs, from mellow cruises to rugged backcountry.",
  },
  "Skiing/Snowboarding": {
    emoji: "\u26F7\uFE0F",
    description: "Resort runs, backcountry lines, and alpine descents through BC's legendary snow.",
  },
  "Snowmobile": {
    emoji: "\u{1F3D4}\uFE0F",
    description: "Deep powder bowls, alpine meadows, and vast sled-accessible terrain in BC's interior mountains.",
  },
  "Hiking": {
    emoji: "\u{1F97E}",
    description: "Coastal rainforest trails, alpine scrambles, and multi-day backcountry routes across British Columbia.",
  },
  "Hunting": {
    emoji: "\u{1F3F9}",
    description: "Backcountry access routes into prime wildlife habitat, from elk meadows to remote watersheds.",
  },
  "Camping/Overlanding": {
    emoji: "\u26FA",
    description: "4x4 access roads and overlanding routes to remote campsites, lakes, and backcountry base camps.",
  },
  "Horseback Riding": {
    emoji: "\u{1F40E}",
    description: "Wide, well-maintained trails through rangelands, river corridors, and mountain valleys perfect for horses.",
  },
  "Fishing": {
    emoji: "\u{1F3A3}",
    description: "Trail and road access to BC's best rivers, lakes, and remote fishing holes for steelhead, salmon, and trout.",
  },
  "Cross-Country Skiing": {
    emoji: "\u{1F3BF}",
    description: "Groomed and backcountry Nordic ski trails through old-growth forest and alpine terrain.",
  },
  "Snowshoeing": {
    emoji: "\u{1F9CA}",
    description: "Winter trails through snowy forests and frozen alpine meadows, from gentle loops to peak summits.",
  },
  "Rock Climbing": {
    emoji: "\u{1F9D7}",
    description: "Approach trails and beta for BC's granite walls, sport crags, and multi-pitch trad routes.",
  },
};

export default function ActivitiesPage() {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Compute trail counts and trails per activity
  const activityData = activityTypes.map((activity) => {
    const trails = sampleTrails.filter((t) => t.activityTypes.includes(activity));
    const meta = activityMeta[activity] || { emoji: "\u{1F30D}", description: "Trails for this activity type." };
    return { activity, trails, ...meta };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse by Activity</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Find trails for your favourite outdoor activities, from mountain biking to rock climbing.
          </p>
          <div className="flex justify-center gap-6 mt-8 text-sm">
            <div className="bg-white/10 rounded-xl px-5 py-3">
              <div className="text-2xl font-bold text-green-400">{activityTypes.length}</div>
              <div className="text-white/60">Activities</div>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3">
              <div className="text-2xl font-bold text-green-400">{sampleTrails.length}</div>
              <div className="text-white/60">Trails</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activityData.map(({ activity, trails, emoji, description }) => (
            <div key={activity} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover shadow-sm">
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-dark">{activity}</h2>
                    <p className="text-xs text-gray-400">
                      {trails.length} trail{trails.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>

                {/* Trail previews */}
                {trails.length > 0 && (
                  <div className="mb-4">
                    <div className="space-y-1.5">
                      {trails.slice(0, expandedActivity === activity ? undefined : 3).map((trail) => (
                        <div key={trail.id} className="flex items-center gap-2 text-sm">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: difficultyColors[trail.difficulty] }}
                          />
                          <span className="text-brand-dark truncate">{trail.name}</span>
                          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                            {difficultyLabels[trail.difficulty]}
                          </span>
                        </div>
                      ))}
                    </div>
                    {trails.length > 3 && (
                      <button
                        onClick={() => setExpandedActivity(expandedActivity === activity ? null : activity)}
                        className="text-xs text-green-500 hover:text-green-600 mt-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                      >
                        {expandedActivity === activity ? "Show less" : `+${trails.length - 3} more`}
                      </button>
                    )}
                  </div>
                )}

                {/* Action */}
                <Link
                  href={`/explore?activity=${encodeURIComponent(activity)}`}
                  className="block w-full text-center bg-green-500 hover:bg-green-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                >
                  Explore {activity} Trails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
