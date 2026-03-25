export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">{text}</p>
      </div>
    </div>
  );
}
