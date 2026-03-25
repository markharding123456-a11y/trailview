import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Trail — TrailView",
  description:
    "Upload your trail video and GPX file to TrailView. Share your trails with the community.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
