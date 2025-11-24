'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Client component wrapper for ThemeProvider
 * This allows the root layout to remain a Server Component
 * Uses next-themes for proper theme management
 */
export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
