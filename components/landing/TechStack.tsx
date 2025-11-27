import Image from "next/image";

/**
 * TechStack component for landing page (Server Component)
 */
export function TechStack() {
  const technologies = [
    {
      name: "Next.js 16",
      logo: "/logos/nextjs.svg",
      alt: "Next.js logo",
    },
    {
      name: "Leaflet",
      logo: "/logos/leaflet.svg",
      alt: "Leaflet logo",
    },
    {
      name: "Tailwind CSS",
      logo: "/logos/tailwind.svg",
      alt: "Tailwind CSS logo",
    },
    {
      name: "shadcn/ui",
      logo: "/logos/shadcn.svg",
      alt: "shadcn/ui logo",
    },
    {
      name: "Lucide Icons",
      logo: "/logos/lucide.svg",
      alt: "Lucide icons logo",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      <h2 className="text-center text-sm font-semibold text-white/60 uppercase tracking-wider mb-12">
        Built With
      </h2>

      <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-4 px-6 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 hover:shadow-lg group border border-white/20 backdrop-blur-sm"
          >
            <span className="text-lg sm:text-xl font-semibold text-white whitespace-nowrap">
              {tech.name}
            </span>
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Image
                src={tech.logo}
                alt={tech.alt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
