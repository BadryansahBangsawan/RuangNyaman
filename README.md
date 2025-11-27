# Next.js Leaflet Starter

An enterprise-grade, production-ready Next.js template with vanilla Leaflet integration. Built with TypeScript, Tailwind CSS, and a clean abstraction layer for seamless map development.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🗺️ **Leaflet Integration** - Vanilla Leaflet with SSR-safe dynamic imports
- 🎨 **Modern UI** - Glassmorphism design with light/dark theme support
- 📱 **Responsive** - Mobile-first design with touch-optimized interactions
- 🔒 **Type-Safe** - Full TypeScript support with strict mode
- 🎯 **Clean Architecture** - Abstraction layer for maintainable map components
- ⚡ **Performance** - Optimized rendering with React Server Components
- 🎭 **Error Handling** - Graceful error boundaries and loading states
- 🧩 **Extensible** - Easy to add custom controls, markers, and layers

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [Components](#components)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nextjs-leaflet.git
cd nextjs-leaflet
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) and navigate to `/map` to see the map in action.

### Basic Usage

```tsx
import { MapProvider } from "@/contexts/MapContext";
import { LeafletMap, LeafletTileLayer } from "@/components/map";

export default function MyMapPage() {
  return (
    <div className="h-screen">
      <MapProvider>
        <LeafletMap center={[51.505, -0.09]} zoom={13}>
          <LeafletTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        </LeafletMap>
      </MapProvider>
    </div>
  );
}
```

## 🏗️ Architecture

This template uses a clean abstraction layer to wrap Leaflet's imperative API with React's declarative paradigm.

### Key Design Patterns

**Context-Based State Management**

- `MapProvider` manages the Leaflet map instance
- Child components access the map via `useLeafletMap` hook
- Prevents prop drilling and enables flexible composition

**SSR-Safe Implementation**

- Dynamic imports of Leaflet library prevent SSR errors
- Client components marked with `'use client'`
- Container refs ensure DOM elements exist before initialization

**Separation of Concerns**

- `/components/map` - Map-specific React components
- `/contexts` - State management (Map, Theme)
- `/hooks` - Reusable logic (useLeafletMap, useTheme)
- `/constants` - Configuration (map settings, tile providers)
- `/types` - TypeScript type definitions
- `/lib` - Utility functions

### Component Hierarchy

```
MapProvider (Context)
└── LeafletMap (Map Container)
    ├── LeafletTileLayer (Base Map)
    ├── LeafletMarker (Markers)
    └── Custom Components (Your Extensions)
```

## 📚 Usage Examples

### Adding Markers

```tsx
import { LeafletMarker } from "@/components/map";

<LeafletMap>
  <LeafletTileLayer url={tileUrl} />
  <LeafletMarker position={[51.5, -0.09]} popup="Hello London!" />
</LeafletMap>;
```

### Draggable Markers with Callbacks

```tsx
const [position, setPosition] = useState<[number, number]>([51.5, -0.09]);

<LeafletMarker
  position={position}
  draggable={true}
  onDragEnd={(newPos) => setPosition(newPos)}
  popup={`Location: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
/>;
```

### Switching Tile Layers

```tsx
import { useState } from "react";
import { TILE_PROVIDERS } from "@/constants/tile-providers";

const [activeProvider, setActiveProvider] = useState("osm");
const provider = TILE_PROVIDERS.find((p) => p.id === activeProvider);

<LeafletMap>
  <LeafletTileLayer
    url={provider.url}
    attribution={provider.attribution}
    maxZoom={provider.maxZoom}
  />
</LeafletMap>;
```

### Error Handling

```tsx
import { MapErrorBoundary } from "@/components/map";

<MapErrorBoundary>
  <MapProvider>
    <LeafletMap>{/* Your map components */}</LeafletMap>
  </MapProvider>
</MapErrorBoundary>;
```

### Loading States

```tsx
import { MapLoadingSpinner } from "@/components/map";

<MapProvider>
  <LeafletMap>
    <LeafletTileLayer url={tileUrl} />
  </LeafletMap>
  <MapLoadingSpinner />
</MapProvider>;
```

## 🧩 Components

### Core Components

- **`LeafletMap`** - Main map container, initializes Leaflet instance
- **`LeafletTileLayer`** - Adds tile layers (OSM, satellite, etc.)
- **`LeafletMarker`** - Renders markers with optional popups
- **`MapProvider`** - Context provider for map instance sharing
- **`MapErrorBoundary`** - Error boundary for graceful error handling
- **`MapLoadingSpinner`** - Loading indicator during initialization

### Landing Page Components

- **`Hero`** - Landing page hero section
- **`NavigationButtons`** - Navigation to map and GitHub
- **`TechStack`** - Technology stack display
- **`ThemeToggle`** - Light/dark theme switcher

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed component documentation and extension guide.

## ⚙️ Configuration

### Map Configuration

Edit `constants/map-config.ts`:

```typescript
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [51.505, -0.09], // London
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: false,
  attributionControl: true,
};
```

### Tile Providers

Add custom tile providers in `constants/tile-providers.ts`:

```typescript
export const TILE_PROVIDERS: TileProvider[] = [
  {
    id: "custom",
    name: "Custom Map",
    url: "https://your-tile-server/{z}/{x}/{y}.png",
    attribution: "© Your Attribution",
    maxZoom: 19,
    category: "custom",
  },
  // ... existing providers
];
```

### Theme Customization

Modify CSS variables in `app/globals.css`:

```css
:root {
  --dock-background: rgba(255, 255, 255, 0.1);
  --dock-border: rgba(255, 255, 255, 0.2);
  /* ... more variables */
}
```

## 🛠️ Development

### Project Structure

```
nextjs-leaflet/
├── app/                  # Next.js app directory
│   ├── map/             # Map page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── map/            # Map components
│   ├── landing/        # Landing page components
│   └── providers/      # Context providers
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── constants/          # Configuration
├── types/              # TypeScript types
├── lib/                # Utilities
└── public/             # Static assets
```

### Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Adding New Components

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for step-by-step instructions on:

- Creating custom map controls
- Adding drawing tools
- Integrating geocoding
- Creating custom markers

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

This is a standard Next.js application and can be deployed to:

- Netlify
- AWS Amplify
- Google Cloud Platform
- Self-hosted with Node.js

Build the application:

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Add JSDoc comments to all components
- Include usage examples in documentation
- Test on mobile and desktop

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Leaflet](https://leafletjs.com/) - Interactive maps library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Icon library

## 📞 Support

- 📖 [Documentation](./DEVELOPER_GUIDE.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/nextjs-leaflet/issues)
- 💬 [Discussions](https://github.com/yourusername/nextjs-leaflet/discussions)

---

Made with ❤️ for the mapping community
