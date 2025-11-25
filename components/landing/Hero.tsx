/**
 * Hero component for landing page (Server Component)
 */
export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white">
          Next.js Leaflet Starter
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
          Enterprise-grade boilerplate with vanilla Leaflet integration and modern macOS-style interface
        </p>
      </div>
    </div>
  );
}
