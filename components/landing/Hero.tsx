/**
 * Hero component for landing page (Server Component)
 */
export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="scroll-m-20 border-b pb-2 text-4xl sm:text-7xl text-white font-extrabold tracking-tight first:mt-0 text-balance">
          RuangNyaman
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
          Temukan lokasi tempat wisata, coffee shop, hotel, dan berbagai tempat menarik lainnya dengan mudah.
        </p>
      </div>
    </div>
  );
}
