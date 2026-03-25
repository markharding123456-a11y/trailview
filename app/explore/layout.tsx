import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Trails — TrailView",
  description:
    "Browse GPS-synced trail videos across British Columbia. Filter by activity, difficulty, and region.",
  openGraph: {
    title: "Explore Trails — TrailView",
    description:
      "Browse GPS-synced trail videos across British Columbia. Filter by activity, difficulty, and region.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
