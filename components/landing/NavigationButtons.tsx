import { MoveUpRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Navigation buttons for landing page (Server Component)
 */
export function NavigationButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-2xl mx-auto px-4">
      {/* Go to Map button */}
      <Link
        href="/map"
        className="group flex w-64 items-center justify-between rounded-full bg-amber-600/90 pl-6 pr-2 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-amber-600"
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
        <span className="text-white">Lihat Peta</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900">
          <div>
            <MoveUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </Link>

      {/* Author button */}
      <a
        href="https://www.badryansahbangsawan.my.id/en"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-64 items-center justify-between rounded-full bg-white/70 pl-6 pr-2 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image
              src="/Logo.png"
              alt="Author Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span>Author</span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900">
          <div>
            <Star className="h-4 w-4 text-white" />
          </div>
        </div>
      </a>
    </div>
  );
}
