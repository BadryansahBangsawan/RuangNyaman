import { MapProvider } from '@/contexts/MapContext';
import { LeafletMap, LeafletTileLayer, MapErrorBoundary, MapLoadingSpinner } from '@/components/map';
import { getDefaultTileProvider } from '@/constants/tile-providers';

/**
 * Map page component (Server Component)
 * 
 * Following Next.js 16 best practices:
 * - Server Component by default for better performance and SEO
 * - Child components (LeafletMap, MapProvider, etc.) are Client Components
 * - getDefaultTileProvider can run on the server
 * 
 * Features:
 * - Full-screen map layout
 * - Default OpenStreetMap tiles
 * - MapProvider context for component integration
 * - Error boundary for graceful error handling
 * - Loading spinner during initialization
 * - Responsive design
 * 
 * This page demonstrates the basic usage of the Leaflet abstraction layer.
 * The map is wrapped in MapProvider to enable access to the map instance
 * from child components. It also includes error handling and loading states
 * for a polished user experience.
 */
export default function MapPage() {
    const defaultProvider = getDefaultTileProvider();

    return (
        <div className="relative w-full h-screen">
            <MapErrorBoundary>
                <MapProvider>
                    <LeafletMap className="w-full h-full">
                        <LeafletTileLayer
                            url={defaultProvider.url}
                            attribution={defaultProvider.attribution}
                            maxZoom={defaultProvider.maxZoom}
                        />
                    </LeafletMap>
                    <MapLoadingSpinner />
                </MapProvider>
            </MapErrorBoundary>
        </div>
    );
}
