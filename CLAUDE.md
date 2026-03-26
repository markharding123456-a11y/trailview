# CLAUDE.md - TrailView

## Project Overview

TrailView is a trail video platform for outdoor activities in British Columbia. It syncs GPS data with trail videos, allowing users to explore trails on an interactive map. Built as a static Next.js site deployed to GitHub Pages, with Supabase as the backend.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with `output: "export"` for static site generation
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4 with custom color palette and animations
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **Maps:** Leaflet (explore page) + Mapbox GL (trail sync)
- **Charts:** Recharts
- **Deployment:** GitHub Pages via GitHub Actions (push to `master`)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (static export to /out)
npm run start    # Serve production build locally
```

No test runner, linter, or formatter is configured.

## Project Structure

```
app/                          # Next.js App Router pages
  layout.tsx                  # Root layout (nav, footer)
  page.tsx                    # Landing page
  explore/page.tsx            # Trail map explorer (Leaflet + filtering)
  trail/page.tsx              # GPS-video sync demo
  contribute/page.tsx         # Contributor landing page
  signup/page.tsx             # User signup form
  signup/contributor/page.tsx # Contributor signup form
  trails/page.tsx             # Trail list (from Supabase)
  trails/new/page.tsx         # Add new trail form
  globals.css                 # Global styles + custom keyframe animations

components/                   # Shared React components
  TrailForm.tsx               # Trail create/edit form with GPX upload
  TrailList.tsx               # Trail list display with filtering

lib/                          # Shared utilities
  supabase.ts                 # Supabase client, types (Region, Trail), CRUD functions
  gpx.ts                      # GPX file parser (coordinates, distance, elevation via Haversine)
  sync-engine.ts              # GPS-video sync engine (interpolates GPS coords to video timestamps)
  projections.ts              # Business growth/revenue projection calculations
  sample-trails.ts            # Demo trail data (11 hardcoded trails, 13 activity types)

public/                       # Static assets
```

## Architecture Notes

- **Static-first:** The site is exported as static HTML/CSS/JS. No server-side API routes.
- **Client-side heavy:** Most pages use `"use client"` for interactive features (maps, forms).
- **Direct Supabase access:** The browser connects to Supabase directly using public anon keys. No backend API layer.
- **Base path:** Deployed at `/trailview` subpath — configured in `next.config.mjs` via `basePath` and `assetPrefix`.
- **Path alias:** `@/*` maps to the project root (configured in `tsconfig.json`).

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Supabase public anon key
NEXT_PUBLIC_MAPBOX_TOKEN=...       # Mapbox public access token
```

All variables are `NEXT_PUBLIC_*` (exposed to browser). No server-only secrets.

## Database Schema

Defined in `supabase-schema.sql`. Two main tables:

- **regions** — 7 pre-seeded BC regions (Kootenays, Okanagan, Whistler/Squamish, North Shore, Kamloops, Fraser Valley, Other BC)
- **trails** — Trail metadata including name, region, activity_types (text[]), difficulty (green/blue/black/expert), distance, elevation, GPX coordinates (JSONB), video status, and timestamps

CRUD operations are in `lib/supabase.ts`: `getTrails()`, `getRegions()`, `createTrail()`, `updateTrail()`, `deleteTrail()`.

## Key Conventions

- **React components:** PascalCase filenames and exports
- **Database columns:** snake_case
- **Difficulty levels:** `green`, `blue`, `black`, `expert` (ski-run style)
- **Activity types:** 13 supported — MTB, Motorcycle, ATV/UTV, Skiing, Snowmobile, Hiking, Hunting, Camping, Horseback, Fishing, XC Skiing, Snowshoeing, Rock Climbing
- **Custom colors:** `trail-green`, `trail-blue`, `trail-black`, `trail-red` and `brand-dark`, `brand-mid`, `brand-light`, `brand-bg` (defined in `tailwind.config.js`)

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on push to `master` or manual dispatch
- Runs `npm ci` + `npm run build` with Node.js 20
- Deploys static `/out` directory to GitHub Pages
