import Link from "next/link";

export const metadata = {
  title: "Contribute — TrailView",
  description: "Film your local trails and share them with the world. A phone, a mount, and a GPS app is all you need to get started.",
};

export default function ContributePage() {
  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-gradient mountain-bg relative py-28 sm:py-36 text-center text-white px-4">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-green-300 border border-green-400/20">
            Share Your Local Trails
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Film Your Trail,<br />
            <span className="gradient-text">Share It With the World</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            You already know the best trails. Point a camera, export your GPS track, and turn your local knowledge into income.
          </p>
          {/* Quick Start callout */}
          <div className="inline-block bg-green-500/20 border border-green-400/30 rounded-2xl px-8 py-5 text-left max-w-lg mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div>
                <div className="text-green-300 font-bold text-sm mb-1">Quick Start</div>
                <p className="text-white/80 text-sm leading-relaxed">Have a phone? You&apos;re ready. Mount it, start Strava, hit record, go.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT WE NEED ═══════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">What We Need From You</h2>
            <p className="text-gray-500 text-lg">Three things. That&apos;s it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                ),
                title: "Video",
                desc: "A first-person recording of the trail. Phone, action camera, whatever you have. Even 1080p is perfect — raw footage works fine.",
                note: "MP4 or MOV · any resolution",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z"/>
                  </svg>
                ),
                title: "GPX File",
                desc: "Your GPS track exported from any app. This is what syncs to the video — it&apos;s just a small data file, takes 10 seconds to export.",
                note: "From Strava, Garmin, OsmAnd, etc.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                ),
                title: "Trail Info",
                desc: "Name, region, activity type, difficulty, and a short description. Takes 2 minutes to fill out the form — we handle everything else.",
                note: "Quick form · we handle the rest",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 card-hover">
                <div className="w-14 h-14 bg-brand-dark text-white rounded-xl flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EQUIPMENT OPTIONS ═══════════════ */}
      <section className="py-20 sm:py-28 bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="text-green-400 text-sm font-semibold mb-3 uppercase tracking-wider">Gear Guide</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pick Your Setup</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Any combination of video + GPS works. Start with what you have — there&apos;s no need to buy anything new.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                option: "Option 1",
                title: "Your Phone",
                badge: "Easiest",
                badgeClass: "bg-green-500",
                desc: "Everything you need in one device. Film with the camera, track GPS with an app, done. Most people can start today.",
                details: [
                  "Any recent smartphone works",
                  "Mount it on handlebars, helmet, or chest",
                  "Run Strava, OsmAnd, GPX Tracker, or Komoot for GPS",
                  "Record video with the built-in camera app",
                  "Export GPX from your tracking app when done",
                ],
              },
              {
                option: "Option 2",
                title: "Action Camera + Phone GPS",
                badge: "Better Video",
                badgeClass: "bg-blue-500",
                desc: "Dedicated action camera for video quality, phone in your pocket for GPS tracking. No GPS on the camera needed.",
                details: [
                  "GoPro, DJI Osmo Action, Insta360, AKASO, or similar",
                  "Mount camera on helmet, chest, or bars",
                  "Phone rides in pocket running any GPS tracking app",
                  "Sync is done by matching video start time to GPX",
                  "Widely used by experienced contributors",
                ],
              },
              {
                option: "Option 3",
                title: "Camera with Built-In GPS",
                badge: "All-in-One",
                badgeClass: "bg-amber-500",
                desc: "Camera records both video and GPS internally. No phone needed at all — the cleanest possible workflow.",
                details: [
                  "GoPro Hero 13 Black — records GPS track internally",
                  "GoPro MAX 2 — 360° video with built-in GPS",
                  "Export GPS track directly from the GoPro app",
                  "Perfect sync with no manual alignment required",
                  "Best choice for frequent contributors",
                ],
              },
              {
                option: "Option 4",
                title: "GPS Device + Any Camera",
                badge: "Best GPS Accuracy",
                badgeClass: "bg-purple-500",
                desc: "Dedicated GPS device for precision tracking paired with any camera. Top accuracy and battery life for long routes.",
                details: [
                  "Garmin Edge (cycling), Garmin watches, Apple Watch",
                  "Garmin inReach or Montana for remote backcountry",
                  "Pair with any camera — phone, action cam, or mirrorless",
                  "Best GPS accuracy and battery life for long days",
                  "Export FIT or GPX from Garmin Connect or similar",
                ],
              },
            ].map((opt) => (
              <div key={opt.option} className="bg-white/5 rounded-2xl p-7 border border-white/10 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">{opt.option}</div>
                  <span className={`${opt.badgeClass} text-white text-xs font-bold px-3 py-1 rounded-full`}>{opt.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{opt.title}</h3>
                <p className="text-white/60 text-sm mb-5 leading-relaxed">{opt.desc}</p>
                <ul className="space-y-2.5">
                  {opt.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MOUNT BY ACTIVITY ═══════════════ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Mount by Activity</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">The right mount depends on how you move. Here&apos;s what works for each activity type.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { activity: "Mountain Biking", icon: "🚵", mounts: "Handlebar · Helmet · Chest" },
              { activity: "Motorcycle", icon: "🏍", mounts: "Handlebar · Helmet · Tank" },
              { activity: "ATV / UTV", icon: "🚜", mounts: "Handlebar · Cage mount · Helmet" },
              { activity: "Skiing / Snowboarding", icon: "⛷", mounts: "Helmet · Chest · Pole clamp" },
              { activity: "Snowmobile", icon: "🛷", mounts: "Handlebar · Chest · Helmet" },
              { activity: "Hiking", icon: "🥾", mounts: "Chest · Pack strap · Trekking pole" },
              { activity: "Hunting", icon: "🏕", mounts: "Chest · Head mount · Pack strap" },
              { activity: "Camping / Overlanding", icon: "🚙", mounts: "Dash / windshield · Chest · Pack" },
              { activity: "Horseback Riding", icon: "🐴", mounts: "Chest · Helmet · Saddle mount" },
              { activity: "Fishing", icon: "🎣", mounts: "Chest · Cap clip · Backpack strap" },
              { activity: "Cross-Country Skiing", icon: "🎿", mounts: "Chest · Helmet · Pack strap" },
              { activity: "Snowshoeing", icon: "❄", mounts: "Chest · Pack strap · Trekking pole" },
              { activity: "Rock Climbing", icon: "🧗", mounts: "Helmet side · Chest · Pack strap" },
            ].map((item) => (
              <div key={item.activity} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-brand-dark text-sm mb-1.5 leading-snug">{item.activity}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.mounts}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ UPLOAD STEPS ═══════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Upload in 3 Steps</h2>
            <p className="text-gray-500 text-lg">Record, export, submit. That&apos;s the whole process.</p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Record Your Trail",
                desc: "Mount your camera, start your GPS app, and go. Film the trail from start to finish. You can do the whole route or just a highlight section — whatever you think other trail users would find most useful. Messy footage is fine; we care about what the trail looks like, not production quality.",
              },
              {
                step: "02",
                title: "Export Your GPX",
                desc: "When you're done, export the GPS track from your tracking app as a GPX file. In Strava: Activity → Export GPX. In Garmin Connect: Activity → Export to GPX. In OsmAnd or Komoot: open the trip and tap Export. You'll end up with a small .gpx file — that's it.",
              },
              {
                step: "03",
                title: "Upload Both Files",
                desc: "Drag your video and GPX file into the upload form, fill in the trail details (name, region, difficulty, activity type), and submit. We'll sync them and publish once reviewed. Most trails go live within 24 hours, and you'll start earning as soon as the video gets views.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 sm:gap-8 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-dark text-white flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GPX export quick reference */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wide">GPX Export — Quick Reference</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { app: "Strava", path: "Activity → ⋯ → Export GPX" },
                { app: "Garmin Connect", path: "Activity → Export to GPX" },
                { app: "OsmAnd", path: "Trip → Share → Export as GPX" },
                { app: "Komoot", path: "Tour → Export → GPX File" },
                { app: "Apple Watch / iPhone", path: "Use OsmAnd or Komoot to record" },
                { app: "GoPro (Hero 13 / MAX 2)", path: "GoPro App → Activity → Export GPS" },
              ].map((row) => (
                <div key={row.app} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-brand-dark text-sm">{row.app}</span>
                    <span className="text-gray-400 text-sm"> — {row.path}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ EARNINGS PREVIEW ═══════════════ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-green-500 text-sm font-semibold mb-3 uppercase tracking-wider">Earnings</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-6">Get Paid Every Time Someone Watches</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Your content keeps earning as long as people watch it. Popular trails generate passive income for years — not just the week you upload them.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { tier: "Explorer", views: "0 – 5,000", payout: "$0.004/view", color: "text-green-500" },
                  { tier: "Trailblazer", views: "5,000 – 25,000", payout: "$0.006/view", color: "text-blue-500" },
                  { tier: "Pioneer", views: "25,000+", payout: "$0.008/view", color: "text-amber-500" },
                ].map((t) => (
                  <div key={t.tier} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className={`font-bold text-lg ${t.color} w-28`}>{t.tier}</div>
                    <div className="flex-1 text-sm text-gray-500">{t.views} views</div>
                    <div className="font-bold text-brand-dark">{t.payout}</div>
                  </div>
                ))}
              </div>
              <div className="bg-brand-dark text-white rounded-xl p-5">
                <div className="text-sm text-white/50 mb-1">Example: 10 popular trails at Trailblazer tier</div>
                <div className="text-2xl font-bold text-green-400">$850+ / month</div>
                <div className="text-xs text-white/40 mt-1">Based on 15,000 views/trail/month</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-brand-dark text-white px-6 py-4">
                <div className="text-sm font-semibold">Upload Your Trail</div>
                <div className="text-xs text-white/50">4 simple steps</div>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { step: 1, label: "Drop your video file", desc: "MP4, MOV up to 4K", done: true },
                  { step: 2, label: "Drop your GPX file", desc: "GPS track from your device", done: true },
                  { step: 3, label: "Add trail details", desc: "Name, region, difficulty, activity", done: false },
                  { step: 4, label: "Preview & submit", desc: "Review GPS sync before publishing", done: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      s.done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {s.done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      ) : s.step}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${s.done ? "text-brand-dark" : "text-gray-400"}`}>{s.label}</div>
                      <div className="text-xs text-gray-400">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-20 hero-gradient text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-white/60 text-lg mb-8">
            Your local knowledge is worth something. Start earning while helping thousands of others find their next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trails/new"
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg pulse-glow"
            >
              Upload Your First Trail
            </Link>
            <Link
              href="/explore"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-white/20"
            >
              Explore Existing Trails
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
