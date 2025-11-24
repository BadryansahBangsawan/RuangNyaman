/**
 * Theme-related type definitions
 */

/**
 * Theme type
 */
export type Theme = 'light' | 'dark';

/**
 * Theme context value
 */
export interface ThemeConfig {
  theme: Theme;
  toggleTheme: () => void;
}
