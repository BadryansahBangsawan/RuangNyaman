/**
 * Component prop type definitions
 */

import type { ReactNode } from 'react';
import type { Icon as LeafletIcon } from 'leaflet';

/**
 * LeafletMap component props
 */
export interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * LeafletTileLayer component props
 */
export interface LeafletTileLayerProps {
  url: string;
  attribution?: string;
  maxZoom?: number;
  subdomains?: string[];
}

/**
 * LeafletMarker component props
 */
export interface LeafletMarkerProps {
  position: [number, number];
  icon?: LeafletIcon;
  popup?: string | ReactNode;
  draggable?: boolean;
  onDragEnd?: (position: [number, number]) => void;
}

/**
 * DockContainer component props
 */
export interface DockContainerProps {
  children: ReactNode;
  position?: 'bottom' | 'top';
  className?: string;
}

/**
 * DockButton component props
 */
export interface DockButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

/**
 * Base map option for chooser
 */
export interface BaseMapOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
  preview?: string;
}

/**
 * BaseMapChooser component props
 */
export interface BaseMapChooserProps {
  options: BaseMapOption[];
  activeId: string;
  onChange: (id: string) => void;
}
