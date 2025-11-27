"use client";

import { Layers, Map, Satellite, Moon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { TILE_PROVIDERS } from "@/constants/tile-providers";

interface MapLayersPanelProps {
  selectedProviderId: string;
  onProviderChange: (providerId: string) => void;
}

/**
 * MapLayersPanel - Layer switcher panel at bottom left with slide-out on hover
 * Shows OSM, Satellite, Dark, and More options
 */
export function MapLayersPanel({
  selectedProviderId,
  onProviderChange,
}: MapLayersPanelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Map tile providers to display options
  const layerOptions = [
    {
      id: "osm",
      label: "Map",
      icon: Map,
      preview: "from-blue-400 to-blue-600",
      provider: TILE_PROVIDERS.find((p) => p.id === "osm"),
    },
    {
      id: "satellite",
      label: "Satellite",
      icon: Satellite,
      preview: "from-green-600 to-green-800",
      provider: TILE_PROVIDERS.find((p) => p.id === "satellite"),
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      preview: "from-gray-700 to-gray-900",
      provider: TILE_PROVIDERS.find((p) => p.id === "dark"),
    },
    {
      id: "more",
      label: "More",
      icon: MoreHorizontal,
      preview: "from-gray-400 to-gray-600",
      provider: null,
    },
  ];

  const selectedLayer =
    layerOptions.find((layer) => layer.id === selectedProviderId) ||
    layerOptions[0];

  return (
    <div
      className="absolute bottom-8 left-4 flex items-center gap-2 z-[1000]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Layer Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          aria-label="Layer options"
        >
          <div
            className={`h-12 w-14 bg-gradient-to-br ${selectedLayer.preview} flex items-center justify-center`}
          >
            <selectedLayer.icon className="h-6 w-6 text-white" />
          </div>
        </button>
        <span className="rounded bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 shadow">
          <Layers className="inline h-3 w-3 mr-1" />
          {selectedLayer.label}
        </span>
      </div>

      {/* Slide-out Panel */}
      <div
        className={`flex items-center gap-2 transition-all duration-300 ease-out ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 border border-gray-200 dark:border-gray-700">
          {layerOptions.map((layer) => (
            <button
              key={layer.id}
              onClick={() => layer.provider && onProviderChange(layer.id)}
              disabled={!layer.provider}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                selectedProviderId === layer.id
                  ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              } ${!layer.provider ? "opacity-50 cursor-not-allowed" : ""}`}
              title={layer.label}
            >
              <div
                className={`h-12 w-12 rounded-lg bg-gradient-to-br ${layer.preview} flex items-center justify-center overflow-hidden shadow-sm`}
              >
                <layer.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {layer.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
