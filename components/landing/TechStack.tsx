'use client';

import Image from 'next/image';

/**
 * TechStack component for landing page
 * 
 * Features:
 * - Display tech stack logos (Next.js, Leaflet, Tailwind)
 * - Horizontal layout with text on left, icon on right
 * - Theme-aware styling
 * - Larger, more prominent display
 * 
 * Requirements: 3.5
 */
export function TechStack() {
  const technologies = [
    {
      name: 'Next.js 16',
      logo: '/logos/nextjs.svg',
      alt: 'Next.js logo',
    },
    {
      name: 'Leaflet',
      logo: '/logos/leaflet.svg',
      alt: 'Leaflet logo',
    },
    {
      name: 'Tailwind CSS',
      logo: '/logos/tailwind.svg',
      alt: 'Tailwind CSS logo',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-center text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-12">
        Built With
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-stretch justify-center">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:scale-105 hover:shadow-lg group border border-foreground/10"
          >
            <span className="text-lg sm:text-xl font-semibold text-foreground whitespace-nowrap">
              {tech.name}
            </span>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Image
                src={tech.logo}
                alt={tech.alt}
                fill
                className="object-contain dark:brightness-90"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
