import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — TrailView",
  description:
    "TrailView admin dashboard for reviewing trail submissions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
