import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Contributor — TrailView",
  description:
    "Sign up as a TrailView contributor. Film trails, upload videos, and earn money per view.",
  openGraph: {
    title: "Become a Contributor — TrailView",
    description:
      "Sign up as a TrailView contributor. Film trails, upload videos, and earn money per view.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
