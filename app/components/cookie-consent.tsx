"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "accepted") {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — show banner to be safe
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // silently fail
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-[slideUp_0.4s_ease-out]"
    >
      <div className="bg-brand-dark border-t border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80 text-center sm:text-left">
            We use essential cookies to make TrailView work. We do not use tracking or advertising cookies.
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/legal"
              className="text-sm text-white/60 hover:text-white underline transition-colors"
            >
              Learn More
            </Link>
            <button
              onClick={accept}
              className="px-5 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
