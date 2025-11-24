/**
 * Validation utility functions for map operations
 * Validates: Requirements 12.3
 */

import type { MapConfig } from '@/types/map';
import type { LatLngBounds } from 'leaflet';

/**
 * Validates if a zoom level is within valid range
 * @param zoom - Zoom level to validate
 * @param minZoom - Minimum allowed zoom (default: 0)
 * @param maxZoom - Maximum allowed zoom (default: 18)
 * @returns True if zoom is valid
 */
export function isValidZoom(
  zoom: number,
  minZoom: number = 0,
  maxZoom: number = 18
): boolean {
  return (
    typeof zoom === 'number' &&
    !isNaN(zoom) &&
    zoom >= minZoom &&
    zoom <= maxZoom
  );
}

/**
 * Validates if coordinate bounds are properly ordered
 * @param bounds - Array of [[minLat, minLng], [maxLat, maxLng]]
 * @returns True if bounds are valid
 */
export function isValidBounds(bounds: [[number, number], [number, number]]): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = bounds;
  
  // Check if all values are numbers
  if (
    typeof minLat !== 'number' ||
    typeof minLng !== 'number' ||
    typeof maxLat !== 'number' ||
    typeof maxLng !== 'number'
  ) {
    return false;
  }
  
  // Check if any value is NaN
  if (isNaN(minLat) || isNaN(minLng) || isNaN(maxLat) || isNaN(maxLng)) {
    return false;
  }
  
  // Check latitude bounds
  if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
    return false;
  }
  
  // Check longitude bounds
  if (minLng < -180 || minLng > 180 || maxLng < -180 || maxLng > 180) {
    return false;
  }
  
  // Check proper ordering
  if (minLat > maxLat) {
    return false;
  }
  
  // Note: We don't check minLng > maxLng because bounds can cross the antimeridian
  
  return true;
}

/**
 * Validates a coordinate pair
 * @param coord - [latitude, longitude] tuple
 * @returns True if coordinate is valid
 */
export function isValidCoordinate(coord: [number, number]): boolean {
  const [lat, lng] = coord;
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Validates map configuration options
 * @param config - Map configuration object
 * @returns Object with isValid flag and error messages
 */
export function validateMapConfig(config: Partial<MapConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validate center
  if (config.defaultCenter) {
    if (!isValidCoordinate(config.defaultCenter)) {
      errors.push('Invalid center coordinates');
    }
  }
  
  // Validate zoom levels
  if (config.defaultZoom !== undefined) {
    if (typeof config.defaultZoom !== 'number' || isNaN(config.defaultZoom)) {
      errors.push('Default zoom must be a number');
    } else if (config.defaultZoom < 0 || config.defaultZoom > 20) {
      errors.push('Default zoom must be between 0 and 20');
    }
  }
  
  if (config.minZoom !== undefined) {
    if (typeof config.minZoom !== 'number' || isNaN(config.minZoom)) {
      errors.push('Min zoom must be a number');
    } else if (config.minZoom < 0) {
      errors.push('Min zoom must be >= 0');
    }
  }
  
  if (config.maxZoom !== undefined) {
    if (typeof config.maxZoom !== 'number' || isNaN(config.maxZoom)) {
      errors.push('Max zoom must be a number');
    } else if (config.maxZoom > 20) {
      errors.push('Max zoom must be <= 20');
    }
  }
  
  // Validate zoom range
  if (
    config.minZoom !== undefined &&
    config.maxZoom !== undefined &&
    config.minZoom > config.maxZoom
  ) {
    errors.push('Min zoom must be less than or equal to max zoom');
  }
  
  // Validate default zoom is within range
  if (
    config.defaultZoom !== undefined &&
    config.minZoom !== undefined &&
    config.defaultZoom < config.minZoom
  ) {
    errors.push('Default zoom must be >= min zoom');
  }
  
  if (
    config.defaultZoom !== undefined &&
    config.maxZoom !== undefined &&
    config.defaultZoom > config.maxZoom
  ) {
    errors.push('Default zoom must be <= max zoom');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates tile layer URL
 * @param url - Tile layer URL template
 * @returns True if URL appears valid
 */
export function isValidTileUrl(url: string): boolean {
  if (typeof url !== 'string' || url.length === 0) {
    return false;
  }
  
  // Check for required placeholders
  const hasZ = url.includes('{z}');
  const hasX = url.includes('{x}');
  const hasY = url.includes('{y}');
  
  return hasZ && hasX && hasY;
}

/**
 * Validates marker position
 * @param position - [latitude, longitude] tuple
 * @returns True if position is valid
 */
export function isValidMarkerPosition(position: [number, number]): boolean {
  return isValidCoordinate(position);
}

/**
 * Clamps a zoom level to valid range
 * @param zoom - Zoom level to clamp
 * @param minZoom - Minimum allowed zoom
 * @param maxZoom - Maximum allowed zoom
 * @returns Clamped zoom level
 */
export function clampZoom(
  zoom: number,
  minZoom: number = 0,
  maxZoom: number = 18
): number {
  return Math.max(minZoom, Math.min(maxZoom, zoom));
}

/**
 * Validates Leaflet bounds object
 * @param bounds - Leaflet LatLngBounds object
 * @returns True if bounds are valid
 */
export function isValidLeafletBounds(bounds: LatLngBounds | null | undefined): boolean {
  if (!bounds) return false;
  
  try {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    return (
      isValidCoordinate([sw.lat, sw.lng]) &&
      isValidCoordinate([ne.lat, ne.lng]) &&
      sw.lat <= ne.lat
    );
  } catch {
    return false;
  }
}
