import { MapProvider } from "@/contexts/MapContext";
import { MapMain, MapErrorBoundary, MapLoadingSpinner } from "@/components/map";

/**
 * Map page component (Server Component)
 *
 * Following Next.js 16 best practices:
 * - Server Component by default for better performance and SEO
 * - Child components (MapMain, MapProvider, etc.) are Client Components
 *
 * Features:
 * - Interface peta modern
 * - Layout peta full-screen dengan integrasi Leaflet
 * - Fungsi pencarian
 * - Filter kategori
 * - Kontrol layer dan zoom
 * - Kontrol navigasi
 * - Error boundary untuk penanganan error yang elegan
 * - Loading spinner saat inisialisasi
 * - Desain responsif
 *
 * Halaman ini menampilkan komponen MapMain yang menggabungkan fungsionalitas
 * Leaflet dengan UI modern dan elegan untuk RuangNyaman.
 */
export default function MapPage() {
  return (
    <div className="relative w-full h-screen">
      <MapErrorBoundary>
        <MapProvider>
          <MapMain />
          <MapLoadingSpinner />
        </MapProvider>
      </MapErrorBoundary>
    </div>
  );
}
