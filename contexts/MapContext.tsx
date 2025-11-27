"use client";

import { createContext, ReactNode, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapContextValue } from "@/types/map";

/**
 * Map context for managing Leaflet map instance
 */
export const MapContext = createContext<MapContextValue | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

/**
 * MapProvider component that manages map instance state
 *
 * Features:
 * - Manages Leaflet map instance state
 * - Provides setMap function for registering map instance
 * - Tracks map initialization status with isReady flag
 * - Shares map instance across all child components
 *
 * @example
 * ```tsx
 * <MapProvider>
 *   <LeafletMap />
 *   <MapControls />
 * </MapProvider>
 * ```
 */
export function MapProvider({ children }: MapProviderProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);

  // Map is ready when instance is not null
  const isReady = map !== null;

  const value: MapContextValue = {
    map,
    setMap,
    isReady,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
