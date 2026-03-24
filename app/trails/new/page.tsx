import type { Metadata } from "next";
import TrailForm from "@/components/TrailForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log New Trail — TrailView",
  description: "Submit a new trail with GPS data to the TrailView platform.",
};

export default function NewTrailPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-brand-mid hover:underline">&larr; Back to Home</Link>
        <h1 className="text-2xl font-bold text-brand-dark mt-2">Log New Trail</h1>
        <p className="text-sm text-gray-500">Enter trail details. Drop a GPX file to auto-fill distance, elevation, and map location.</p>
      </div>
      <TrailForm />
    </div>
  );
}
