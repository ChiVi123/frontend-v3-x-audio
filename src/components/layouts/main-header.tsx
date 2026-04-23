import { Button } from '~/components/ui/button';
import { ThemeToggle } from '~/components/shared/theme-toggle';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold tracking-tighter uppercase italic">V3-X Audio</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium tracking-tight uppercase">
          <a href="#" className="hover:text-zinc-500 transition-colors">
            Collection
          </a>
          <a href="#" className="hover:text-zinc-500 transition-colors">
            Technology
          </a>
          <a href="#" className="hover:text-zinc-500 transition-colors">
            Support
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="font-mono text-xs tracking-widest uppercase">
            Cart (0)
          </Button>
          <Button size="sm" className="rounded-full px-6 uppercase text-xs tracking-widest font-bold">
            Shop Now
          </Button>
        </div>
      </div>
    </header>
  );
}
