import { Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '~/components/shared/theme-toggle';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between px-6 mx-auto relative">
        <div className="flex items-center">
          <Link href="/" className="group">
            <span className="text-xl font-heading font-bold uppercase text-primary tracking-tight">V3-X Audio</span>
          </Link>
        </div>

        {/* Nav: Centered, Title Case Serif */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {[
            { label: 'Over-ear', href: '/catalog?category=over-ear' },
            { label: 'IEM', href: '/catalog?category=iem' },
            { label: 'DAC/Amp', href: '/catalog?category=amps' },
            { label: 'Gallery', href: '/#' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-heading text-foreground/90 hover:text-primary transition-all duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Gold Icons */}
        <div className="flex items-center gap-5">
          <ThemeToggle />

          <button type="button" className="text-primary hover:opacity-80 transition-opacity">
            <Search className="size-5" />
          </button>

          <button type="button" className="text-primary hover:opacity-80 transition-opacity">
            <User className="size-5" />
          </button>

          <Link href="/cart" className="text-primary hover:opacity-80 transition-opacity relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
