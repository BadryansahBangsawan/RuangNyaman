'use client';

import { useTheme } from '@/hooks/useTheme';

/**
 * Test component to verify theme system functionality
 * This can be temporarily added to a page to test the theme system
 */
export function ThemeTestComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="p-4 border rounded">
      <p>Current theme: <strong>{theme}</strong></p>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-4 py-2 bg-accent-primary text-white rounded hover:opacity-80"
      >
        Toggle Theme
      </button>
    </div>
  );
}
