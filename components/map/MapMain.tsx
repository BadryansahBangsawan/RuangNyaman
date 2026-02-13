"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { LeafletMap } from "./LeafletMap";
import { LeafletTileLayer } from "./LeafletTileLayer";
import { LeafletGeoJSON } from "./LeafletGeoJSON";
import { MapSearchBar } from "./MapSearchBar";
import { MapTopBar } from "./MapTopBar";
import { MapTileSwitcher } from "./MapTileSwitcher";
import { MapControls } from "./MapControls";
import { MapDetailsPanel } from "./MapDetailsPanel";
import { MapMeasurementPanel } from "./MapMeasurementPanel";
import { MapContextMenu } from "./MapContextMenu";
import { MapPOIPanel } from "./MapPOIPanel";
import { useMapTileProvider } from "@/hooks/useMapTileProvider";
import { useMapContextMenu } from "@/hooks/useMapContextMenu";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { usePOIManager } from "@/hooks/usePOIManager";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import type { Polyline, Marker } from "leaflet";
import type { POICategory } from "@/types/poi";

// Memoized style object to prevent unnecessary re-renders
const GEOJSON_STYLE = {
  fillColor: "#3b82f6",
  fillOpacity: 0.2,
  color: "#2563eb",
  weight: 2,
} as const;

const LOCATION_PROMPT_KEY = "ruang-nyaman-location-prompted";

/**
 * MapMain - Main map component with theme-aware tile provider
 *
 * Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Static style object for GeoJSON
 * - Stable function references
 */
export function MapMain() {
  const [selectedCountry, setSelectedCountry] =
    useState<GeoJSON.Feature | null>(null);
  const [isMeasurementOpen, setIsMeasurementOpen] = useState(false);
  const [isPOIPanelOpen, setIsPOIPanelOpen] = useState(false);
  const [poiFilterCategory, setPOIFilterCategory] =
    useState<POICategory | null>(null);
  const [poiInitialCoords, setPOIInitialCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [poiPanelMode, setPOIPanelMode] = useState<"list" | "add">("list");
  const [isSelectingPOILocation, setIsSelectingPOILocation] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const routeLineRef = useRef<Polyline | null>(null);
  const routeStartMarkerRef = useRef<Marker | null>(null);
  const routeEndMarkerRef = useRef<Marker | null>(null);

  // Use custom hook for theme-aware tile provider management
  const { tileProvider, currentProviderId, setProviderId } =
    useMapTileProvider();

  // Context menu hook
  const {
    isOpen: isContextMenuOpen,
    position: contextMenuPosition,
    close: closeContextMenu,
  } = useMapContextMenu();

  // User markers hook
  const { addMarker } = useMapMarkers();

  // POI Manager hook
  const {
    pois,
    addPOI,
    updatePOI,
    deletePOI,
    clearAllPOIs,
    exportGeoJSON,
    importGeoJSON,
    flyToPOI,
  } = usePOIManager();

  const { locateUser, isAvailable } = useGeolocation();
  const map = useLeafletMap();

  useEffect(() => {
    if (!isAvailable) return;

    const prompted = localStorage.getItem(LOCATION_PROMPT_KEY);
    if (prompted) return;

    localStorage.setItem(LOCATION_PROMPT_KEY, "1");
    locateUser();
  }, [isAvailable, locateUser]);

  useEffect(() => {
    return () => {
      if (!map) return;
      if (routeLineRef.current && map.hasLayer(routeLineRef.current)) map.removeLayer(routeLineRef.current);
      if (routeStartMarkerRef.current && map.hasLayer(routeStartMarkerRef.current)) map.removeLayer(routeStartMarkerRef.current);
      if (routeEndMarkerRef.current && map.hasLayer(routeEndMarkerRef.current)) map.removeLayer(routeEndMarkerRef.current);
    };
  }, [map]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCountrySelect = useCallback(async (countryId: string) => {
    try {
      const response = await fetch(
        `/api/countries/${encodeURIComponent(countryId)}`
      );
      const feature = await response.json();
      setSelectedCountry(feature);
    } catch (error) {
      console.error("Error loading country GeoJSON:", error);
    }
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleMeasurementOpen = useCallback(() => {
    setIsMeasurementOpen(true);
  }, []);

  const handleMeasurementClose = useCallback(() => {
    setIsMeasurementOpen(false);
  }, []);

  // Context menu handlers
  const handleAddMarker = useCallback(
    (lat: number, lng: number) => {
      addMarker(lat, lng);
    },
    [addMarker]
  );

  const handleContextMenuMeasurement = useCallback(() => {
    setIsMeasurementOpen(true);
  }, []);

  const handleContextMenuAddPOI = useCallback((lat: number, lng: number) => {
    // Always set fresh coordinates - this ensures updates even if panel is already open
    setPOIInitialCoords({ lat, lng });
    setPOIFilterCategory(null);
    setPOIPanelMode("add");
    setIsPOIPanelOpen(true);
  }, []);

  // POI Panel handlers
  const handleOpenPOIPanel = useCallback((category?: POICategory) => {
    setPOIFilterCategory(category || null);
    setPOIInitialCoords(null);
    setPOIPanelMode("list");
    setIsPOIPanelOpen(true);
  }, []);

  const handleClosePOIPanel = useCallback(() => {
    setIsPOIPanelOpen(false);
    setIsSelectingPOILocation(false);
    setPOIPanelMode("list");
    // Reset coordinates and category after a brief delay to allow panel to close smoothly
    setTimeout(() => {
      setPOIFilterCategory(null);
      setPOIInitialCoords(null);
    }, 100);
  }, []);

  // Handle POI location selection request
  const handleRequestPOILocation = useCallback(() => {
    setIsSelectingPOILocation((prev) => !prev);
  }, []);

  // Handle clear POI coordinates
  const handleClearPOICoordinates = useCallback(() => {
    setPOIInitialCoords(null);
    setCursorCoords(null);
    setIsSelectingPOILocation(false);
  }, []);

  // Handle POI panel mode change
  const handlePOIModeChange = useCallback((mode: "list" | "add" | "edit") => {
    setPOIPanelMode(mode as "list" | "add");
  }, []);

  // Handle map click for POI location selection
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (isSelectingPOILocation) {
        setPOIInitialCoords({ lat, lng });
        setIsSelectingPOILocation(false);
        setCursorCoords(null);
      }
    },
    [isSelectingPOILocation]
  );

  // Handle map mouse move for cursor tracking
  const handleMapMouseMove = useCallback(
    (lat: number, lng: number) => {
      if (isSelectingPOILocation) {
        setCursorCoords({ lat, lng });
      }
    },
    [isSelectingPOILocation]
  );

  const handlePOIExport = useCallback(() => {
    const geojson = exportGeoJSON();
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-places-${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportGeoJSON]);

  const handlePOIImport = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const geojson = JSON.parse(text);
        const count = importGeoJSON(geojson);
        toast.success(
          `Successfully imported ${count} place${count !== 1 ? "s" : ""}!`
        );
      } catch (error) {
        console.error("Failed to import POIs:", error);
        toast.error("Failed to import file. Please check the format.");
      }
    },
    [importGeoJSON]
  );

  const handleFoursquareImport = useCallback(
    async (query: string) => {
      const res = await fetch(
        `/api/foursquare/search?q=${encodeURIComponent(query)}&limit=20`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Foursquare import failed");
      }

      const data = (await res.json()) as {
        places?: Array<{ name: string; location?: string; lat: number | null; lng: number | null }>;
      };

      const places = data.places ?? [];
      const existing = new Set(
        pois.map((p) => `${p.title.toLowerCase()}::${p.lat.toFixed(4)}::${p.lng.toFixed(4)}`)
      );

      const inferCategory = (text: string): POICategory => {
        const lower = text.toLowerCase();

        if (/(hotel|villa|resort|penginapan|homestay|hostel|inn)/.test(lower)) return "lodging";
        if (/(coffee|cafe|restaurant|food|bakery|warung|bar|dining)/.test(lower)) return "food-drink";
        if (/(beach|pantai|gunung|mount|waterfall|air terjun|hutan|forest|lake|danau|nature|park|taman)/.test(lower)) return "nature";
        if (/(mall|shop|store|pasar|market)/.test(lower)) return "shopping";
        if (/(station|terminal|airport|pelabuhan|port|bus|train|stasiun)/.test(lower)) return "transport";
        if (/(hospital|clinic|klinik|pharmacy|apotik)/.test(lower)) return "health";
        if (/(masjid|mosque|church|gereja|temple|pura|vihara)/.test(lower)) return "religion";
        if (/(school|campus|university|sekolah)/.test(lower)) return "education";
        if (/(tour|wisata|attraction|museum|landmark|monument)/.test(lower)) return "tourism";

        return "tourism";
      };

      let added = 0;

      for (const row of places) {
        if (typeof row.lat !== "number" || typeof row.lng !== "number") continue;

        const key = `${row.name.toLowerCase()}::${row.lat.toFixed(4)}::${row.lng.toFixed(4)}`;
        if (existing.has(key)) continue;

        const category = inferCategory(`${query} ${row.name} ${row.location ?? ""}`);

        addPOI(
          row.name,
          row.lat,
          row.lng,
          category,
          row.location ? `Imported from Foursquare: ${row.location}` : "Imported from Foursquare"
        );
        existing.add(key);
        added += 1;
      }

      toast.success(`Imported ${added} place${added !== 1 ? "s" : ""} from Foursquare`);
    },
    [addPOI, pois]
  );

  // Category click handler for MapTopBar
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      // Map category IDs to POI categories
      const categoryMapping: Record<string, POICategory> = {
        restaurants: "food-drink",
        hotels: "lodging",
        attractions: "tourism",
        transit: "transport",
      };

      const poiCategory = categoryMapping[categoryId.toLowerCase()];
      if (poiCategory) {
        handleOpenPOIPanel(poiCategory);
      }
    },
    [handleOpenPOIPanel]
  );

  const distanceInKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const clearRouteDecorations = useCallback(() => {
    if (!map) return;

    if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
      map.removeLayer(routeLineRef.current);
    }
    if (routeStartMarkerRef.current && map.hasLayer(routeStartMarkerRef.current)) {
      map.removeLayer(routeStartMarkerRef.current);
    }
    if (routeEndMarkerRef.current && map.hasLayer(routeEndMarkerRef.current)) {
      map.removeLayer(routeEndMarkerRef.current);
    }

    routeLineRef.current = null;
    routeStartMarkerRef.current = null;
    routeEndMarkerRef.current = null;
  }, [map]);

  const getRouteSummary = useCallback(async (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`,
        { cache: "no-store" }
      );
      if (!res.ok) return null;

      const data = (await res.json()) as {
        routes?: Array<{
          distance?: number;
          duration?: number;
          geometry?: { coordinates?: [number, number][] };
        }>;
      };

      const route = data.routes?.[0];
      if (!route?.distance || !route?.duration) return null;

      const points =
        route.geometry?.coordinates?.map(([lng, lat]) => [lat, lng] as [number, number]) ?? [];

      return {
        km: route.distance / 1000,
        minutes: Math.round(route.duration / 60),
        points,
      };
    } catch {
      return null;
    }
  }, []);

  const handlePlaceSelect = useCallback(
    async (place: { name: string; lat: number; lng: number; location?: string }) => {
      if (!map) return;
      clearRouteDecorations();
      map.flyTo([place.lat, place.lng], 16, { duration: 1.2 });

      const position = await new Promise<GeolocationPosition | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
        );
      });

      if (position) {
        const fromLat = position.coords.latitude;
        const fromLng = position.coords.longitude;
        const route = await getRouteSummary(fromLat, fromLng, place.lat, place.lng);
        if (route) {
          if (route.points.length > 1) {
            const L = await import("leaflet");
            const line = L.polyline(route.points, {
              color: "#10b981",
              weight: 5,
              opacity: 0.9,
            }).addTo(map);
            routeLineRef.current = line;

            const startMarker = L.marker([fromLat, fromLng], {
              icon: L.divIcon({
                className: "route-start-marker",
                html: '<div style="width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              }),
            })
              .addTo(map)
              .bindPopup("Lokasi kamu");

            const endMarker = L.marker([place.lat, place.lng], {
              icon: L.divIcon({
                className: "route-end-marker",
                html: '<div style="width:16px;height:16px;border-radius:9999px;background:#ef4444;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              }),
            })
              .addTo(map)
              .bindPopup(place.name);

            routeStartMarkerRef.current = startMarker;
            routeEndMarkerRef.current = endMarker;

            map.fitBounds(line.getBounds(), { padding: [40, 40] });
          }
          toast.success(`${place.name} • ${route.km.toFixed(1)} km • ${route.minutes} menit`);
          return;
        }

        const km = distanceInKm(fromLat, fromLng, place.lat, place.lng);
        toast.success(`${place.name} • ${km.toFixed(1)} km`);
        return;
      }

      toast.success(place.location ? `${place.name} • ${place.location}` : place.name);
    },
    [map, getRouteSummary, clearRouteDecorations]
  );

  const handleNearbySearch = useCallback(
    async (query: string) => {
      if (!map) return;

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        });
      }).catch(() => null);

      if (!position) {
        toast.error("Lokasi tidak tersedia. Izinkan location permission dulu.");
        return;
      }

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const res = await fetch(
        `/api/foursquare/search?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&limit=20`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        toast.error("Gagal mencari lokasi terdekat");
        return;
      }

      const data = (await res.json()) as {
        places?: Array<{ name: string; location?: string; lat: number | null; lng: number | null }>;
      };

      const candidates = (data.places ?? []).filter(
        (p): p is { name: string; location?: string; lat: number; lng: number } =>
          typeof p.lat === "number" && typeof p.lng === "number"
      );

      if (candidates.length === 0) {
        toast.error("Tidak ada hasil terdekat untuk pencarian ini.");
        return;
      }

      candidates.sort((a, b) => distanceInKm(lat, lng, a.lat, a.lng) - distanceInKm(lat, lng, b.lat, b.lng));
      const nearest = candidates[0];
      const km = distanceInKm(lat, lng, nearest.lat, nearest.lng);
      const route = await getRouteSummary(lat, lng, nearest.lat, nearest.lng);

      clearRouteDecorations();
      map.flyTo([nearest.lat, nearest.lng], 15, { duration: 1.4 });
      if (route) {
        if (route.points.length > 1) {
          const L = await import("leaflet");
          const line = L.polyline(route.points, {
            color: "#10b981",
            weight: 5,
            opacity: 0.9,
          }).addTo(map);
          routeLineRef.current = line;

          const startMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: "route-start-marker",
              html: '<div style="width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            }),
          })
            .addTo(map)
            .bindPopup("Lokasi kamu");

          const endMarker = L.marker([nearest.lat, nearest.lng], {
            icon: L.divIcon({
              className: "route-end-marker",
              html: '<div style="width:16px;height:16px;border-radius:9999px;background:#ef4444;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          })
            .addTo(map)
            .bindPopup(nearest.name);

          routeStartMarkerRef.current = startMarker;
          routeEndMarkerRef.current = endMarker;

          map.fitBounds(line.getBounds(), { padding: [40, 40] });
        }
        toast.success(`${nearest.name} • ${route.km.toFixed(1)} km • ${route.minutes} menit`);
      } else {
        toast.success(`${nearest.name} • ${km.toFixed(1)} km dari lokasimu`);
      }
    },
    [map, getRouteSummary, clearRouteDecorations]
  );

  // Memoize tile layer props to prevent unnecessary updates
  const tileLayerProps = useMemo(
    () => ({
      url: tileProvider.url,
      attribution: tileProvider.attribution,
      maxZoom: tileProvider.maxZoom,
    }),
    [tileProvider.url, tileProvider.attribution, tileProvider.maxZoom]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <LeafletMap
        className="w-full h-full"
        onClick={handleMapClick}
        onMouseMove={handleMapMouseMove}
        cursorStyle={isSelectingPOILocation ? "crosshair" : "grab"}
      >
        <LeafletTileLayer
          url={tileLayerProps.url}
          attribution={tileLayerProps.attribution}
          maxZoom={tileLayerProps.maxZoom}
        />
        <LeafletGeoJSON data={selectedCountry} style={GEOJSON_STYLE} />
      </LeafletMap>

      {/* Search Bar */}
      <MapSearchBar
        onCountrySelect={handleCountrySelect}
        selectedCountry={selectedCountry}
        onClearSelection={handleClearSelection}
        onMeasurementClick={handleMeasurementOpen}
        onPOIClick={() => handleOpenPOIPanel()}
        onNearbySearch={handleNearbySearch}
        onPlaceSelect={handlePlaceSelect}
        isPOIPanelOpen={isPOIPanelOpen}
        onClosePOIPanel={handleClosePOIPanel}
      />

      {/* Top Bar */}
      <MapTopBar onCategoryClick={handleCategoryClick} />

      {/* Tile Switcher */}
      <MapTileSwitcher
        selectedProviderId={currentProviderId}
        onProviderChange={setProviderId}
      />

      {/* Map Controls */}
      <MapControls />

      {/* Country Details Panel */}
      <MapDetailsPanel
        country={selectedCountry}
        onClose={handleClearSelection}
      />

      {/* Measurement Panel */}
      <MapMeasurementPanel
        isOpen={isMeasurementOpen}
        onClose={handleMeasurementClose}
      />

      {/* Context Menu */}
      <MapContextMenu
        isOpen={isContextMenuOpen}
        position={contextMenuPosition}
        onClose={closeContextMenu}
        onAddMarker={handleAddMarker}
        onStartMeasurement={handleContextMenuMeasurement}
        onAddPOI={handleContextMenuAddPOI}
      />

      {/* POI Panel */}
      <MapPOIPanel
        isOpen={isPOIPanelOpen}
        onClose={handleClosePOIPanel}
        pois={pois}
        filterCategory={poiFilterCategory}
        onAddPOI={addPOI}
        onUpdatePOI={updatePOI}
        onDeletePOI={deletePOI}
        onClearAll={clearAllPOIs}
        onExport={handlePOIExport}
        onImport={handlePOIImport}
        onImportFoursquare={handleFoursquareImport}
        onFlyTo={flyToPOI}
        onRequestLocation={handleRequestPOILocation}
        onClearCoordinates={handleClearPOICoordinates}
        onModeChange={handlePOIModeChange}
        isSelectingLocation={isSelectingPOILocation}
        initialLat={poiInitialCoords?.lat}
        initialLng={poiInitialCoords?.lng}
        cursorLat={cursorCoords?.lat}
        cursorLng={cursorCoords?.lng}
        mode={poiPanelMode}
      />
    </div>
  );
}
