import type { Metadata } from "next";
import Link from "next/link";
import Nav from "./components/nav";
import CookieConsent from "./components/cookie-consent";
import "./globals.css";


export const metadata: Metadata = {
  title: "TrailView — See Every Trail Before You Go",
  description:
    "GPS-synced first-person trail videos for every outdoor activity — mountain biking, motorcycles, ATVs, skiing, snowmobiling, hiking, hunting, horseback riding, and more across British Columbia.",
  metadataBase: new URL("https://trailview.app"),
  openGraph: {
    title: "TrailView — See Every Trail Before You Go",
    description:
      "GPS-synced first-person trail videos for mountain biking, motorcycles, skiing, hiking, and more across British Columbia.",
    siteName: "TrailView",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrailView — See Every Trail Before You Go",
    description:
      "GPS-synced first-person trail videos across British Columbia.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#0a1628",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen flex flex-col">
        {/* Public Nav */}
        <Nav />

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer aria-label="Site footer" className="bg-brand-dark text-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <nav aria-label="Footer navigation">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white">TRAILVIEW</span>
                </div>
                <p className="text-sm leading-relaxed">
                  GPS-synced trail videos for every outdoor activity. See the trail before you go.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/explore" className="hover:text-white transition-colors">Trail Map</Link></li>
                  <li><Link href="/activities" className="hover:text-white transition-colors">Activities</Link></li>
                  <li><Link href="/regions" className="hover:text-white transition-colors">Regions</Link></li>
                  <li><Link href="/upload" className="hover:text-white transition-colors">Upload Trail</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Regions</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/regions" className="hover:text-white transition-colors">Whistler / Squamish</Link></li>
                  <li><Link href="/regions" className="hover:text-white transition-colors">North Shore</Link></li>
                  <li><Link href="/regions" className="hover:text-white transition-colors">Kootenays</Link></li>
                  <li><Link href="/regions" className="hover:text-white transition-colors">Okanagan</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                  <li><Link href="/contribute" className="hover:text-white transition-colors">Contribute</Link></li>
                  <li><Link href="/trail" className="hover:text-white transition-colors">GPS Sync Demo</Link></li>
                  <li><Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
                  <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                  <li><Link href="/legal" className="hover:text-white transition-colors">Legal</Link></li>
                  <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
                </ul>
              </div>
            </div>
            </nav>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs">2026 TrailView. Built in British Columbia.</p>
              <p className="text-xs text-white/40">The Google Street View of off-road recreation.</p>
            </div>
          </div>
        </footer>

        {/* Cookie consent banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
