'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '~/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full border border-zinc-200 dark:border-zinc-700">
      {[
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
      ].map((t) => (
        <Button
          key={t.name}
          variant={theme === t.name ? 'secondary' : 'ghost'}
          size="icon"
          className={`w-7 h-7 rounded-full transition-all ${theme === t.name ? 'shadow-sm bg-white dark:bg-zinc-900' : 'opacity-50 hover:opacity-100'}`}
          onClick={() => setTheme(t.name)}
        >
          <t.icon className="w-3.5 h-3.5" />
          <span className="sr-only">{t.name} mode</span>
        </Button>
      ))}
    </div>
  );
}
