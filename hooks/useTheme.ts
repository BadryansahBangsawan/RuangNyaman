'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Hook to access theme from next-themes
 * 
 * @returns Theme object with current theme, setTheme, and toggle function
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the actual theme (resolve 'system' to actual theme)
  const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme: (mounted ? currentTheme : 'light') as 'light' | 'dark',
    setTheme,
    toggleTheme,
    mounted,
  };
}
