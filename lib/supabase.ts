import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Note: placeholder values allow the app to build without env vars set.
// All Supabase calls will fail gracefully at runtime if not configured.
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Region = {
  id: string;
  name: string;
  slug: string;
  center_lat: number;
  center_lng: number;
};

export type Trail = {
  id: string;
  name: string;
  region_id: string;
  activity_types: string[];
  difficulty: "green" | "blue" | "black" | "expert";
  distance_km: number | null;
  elevation_gain_m: number | null;
  latitude: number | null;
  longitude: number | null;
  gpx_coordinates: Array<{ lat: number; lng: number; ele: number }> | null;
  video_status: "not_filmed" | "filmed" | "uploaded" | "processing" | "live";
  filmed_date: string | null;
  notes: string | null;
  description: string | null;
  highlights: string[];
  season: string | null;
  duration_min: number | null;
  video_url: string | null;
  gpx_url: string | null;
  thumbnail_url: string | null;
  contributor_id: string | null;
  contributor_name: string | null;
  created_at: string;
  updated_at: string;
  regions?: Region;
};

export type Submission = {
  id: string;
  trail_name: string;
  activity_types: string[];
  region: string;
  difficulty: "green" | "blue" | "black" | "expert";
  description: string | null;
  video_key: string | null;
  gpx_key: string | null;
  thumbnail_key: string | null;
  gpx_coordinates: Array<{ lat: number; lng: number; ele: number }> | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  latitude: number | null;
  longitude: number | null;
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string | null;
  reviewed_at: string | null;
  contributor_name: string | null;
  contributor_email: string | null;
  submitted_at: string;
};

// ── Trails ──

export async function getTrails(): Promise<Trail[]> {
  const { data, error } = await supabase
    .from("trails")
    .select("*, regions(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTrailById(id: string): Promise<Trail | null> {
  const { data, error } = await supabase
    .from("trails")
    .select("*, regions(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getLiveTrails(): Promise<Trail[]> {
  const { data, error } = await supabase
    .from("trails")
    .select("*, regions(*)")
    .eq("video_status", "live")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("name");
  if (error) throw error;
  return data || [];
}

export async function createTrail(trail: Partial<Trail>): Promise<Trail> {
  const { data, error } = await supabase
    .from("trails")
    .insert(trail)
    .select("*, regions(*)")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrail(id: string, trail: Partial<Trail>): Promise<Trail> {
  const { data, error } = await supabase
    .from("trails")
    .update({ ...trail, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, regions(*)")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrail(id: string): Promise<void> {
  const { error } = await supabase.from("trails").delete().eq("id", id);
  if (error) throw error;
}

// ── Submissions ──

export async function getSubmissions(status?: string): Promise<Submission[]> {
  let query = supabase
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (status) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

const VALID_DIFFICULTIES = ["green", "blue", "black", "expert"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createSubmission(submission: Partial<Submission>): Promise<Submission> {
  // Input validation
  if (
    typeof submission.trail_name !== "string" ||
    submission.trail_name.trim().length === 0
  ) {
    throw new Error("trail_name is required and must be a non-empty string");
  }
  if (submission.trail_name.length > 200) {
    throw new Error("trail_name must be under 200 characters");
  }

  if (!Array.isArray(submission.activity_types) || submission.activity_types.length === 0) {
    throw new Error("activity_types must be an array with at least one item");
  }

  if (
    submission.difficulty &&
    !VALID_DIFFICULTIES.includes(submission.difficulty)
  ) {
    throw new Error(
      `difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`
    );
  }

  if (
    submission.contributor_email != null &&
    submission.contributor_email !== "" &&
    !EMAIL_PATTERN.test(submission.contributor_email)
  ) {
    throw new Error("contributor_email must be a valid email address");
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert(submission)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubmission(id: string, update: Partial<Submission>): Promise<Submission> {
  const { data, error } = await supabase
    .from("submissions")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Approve a submission: creates a trail from it and marks it approved.
 */
export async function approveSubmission(
  submission: Submission,
  regionId: string
): Promise<Trail> {
  // Create the trail
  const trail = await createTrail({
    name: submission.trail_name,
    region_id: regionId,
    activity_types: submission.activity_types,
    difficulty: submission.difficulty,
    description: submission.description,
    distance_km: submission.distance_km,
    elevation_gain_m: submission.elevation_gain_m,
    latitude: submission.latitude,
    longitude: submission.longitude,
    gpx_coordinates: submission.gpx_coordinates,
    video_url: submission.video_key ? `/api/assets/${submission.video_key}` : null,
    gpx_url: submission.gpx_key ? `/api/assets/${submission.gpx_key}` : null,
    thumbnail_url: submission.thumbnail_key ? `/api/assets/${submission.thumbnail_key}` : null,
    video_status: "live",
    contributor_name: submission.contributor_name,
  });

  // Mark submission as approved
  await updateSubmission(submission.id, {
    status: "approved",
    reviewed_at: new Date().toISOString(),
  });

  return trail;
}

export async function rejectSubmission(id: string, notes?: string): Promise<void> {
  await updateSubmission(id, {
    status: "rejected",
    reviewer_notes: notes || null,
    reviewed_at: new Date().toISOString(),
  });
}
