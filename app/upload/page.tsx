"use client";

import Link from "next/link";
import { useState, useCallback, type FormEvent } from "react";
import { parseGpx, type GpxResult } from "@/lib/gpx";
import { saveSubmission } from "@/lib/submissions";

const ACTIVITIES = [
  "Mountain Biking", "Motorcycle", "ATV/UTV", "Skiing/Snowboarding",
  "Snowmobile", "Hiking", "Hunting", "Camping/Overlanding",
  "Horseback Riding", "Fishing", "Cross-Country Skiing", "Snowshoeing", "Rock Climbing",
];

const REGIONS = [
  "Kootenays", "Okanagan", "Whistler/Squamish", "North Shore",
  "Kamloops", "Fraser Valley", "Other BC",
];

const DIFFICULTIES = [
  { value: "green", label: "Easy", color: "bg-trail-green" },
  { value: "blue", label: "Intermediate", color: "bg-trail-blue" },
  { value: "black", label: "Advanced", color: "bg-trail-black" },
  { value: "expert", label: "Expert", color: "bg-trail-red" },
];

export default function UploadPage() {
  const [form, setForm] = useState({
    trailName: "",
    activity: [] as string[],
    region: "",
    difficulty: "blue",
    description: "",
    videoLink: "",
    contributorAgreement: false,
    liabilityWaiver: false,
  });
  const [gpxResult, setGpxResult] = useState<GpxResult | null>(null);
  const [gpxFileName, setGpxFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);

  function toggleActivity(activity: string) {
    setForm((f) => ({
      ...f,
      activity: f.activity.includes(activity)
        ? f.activity.filter((a) => a !== activity)
        : [...f.activity, activity],
    }));
  }

  const processGpxFile = useCallback((file: File) => {
    if (!file.name.endsWith(".gpx")) {
      setErrors((e) => ({ ...e, gpx: "Please upload a .gpx file." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const xml = ev.target?.result as string;
      try {
        const result = parseGpx(xml);
        setGpxResult(result);
        setGpxFileName(file.name);
        setErrors((e) => {
          const next = { ...e };
          delete next.gpx;
          return next;
        });
      } catch {
        setErrors((e) => ({ ...e, gpx: "Could not parse GPX file." }));
      }
    };
    reader.readAsText(file);
  }, []);

  const handleGpxUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processGpxFile(file);
  }, [processGpxFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processGpxFile(file);
  }, [processGpxFile]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.trailName.trim()) e.trailName = "Trail name is required.";
    if (form.activity.length === 0) e.activity = "Select at least one activity.";
    if (!form.region) e.region = "Region is required.";
    if (!form.videoLink.trim()) e.videoLink = "Video link is required.";
    else if (
      !form.videoLink.includes("youtube.com") &&
      !form.videoLink.includes("youtu.be") &&
      !form.videoLink.includes("drive.google.com")
    ) {
      e.videoLink = "Please use a YouTube or Google Drive link.";
    }
    if (!gpxResult) e.gpx = "GPX file is required.";
    if (!form.description.trim()) e.description = "A short description is required.";
    if (!form.contributorAgreement) e.contributorAgreement = "You must accept the Contributor Agreement.";
    if (!form.liabilityWaiver) e.liabilityWaiver = "You must accept the Liability Waiver.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    saveSubmission({
      id: crypto.randomUUID(),
      trailName: form.trailName.trim(),
      activity: form.activity,
      region: form.region,
      difficulty: form.difficulty as "green" | "blue" | "black" | "expert",
      description: form.description.trim(),
      videoLink: form.videoLink.trim(),
      gpxData: gpxResult
        ? {
            coordinates: gpxResult.coordinates,
            distance_km: gpxResult.distance_km,
            elevation_gain_m: gpxResult.elevation_gain_m,
          }
        : null,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  }

  function resetForm() {
    setForm({ trailName: "", activity: [], region: "", difficulty: "blue", description: "", videoLink: "", contributorAgreement: false, liabilityWaiver: false });
    setGpxResult(null);
    setGpxFileName("");
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Trail Submitted!</h2>
          <p className="text-gray-500 mb-6">Your trail is pending review. We&apos;ll get back to you soon.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={resetForm}
              className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all"
            >
              Submit Another Trail
            </button>
            <Link href="/" className="text-sm text-brand-mid hover:text-brand-dark font-medium transition-colors">
              Back to TrailView
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">TRAILVIEW</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Upload a Trail</h1>
          <p className="text-gray-500">Share your GPX and video link. We&apos;ll handle the rest.</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* GPX Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GPX File</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-xl p-5 border-2 border-dashed transition-colors ${
                  dragging ? "border-green-400 bg-green-50" : errors.gpx ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  accept=".gpx"
                  onChange={handleGpxUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-dark file:text-white file:font-semibold file:cursor-pointer hover:file:bg-brand-mid"
                />
                <p className="text-xs text-gray-400 mt-2">Drag and drop or click to select. Export from Strava, Garmin, etc.</p>
              </div>
              {gpxResult && (
                <div className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                  <span className="font-medium">{gpxFileName}</span> — {gpxResult.distance_km} km, {gpxResult.elevation_gain_m}m gain, {gpxResult.coordinates.length} trackpoints
                </div>
              )}
              {errors.gpx && <p className="text-red-500 text-xs mt-1">{errors.gpx}</p>}
            </div>

            {/* Video Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Video Link</label>
              <input
                type="url"
                value={form.videoLink}
                onChange={(e) => setForm({ ...form, videoLink: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or Google Drive link"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.videoLink ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.videoLink && <p className="text-red-500 text-xs mt-1">{errors.videoLink}</p>}
            </div>

            {/* Trail Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trail Name</label>
              <input
                type="text"
                value={form.trailName}
                onChange={(e) => setForm({ ...form, trailName: e.target.value })}
                placeholder="e.g., Top of the World"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.trailName ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.trailName && <p className="text-red-500 text-xs mt-1">{errors.trailName}</p>}
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Activity</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      form.activity.includes(activity)
                        ? "bg-brand-dark text-white border-brand-dark shadow"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
              {errors.activity && <p className="text-red-500 text-xs mt-1">{errors.activity}</p>}
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors text-gray-700 ${errors.region ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              >
                <option value="">Select a region...</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setForm({ ...form, difficulty: d.value })}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Trail conditions, highlights, what to expect..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.contributorAgreement}
                    onChange={(e) => setForm({ ...form, contributorAgreement: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    form.contributorAgreement ? "bg-green-500 border-green-500" : errors.contributorAgreement ? "border-red-400" : "border-gray-300 group-hover:border-brand-mid"
                  }`}>
                    {form.contributorAgreement && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  I agree to the <Link href="/legal#contributor" className="text-brand-mid font-medium underline">Contributor Agreement</Link>, including content ownership, revenue share terms, and upload guidelines
                </span>
              </label>
              {errors.contributorAgreement && <p className="text-red-500 text-xs ml-8">{errors.contributorAgreement}</p>}

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.liabilityWaiver}
                    onChange={(e) => setForm({ ...form, liabilityWaiver: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    form.liabilityWaiver ? "bg-green-500 border-green-500" : errors.liabilityWaiver ? "border-red-400" : "border-gray-300 group-hover:border-brand-mid"
                  }`}>
                    {form.liabilityWaiver && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  I acknowledge the <Link href="/legal#waiver" className="text-brand-mid font-medium underline">Liability Waiver &amp; Assumption of Risk</Link> and confirm I have the legal right to film and share this trail content
                </span>
              </label>
              {errors.liabilityWaiver && <p className="text-red-500 text-xs ml-8">{errors.liabilityWaiver}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-green-500/25"
            >
              Submit Trail
            </button>
          </form>

          {/* Helper link */}
          <div className="my-6 border-t border-gray-100" />
          <div className="bg-brand-dark/5 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Not sure how to get started?</p>
            <Link href="/contribute" className="text-sm font-semibold text-green-600 hover:text-green-500 transition-colors">
              Read our Contributor Guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
