import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Mountain icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-brand-dark rounded-2xl flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
            </svg>
          </div>
        </div>

        <p className="text-green-500 font-bold text-sm uppercase tracking-wider mb-2">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
          Trail Not Found
        </h1>
        <p className="text-gray-400 leading-relaxed mb-8">
          Looks like this path leads nowhere. The trail you&apos;re looking for
          may have been removed, renamed, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-green-500/25"
          >
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="bg-brand-dark hover:bg-brand-dark/90 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Explore Trails
          </Link>
        </div>

        <p className="text-xs text-gray-300 mt-10">
          Think this is a mistake?{" "}
          <Link href="/" className="text-green-500 hover:text-green-400 font-medium">
            Let us know
          </Link>
        </p>
      </div>
    </div>
  );
}
