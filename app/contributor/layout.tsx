import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributor Profile — TrailView",
  description:
    "View contributor profile, published trails, and stats on TrailView.",
  openGraph: {
    title: "Contributor Profile — TrailView",
    description:
      "View contributor profile, published trails, and stats on TrailView.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
