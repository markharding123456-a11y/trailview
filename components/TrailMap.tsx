"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Trail } from "@/lib/supabase";

const DIFFICULTY_COLORS: Record<string, string> = {
  green: "#22c55e",
  blue: "#3b82f6",
  black: "#1e293b",
  expert: "#ef4444",
};

const STATUS_OPACITY: Record<string, number> = {
  not_filmed: 0.3,
  filmed: 0.6,
  uploaded: 0.8,
  processing: 0.8,
  live: 1,
};

export default function TrailMap({ trails }: { trails: Trail[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-122.5, 49.8],
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => { map.current?.remove(); };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    // Remove existing markers
    const existing = document.querySelectorAll(".trail-marker");
    existing.forEach((el) => el.remove());

    trails.forEach((trail) => {
      if (!trail.latitude || !trail.longitude) return;

      const color = DIFFICULTY_COLORS[trail.difficulty] || "#3b82f6";
      const opacity = STATUS_OPACITY[trail.video_status] || 0.5;

      const el = document.createElement("div");
      el.className = "trail-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "2px solid white";
      el.style.opacity = String(opacity);
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";

      const statusLabel = trail.video_status.replace("_", " ");
      const activities = trail.activity_types?.join(", ") || "";

      new mapboxgl.Marker(el)
        .setLngLat([trail.longitude, trail.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 15, maxWidth: "240px" }).setHTML(
            `<div style="font-family:sans-serif">
              <strong style="font-size:14px">${trail.name}</strong><br/>
              <span style="color:${color};font-weight:600">${trail.difficulty.toUpperCase()}</span>
              ${activities ? ` &middot; ${activities.toUpperCase()}` : ""}
              <br/>
              ${trail.distance_km ? `${trail.distance_km} km` : ""}
              ${trail.elevation_gain_m ? ` &middot; ${trail.elevation_gain_m}m gain` : ""}
              <br/>
              <span style="color:#888;font-size:12px">Status: ${statusLabel}</span>
            </div>`
          )
        )
        .addTo(m);
    });

    // Draw trail lines for trails with GPX data
    trails.forEach((trail) => {
      if (!trail.gpx_coordinates || trail.gpx_coordinates.length < 2) return;
      const sourceId = `trail-line-${trail.id}`;
      const layerId = `trail-layer-${trail.id}`;

      if (m.getSource(sourceId)) {
        m.removeLayer(layerId);
        m.removeSource(sourceId);
      }

      const coordinates = trail.gpx_coordinates.map((p) => [p.lng, p.lat]);
      const color = DIFFICULTY_COLORS[trail.difficulty] || "#3b82f6";

      m.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });

      m.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": color,
          "line-width": 3,
          "line-opacity": STATUS_OPACITY[trail.video_status] || 0.5,
        },
      });
    });
  }, [trails]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="bg-gray-100 rounded-xl h-full flex items-center justify-center text-gray-500 p-8 text-center">
        <div>
          <p className="font-semibold text-lg mb-2">Map needs a Mapbox token</p>
          <p className="text-sm">Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.<br/>Get a free token at mapbox.com</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />;
}
