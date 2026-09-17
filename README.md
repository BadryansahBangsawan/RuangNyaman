# RuangNyaman

Website untuk menemukan lokasi tempat wisata, coffee shop, hotel, dan berbagai tempat menarik lainnya. Dibangun dengan Next.js 16 dan Leaflet untuk pengalaman peta yang modern dan interaktif.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Template](https://img.shields.io/badge/Template-Use%20this%20template-brightgreen?logo=github)](https://github.com/wellywahyudi/nextjs-leaflet-starter/generate)

![Demo Screenshot](screenshot.png)

## ✨ Fitur

### Fitur Peta Utama

- **Interface Peta Modern** — UI yang inspiratif dengan animasi yang halus
- **Multiple Tile Providers** — OpenStreetMap, Satellite (Esri), dan Dark mode (CARTO)
- **Theme-Aware Basemaps** — Otomatis mengganti style peta berdasarkan tema terang/gelap
- **Dukungan GeoJSON** — Render dan style fitur geografis dengan animasi fly-to
- **Pencarian Lokasi** — Pencarian dengan keyboard navigation (↑↓ Enter Esc)
- **Kontrol Peta** — Zoom, fullscreen, geolocation, dan reset view
- **Desain Responsif** — Mobile-first dengan layout adaptif
- **Server Components** — Next.js 16 App Router dengan optimasi client boundaries

### 🆕 Manajemen POI (Point of Interest)

- **Operasi CRUD Lengkap** — Buat, baca, update, dan hapus tempat kustom
- **14 Tipe Kategori** — Makanan & Minuman, Belanja, Transportasi, Penginapan, Kesehatan, Hiburan, Alam, Layanan, Pendidikan, Agama, Bisnis, Wisata, Darurat, Utilitas
- **Interactive Location Picker** — Klik untuk memilih dengan live cursor tracking
- **Penyimpanan LocalStorage** — Tempat Anda tersimpan otomatis
- **Import/Export GeoJSON** — Bagikan dan backup tempat Anda
- **Filter Kategori** — Filter tempat berdasarkan kategori dengan marker berwarna
- **Animasi Fly-to** — Navigasi halus ke tempat yang tersimpan
- **Optimasi Mobile** — Drawer UI di mobile, side panel di desktop
- **Notifikasi Toast** — Feedback yang indah dan berwarna untuk semua aksi

### 🎯 Fitur Lanjutan

- **Context Menu** — Klik kanan untuk aksi cepat (copy koordinat, tambah marker, ukur, simpan tempat)
- **Alat Pengukuran** — Pengukuran jarak dan area dengan drawing interaktif
- **User Markers** — Tambah marker kustom di mana saja di peta
- **Tampilan Koordinat Real-time** — Tracking lat/lng langsung saat memilih lokasi
- **Dukungan Dark Mode** — Pergantian tema yang mulus dengan preferensi persisten
- **Error Boundaries** — Penanganan error yang elegan dengan fallback UI

## 🛠 Tech Stack

| Category      | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | Next.js 16.0.7 (App Router)             |
| UI            | React 19.2.1, Tailwind CSS 4, shadcn/ui |
| Maps          | Leaflet 1.9 (vanilla, no wrapper)       |
| Icons         | Lucide React                            |
| Theming       | next-themes                             |
| Notifications | Sonner (toast notifications)            |
| Drawers       | Vaul (mobile-optimized)                 |
| Language      | TypeScript 5                            |

## 🚀 Memulai

Butuh **Node.js LTS** (18+) sebelum `npm install`.

```bash
# Clone the repository
git clone https://github.com/BadryansahBangsawan/RuangNyaman.git
cd RuangNyaman

# Install dependencies
npm install

# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat halaman utama, lalu navigasi ke `/map` untuk peta interaktif.

## 📁 Project Structure

```
├── app/
│   ├── api/countries/     # Country search API
│   ├── map/               # Map page (Server Component)
│   └── page.tsx           # Landing page
├── components/
│   ├── landing/           # Hero, navigation, tech stack
│   ├── map/               # Map components (controls, layers, search)
│   └── ui/                # shadcn/ui components
├── contexts/              # MapContext, ThemeContext
├── hooks/                 # useLeafletMap, useMapControls, useMapTileProvider
├── constants/             # Map config, tile providers
└── types/                 # TypeScript definitions
```

## 🗺 Map Components

| Component             | Description                                 |
| --------------------- | ------------------------------------------- |
| `LeafletMap`          | Core map container with initialization      |
| `LeafletTileLayer`    | Dynamic tile layer switching                |
| `LeafletGeoJSON`      | GeoJSON rendering with styling              |
| `LeafletMarker`       | Custom markers with popups                  |
| `MapControls`         | Zoom, fullscreen, location, reset           |
| `MapTileSwitcher`     | Tile provider switcher with previews        |
| `MapSearchBar`        | Country search with autocomplete            |
| `MapContextMenu`      | Right-click menu for quick actions          |
| `MapPOIPanel`         | POI management with CRUD operations         |
| `MapMeasurementPanel` | Distance and area measurement tools         |
| `MapDetailsPanel`     | Country information with REST Countries API |
| `MapErrorBoundary`    | Error handling with fallback UI             |

## 🎨 Customization

### Default Map View

Edit `constants/map-config.ts`:

```typescript
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [-2.911154, 120.074263], // Indonesia
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 18,
};
```

### Add Tile Providers

Edit `constants/tile-providers.ts`:

```typescript
export const TILE_PROVIDERS: TileProvider[] = [
  {
    id: "custom",
    name: "Custom Map",
    url: "https://your-tile-server/{z}/{x}/{y}.png",
    attribution: "© Your Attribution",
    maxZoom: 19,
    category: "standard",
  },
  // ...existing providers
];
```

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wellywahyudi/nextjs-leaflet-starter)

### Manual Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow the prompts to link your project

### Environment Variables

No environment variables required for basic deployment. The app uses public GeoJSON data from the `/public/data` directory.

## 📊 Production Readiness

This starter is production-ready with:

- ✅ Error boundaries and graceful fallbacks
- ✅ Optimized bundle size with code splitting
- ✅ Memory leak prevention with proper cleanup
- ✅ Toast notifications instead of blocking alerts
- ✅ TypeScript strict mode
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Dark mode support

## 🔧 Troubleshooting

| Masalah | Solusi |
| ------- | ------ |
| `window is not defined` saat build | Pastikan komponen Leaflet di-wrap `dynamic(() => import(...), { ssr: false })` — Leaflet membutuhkan DOM browser |
| Tile layer tidak muncul di production | Tambahkan domain tile provider ke `next.config.ts` `images.remotePatterns` jika menggunakan `<Image>` |
| Peta kosong setelah hydration | Panggil `map.invalidateSize()` di dalam `useEffect` setelah container selesai di-render |
| POI tidak tersimpan setelah refresh | LocalStorage mungkin diblokir di mode incognito — gunakan fallback `sessionStorage` atau cek `window.localStorage` tersedia |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License — feel free to use this starter for personal or commercial projects.
