import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — TrailView",
  description:
    "Top TrailView contributors ranked by trails published, distance covered, and regions explored.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
