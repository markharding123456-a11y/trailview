export function SkeletonText({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 ${width} animate-pulse bg-gray-200 rounded`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="aspect-[16/10] animate-pulse bg-gray-200" />
      <div className="p-4 space-y-3">
        <SkeletonText width="w-3/4" />
        <SkeletonText width="w-1/2" />
        <SkeletonText width="w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-xl animate-pulse bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-2/3" />
            <SkeletonText width="w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
