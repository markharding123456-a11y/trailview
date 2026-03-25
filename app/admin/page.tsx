"use client";

import { useState, useEffect } from "react";
import { getSubmissions, updateSubmissionStatus, type Submission } from "@/lib/submissions";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "trailview-admin";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  black: "bg-gray-800 text-white",
  expert: "bg-red-100 text-red-700",
};

type Filter = "all" | "pending" | "approved" | "rejected";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");

  useEffect(() => {
    if (authenticated) {
      setSubmissions(getSubmissions());
    }
  }, [authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password.");
    }
  }

  function handleStatusUpdate(id: string, status: Submission["status"]) {
    updateSubmissionStatus(id, status);
    setSubmissions(getSubmissions());
  }

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  // Login gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">Enter the admin password to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors text-center"
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-brand-dark hover:bg-brand-mid text-white font-semibold rounded-xl transition-all"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              {pendingCount} pending submission{pendingCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
          >
            Log Out
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-brand-dark text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-400">No {filter === "all" ? "" : filter + " "}submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-dark">{sub.trailName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {new Date(sub.submittedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[sub.status]}`}>
                    {sub.status}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Region</p>
                    <p className="text-sm font-medium text-gray-700">{sub.region}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${DIFFICULTY_STYLES[sub.difficulty]}`}>
                      {sub.difficulty}
                    </span>
                  </div>
                  {sub.gpxData && (
                    <>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Distance</p>
                        <p className="text-sm font-medium text-gray-700">{sub.gpxData.distance_km} km</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Elevation Gain</p>
                        <p className="text-sm font-medium text-gray-700">{sub.gpxData.elevation_gain_m}m</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Activities */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {sub.activity.map((a) => (
                    <span key={a} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{a}</span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">{sub.description}</p>

                {/* Video link */}
                <a
                  href={sub.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-mid hover:text-brand-dark transition-colors break-all"
                >
                  {sub.videoLink}
                </a>

                {/* Actions */}
                {sub.status === "pending" && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleStatusUpdate(sub.id, "approved")}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg text-sm transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(sub.id, "rejected")}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg text-sm transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
