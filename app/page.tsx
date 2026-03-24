"use client";

import Link from "next/link";
import { sampleTrails, regions, activityTypes, difficultyColors } from "@/lib/sample-trails";

const activityIcons: Record<string, string> = {
  "MTB": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z",
  "Motorcycle": "M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97z",
  "ATV/UTV": "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z",
  "Skiing/Snowboarding": "M18 14h-4l-2-2v-4c0-1.1-.9-2-2-2s-2 .9-2 2v5.5L5 17l1 2 5-3 3 3h4v-2h-3.5l-2.09-2.09L14 14h4v-2z",
  "Snowmobile": "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z",
  "Hiking": "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z",
  // New activity types
  "Hunting": "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
  "Camping/Overlanding": "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  "Horseback Riding": "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z",
  "Fishing": "M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6C9.2 17.41 8.35 17 7 17s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6V20c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8v-1.6c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6C9.2 12.42 8.35 12 7 12s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6V15c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8v-1.6c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zM12 1L2 6v2h20V6L12 1z",
  "Cross-Country Skiing": "M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z",
  "Snowshoeing": "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z",
  "Rock Climbing": "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z",
};

const stats = [
  { value: "30,000+", label: "km of BC trails" },
  { value: "4.8M+", label: "BC outdoor recreation participants" },
  { value: "300K+", label: "Whistler visitors per season" },
  { value: "13", label: "activity types covered" },
];

export default function LandingPage() {
  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-gradient mountain-bg relative min-h-[90vh] flex items-center justify-center text-center text-white px-4">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-green-300 border border-green-400/20">
            13 activities · 6 regions across British Columbia
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            See Every Trail<br />
            <span className="gradient-text">Before You Go</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            GPS-synced first-person trail videos for every outdoor activity — mountain biking, motorcycles, skiing, hiking, hunting, horseback riding, and more. Watch exactly what the trail looks like, with your position tracked on the map in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg pulse-glow"
            >
              Explore Trails
            </Link>
            <Link
              href="/trail"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-white/20"
            >
              Watch GPS Sync Demo
            </Link>
          </div>
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">How TrailView Works</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Three steps from curiosity to confidence. Know exactly what you&apos;re getting into before you head out.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                step: "01",
                title: "Film the Trail",
                desc: "Contributors explore trails with a camera and GPS tracker. The footage captures every feature, every turn, every obstacle — for any activity.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "GPS Sync",
                desc: "Our sync engine matches every second of video to a GPS coordinate. Scrub the video, and a dot moves on the map showing exactly where you are.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Explore & Go",
                desc: "Browse trails on the map, watch the POV video, check difficulty and conditions. Then head out with total confidence in what you&apos;re getting into.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-2xl p-8 text-center card-hover">
                <div className="w-16 h-16 bg-brand-dark text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-green-500 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GPS SYNC PREVIEW ═══════════════ */}
      <section className="py-20 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-green-400 text-sm font-semibold mb-3">THE CORE TECHNOLOGY</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">GPS-Synced Video Playback</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                As the trail video plays, a dot tracks your exact position on the map in real time. Scrub to any point in the video and instantly see where on the trail you are. Speed, elevation, distance — all synced live.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Live Position", desc: "Map marker moves with video" },
                  { label: "Speed Overlay", desc: "Real-time km/h from GPS" },
                  { label: "Elevation Profile", desc: "See the climbs and descents" },
                  { label: "Scrub & Seek", desc: "Jump to any point on the trail" },
                ].map((f) => (
                  <div key={f.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-sm font-semibold text-green-400">{f.label}</div>
                    <div className="text-xs text-white/50 mt-1">{f.desc}</div>
                  </div>
                ))}
              </div>
              <Link href="/trail" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 px-6 py-3 rounded-xl font-semibold transition-all">
                Try the Live Demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            {/* Simulated player preview */}
            <div className="bg-black/30 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="aspect-video relative bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle at 50% 120%, rgba(34,197,94,0.3) 0%, transparent 60%),
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
                }} />
                {/* HUD overlay */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-white/50 text-xs">SPEED</span>
                  <div className="text-green-400 font-bold text-lg hud-value">24.7 <span className="text-xs text-white/40">km/h</span></div>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-white/50 text-xs">ELEV</span>
                  <div className="text-blue-400 font-bold text-lg hud-value">1,247 <span className="text-xs text-white/40">m</span></div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-white/50 text-xs">DIST</span>
                  <div className="text-amber-400 font-bold text-lg hud-value">3.2 / 8.4 <span className="text-xs text-white/40">km</span></div>
                </div>
                {/* Play button */}
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <div className="h-full bg-green-500 w-[38%] rounded-r-full" />
                </div>
              </div>
              {/* Mini map preview */}
              <div className="p-4 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 bg-brand-dark/50 rounded-lg border border-white/10 flex items-center justify-center text-white/30 text-xs">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Top of the World</div>
                    <div className="text-xs text-white/40">Whistler / Squamish &middot; Expert &middot; 8.4 km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ACTIVITY TYPES ═══════════════ */}
      <section id="activities" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Every Trail. Every Activity.</h2>
            <p className="text-gray-500 text-lg">One platform for all off-road recreation across British Columbia.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {activityTypes.map((activity) => {
              const trailCount = sampleTrails.filter(t => t.activityTypes.includes(activity)).length;
              return (
                <Link href="/explore" key={activity} className="bg-white rounded-2xl p-6 sm:p-8 text-center card-hover shadow-sm border border-gray-100 group">
                  <div className="w-14 h-14 bg-brand-dark text-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d={activityIcons[activity] || activityIcons.Hiking} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-brand-dark text-lg mb-1">{activity}</h3>
                  <p className="text-sm text-gray-400">{trailCount * 45}+ trails</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ REGIONAL COVERAGE ═══════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Covering BC&apos;s Best Trail Systems</h2>
            <p className="text-gray-500 text-lg">From the North Shore to the Kootenays. More regions added every month.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {regions.map((region) => (
              <Link href="/explore" key={region.slug} className="group relative bg-brand-dark rounded-2xl p-6 overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-mid/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-lg mb-1">{region.name}</h3>
                  <p className="text-white/50 text-sm">{region.trailCount * 38} trails filmed</p>
                  <div className="mt-4 flex items-center gap-1 text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-1">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTRIBUTORS ═══════════════ */}
      <section id="contributors" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-green-500 text-sm font-semibold mb-3">FOR CONTRIBUTORS</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">Get Paid to Explore</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Film your favourite trails and earn money every time someone watches. Upload your footage with a GPX file, and we handle the rest — syncing, hosting, and paying you a share of the revenue your content generates.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { tier: "Explorer", views: "0 - 5,000", payout: "$0.004/view", color: "text-green-500" },
                  { tier: "Trailblazer", views: "5,000 - 25,000", payout: "$0.006/view", color: "text-blue-500" },
                  { tier: "Pioneer", views: "25,000+", payout: "$0.008/view", color: "text-amber-500" },
                ].map((t) => (
                  <div key={t.tier} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className={`font-bold text-lg ${t.color}`}>{t.tier}</div>
                    <div className="flex-1 text-sm text-gray-500">{t.views} views</div>
                    <div className="font-bold text-brand-dark">{t.payout}</div>
                  </div>
                ))}
              </div>
              <div className="bg-brand-dark text-white rounded-xl p-5">
                <div className="text-sm text-white/50 mb-1">Example: Top contributor with 10 popular trails</div>
                <div className="text-2xl font-bold text-green-400">$850+ / month</div>
                <div className="text-xs text-white/40 mt-1">Based on 15,000 views/trail at Trailblazer tier</div>
              </div>
            </div>
            {/* Upload flow preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-brand-dark text-white px-6 py-4">
                <div className="text-sm font-semibold">Upload Your Trail</div>
                <div className="text-xs text-white/50">4 simple steps</div>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { step: 1, label: "Drop your video file", desc: "MP4, MOV up to 4K", icon: "film", done: true },
                  { step: 2, label: "Drop your GPX file", desc: "GPS track from your device", icon: "map", done: true },
                  { step: 3, label: "Add trail details", desc: "Name, region, difficulty, activity", icon: "edit", done: false },
                  { step: 4, label: "Preview & submit", desc: "Review GPS sync before publishing", icon: "check", done: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      s.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {s.done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      ) : s.step}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${s.done ? 'text-brand-dark' : 'text-gray-400'}`}>{s.label}</div>
                      <div className="text-xs text-gray-400">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRAIL OF THE WEEK ═══════════════ */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-green-500 rounded-full" />
              <div>
                <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-0.5">Trail of the Week</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">Most Watched This Week</h2>
              </div>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-dark transition-colors font-medium">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <Link href="/trail" className="group block">
            <div className="relative bg-brand-dark rounded-2xl overflow-hidden shadow-xl border border-white/5">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-mid/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="relative z-10 flex flex-col md:flex-row gap-0">
                {/* Left — trail info */}
                <div className="flex-1 p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Expert</span>
                    <span className="text-white/60 text-xs bg-white/10 px-2.5 py-1 rounded-full">MTB</span>
                    <span className="text-white/60 text-xs bg-white/10 px-2.5 py-1 rounded-full">Whistler / Squamish</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                    Top of the World
                  </h3>
                  <p className="text-white/60 text-base mb-6 max-w-md leading-relaxed">
                    Whistler&apos;s crown jewel. A high-alpine descent starting above the treeline with massive exposure, technical rock rolls, and breathtaking views of the Whistler valley.
                  </p>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    {[
                      { label: "Distance", value: "8.4 km" },
                      { label: "Elevation", value: "1,180 m" },
                      { label: "Duration", value: "32 min" },
                      { label: "Season", value: "Jun – Oct" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="text-white/40 text-xs mb-0.5">{s.label}</div>
                        <div className="text-white font-bold text-sm">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Play count + contributor */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-400"><polygon points="8 5 20 12 8 19" /></svg>
                      <span className="text-white font-bold text-lg">14,280</span>
                      <span className="text-white/50 text-xs">plays this week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center text-xs font-bold text-green-400">N</div>
                      <span className="text-white/60 text-sm">by <span className="text-white font-medium">NateHills_BC</span></span>
                    </div>
                  </div>
                </div>

                {/* Right — play button panel */}
                <div className="md:w-72 flex items-center justify-center p-8 bg-gradient-to-l from-black/30 to-transparent">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-500 group-hover:bg-green-400 transition-colors rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>
                    </div>
                    <div className="text-white font-semibold text-sm">Watch Trail Video</div>
                    <div className="text-white/40 text-xs mt-1">GPS-synced · 32 min</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════ FEATURED TRAILS PREVIEW ═══════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Featured Trails</h2>
            <p className="text-gray-500 text-lg">Hand-picked from BC&apos;s best riding, hiking, skiing, and backcountry terrain.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {sampleTrails.slice(0, 6).map((trail) => (
              <Link href="/trail" key={trail.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                {/* Trail preview header */}
                <div className="aspect-[16/9] relative bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light flex items-end p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative z-10 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: difficultyColors[trail.difficulty] }}>
                        {trail.difficulty.toUpperCase()}
                      </span>
                      {trail.activityTypes.map(a => (
                        <span key={a} className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                    <h3 className="text-white font-bold text-lg">{trail.name}</h3>
                  </div>
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19" /></svg>
                    </div>
                  </div>
                </div>
                {/* Trail info */}
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">{trail.region}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{trail.distanceKm} km</span>
                    <span>{trail.elevationGainM}m elev</span>
                    <span>{trail.durationMin} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/explore" className="bg-brand-dark hover:bg-brand-mid text-white px-8 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2">
              View All Trails
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-20 hero-gradient text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to See the Trail?</h2>
          <p className="text-white/60 text-lg mb-8">Stop guessing. Preview any trail, any activity, before you go.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg pulse-glow">
              Start Exploring — It&apos;s Free
            </Link>
            <Link href="/trail" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-white/20">
              Watch the Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
