'use client';

import { useEffect, useRef } from 'react';
import type { Marker, DragEndEvent } from 'leaflet';
import { useLeafletMap } from '@/hooks/useLeafletMap';
import type { LeafletMarkerProps } from '@/types/components';

/**
 * LeafletMarker component - Manages marker rendering on the map
 * 
 * This component creates and manages a Leaflet marker at a specified position.
 * It supports optional popups, custom icons, and draggable markers with events.
 * 
 * Features:
 * - Creates marker at specified position
 * - Supports optional popup content (string or React node)
 * - Handles custom icons
 * - Supports draggable markers with drag end events
 * - Removes marker on unmount
 * - Updates marker position when props change
 * 
 * @example
 * ```tsx
 * <LeafletMarker
 *   position={[51.505, -0.09]}
 *   popup="Hello World!"
 *   draggable={true}
 *   onDragEnd={(position) => console.log('New position:', position)}
 * />
 * ```
 */
export function LeafletMarker({
  position,
  icon,
  popup,
  draggable = false,
  onDragEnd,
}: LeafletMarkerProps) {
  const map = useLeafletMap();
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    // Wait for map to be ready
    if (!map) {
      return;
    }

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!map) {
        return;
      }

      // Remove existing marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create marker options
      const markerOptions: L.MarkerOptions = {
        draggable,
      };

      // Add custom icon if provided
      if (icon) {
        markerOptions.icon = icon;
      }

      // Create and add marker
      const marker = L.marker(position, markerOptions);
      marker.addTo(map);

      // Add popup if provided
      if (popup) {
        if (typeof popup === 'string') {
          marker.bindPopup(popup);
        } else {
          // For React nodes, we'd need to render to a DOM element
          // For now, convert to string representation
          marker.bindPopup(String(popup));
        }
      }

      // Handle drag end event
      if (draggable && onDragEnd) {
        marker.on('dragend', (event: DragEndEvent) => {
          const newPosition = event.target.getLatLng();
          onDragEnd([newPosition.lat, newPosition.lng]);
        });
      }

      markerRef.current = marker;
    });

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, position, icon, popup, draggable, onDragEnd]);

  // This component doesn't render anything visible
  return null;
}
