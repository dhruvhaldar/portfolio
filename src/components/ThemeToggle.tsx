"use client";

import { useEffect, useState } from "react";
import { ToggleButton } from "@/once-ui/components";

type Theme = 'light' | 'dark';

/**
 * A toggle button component to switch between light and dark themes.
 * Persists preference to localStorage and respects system preferences.
 */
export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  // Set theme on initial load and when theme changes
  const setTheme = (theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    setCurrentTheme(theme);
  };

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <ToggleButton
      prefixIcon={currentTheme === 'dark' ? 'sun' : 'moon'}
      selected={currentTheme === 'dark'}
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      tooltip={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={currentTheme === 'dark'}
      selected={currentTheme === 'dark'}
      variant="ghost"
      size="m"
    />
  );
};
