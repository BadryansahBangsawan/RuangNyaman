'use client';

/**
 * Hero component for landing page
 * 
 * Features:
 * - Title and tagline display
 * - Gradient background with theme support
 * - Responsive layout
 * 
 * Requirements: 3.1, 3.7
 */
export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary opacity-10 dark:opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-secondary/5 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Next.js Leaflet Starter
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto">
          Enterprise-grade boilerplate with vanilla Leaflet integration and modern macOS-style interface
        </p>
      </div>
    </div>
  );
}
