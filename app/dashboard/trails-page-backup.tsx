"use client";

import { useEffect, useState } from "react";
import { getTrails, type Trail } from "@/lib/supabase";
import TrailList from "@/components/TrailList";
import Link from "next/link";

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrails()
      .then(setTrails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading trails...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">All Trails</h1>
          <p className="text-sm text-gray-500">{trails.length} trail{trails.length !== 1 ? "s" : ""} logged</p>
        </div>
        <Link
          href="/trails/new"
          className="bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow"
        >
          + Log Trail
        </Link>
      </div>
      <TrailList trails={trails} />
    </div>
  );
}
