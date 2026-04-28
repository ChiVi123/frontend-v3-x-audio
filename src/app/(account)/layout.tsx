'use client';

import {
  MapPinIcon as AddressesIcon,
  LayoutDashboardIcon as DashboardIcon,
  CompassIcon as ExploreIcon,
  ShoppingBagIcon as OrdersIcon,
  UserIcon as ProfileIcon,
  SettingsIcon,
  ShoppingCartIcon as ShopIcon,
  HeartIcon as WishlistIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ElementType } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  Icon: ElementType;
  match?: 'exact' | 'startsWith';
}

// ── Nav configs ───────────────────────────────────────────────────────────

// Desktop sidebar nav — matches order_history_dark_mode_desktop mockup
const SIDEBAR_NAV: NavItem[] = [
  { href: '/account', label: 'Dashboard', Icon: DashboardIcon, match: 'exact' },
  { href: '/orders', label: 'Orders', Icon: OrdersIcon },
  { href: '/account/wishlist', label: 'Wishlist', Icon: WishlistIcon },
  { href: '/account/profile', label: 'Profile', Icon: ProfileIcon },
  { href: '/account/addresses', label: 'Addresses', Icon: AddressesIcon },
];

// Mobile bottom nav — matches order_history_dark_mode_mobile mockup:
// Shop | Explore | Account (active gold) | Settings
const BOTTOM_NAV: NavItem[] = [
  { href: '/', label: 'Shop', Icon: ShopIcon },
  { href: '/catalog', label: 'Explore', Icon: ExploreIcon },
  { href: '/account', label: 'Account', Icon: ProfileIcon },
  { href: '/account/settings', label: 'Settings', Icon: SettingsIcon },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function isNavActive(item: NavItem, pathname: string): boolean {
  return item.match === 'exact' ? pathname === item.href : pathname.startsWith(item.href);
}

// ── Desktop Sidebar NavLink ───────────────────────────────────────────────

function SidebarNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
        'transition-all duration-200 ease-out outline-none',
        'focus-visible:ring-1 focus-visible:ring-primary/40',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
      )}
    >
      {/* Gold left-border accent for active item */}
      {isActive && <span aria-hidden="true" className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary" />}
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

// ── Layout ────────────────────────────────────────────────────────────────

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR — 240px fixed width
          Matches order_history_dark_mode_desktop:
          - "Premium Member" + tier label
          - Gold "Upgrade Plan" button
          - Nav items with active gold left-border
      ══════════════════════════════════════ */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-surface-container-high bg-background md:flex">
        <div className="sticky top-14 flex flex-col p-5">
          {/* User info block */}
          <div className="flex items-center gap-3 pb-4">
            {/* Avatar circle with initial */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-sm font-semibold text-on-surface-variant">
              P
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">Premium Member</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-outline-variant">
                V3-X Audiophile Tier
              </p>
            </div>
          </div>

          {/* Upgrade Plan CTA */}
          <Button
            variant="gold"
            size="sm"
            className="mb-5 w-full font-mono text-[11px] uppercase tracking-widest"
            asChild
          >
            <Link href="/account/upgrade">Upgrade Plan</Link>
          </Button>

          <div className="mb-4 h-px bg-surface-container-high" />

          {/* Sidebar navigation */}
          <nav aria-label="Account navigation" className="flex flex-col gap-0.5">
            {SIDEBAR_NAV.map((item) => (
              <SidebarNavLink key={item.href} item={item} isActive={isNavActive(item, pathname)} />
            ))}
          </nav>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
          Desktop: full height beside sidebar
          Mobile: scrollable, padded bottom for bottom nav
      ══════════════════════════════════════ */}
      <main className="flex-1 overflow-x-hidden px-4 pb-24 md:px-8 md:pb-0">{children}</main>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV BAR
          Fixed at bottom, 4 items:
          Shop | Explore | Account | Settings
          Active item: gold icon + gold label
          Matches both mobile mockups exactly
      ══════════════════════════════════════ */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-surface-container-high bg-background md:hidden"
      >
        {BOTTOM_NAV.map((item) => {
          const active = isNavActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 outline-none"
            >
              <item.Icon
                className={cn(
                  'size-5 transition-colors duration-200',
                  active ? 'text-primary' : 'text-on-surface-variant',
                )}
                strokeWidth={active ? 2 : 1.5}
              />
              <span
                className={cn(
                  'font-mono text-[9px] uppercase tracking-widest transition-colors duration-200',
                  active ? 'text-primary' : 'text-on-surface-variant',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
