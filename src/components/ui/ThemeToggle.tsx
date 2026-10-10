import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { sound } from '../../lib/audio';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    const saved = localStorage.getItem('kulfi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    sound.playPop(isDark ? 620 : 440);
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kulfi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kulfi_theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      data-cursor="Theme"
      aria-label={isDark ? 'Switch to Sunny Cream Mode' : 'Switch to Midnight Dessert Mode'}
      className="relative flex items-center justify-center h-9 w-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--kulfi-saffron)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300]"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#FFB347] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-[#6B5548] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
