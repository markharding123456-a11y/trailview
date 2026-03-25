import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regions — TrailView",
  description:
    "Explore trail regions across British Columbia: Whistler, North Shore, Kootenays, Okanagan, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
