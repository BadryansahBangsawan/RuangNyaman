'use client';

import { Hero } from '@/components/landing/Hero';
import { NavigationButtons } from '@/components/landing/NavigationButtons';
import { TechStack } from '@/components/landing/TechStack';
import { ThemeToggle } from '@/components/landing/ThemeToggle';

/**
 * Landing page component
 * 
 * Features:
 * - Hero section with title and tagline
 * - Navigation buttons (Go to Map, GitHub)
 * - Tech stack display
 * - Theme toggle
 * - Responsive layout
 * - Semantic HTML structure
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      {/* Modern blur gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light mode gradients */}
        <div className="absolute top-0 left-0 w-full h-full dark:opacity-0 transition-opacity duration-300">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-reverse animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        
        {/* Dark mode gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-300">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob-reverse animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </div>
      
      {/* Theme toggle button */}
      <ThemeToggle />
      
      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen">
        {/* Hero section */}
        <section className="w-full">
          <Hero />
        </section>
        
        {/* Navigation buttons */}
        <section className="w-full py-8">
          <NavigationButtons />
        </section>
        
        {/* Tech stack */}
        <section className="w-full py-8">
          <TechStack />
        </section>
      </main>
    </div>
  );
}
