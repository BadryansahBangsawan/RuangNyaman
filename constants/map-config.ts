/**
 * Default map configuration constants
 */

import type { MapConfig } from '@/types';

/**
 * Default map configuration
 * Center: London coordinates
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [51.505, -0.09],
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: false, // Using custom controls in dock
  attributionControl: true,
};

/**
 * Map animation duration in milliseconds
 */
export const MAP_ANIMATION_DURATION = 500;

/**
 * Default map container height
 */
export const DEFAULT_MAP_HEIGHT = '100vh';
