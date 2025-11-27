"use client";

import { useState, useMemo } from "react";
import { LeafletMap } from "./LeafletMap";
import { LeafletTileLayer } from "./LeafletTileLayer";
import { LeafletGeoJSON } from "./LeafletGeoJSON";
import { MapSearchBar } from "./MapSearchBar";
import { MapTopBar } from "./MapTopBar";
import { MapLayersPanel } from "./MapLayersPanel";
import { MapControls } from "./MapControls";
import {
  getTileProviderById,
  getDefaultTileProvider,
} from "@/constants/tile-providers";
import { useTheme } from "@/hooks/useTheme";

/**
 * MapMain - Main map component with theme-aware tile provider
 */
export function MapMain() {
  const [selectedCountry, setSelectedCountry] =
    useState<GeoJSON.Feature | null>(null);
  const [selectedTileProviderId, setSelectedTileProviderId] =
    useState<string>("osm");
  const { theme } = useTheme();

  // Get tile provider based on manual selection or theme
  const tileProvider = useMemo(() => {
    // If user manually selected a provider, use that
    if (selectedTileProviderId) {
      return (
        getTileProviderById(selectedTileProviderId) || getDefaultTileProvider()
      );
    }
    // Otherwise, auto-switch based on theme
    if (theme === "dark") {
      return getTileProviderById("dark") || getDefaultTileProvider();
    }
    return getDefaultTileProvider();
  }, [selectedTileProviderId, theme]);

  const handleCountrySelect = async (countryId: string) => {
    try {
      const response = await fetch(
        `/api/countries/${encodeURIComponent(countryId)}`
      );
      const feature = await response.json();
      setSelectedCountry(feature);
    } catch (error) {
      console.error("Error loading country GeoJSON:", error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <LeafletMap className="w-full h-full">
        <LeafletTileLayer
          url={tileProvider.url}
          attribution={tileProvider.attribution}
          maxZoom={tileProvider.maxZoom}
        />
        <LeafletGeoJSON
          data={selectedCountry}
          style={{
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            color: "#2563eb",
            weight: 2,
          }}
        />
      </LeafletMap>

      {/* Search Bar */}
      <MapSearchBar onCountrySelect={handleCountrySelect} />

      {/* Top Bar */}
      <MapTopBar />

      {/* Layers Panel */}
      <MapLayersPanel
        selectedProviderId={selectedTileProviderId}
        onProviderChange={setSelectedTileProviderId}
      />

      {/* Map Controls */}
      <MapControls />
    </div>
  );
}
