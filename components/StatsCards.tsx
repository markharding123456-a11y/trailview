"use client";

import type { ProjectionData } from "@/lib/projections";

const cards = [
  { key: "trailCount", label: "Trails Logged", fmt: (v: number) => v.toString(), color: "bg-brand-dark" },
  { key: "filmedCount", label: "Filmed", fmt: (v: number) => v.toString(), color: "bg-brand-mid" },
  { key: "totalKm", label: "Total KM", fmt: (v: number) => `${v} km`, color: "bg-brand-light" },
  { key: "regionsCovered", label: "Regions", fmt: (v: number) => `${v} / 7`, color: "bg-emerald-600" },
  { key: "estimatedViewersMonth", label: "Est. Monthly Viewers", fmt: (v: number) => v.toLocaleString(), color: "bg-amber-600" },
  { key: "estimatedRevenueMonth", label: "Est. Monthly Revenue", fmt: (v: number) => `$${v.toLocaleString()}`, color: "bg-green-600" },
] as const;

export default function StatsCards({ data }: { data: ProjectionData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div key={card.key} className={`${card.color} rounded-xl p-4 text-white shadow-lg`}>
          <div className="text-2xl font-bold">
            {card.fmt(data[card.key as keyof ProjectionData] as number)}
          </div>
          <div className="text-sm opacity-80 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
