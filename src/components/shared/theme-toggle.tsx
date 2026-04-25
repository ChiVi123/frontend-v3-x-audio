'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

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
    <div className="flex items-center gap-0.5 bg-surface-container-low p-1 rounded-full border border-border">
      {[
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
      ].map((t) => (
        <Button
          key={t.name}
          variant="ghost"
          size="icon"
          className={cn(
            'w-7 h-7 rounded-full transition-all duration-300',
            theme === t.name
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100',
          )}
          onClick={() => setTheme(t.name)}
        >
          <t.icon className="w-3.5 h-3.5" />
          <span className="sr-only">{t.name} mode</span>
        </Button>
      ))}
    </div>
  );
}
