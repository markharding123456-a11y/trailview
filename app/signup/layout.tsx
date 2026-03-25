import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — TrailView",
  description:
    "Create your free TrailView account to explore GPS-synced trail videos across British Columbia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
