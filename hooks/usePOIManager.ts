'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLeafletMap } from './useLeafletMap';
import type { POI, POIGeoJSON, POICategory } from '@/types/poi';
import { getCategoryColor } from '@/constants/poi-categories';
import type { Marker } from 'leaflet';

const STORAGE_KEY = 'ruang-nyaman-pois';

/**
 * Hook for managing POIs (Points of Interest)
 * 
 * Features:
 * - CRUD operations for POIs
 * - LocalStorage persistence
 * - GeoJSON import/export
 * - Map marker rendering with category colors
 * - Proper cleanup on unmount
 * 
 * @returns Object with POI management functions and state
 */
export function usePOIManager() {
  const map = useLeafletMap();
  const [pois, setPOIs] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  /**
   * Load POIs from localStorage
   */
  const loadPOIs = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as POI[];
        setPOIs(parsed);
      }
    } catch (error) {
      console.error('Failed to load POIs from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save POIs to localStorage
   */
  const savePOIs = useCallback((poisToSave: POI[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(poisToSave));
    } catch (error) {
      console.error('Failed to save POIs to localStorage:', error);
    }
  }, []);

  /**
   * Generate unique POI ID
   */
  const generateId = useCallback(() => {
    return `poi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Create marker for POI
   */
  const createMarker = useCallback(async (poi: POI) => {
    if (!map) return null;

    const L = await import('leaflet');
    const color = getCategoryColor(poi.category);

    const marker = L.marker([poi.lat, poi.lng], {
      icon: L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              font-size: 14px;
            ">📍</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    }).addTo(map);

    // Add popup
    const popupContent = `
      <div style="min-width: 150px;">
        <div style="font-weight: 600; margin-bottom: 4px;">${poi.title}</div>
        ${poi.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${poi.description}</div>` : ''}
        <div style="font-size: 11px; color: #999;">${poi.lat.toFixed(6)}, ${poi.lng.toFixed(6)}</div>
      </div>
    `;
    marker.bindPopup(popupContent);

    return marker;
  }, [map]);

  /**
   * Render all POI markers on map
   */
  const renderMarkers = useCallback(async () => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current.clear();

    // Create new markers
    for (const poi of pois) {
      const marker = await createMarker(poi);
      if (marker) {
        markersRef.current.set(poi.id, marker);
      }
    }
  }, [map, pois, createMarker]);

  /**
   * Add new POI
   */
  const addPOI = useCallback((
    title: string,
    lat: number,
    lng: number,
    category: POICategory,
    description?: string
  ): POI => {
    const now = Date.now();
    const newPOI: POI = {
      id: generateId(),
      title,
      description,
      lat,
      lng,
      category,
      createdAt: now,
      updatedAt: now,
    };

    setPOIs((prev) => {
      const updated = [...prev, newPOI];
      savePOIs(updated);
      return updated;
    });

    return newPOI;
  }, [generateId, savePOIs]);

  /**
   * Update existing POI
   */
  const updatePOI = useCallback((
    id: string,
    updates: Partial<Omit<POI, 'id' | 'createdAt'>>
  ) => {
    setPOIs((prev) => {
      const updated = prev.map((poi) =>
        poi.id === id
          ? { ...poi, ...updates, updatedAt: Date.now() }
          : poi
      );
      savePOIs(updated);
      return updated;
    });
  }, [savePOIs]);

  /**
   * Delete POI
   */
  const deletePOI = useCallback((id: string) => {
    setPOIs((prev) => {
      const updated = prev.filter((poi) => poi.id !== id);
      savePOIs(updated);
      return updated;
    });

    // Remove marker
    const marker = markersRef.current.get(id);
    if (marker && map?.hasLayer(marker)) {
      map.removeLayer(marker);
    }
    markersRef.current.delete(id);
  }, [map, savePOIs]);

  /**
   * Clear all POIs
   */
  const clearAllPOIs = useCallback(() => {
    setPOIs([]);
    savePOIs([]);

    // Clear all markers
    markersRef.current.forEach((marker) => {
      if (map?.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current.clear();
  }, [map, savePOIs]);

  /**
   * Get POIs by category
   */
  const getPOIsByCategory = useCallback((category: POICategory): POI[] => {
    return pois.filter((poi) => poi.category === category);
  }, [pois]);

  /**
   * Export POIs as GeoJSON
   */
  const exportGeoJSON = useCallback((): POIGeoJSON => {
    return {
      type: 'FeatureCollection',
      features: pois.map((poi) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [poi.lng, poi.lat],
        },
        properties: {
          id: poi.id,
          title: poi.title,
          description: poi.description,
          category: poi.category,
          createdAt: poi.createdAt,
          updatedAt: poi.updatedAt,
        },
      })),
    };
  }, [pois]);

  /**
   * Import POIs from GeoJSON
   */
  const importGeoJSON = useCallback((geojson: POIGeoJSON) => {
    try {
      const importedPOIs: POI[] = geojson.features.map((feature) => ({
        id: feature.properties.id || generateId(),
        title: feature.properties.title,
        description: feature.properties.description,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        category: feature.properties.category,
        createdAt: feature.properties.createdAt || Date.now(),
        updatedAt: feature.properties.updatedAt || Date.now(),
      }));

      setPOIs((prev) => {
        const updated = [...prev, ...importedPOIs];
        savePOIs(updated);
        return updated;
      });

      return importedPOIs.length;
    } catch (error) {
      console.error('Failed to import GeoJSON:', error);
      throw new Error('Invalid GeoJSON format');
    }
  }, [generateId, savePOIs]);

  /**
   * Fly to POI location
   */
  const flyToPOI = useCallback((poi: POI) => {
    if (!map) return;
    map.flyTo([poi.lat, poi.lng], 16, {
      duration: 1.5,
    });

    // Open popup if marker exists
    const marker = markersRef.current.get(poi.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 1500);
    }
  }, [map]);

  // Load POIs on mount
  useEffect(() => {
    loadPOIs();
  }, [loadPOIs]);

  // Render markers when POIs or map changes
  useEffect(() => {
    if (!isLoading) {
      renderMarkers();
    }
  }, [pois, map, isLoading, renderMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      markers.forEach((marker) => {
        if (map?.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
      markers.clear();
    };
  }, [map]);

  return {
    pois,
    isLoading,
    addPOI,
    updatePOI,
    deletePOI,
    clearAllPOIs,
    getPOIsByCategory,
    exportGeoJSON,
    importGeoJSON,
    flyToPOI,
    poiCount: pois.length,
  };
}
