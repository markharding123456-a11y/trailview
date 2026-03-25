"use client";

import Link from "next/link";
import { useState } from "react";

const ACTIVITIES = [
  "Mountain Biking", "Motorcycle", "ATV/UTV", "Skiing/Snowboarding",
  "Snowmobile", "Hiking", "Hunting", "Camping/Overlanding",
  "Horseback Riding", "Fishing", "Cross-Country Skiing", "Snowshoeing", "Rock Climbing",
];

const REGIONS = [
  "Kootenays", "Okanagan", "Whistler/Squamish", "North Shore",
  "Kamloops", "Fraser Valley", "Other BC",
];

const EQUIPMENT = [
  "Smartphone", "GoPro", "DJI Action Cam", "Insta360",
  "Other Action Camera", "Dedicated GPS Device",
];

const EXPERIENCE_LEVELS = [
  "Just Starting Out",
  "Some Experience",
  "Regular Contributor",
  "Professional Videographer",
];

export default function ContributorSignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    activities: [] as string[],
    regions: [] as string[],
    equipment: [] as string[],
    experience: "",
    bio: "",
    socialLink: "",
    terms: false,
    contributorAgreement: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggleItem(field: "activities" | "regions" | "equipment", value: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!form.terms) e.terms = "You must accept the Terms of Service.";
    if (!form.contributorAgreement) e.contributorAgreement = "You must accept the Contributor Agreement.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-3">Welcome, Contributor!</h2>
          <p className="text-gray-500 mb-2">Thanks for signing up! We&apos;ll review your application and be in touch with next steps.</p>
          <p className="text-sm text-gray-400 mb-6">Get ready to start filming and earning.</p>
          <Link href="/" className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2">
            Back to TrailView
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TRAILVIEW</span>
          </Link>
          <div className="inline-block mb-3 px-3 py-1 bg-green-500/20 rounded-full text-xs font-semibold text-green-400 border border-green-500/30">
            CONTRIBUTOR PROGRAM
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Sign Up as a Contributor</h1>
          <p className="text-white/60">Film trails. Build an audience. Get paid per view.</p>
        </div>

        {/* Earnings teaser */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Explorer Tier", value: "$0.004", sub: "per view" },
            { label: "Trailblazer Tier", value: "$0.006", sub: "per view" },
            { label: "Pioneer Tier", value: "$0.008", sub: "per view" },
          ].map((t) => (
            <div key={t.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-green-400 font-bold text-lg">{t.value}</div>
              <div className="text-white/40 text-xs">{t.sub}</div>
              <div className="text-white/60 text-xs mt-0.5">{t.label}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── ACCOUNT DETAILS ── */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-dark text-white rounded text-xs flex items-center justify-center">1</span>
                Account Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 8 characters"
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── CONTENT PROFILE ── */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-dark text-white rounded text-xs flex items-center justify-center">2</span>
                Content Profile
              </h3>
              <div className="space-y-5">

                {/* Activities filmed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Activities You Film <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITIES.map((activity) => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => toggleItem("activities", activity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                          form.activities.includes(activity)
                            ? "bg-brand-dark text-white border-brand-dark shadow"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Regions You Cover <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleItem("regions", region)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                          form.regions.includes(region)
                            ? "bg-green-500 text-white border-green-500 shadow"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment You Use <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {EQUIPMENT.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem("equipment", item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                          form.equipment.includes(item)
                            ? "bg-brand-mid text-white border-brand-mid shadow"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Level</label>
                  <select
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors text-gray-700"
                  >
                    <option value="">Select your experience level...</option>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── ABOUT YOU ── */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-dark text-white rounded text-xs flex items-center justify-center">3</span>
                About You
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about your outdoor experience — what trails you ride, how long you've been at it, what regions you know best..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Social Media Link <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.socialLink}
                    onChange={(e) => setForm({ ...form, socialLink: e.target.value })}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── AGREEMENTS ── */}
            <div className="space-y-3">
              <label className={`flex items-start gap-3 cursor-pointer group`}>
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    form.terms ? "bg-green-500 border-green-500" : errors.terms ? "border-red-400" : "border-gray-300 group-hover:border-brand-mid"
                  }`}>
                    {form.terms && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  I agree to the <span className="text-brand-mid font-medium underline cursor-pointer">Terms of Service</span> and <span className="text-brand-mid font-medium underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs ml-8">{errors.terms}</p>}

              <label className={`flex items-start gap-3 cursor-pointer group`}>
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
                  I agree to the <span className="text-brand-mid font-medium underline cursor-pointer">Contributor Agreement</span>, including content ownership, revenue share terms, and upload guidelines
                </span>
              </label>
              {errors.contributorAgreement && <p className="text-red-500 text-xs ml-8">{errors.contributorAgreement}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-base rounded-xl transition-colors shadow-lg hover:shadow-green-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
            >
              Sign Up as Contributor
            </button>
          </form>

          {/* Viewer link */}
          <div className="my-6 border-t border-gray-100" />
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Just want to watch trails?</p>
            <Link href="/signup" className="text-sm font-semibold text-brand-mid hover:text-brand-dark transition-colors">
              Sign up as a viewer instead →
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span className="text-brand-mid font-medium underline cursor-pointer">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
