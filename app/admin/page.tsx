"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getSubmissions as getDbSubmissions,
  approveSubmission,
  rejectSubmission,
  getRegions,
  getTrails,
  type Submission,
  type Region,
  type Trail,
} from "@/lib/supabase";
import { getAssetUrl, formatFileSize } from "@/lib/cloudflare";
import { signIn, signOut, getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const DIFF_COLORS: Record<string, string> = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  black: "bg-gray-800",
  expert: "bg-red-500",
};

type Tab = "submissions" | "trails" | "assets";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  // Review modal state
  const [reviewing, setReviewing] = useState<Submission | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    getSession().then((session) => {
      if (session) setAuthenticated(true);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    try {
      await signIn(email, password);
      setAuthenticated(true);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    }
  }

  async function handleSignOut() {
    await signOut();
    setAuthenticated(false);
  }

  useEffect(() => {
    if (!authenticated) return;
    loadData();
  }, [authenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const [subs, regs, trs] = await Promise.all([
        getDbSubmissions(),
        getRegions(),
        getTrails(),
      ]);
      setSubmissions(subs);
      setRegions(regs);
      setTrails(trs);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!reviewing || !selectedRegionId) return;
    setProcessing(true);
    try {
      await approveSubmission(reviewing, selectedRegionId);
      setReviewing(null);
      setSelectedRegionId("");
      await loadData();
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve submission.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    if (!reviewing) return;
    setProcessing(true);
    try {
      await rejectSubmission(reviewing.id, rejectNotes);
      setReviewing(null);
      setRejectNotes("");
      await loadData();
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject submission.");
    } finally {
      setProcessing(false);
    }
  }

  const filteredSubmissions = statusFilter
    ? submissions.filter((s) => s.status === statusFilter)
    : submissions;

  const liveTrails = trails.filter((t) => t.video_status === "live");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-brand-dark">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in with your admin account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid ${
                authError ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid ${
                authError ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {authError && <p className="text-red-500 text-xs">{authError}</p>}
            <button type="submit" className="w-full py-3 bg-brand-dark hover:bg-brand-dark/90 text-white font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-brand-dark text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="font-bold text-lg">TRAILVIEW</span>
            <span className="text-white/40 text-sm ml-2">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-400 font-medium">{liveTrails.length} live trails</span>
            <span className="text-amber-400 font-medium">{submissions.filter(s => s.status === "pending").length} pending</span>
            <button
              onClick={handleSignOut}
              className="ml-2 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex" role="tablist">
          {(["submissions", "trails", "assets"] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                tab === t
                  ? "border-green-500 text-brand-dark"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── SUBMISSIONS TAB ── */}
            {tab === "submissions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-dark">Submissions</h2>
                  <div className="flex gap-2">
                    {["pending", "approved", "rejected", ""].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                          statusFilter === s
                            ? "bg-brand-dark text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {s || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <p className="text-lg mb-1">No {statusFilter} submissions</p>
                    <p className="text-sm">New uploads will appear here for review.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSubmissions.map((sub) => (
                      <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`${DIFF_COLORS[sub.difficulty]} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                              {sub.difficulty === "expert" ? "EX" : sub.difficulty[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-brand-dark">{sub.trail_name}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">{sub.region} — {sub.activity_types.join(", ")}</p>
                              {sub.description && <p className="text-sm text-gray-500 mt-1">{sub.description}</p>}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                {sub.distance_km && <span>{sub.distance_km} km</span>}
                                {sub.elevation_gain_m && <span>{sub.elevation_gain_m}m elev</span>}
                                {sub.contributor_name && <span>by {sub.contributor_name}</span>}
                                <span>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {sub.video_key && (
                                  <a
                                    href={getAssetUrl(sub.video_key)}
                                    target="_blank"
                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium hover:bg-blue-100"
                                  >
                                    Preview Video
                                  </a>
                                )}
                                {sub.gpx_key && (
                                  <a
                                    href={getAssetUrl(sub.gpx_key)}
                                    target="_blank"
                                    className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-medium hover:bg-green-100"
                                  >
                                    Download GPX
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${STATUS_COLORS[sub.status]} px-3 py-1 rounded-full text-xs font-semibold`}>
                              {sub.status}
                            </span>
                            {sub.status === "pending" && (
                              <button
                                onClick={() => setReviewing(sub)}
                                className="px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TRAILS TAB ── */}
            {tab === "trails" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-dark">All Trails ({trails.length})</h2>
                  <Link href="/trails/new" className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2">
                    + Add Trail
                  </Link>
                </div>
                <div className="space-y-2">
                  {trails.map((trail) => (
                    <div key={trail.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                      <div className={`${DIFF_COLORS[trail.difficulty]} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {trail.difficulty === "expert" ? "EX" : trail.difficulty[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-brand-dark truncate">{trail.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {trail.regions?.name} — {trail.activity_types.join(", ")}
                          {trail.distance_km && <span> — {trail.distance_km} km</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {trail.video_url && (
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-medium">Has Video</span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trail.video_status === "live" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          {trail.video_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ASSETS TAB ── */}
            {tab === "assets" && (
              <div>
                <h2 className="text-xl font-bold text-brand-dark mb-6">Cloudflare R2 Assets</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="text-3xl font-bold text-brand-dark">{trails.filter(t => t.video_url).length}</div>
                    <div className="text-sm text-gray-500 mt-1">Videos stored in R2</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="text-3xl font-bold text-brand-dark">{trails.filter(t => t.gpx_url).length}</div>
                    <div className="text-sm text-gray-500 mt-1">GPX files stored in R2</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="text-3xl font-bold text-brand-dark">{submissions.filter(s => s.status === "pending" && s.video_key).length}</div>
                    <div className="text-sm text-gray-500 mt-1">Pending video reviews</div>
                  </div>
                </div>
                <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-brand-dark mb-3">R2 Bucket: trailview-assets</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Videos, GPX files, and thumbnails are stored in Cloudflare R2 with zero egress fees.
                    Files are organized as: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">type/trailId/timestamp-filename</code>
                  </p>
                  <div className="text-xs text-gray-400">
                    Manage via Cloudflare Dashboard or <code className="bg-gray-100 px-1.5 py-0.5 rounded">npx wrangler r2 object list trailview-assets</code>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── REVIEW MODAL ── */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-label="Review submission" className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brand-dark">Review Submission</h2>
                <button onClick={() => setReviewing(null)} aria-label="Close review" className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-700">Trail Name</div>
                <div className="text-brand-dark font-medium">{reviewing.trail_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700">Region</div>
                  <div className="text-gray-600">{reviewing.region}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Difficulty</div>
                  <div className="capitalize text-gray-600">{reviewing.difficulty}</div>
                </div>
              </div>
              {reviewing.description && (
                <div>
                  <div className="text-sm font-semibold text-gray-700">Description</div>
                  <div className="text-sm text-gray-500">{reviewing.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {reviewing.distance_km && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Distance</div>
                    <div className="text-gray-600">{reviewing.distance_km} km</div>
                  </div>
                )}
                {reviewing.elevation_gain_m && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700">Elevation</div>
                    <div className="text-gray-600">{reviewing.elevation_gain_m}m</div>
                  </div>
                )}
              </div>

              {/* Video preview */}
              {reviewing.video_key && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Video Preview</div>
                  <video
                    src={getAssetUrl(reviewing.video_key)}
                    controls
                    className="w-full rounded-lg bg-black"
                    style={{ maxHeight: 200 }}
                  />
                </div>
              )}

              {/* Assign region for trail creation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Assign to Region (required for approval)
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select region...</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Reject notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Notes (optional, visible if rejecting)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Reason for rejection, feedback for contributor..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleApprove}
                disabled={!selectedRegionId || processing}
                className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 disabled:bg-gray-200 disabled:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              >
                {processing ? "..." : "Approve & Publish"}
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-400 disabled:bg-gray-200 disabled:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              >
                {processing ? "..." : "Reject"}
              </button>
              <button
                onClick={() => setReviewing(null)}
                className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
