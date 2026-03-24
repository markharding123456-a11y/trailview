import type { Trail } from "./supabase";

export type ProjectionData = {
  trailCount: number;
  totalKm: number;
  regionsCovered: number;
  filmedCount: number;
  liveCount: number;
  estimatedViewersMonth: number;
  estimatedRevenueMonth: number;
  projections: Array<{
    month: number;
    trails: number;
    viewers: number;
    subscribers: number;
    revenue: number;
  }>;
  milestoneMessage: string;
};

export function calculateProjections(trails: Trail[]): ProjectionData {
  const trailCount = trails.length;
  const totalKm = trails.reduce((sum, t) => sum + (Number(t.distance_km) || 0), 0);
  const regionIds = new Set(trails.map((t) => t.region_id).filter(Boolean));
  const regionsCovered = regionIds.size;
  const filmedCount = trails.filter(
    (t) => t.video_status !== "not_filmed"
  ).length;
  const liveCount = trails.filter((t) => t.video_status === "live").length;

  // Conservative viewer projection:
  // Each trail averages 50 views/month at launch, growing as platform matures
  const viewsPerTrail = trailCount < 50 ? 30 : trailCount < 100 ? 50 : 100;
  const estimatedViewersMonth = filmedCount * viewsPerTrail;

  // Revenue projection:
  // 3% of viewers convert to Pro at $4.50/mo blended average
  const conversionRate = 0.03;
  const avgRevenuePerSub = 4.5;
  const subscribers = Math.round(estimatedViewersMonth * conversionRate);
  const estimatedRevenueMonth =
    Math.round(subscribers * avgRevenuePerSub * 0.7 * 100) / 100; // 0.7 = after 30% contributor pool

  // 12-month projections
  const projections = [];
  for (let m = 1; m <= 12; m++) {
    const projTrails = Math.min(trailCount + m * 15, 500); // ~15 new trails/month
    const projViewers = projTrails * (50 + m * 10); // views grow with content
    const projSubs = Math.round(projViewers * conversionRate);
    const projRevenue =
      Math.round(projSubs * avgRevenuePerSub * 0.7 * 100) / 100;
    projections.push({
      month: m,
      trails: projTrails,
      viewers: projViewers,
      subscribers: projSubs,
      revenue: projRevenue,
    });
  }

  // Milestone messages to motivate Jim
  let milestoneMessage = "";
  if (trailCount === 0) {
    milestoneMessage = "Log your first trail to start building TrailView!";
  } else if (trailCount < 10) {
    milestoneMessage = `${trailCount} trails logged. Get to 10 to cover your first region!`;
  } else if (trailCount < 25) {
    milestoneMessage = `${trailCount} trails! You already have more GPS-synced content than TrailPOV.`;
  } else if (trailCount < 50) {
    milestoneMessage = `${trailCount} trails. At 50, you have enough for a soft launch.`;
  } else if (trailCount < 100) {
    milestoneMessage = `${trailCount} trails! You're past soft launch territory. 100 trails = public launch.`;
  } else {
    milestoneMessage = `${trailCount} trails! This is a real platform. Time to open community uploads.`;
  }

  return {
    trailCount,
    totalKm: Math.round(totalKm * 10) / 10,
    regionsCovered,
    filmedCount,
    liveCount,
    estimatedViewersMonth,
    estimatedRevenueMonth,
    projections,
    milestoneMessage,
  };
}
