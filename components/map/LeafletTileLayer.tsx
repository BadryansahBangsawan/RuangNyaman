'use client';

import { useEffect, useRef } from 'react';
import type { TileLayer } from 'leaflet';
import { useLeafletMap } from '@/hooks/useLeafletMap';
import type { LeafletTileLayerProps } from '@/types/components';

/**
 * LeafletTileLayer component - Manages tile layer rendering
 * 
 * This component adds a tile layer to the Leaflet map. It handles
 * tile layer updates when the URL changes and cleanup on unmount.
 * 
 * Features:
 * - Adds tile layer to map on mount
 * - Updates tile layer when URL changes
 * - Removes tile layer on unmount
 * - Supports custom attribution and zoom levels
 * - Handles subdomains for load balancing
 * 
 * @example
 * ```tsx
 * <LeafletTileLayer
 *   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 *   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 *   maxZoom={19}
 * />
 * ```
 */
export function LeafletTileLayer({
  url,
  attribution = '',
  maxZoom = 19,
  subdomains = ['a', 'b', 'c'],
}: LeafletTileLayerProps) {
  const map = useLeafletMap();
  const tileLayerRef = useRef<TileLayer | null>(null);

  useEffect(() => {
    // Wait for map to be ready
    if (!map) {
      return;
    }

    // Validate tile URL
    if (!url || typeof url !== 'string') {
      console.error('Invalid tile layer URL:', url);
      return;
    }

    // Dynamically import Leaflet
    import('leaflet')
      .then((L) => {
        if (!map) {
          return;
        }

        try {
          // Remove existing tile layer if it exists
          if (tileLayerRef.current) {
            tileLayerRef.current.remove();
          }

          // Create and add new tile layer
          const tileLayer = L.tileLayer(url, {
            attribution,
            maxZoom,
            subdomains,
          });

          // Add error handling for tile loading
          tileLayer.on('tileerror', (error) => {
            console.error('Tile loading error:', error);
          });

          tileLayer.addTo(map);
          tileLayerRef.current = tileLayer;
        } catch (error) {
          console.error('Failed to add tile layer:', error);
        }
      })
      .catch((error) => {
        console.error('Failed to load Leaflet library:', error);
      });

    // Cleanup function
    return () => {
      if (tileLayerRef.current) {
        try {
          tileLayerRef.current.remove();
          tileLayerRef.current = null;
        } catch (error) {
          console.error('Error removing tile layer:', error);
        }
      }
    };
  }, [map, url, attribution, maxZoom, subdomains]);

  // This component doesn't render anything visible
  return null;
}
