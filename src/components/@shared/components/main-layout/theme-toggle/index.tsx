'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground transition-transform hover:scale-110 active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-yellow-500" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}
