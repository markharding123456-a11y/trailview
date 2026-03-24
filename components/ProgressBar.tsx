"use client";

export default function ProgressBar({ current, target, message }: { current: number; target: number; message: string }) {
  const pct = Math.min((current / target) * 100, 100);

  return (
    <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-brand-dark">Progress to Launch</span>
        <span className="text-sm text-gray-500">{current} / {target} trails</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: pct < 25 ? "#ef4444" : pct < 50 ? "#f59e0b" : pct < 75 ? "#3b82f6" : "#22c55e",
          }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">{message}</p>
    </div>
  );
}
