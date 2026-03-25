"use client";

import { difficultyColors } from "@/lib/sample-trails";

interface ElevationChartProps {
  elevations: number[];
  currentIndex: number;
  minEle: number;
  maxEle: number;
  totalDistanceKm: number;
  difficulty: keyof typeof difficultyColors;
}

export default function ElevationChart({ elevations, currentIndex, minEle, maxEle, totalDistanceKm, difficulty }: ElevationChartProps) {
  const totalPoints = elevations.length;
  const eleRange = maxEle - minEle || 1;
  const color = difficultyColors[difficulty];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-4">
      <h3 className="font-semibold text-brand-dark text-sm mb-3">Elevation Profile</h3>
      <div className="relative h-24">
        <svg viewBox={`0 0 ${totalPoints} 100`} className="w-full h-full" preserveAspectRatio="none">
          <path d={`M0 100 ${elevations.map((e, i) => `L${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" ")} L${totalPoints - 1} 100 Z`} fill={color} fillOpacity="0.1" />
          <path d={`M${elevations.map((e, i) => `${i} ${100 - ((e - minEle) / eleRange) * 80}`).join(" L")}`} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1={currentIndex} y1="0" x2={currentIndex} y2="100" stroke="#22c55e" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 2" />
          <circle cx={currentIndex} cy={100 - ((elevations[currentIndex] - minEle) / eleRange) * 80} r="3" fill="#22c55e" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute left-0 top-0 text-[10px] text-gray-400">{maxEle}m</div>
        <div className="absolute left-0 bottom-0 text-[10px] text-gray-400">{minEle}m</div>
        <div className="absolute right-0 bottom-0 text-[10px] text-gray-400">{totalDistanceKm} km</div>
      </div>
    </div>
  );
}
