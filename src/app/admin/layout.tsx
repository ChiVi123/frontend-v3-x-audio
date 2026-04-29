'use client';

import { BellIcon, MenuIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AdminSidebar } from '~/components/layouts/admin-sidebar';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * AdminLayout — wraps all /admin/* pages.
 *
 * 'use client' — needs usePathname to pass active route to AdminSidebar.
 *
 * Structure:
 *   - AdminSidebar (fixed left, w-60, full height) — already built
 *   - Right side: flex-col
 *     - TopBar (sticky, h-14) — breadcrumb + search + notifications + avatar
 *     - Main content (flex-1, scrollable)
 *
 * Mobile: Sidebar hidden, hamburger opens it as overlay (sheet pattern).
 * Desktop (≥ lg): Sidebar always visible.
 *
 * Mock user — replace with session when auth is wired.
 */

// ── Page title from pathname ───────────────────────────────────────────────

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Overview';
  const segment = pathname.split('/').filter(Boolean).at(1);
  if (!segment) return 'Admin';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

// ── TopBar ────────────────────────────────────────────────────────────────

function AdminTopBar({ pathname, onMenuClick }: { pathname: string; onMenuClick: () => void }) {
  const title = getPageTitle(pathname);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center justify-between',
        'border-b border-surface-container-high bg-background/95 backdrop-blur-md',
        'px-4 md:px-6',
      )}
    >
      {/* Left — hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-on-surface-variant"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MenuIcon className="size-4" />
        </Button>

        {/* Page title */}
        <div className="flex items-center gap-2">
          {/* Breadcrumb prefix — desktop */}
          <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant md:inline">
            Admin
          </span>
          <span className="hidden text-outline-variant md:inline">/</span>
          <h1 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-on-surface">{title}</h1>
        </div>
      </div>

      {/* Right — search + notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Search — desktop */}
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search admin"
            className={cn(
              'h-8 w-48 rounded-lg border border-surface-container-high bg-surface-container-low',
              'pl-8 pr-3 font-sans text-xs text-on-surface placeholder:text-outline-brand',
              'transition-all duration-200 outline-none',
              'focus:border-primary/60 focus:w-64 focus:ring-2 focus:ring-primary/20',
            )}
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-on-surface-variant hover:text-on-surface"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" strokeWidth={1.5} />
          {/* Unread dot */}
          <span aria-hidden className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </Button>

        {/* Avatar */}
        <Link
          href="/admin/settings"
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full',
            'border border-primary/40 bg-primary/10',
            'font-mono text-xs font-bold text-primary',
            'transition-colors duration-200 hover:bg-primary/20',
          )}
          aria-label="Admin profile"
        >
          A
        </Link>
      </div>
    </header>
  );
}

// ── Mobile overlay sidebar ────────────────────────────────────────────────

function MobileSidebarOverlay({ open, pathname, onClose }: { open: boolean; pathname: string; onClose: () => void }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div aria-hidden className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      {/* Sidebar panel — slides in from left */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 lg:hidden',
          'translate-x-0 transition-transform duration-300 ease-out',
        )}
      >
        <AdminSidebar
          pathname={pathname}
          user={{ name: 'Alex Thompson', role: 'Super Admin' }}
          className="shadow-2xl"
        />
      </div>
    </>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar — always visible on lg+ */}
      <div className="hidden lg:block">
        <AdminSidebar pathname={pathname} user={{ name: 'Alex Thompson', role: 'Super Admin' }} />
      </div>

      {/* Mobile Sidebar overlay */}
      <MobileSidebarOverlay open={mobileNavOpen} pathname={pathname} onClose={() => setMobileNavOpen(false)} />

      {/* Right side — top bar + content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar pathname={pathname} onMenuClick={() => setMobileNavOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
