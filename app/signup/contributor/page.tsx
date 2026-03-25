"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import FormField from "@/app/components/form-field";

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

const BIO_MAX_LENGTH = 500;

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleItem(field: "activities" | "regions" | "equipment", value: string) {
    setForm((f) => {
      const updated = f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value];
      return { ...f, [field]: updated };
    });
    // Clear validation error for the field when user selects something
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  const validateField = useCallback((field: string, value: string | boolean) => {
    switch (field) {
      case "name":
        if (!(value as string).trim()) return "Name is required.";
        break;
      case "email":
        if (!(value as string).trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) return "Enter a valid email.";
        break;
      case "password":
        if (!(value as string)) return "Password is required.";
        if ((value as string).length < 8) return "Password must be at least 8 characters.";
        break;
      case "confirmPassword":
        if ((value as string) !== form.password) return "Passwords do not match.";
        break;
    }
    return "";
  }, [form.password]);

  function handleBlur(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    const val = form[field as keyof typeof form];
    const error = validateField(field, typeof val === "string" || typeof val === "boolean" ? val : String(val));
    setErrors((e) => {
      if (error) return { ...e, [field]: error };
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  function handleChange(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((e) => {
        if (error) return { ...e, [field]: error };
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (form.activities.length === 0) e.activities = "Select at least one activity.";
    if (form.regions.length === 0) e.regions = "Select at least one region.";
    if (!form.terms) e.terms = "You must accept the Terms of Service.";
    if (!form.contributorAgreement) e.contributorAgreement = "You must accept the Contributor Agreement.";
    return e;
  }

  const isFormValid =
    form.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.activities.length > 0 &&
    form.regions.length > 0 &&
    form.terms &&
    form.contributorAgreement;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsSubmitting(false);
      setSubmitted(true);
    }
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

            {/* -- ACCOUNT DETAILS -- */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-dark text-white rounded text-xs flex items-center justify-center">1</span>
                Account Details
              </h3>
              <div className="space-y-4">
                <FormField label="Full Name" error={touched.name ? errors.name : undefined} required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Jane Smith"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.name && errors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                </FormField>

                <FormField label="Email Address" error={touched.email ? errors.email : undefined} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="jane@example.com"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.email && errors.email ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                </FormField>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Password" error={touched.password ? errors.password : undefined} required>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Min. 8 characters"
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.password && errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    />
                    <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters</p>
                  </FormField>
                  <FormField label="Confirm Password" error={touched.confirmPassword ? errors.confirmPassword : undefined} required>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.confirmPassword && errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* -- CONTENT PROFILE -- */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-brand-dark text-white rounded text-xs flex items-center justify-center">2</span>
                Content Profile
              </h3>
              <div className="space-y-5">

                {/* Activities filmed */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Activities You Film <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex flex-wrap gap-2 p-3 rounded-lg border-2 transition-colors ${errors.activities ? "border-red-300 bg-red-50" : "border-transparent"}`}>
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
                  {errors.activities && <p className="text-xs text-red-500 mt-1">{errors.activities}</p>}
                </div>

                {/* Regions */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Regions You Cover <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex flex-wrap gap-2 p-3 rounded-lg border-2 transition-colors ${errors.regions ? "border-red-300 bg-red-50" : "border-transparent"}`}>
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
                  {errors.regions && <p className="text-xs text-red-500 mt-1">{errors.regions}</p>}
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

            {/* -- ABOUT YOU -- */}
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
                    onChange={(e) => {
                      if (e.target.value.length <= BIO_MAX_LENGTH) {
                        setForm({ ...form, bio: e.target.value });
                      }
                    }}
                    placeholder="Tell us about your outdoor experience — what trails you ride, how long you've been at it, what regions you know best..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/{BIO_MAX_LENGTH}</p>
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

            {/* -- AGREEMENTS -- */}
            <div className="space-y-3">
              <label className={`flex items-start gap-3 cursor-pointer group`}>
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => {
                      setForm({ ...form, terms: e.target.checked });
                      if (e.target.checked) {
                        setErrors((prev) => { const next = { ...prev }; delete next.terms; return next; });
                      }
                    }}
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
                    onChange={(e) => {
                      setForm({ ...form, contributorAgreement: e.target.checked });
                      if (e.target.checked) {
                        setErrors((prev) => { const next = { ...prev }; delete next.contributorAgreement; return next; });
                      }
                    }}
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
              disabled={!isFormValid || isSubmitting}
              className="w-full py-4 bg-green-500 hover:bg-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-colors shadow-lg hover:shadow-green-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Sign Up as Contributor"}
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
