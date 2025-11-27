"use client";

import { Plus, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useMapControls } from "@/hooks/useMapControls";
import { useState, useEffect, useCallback } from "react";

/**
 * MapControls - Map control buttons at bottom right
 * Includes: Location, Zoom In/Out, Reset View, Fullscreen
 *
 * Uses project's useMapControls hook for map interactions
 */
export function MapControls() {
  const { map, zoomIn, zoomOut, toggleFullscreen, resetView } =
    useMapControls();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle geolocation
  const handleLocate = useCallback(() => {
    if (!map) return;

    setIsLocating(true);

    map.locate({ setView: true, maxZoom: 16 });

    map.once("locationfound", (e) => {
      setIsLocating(false);
      // Add marker at user's location
      import("leaflet").then((L) => {
        L.circle(e.latlng, {
          radius: e.accuracy / 2,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.2,
        }).addTo(map);

        L.marker(e.latlng, {
          icon: L.divIcon({
            className: "custom-location-marker",
            html: `<div style="width: 16px; height: 16px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }).addTo(map);
      });
    });

    map.once("locationerror", () => {
      setIsLocating(false);
      alert(
        "Unable to find your location. Please check your browser permissions."
      );
    });
  }, [map]);

  return (
    <div className="absolute bottom-8 right-4 flex flex-col items-center gap-2 z-[1000]">
      {/* Location Button */}
      <button
        onClick={handleLocate}
        disabled={!map || isLocating}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-600 ${
          isLocating ? "animate-pulse" : ""
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Find my location"
        aria-label="Find my location"
      >
        <svg
          className={`h-5 w-5 ${
            isLocating
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-100"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="flex flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-700 shadow-lg">
        <button
          onClick={zoomIn}
          disabled={!map}
          className="flex h-9 w-9 items-center justify-center border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="h-5 w-5 text-gray-600 dark:text-gray-100" />
        </button>
        <button
          onClick={zoomOut}
          disabled={!map}
          className="flex h-9 w-9 items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="h-5 w-5 text-gray-600 dark:text-gray-100" />
        </button>
      </div>

      {/* Reset View Button */}
      <button
        onClick={resetView}
        disabled={!map}
        className="flex h-9 w-9 items-center justify-center rounded bg-white dark:bg-slate-700 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Reset view"
        aria-label="Reset view to default"
      >
        <svg
          className="h-5 w-5 text-gray-600 dark:text-gray-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="flex h-9 w-9 items-center justify-center rounded bg-white dark:bg-slate-700 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-600"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-100" />
        ) : (
          <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-100" />
        )}
      </button>
    </div>
  );
}
