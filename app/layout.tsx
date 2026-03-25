import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";


export const metadata: Metadata = {
  title: "TrailView — See Every Trail Before You Go",
  description: "GPS-synced first-person trail videos for every outdoor activity — mountain biking, motorcycles, ATVs, skiing, snowmobiling, hiking, hunting, horseback riding, and more across British Columbia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen flex flex-col">
        {/* Public Nav */}
        <nav className="bg-brand-dark/95 backdrop-blur-sm text-white sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">TRAILVIEW</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">How It Works</Link>
              <Link href="/#activities" className="text-sm text-white/80 hover:text-white transition-colors">Activities</Link>
              <Link href="/contribute" className="text-sm text-white/80 hover:text-white transition-colors">Contribute</Link>
              <Link href="/upload" className="text-sm text-white/80 hover:text-white transition-colors">Upload</Link>
              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-green-500/25"
              >
                Sign Up
              </Link>
              <Link
                href="/explore"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all border border-white/20"
              >
                Explore
              </Link>
            </div>
            {/* Mobile buttons */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/signup" className="bg-green-500 px-3 py-2 rounded-lg text-xs font-semibold">
                Sign Up
              </Link>
              <Link href="/contribute" className="text-xs text-white/70 hover:text-white transition-colors px-2 py-2">
                Contribute
              </Link>
              <Link href="/upload" className="text-xs text-white/70 hover:text-white transition-colors px-2 py-2">
                Upload
              </Link>
              <Link href="/explore" className="bg-white/10 border border-white/20 px-3 py-2 rounded-lg text-xs font-semibold">
                Explore
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-brand-dark text-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
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
                  <li><Link href="/explore" className="hover:text-white transition-colors">Mountain Biking</Link></li>
                  <li><Link href="/explore" className="hover:text-white transition-colors">Motorcycles</Link></li>
                  <li><Link href="/explore" className="hover:text-white transition-colors">ATV / UTV</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Regions</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/explore" className="hover:text-white transition-colors">Whistler / Squamish</Link></li>
                  <li><Link href="/explore" className="hover:text-white transition-colors">North Shore</Link></li>
                  <li><Link href="/explore" className="hover:text-white transition-colors">Kootenays</Link></li>
                  <li><Link href="/explore" className="hover:text-white transition-colors">Okanagan</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                  <li><Link href="/contribute" className="hover:text-white transition-colors">Contribute</Link></li>
                  <li><Link href="/trail" className="hover:text-white transition-colors">GPS Sync Demo</Link></li>
                  <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                  <li><Link href="/legal" className="hover:text-white transition-colors">Legal</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs">&copy; 2026 TrailView. All rights reserved. Built in British Columbia.</p>
              <div className="flex items-center gap-4 text-xs">
                <Link href="/legal#terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/legal#privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/legal#copyright" className="hover:text-white transition-colors">Copyright</Link>
                <Link href="/legal#disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
