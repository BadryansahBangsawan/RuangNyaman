"use client";

import { useContext } from "react";
import { MapContext } from "@/contexts/MapContext";

/**
 * MapLoadingSpinner component - Loading overlay during map initialization
 *
 * This component displays a loading spinner while the map is initializing.
 * It automatically fades out when the map is ready.
 *
 * Features:
 * - Centered loading spinner with backdrop
 * - Smooth fade-out transition when ready
 * - Modern animated ring design
 * - Gradient colors matching theme
 * - Informative loading text
 *
 * @example
 * ```tsx
 * <div className="relative w-full h-screen">
 *   <MapProvider>
 *     <LeafletMap>
 *       <LeafletTileLayer url={tileUrl} />
 *     </LeafletMap>
 *     <MapLoadingSpinner />
 *   </MapProvider>
 * </div>
 * ```
 */
export function MapLoadingSpinner() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("MapLoadingSpinner must be used within a MapProvider");
  }

  const { isReady } = context;

  // Don't render if map is ready
  if (isReady) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-40 animate-in fade-in-0">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-700 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-l-blue-500 rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
          Loading map...
        </p>
      </div>
    </div>
  );
}
