import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

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
  created_at: string;
  updated_at: string;
  regions?: Region;
};

export async function getTrails(): Promise<Trail[]> {
  const { data, error } = await supabase
    .from("trails")
    .select("*, regions(*)")
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
