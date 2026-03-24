"use client";

import { useState, useEffect, useCallback } from "react";
import { createTrail, getRegions, type Region, type Trail } from "@/lib/supabase";
import { parseGpx, type GpxResult } from "@/lib/gpx";
import { useRouter } from "next/navigation";

const ACTIVITIES = ["MTB", "Moto", "ATV/UTV", "Ski", "Snowmobile", "Hiking"];
const DIFFICULTIES = [
  { value: "green", label: "Green (Easy)", color: "bg-trail-green" },
  { value: "blue", label: "Blue (Intermediate)", color: "bg-trail-blue" },
  { value: "black", label: "Black (Advanced)", color: "bg-trail-black" },
  { value: "expert", label: "Expert Only", color: "bg-trail-red" },
];
const STATUSES = [
  { value: "not_filmed", label: "Not Filmed Yet" },
  { value: "filmed", label: "Filmed - Not Uploaded" },
  { value: "uploaded", label: "Uploaded" },
  { value: "processing", label: "Processing" },
  { value: "live", label: "Live" },
];

export default function TrailForm() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [saving, setSaving] = useState(false);
  const [gpxResult, setGpxResult] = useState<GpxResult | null>(null);
  const [form, setForm] = useState({
    name: "",
    region_id: "",
    activity_types: [] as string[],
    difficulty: "blue",
    distance_km: "",
    elevation_gain_m: "",
    latitude: "",
    longitude: "",
    video_status: "filmed",
    filmed_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    getRegions().then(setRegions).catch(console.error);
  }, []);

  const toggleActivity = (act: string) => {
    setForm((f) => ({
      ...f,
      activity_types: f.activity_types.includes(act)
        ? f.activity_types.filter((a) => a !== act)
        : [...f.activity_types, act],
    }));
  };

  const handleGpxUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const xml = ev.target?.result as string;
      try {
        const result = parseGpx(xml);
        setGpxResult(result);
        setForm((f) => ({
          ...f,
          distance_km: String(result.distance_km),
          elevation_gain_m: String(result.elevation_gain_m),
          latitude: String(result.start_lat),
          longitude: String(result.start_lng),
        }));
      } catch (err) {
        alert("Could not parse GPX file. Make sure it's a valid .gpx file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.region_id || form.activity_types.length === 0) {
      alert("Please fill in trail name, region, and at least one activity type.");
      return;
    }
    setSaving(true);
    try {
      await createTrail({
        name: form.name,
        region_id: form.region_id,
        activity_types: form.activity_types,
        difficulty: form.difficulty as Trail["difficulty"],
        distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
        elevation_gain_m: form.elevation_gain_m ? parseInt(form.elevation_gain_m) : null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        gpx_coordinates: gpxResult?.coordinates || null,
        video_status: form.video_status as Trail["video_status"],
        filmed_date: form.filmed_date || null,
        notes: form.notes || null,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      alert("Failed to save trail. Check your Supabase connection.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Trail Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Trail Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g., Top of the World"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid focus:border-brand-mid text-lg"
          required
        />
      </div>

      {/* Region */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Region *</label>
        <select
          value={form.region_id}
          onChange={(e) => setForm((f) => ({ ...f, region_id: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
          required
        >
          <option value="">Select a region...</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Activity Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Types *</label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES.map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => toggleActivity(act)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                form.activity_types.includes(act)
                  ? "bg-brand-mid text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty *</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, difficulty: d.value }))}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all border-2 ${
                form.difficulty === d.value
                  ? `${d.color} text-white border-transparent shadow-lg scale-105`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* GPX Upload */}
      <div className="bg-brand-bg rounded-xl p-5 border-2 border-dashed border-gray-300">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          GPX File (auto-fills distance, elevation, and map location)
        </label>
        <input
          type="file"
          accept=".gpx"
          onChange={handleGpxUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-mid file:text-white file:font-semibold file:cursor-pointer hover:file:bg-brand-dark"
        />
        {gpxResult && (
          <div className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg p-3">
            GPX loaded: {gpxResult.distance_km} km, {gpxResult.elevation_gain_m}m elevation gain, {gpxResult.coordinates.length} trackpoints
          </div>
        )}
      </div>

      {/* Distance & Elevation */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Distance (km)</label>
          <input
            type="number"
            step="0.1"
            value={form.distance_km}
            onChange={(e) => setForm((f) => ({ ...f, distance_km: e.target.value }))}
            placeholder="12.4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Elevation Gain (m)</label>
          <input
            type="number"
            value={form.elevation_gain_m}
            onChange={(e) => setForm((f) => ({ ...f, elevation_gain_m: e.target.value }))}
            placeholder="487"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
          />
        </div>
      </div>

      {/* Lat/Lng (manual if no GPX) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={form.latitude}
            onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
            placeholder="49.2827"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={form.longitude}
            onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
            placeholder="-123.1207"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
          />
        </div>
      </div>

      {/* Video Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Video Status</label>
        <select
          value={form.video_status}
          onChange={(e) => setForm((f) => ({ ...f, video_status: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Date Filmed */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Date Filmed</label>
        <input
          type="date"
          value={form.filmed_date}
          onChange={(e) => setForm((f) => ({ ...f, filmed_date: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Trail conditions, notable features, things to know..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mid"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 bg-brand-dark text-white font-bold text-lg rounded-xl hover:bg-brand-mid transition-colors disabled:opacity-50 shadow-lg"
      >
        {saving ? "Saving..." : "Save Trail"}
      </button>
    </form>
  );
}
