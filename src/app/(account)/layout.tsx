'use client';

import {
  LayoutDashboardIcon as DashboardIcon,
  ShoppingBagIcon as OrdersIcon,
  UserIcon as ProfileIcon,
  HeartIcon as WishlistIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ElementType, ReactNode } from 'react';
import { cn } from '~/lib/utils';

/**
 * AccountLayout — Customer account section layout.
 *
 * Left sidebar (240px): avatar, name, role pill, nav items.
 * Active state: gold left-border accent + gold text (same pattern as admin-sidebar.tsx).
 *
 * Client Component — owns usePathname() for active nav detection.
 * A thin client wrapper is used here per AGENTS.md: the actual content
 * (children) is always Server Component subtrees passed as props.
 */

interface NavItem {
  href: string;
  label: string;
  Icon: ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/account-dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/orders', label: 'Orders', Icon: OrdersIcon },
  { href: '/wishlist', label: 'Wishlist', Icon: WishlistIcon },
  { href: '/profile', label: 'Profile', Icon: ProfileIcon },
];

// Mock user — replace with session data from next-auth once integrated
const MOCK_USER = {
  name: 'John Doe',
  role: 'High-Fidelity Audio',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=75',
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* ── Sidebar ── */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r border-surface-container-high bg-background lg:flex">
        {/* User info */}
        <div className="flex items-center gap-3 border-b border-surface-container-high px-5 py-5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-outline-variant">
            <Image src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-on-surface">{MOCK_USER.name}</p>
            <p className="truncate font-mono text-[9px] uppercase tracking-wider text-outline-variant">
              {MOCK_USER.role}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5',
                  'font-sans text-sm font-medium transition-colors duration-200 outline-none',
                  'focus-visible:ring-1 focus-visible:ring-primary/40',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
                )}
              >
                {/* Gold left accent */}
                {active && <span aria-hidden className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary" />}
                <item.Icon
                  className={cn(
                    'size-4 shrink-0 transition-colors duration-200',
                    active ? 'text-primary' : 'text-outline-variant',
                  )}
                  strokeWidth={active ? 2 : 1.5}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
