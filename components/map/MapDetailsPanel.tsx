"use client";

import { X, Navigation, Bookmark, MapPin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Drawer } from "vaul";

interface MapDetailsPanelProps {
  country: GeoJSON.Feature | null;
  onClose: () => void;
}

/**
 * MapDetailsPanel - Shows country information
 * Desktop: Side panel on the left
 * Mobile: Bottom drawer
 */
export function MapDetailsPanel({ country, onClose }: MapDetailsPanelProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const snapPoints = [0.3, 0.6, 1];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch additional country info from REST Countries API
  useEffect(() => {
    const isoCode = country?.properties?.ISO_A2;
    if (!isoCode) return;

    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${isoCode}`
        );
        const data = await response.json();
        setCountryInfo(data[0]);
      } catch (error) {
        console.error("Error fetching country info:", error);
      }
    };

    fetchCountryInfo();
  }, [country]);

  if (!country) return null;

  const countryName = country.properties?.NAME || "Unknown";
  const countryCode = country.properties?.ISO_A3 || "";

  const content = (
    <div className="flex flex-col h-full">
      {/* Header Image - Hidden on mobile */}
      {!isMobile && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
          {/* Background landscape image */}
          <Image
            src="/vecteezy_village-and-mountains-landscape-illustration_11871677-1.jpg"
            alt="Landscape"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

          {/* Country name overlay */}
          <div className="absolute bottom-4 left-6 right-6 z-20">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {countryName}
            </h2>
            {countryCode && (
              <p className="text-sm text-white/90 mt-1 drop-shadow">
                {countryCode}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content - Custom thin scrollbar */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-thin">
        {/* Country Name - Only show on mobile since desktop has it in header */}
        {isMobile && (
          <div className="px-6 py-4 border-b dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {countryName}
            </h2>
            {countryCode && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {countryCode}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 border-b dark:border-gray-800">
          <div className="grid grid-cols-4 gap-2">
            <button className="flex flex-col items-center gap-1.5 p-2 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors">
              <Navigation className="h-5 w-5 text-white" />
              <span className="text-[10px] font-medium text-white leading-tight">
                Directions
              </span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <Bookmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 leading-tight">
                Save
              </span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 leading-tight">
                Nearby
              </span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 leading-tight">
                Share
              </span>
            </button>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick facts
          </h3>
          {countryInfo ? (
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>
                {countryInfo.name?.official || countryName} is a country
                {countryInfo.region && ` in ${countryInfo.region}`}
                {countryInfo.subregion && `, ${countryInfo.subregion}`}.
                {countryInfo.capital?.[0] &&
                  ` The capital is ${countryInfo.capital[0]}.`}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {countryInfo.population && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Population
                    </p>
                    <p className="font-medium">
                      {countryInfo.population.toLocaleString()}
                    </p>
                  </div>
                )}
                {countryInfo.area && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Area
                    </p>
                    <p className="font-medium">
                      {countryInfo.area.toLocaleString()} km²
                    </p>
                  </div>
                )}
                {countryInfo.capital?.[0] && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Capital
                    </p>
                    <p className="font-medium">{countryInfo.capital[0]}</p>
                  </div>
                )}
                {countryInfo.currencies && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Currency
                    </p>
                    <p className="font-medium">
                      {(Object.values(countryInfo.currencies)[0] as any)?.name}
                    </p>
                  </div>
                )}
              </div>

              {countryInfo.languages && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Languages
                  </p>
                  <p className="font-medium">
                    {Object.values(countryInfo.languages).join(", ")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          )}
        </div>

        {/* Photos Section */}
        {countryInfo?.flags?.svg && (
          <div className="px-6 py-4 border-t dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Flag
            </h3>
            <div className="relative rounded-lg overflow-hidden shadow-md border">
              <img
                src={countryInfo.flags.svg}
                alt={`${countryName} flag`}
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile: Use Drawer with snap points at 50% and 100%
  if (isMobile) {
    return (
      <Drawer.Root
        open={!!country}
        onOpenChange={(open) => !open && onClose()}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 !z-[1100]" />
          <Drawer.Content className="fixed flex flex-col bg-white dark:bg-gray-900 rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] !z-[1100]">
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="flex-1 overflow-hidden">
              <Drawer.Title className="sr-only">
                {String(countryName)}
              </Drawer.Title>
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // Desktop: Side Panel
  return (
    <div
      className={`absolute top-0 left-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-[1000] transform transition-transform duration-300 ${
        country ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {content}
    </div>
  );
}
