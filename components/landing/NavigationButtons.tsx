'use client';

import Link from 'next/link';

/**
 * Navigation buttons for landing page
 * 
 * Features:
 * - "Go to Map" button with Next.js Link
 * - "GitHub" button with external link
 * - Hover effects and transitions
 * - Responsive layout
 * - Icons for visual enhancement
 * 
 * Requirements: 3.2, 3.3, 3.4
 */
export function NavigationButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-2xl mx-auto px-4">
      {/* Go to Map button */}
      <Link
        href="/map"
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-lg rounded-full bg-accent-primary text-white font-semibold transition-all duration-200 hover:bg-accent-primary/90 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z"
            clipRule="evenodd"
          />
        </svg>
        Go to Map
      </Link>
      
      {/* GitHub button */}
      <a
        href="https://github.com/yourusername/nextjs-leaflet-starter"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-lg rounded-full border-2 border-foreground/20 text-foreground font-semibold transition-all duration-200 hover:border-foreground/40 hover:bg-foreground/5 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </a>
    </div>
  );
}
