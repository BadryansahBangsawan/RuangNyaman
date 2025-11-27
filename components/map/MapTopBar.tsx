"use client";

import {
  Utensils,
  Hotel,
  Compass,
  Bus,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapThemeSwitcher } from "./MapThemeSwitcher";

const categories = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Hotel, label: "Hotels" },
  { icon: Compass, label: "Attractions" },
  { icon: Bus, label: "Transit" },
];

/**
 * MapTopBar - Top navigation bar with category pills and user menu
 */
export function MapTopBar() {
  const router = useRouter();

  const handleCloseMaps = () => {
    router.push("/");
  };

  return (
    <div className="absolute left-4 right-4 top-4 flex items-center gap-2 z-[1000]">
      {/* Spacer for search bar */}
      <div className="w-[360px]" />

      {/* Category Pills */}
      <div className="hidden lg:flex items-center gap-2 overflow-x-auto pointer-events-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Right side icons */}
      <div className="hidden sm:flex ml-auto items-center gap-2 pointer-events-auto">
        {/* Theme Switcher */}
        <MapThemeSwitcher />

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-semibold text-sm">
                W
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-[1100]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Welly Wahyudi
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  welly@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Github</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleCloseMaps}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Close Maps</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
