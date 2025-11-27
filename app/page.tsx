import Image from "next/image";
import { Hero } from "@/components/landing/Hero";
import { NavigationButtons } from "@/components/landing/NavigationButtons";
import { TechStack } from "@/components/landing/TechStack";

/**
 * Landing page component (Server Component)
 *
 * Following Next.js 16 best practices:
 * - Server Component by default for better performance
 * - Only child components that need interactivity are Client Components
 * - Image optimization with Next.js Image component
 * - Optimized for dark background with light text
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/vimal-s-GBg3jyGS-Ug-unsplash.jpg"
          alt="Map background"
          fill
          className="object-cover"
          priority
        />
        {/* Darker overlay for better text readability on dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Unsplash attribution */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-white/90">
        <div className="flex items-center gap-1 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
          <span>Photo by</span>
          <a
            href="https://unsplash.com/@vimal_s?utm_source=nextjs-leaflet&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Vimal S
          </a>
          <span>on</span>
          <a
            href="https://unsplash.com?utm_source=nextjs-leaflet&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            Unsplash
          </a>
        </div>
      </div>

      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen">
        {/* Hero section */}
        <section className="w-full">
          <Hero />
        </section>

        {/* Navigation buttons */}
        <section className="w-full py-8">
          <NavigationButtons />
        </section>

        {/* Tech stack */}
        <section className="w-full py-8">
          <TechStack />
        </section>
      </main>
    </div>
  );
}
