"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ProjectionData } from "@/lib/projections";

export default function RevenueProjection({ data }: { data: ProjectionData }) {
  const chartData = data.projections.map((p) => ({
    name: `Mo ${p.month}`,
    Trails: p.trails,
    Viewers: p.viewers,
    Revenue: p.revenue,
    Subscribers: p.subscribers,
  }));

  return (
    <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
      <h3 className="font-semibold text-brand-dark mb-1">12-Month Revenue Projection</h3>
      <p className="text-sm text-gray-500 mb-4">Based on your current trail count + 15 new trails/month growth</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="revenue" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <YAxis yAxisId="subs" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: unknown, name: unknown) => {
                const v = Number(value);
                return name === "Revenue" ? `$${v.toLocaleString()}` : v.toLocaleString();
              }}
            />
            <Legend />
            <Line yAxisId="revenue" type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line yAxisId="subs" type="monotone" dataKey="Subscribers" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
