'use client';

import {
  MapPinIcon as AddressesIcon,
  LayoutDashboardIcon as DashboardIcon,
  LogOutIcon,
  ShoppingBagIcon as OrdersIcon,
  UserIcon as ProfileIcon,
  SparklesIcon as UpgradeIcon,
  HeartIcon as WishlistIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ElementType, ReactNode } from 'react';
import { MainHeader } from '~/components/layouts/main-header';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * AccountLayout — wraps all /account/* pages.
 *
 * 'use client' — needs usePathname for active nav state.
 *
 * Desktop (≥ md):
 *   MainHeader (sticky top) + horizontal flex:
 *     - Sidebar w-60, sticky top-14, border-r
 *     - Main content flex-1
 *
 * Mobile (< md):
 *   MainHeader + scrollable main content (pb-24 to clear bottom nav)
 *   + Fixed bottom nav bar h-16
 *
 * Sidebar sections:
 *   1. User block — avatar initial + name + tier badge
 *   2. Upgrade Plan button (gold, full-width)
 *   3. Divider
 *   4. Nav links — Dashboard / Orders / Wishlist / Profile / Addresses
 *   5. Logout (bottom, destructive hover)
 *
 * Mobile bottom nav — 4 items: Shop / Explore / Account / Settings
 */

// ── Nav config ────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  Icon: ElementType;
  match?: 'exact' | 'startsWith';
}

const SIDEBAR_NAV: NavItem[] = [
  { href: '/account', label: 'Dashboard', Icon: DashboardIcon, match: 'exact' },
  { href: '/account/orders', label: 'Orders', Icon: OrdersIcon },
  { href: '/account/wishlist', label: 'Wishlist', Icon: WishlistIcon },
  { href: '/account/profile', label: 'Profile', Icon: ProfileIcon },
  { href: '/account/addresses', label: 'Addresses', Icon: AddressesIcon },
];

interface MobileNavItem {
  href: string;
  label: string;
  Icon: ElementType;
  match?: 'exact' | 'startsWith';
}

const MOBILE_NAV: MobileNavItem[] = [
  {
    href: '/',
    label: 'Shop',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    match: 'exact',
  },
  {
    href: '/catalog',
    label: 'Explore',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-1.298.27-2.532.757-3.668" />
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'Account',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: '/account/settings',
    label: 'Settings',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

// ── Sidebar NavLink ────────────────────────────────────────────────────────

function SidebarNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = item.match === 'exact' ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      data-active={isActive}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
        'font-sans text-sm font-medium transition-all duration-200 ease-out outline-none',
        'focus-visible:ring-1 focus-visible:ring-primary/40',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
      )}
    >
      {/* Gold left accent — active only */}
      {isActive && <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary" />}

      <item.Icon
        className={cn(
          'size-4 shrink-0 transition-colors duration-200',
          isActive ? 'text-primary' : 'text-outline-variant group-hover:text-outline-brand',
        )}
        strokeWidth={isActive ? 2 : 1.5}
      />

      {item.label}
    </Link>
  );
}

// ── Mobile bottom NavLink ─────────────────────────────────────────────────

function MobileNavLink({ item, pathname }: { item: MobileNavItem; pathname: string }) {
  const isActive =
    item.match === 'exact'
      ? pathname === item.href
      : item.href === '/account'
        ? pathname.startsWith('/account')
        : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 outline-none focus-visible:opacity-80"
      aria-current={isActive ? 'page' : undefined}
    >
      <item.Icon
        className={cn('size-5 transition-colors duration-200', isActive ? 'text-primary' : 'text-on-surface-variant')}
      />
      <span
        className={cn(
          'font-mono text-[9px] font-semibold uppercase tracking-wider transition-colors duration-200',
          isActive ? 'text-primary' : 'text-on-surface-variant',
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  // User mock — replace with session data when auth is wired
  const user = {
    name: 'Alex Thompson',
    initial: 'A',
    tier: 'Platinum Reference',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />

      <div className="flex flex-1">
        {/* ── Desktop Sidebar ── */}
        <aside
          aria-label="Account navigation"
          className={cn(
            'hidden md:flex',
            'w-60 shrink-0 flex-col',
            'sticky top-14 h-[calc(100vh-3.5rem)]',
            'border-r border-surface-container-high bg-background',
            'overflow-y-auto',
          )}
        >
          {/* User block */}
          <div className="flex flex-col gap-3 px-4 py-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full',
                  'border border-primary/40 bg-primary/10',
                  'font-mono text-sm font-bold text-primary',
                )}
                aria-hidden
              >
                {user.initial}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold text-on-surface">{user.name}</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">{user.tier}</p>
              </div>
            </div>

            {/* Upgrade Plan button */}
            <Button variant="gold" size="sm" className="w-full font-mono text-[10px] uppercase tracking-widest">
              <UpgradeIcon className="size-3" />
              Upgrade Plan
            </Button>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-surface-container-high" />

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
            {SIDEBAR_NAV.map((item) => (
              <SidebarNavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-surface-container-high p-3">
            <Link
              href="/auth/logout"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5',
                'font-sans text-sm text-on-surface-variant',
                'transition-all duration-200 ease-out outline-none',
                'hover:bg-status-cancelled hover:text-status-cancelled-fg',
                'focus-visible:ring-1 focus-visible:ring-status-cancelled-fg/40',
              )}
            >
              <LogOutIcon className="size-4 shrink-0" strokeWidth={1.5} />
              Log Out
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex flex-1 flex-col">
          {/* pb-24 on mobile to clear fixed bottom nav */}
          <div className="flex-1 pb-24 md:pb-0">{children}</div>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        aria-label="Account mobile navigation"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 md:hidden',
          'flex h-16 items-center justify-around',
          'border-t border-surface-container-high bg-background/95 backdrop-blur-md',
        )}
      >
        {MOBILE_NAV.map((item) => (
          <MobileNavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}
