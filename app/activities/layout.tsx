import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities — TrailView",
  description:
    "Browse trails by activity type: mountain biking, motorcycles, ATVs, skiing, hiking, hunting, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
