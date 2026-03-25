import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trail Video — TrailView",
  description:
    "Watch GPS-synced first-person trail video with live map tracking, elevation profile, and speed overlay.",
  openGraph: {
    title: "Trail Video — TrailView",
    description:
      "Watch GPS-synced first-person trail video with live map tracking, elevation profile, and speed overlay.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
