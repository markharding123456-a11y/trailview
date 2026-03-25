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

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    activities: [] as string[],
    region: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleActivity(activity: string) {
    setForm((f) => ({
      ...f,
      activities: f.activities.includes(activity)
        ? f.activities.filter((a) => a !== activity)
        : [...f.activities, activity],
    }));
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
    if (!form.terms) e.terms = "You must accept the Terms of Service.";
    return e;
  }

  const isFormValid =
    form.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.terms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true, terms: true });
    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsSubmitting(false);
      setSubmitted(true);
    }
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
          <h2 className="text-2xl font-bold text-brand-dark mb-3">You&apos;re on the list!</h2>
          <p className="text-gray-500 mb-6">Thanks for signing up! We&apos;ll be in touch soon with early access details.</p>
          <Link href="/" className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2">
            Back to TrailView
          </Link>
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
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Create Your Account</h1>
          <p className="text-gray-500">Get access to GPS-synced trail videos across BC.</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
            <FormField label="Password" error={touched.password ? errors.password : undefined} required>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Minimum 8 characters"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.password && errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters</p>
            </FormField>

            {/* Confirm Password */}
            <FormField label="Confirm Password" error={touched.confirmPassword ? errors.confirmPassword : undefined} required>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors ${touched.confirmPassword && errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
            </FormField>

            {/* Favorite Activities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Favorite Activities <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => toggleActivity(activity)}
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

            {/* Home Region */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Home Region <span className="text-gray-400 font-normal">(optional)</span></label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid focus:border-brand-mid transition-colors text-gray-700"
              >
                <option value="">Select a region...</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Terms */}
            <div>
              <label className={`flex items-start gap-3 cursor-pointer group ${errors.terms ? "text-red-500" : ""}`}>
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => handleChange("terms", e.target.checked)}
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
              {errors.terms && <p className="text-red-500 text-xs mt-1 ml-8">{errors.terms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-colors shadow-lg hover:shadow-green-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Contributor CTA */}
          <div className="bg-brand-dark/5 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Want to film trails and earn money?</p>
            <Link href="/signup/contributor" className="text-sm font-semibold text-green-600 hover:text-green-500 transition-colors">
              Sign up as a Contributor instead →
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
