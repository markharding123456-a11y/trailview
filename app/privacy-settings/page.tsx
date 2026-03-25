"use client";

import Link from "next/link";

export default function PrivacySettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-brand-mid hover:text-brand-dark font-medium transition-colors">
            &larr; Back to TrailView
          </Link>
          <h1 className="text-3xl font-extrabold text-brand-dark mt-4 mb-2">Privacy Settings</h1>
          <p className="text-gray-500">
            Control how TrailView handles your data. We believe in transparency and minimal data collection.
          </p>
        </div>

        <div className="space-y-6">
          {/* What we collect */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-dark mb-4">What TrailView Collects</h2>
            <ul className="space-y-3">
              {[
                { label: "Trail uploads", detail: "Videos, GPX files, and trail descriptions you submit." },
                { label: "Account email", detail: "Used for authentication and to contact you about your submissions." },
                { label: "GPS coordinates", detail: "Extracted from GPX files to display trail routes on the map." },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* What we don't collect */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-dark mb-4">What TrailView Does NOT Collect</h2>
            <ul className="space-y-3">
              {[
                "No tracking cookies or behavioral analytics",
                "No advertising or marketing cookies",
                "No third-party analytics (no Google Analytics, no Meta Pixel)",
                "No sale or sharing of data with third parties",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cookie toggle */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-dark mb-4">Cookie Preferences</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">Essential cookies only</p>
                <p className="text-sm text-gray-500 mt-1">
                  These cookies are required for TrailView to function (authentication, session management). They cannot be disabled.
                </p>
              </div>
              {/* Always-on toggle */}
              <div
                aria-label="Essential cookies are always enabled"
                className="w-11 h-6 bg-green-500 rounded-full relative flex-shrink-0 cursor-not-allowed opacity-90"
                title="Required for site functionality"
              >
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              TrailView only uses cookies that are strictly necessary for the site to work. Since we have no optional cookies, this setting cannot be changed.
            </p>
          </section>

          {/* Privacy policy link */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-dark mb-2">Full Privacy Policy</h2>
            <p className="text-sm text-gray-500 mb-4">
              For complete details on how we handle your information, read our full privacy policy and legal documents.
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-500 transition-colors"
            >
              View Privacy Policy &amp; Legal
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          {/* Delete my data */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-brand-dark mb-2">Delete My Data</h2>
            <p className="text-sm text-gray-500 mb-4">
              You have the right to request deletion of all data associated with your account, including uploaded trails, GPS data, and personal information.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                To request data deletion, please contact us at{" "}
                <span className="font-semibold text-brand-dark">privacy@trailview.ca</span>.
                We will process your request within 30 days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
