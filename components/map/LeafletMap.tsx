'use client';

import { useEffect, useRef, useContext } from 'react';
import type { Map as LeafletMapInstance } from 'leaflet';
import { MapContext } from '@/contexts/MapContext';
import { DEFAULT_MAP_CONFIG } from '@/constants/map-config';
import type { LeafletMapProps } from '@/types/components';

/**
 * LeafletMap component - Core map wrapper that initializes Leaflet
 * 
 * This component creates a map container and initializes a Leaflet map instance.
 * It registers the map with MapContext so other components can access it.
 * 
 * Features:
 * - Initializes Leaflet map with configurable options
 * - Registers map instance with MapContext
 * - Handles cleanup on unmount to prevent memory leaks
 * - Supports custom center, zoom, and zoom bounds
 * 
 * @example
 * ```tsx
 * <MapProvider>
 *   <LeafletMap center={[51.505, -0.09]} zoom={13}>
 *     <LeafletTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
 *   </LeafletMap>
 * </MapProvider>
 * ```
 */
export function LeafletMap({
  center = DEFAULT_MAP_CONFIG.defaultCenter,
  zoom = DEFAULT_MAP_CONFIG.defaultZoom,
  minZoom = DEFAULT_MAP_CONFIG.minZoom,
  maxZoom = DEFAULT_MAP_CONFIG.maxZoom,
  className = '',
  children,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const context = useContext(MapContext);

  if (context === undefined) {
    throw new Error('LeafletMap must be used within a MapProvider');
  }

  const { setMap } = context;

  useEffect(() => {
    // Don't initialize if container is missing or map already exists
    if (!containerRef.current || mapRef.current) {
      return;
    }

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      // Initialize Leaflet map
      const map = L.map(containerRef.current, {
        center,
        zoom,
        minZoom,
        maxZoom,
        zoomControl: DEFAULT_MAP_CONFIG.zoomControl,
        attributionControl: DEFAULT_MAP_CONFIG.attributionControl,
      });

      // Store map reference
      mapRef.current = map;

      // Register map with context
      setMap(map);
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
      }
    };
  }, []); // Empty dependency array - only initialize once

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      data-testid="leaflet-map-container"
    />
  );
}
