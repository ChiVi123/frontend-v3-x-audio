import {
  BarChart3Icon as AnalyticsIcon,
  UsersIcon as CustomersIcon,
  LogOutIcon as LogoutIcon,
  ShoppingCartIcon as OrdersIcon,
  LayoutDashboardIcon as OverviewIcon,
  BoxIcon as ProductsIcon,
  SettingsIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ElementType } from 'react';
import { cn } from '~/lib/utils';

/**
 * AdminSidebar — Fixed left navigation for admin layout
 *
 * Matches admin_dashboard.png and admin_add_product.png.
 * Server Component — no 'use client' directive.
 * Active state driven by pathname prop from a thin client wrapper
 * that calls usePathname().
 *
 * Icons renamed per context with Icon suffix.
 */

// ── Nav config — keyed by href (stable, unique) ───────────────────────────

interface NavItem {
  href: string;
  label: string;
  Icon: ElementType;
  match?: 'exact' | 'startsWith';
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Overview', Icon: OverviewIcon, match: 'exact' },
  { href: '/admin/orders', label: 'Orders', Icon: OrdersIcon },
  { href: '/admin/products', label: 'Products', Icon: ProductsIcon },
  { href: '/admin/customers', label: 'Customers', Icon: CustomersIcon },
  { href: '/admin/analytics', label: 'Analytics', Icon: AnalyticsIcon },
  { href: '/admin/settings', label: 'Settings', Icon: SettingsIcon },
];

// ── Sub-component ─────────────────────────────────────────────────────────

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
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
      {/* Gold left border accent — active only */}
      {isActive && <span aria-hidden className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary" />}

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

// ── Main component ────────────────────────────────────────────────────────

interface AdminSidebarProps {
  pathname?: string;
  user?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  className?: string;
}

function AdminSidebar({ pathname = '', user, className }: AdminSidebarProps) {
  const isActive = (item: NavItem) =>
    item.match === 'exact' ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      data-slot="admin-sidebar"
      className={cn(
        'flex h-screen w-60 flex-col border-r border-surface-container-high bg-background',
        'sticky top-0 shrink-0',
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-surface-container-high px-5">
        <Link href="/admin" className="flex flex-col outline-none focus-visible:opacity-80">
          <span className="font-heading text-xl font-bold italic leading-tight tracking-tight text-primary">
            V3-X Admin
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-outline-variant">System Control</span>
        </Link>
      </div>

      {/* Nav — keyed by href (stable, unique) */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item)} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="flex flex-col gap-1 border-t border-surface-container-high p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            {user.avatarUrl ? (
              <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-outline-variant">
                <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
              </div>
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-xs font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-on-surface">{user.name}</p>
              <p className="truncate font-mono text-[9px] uppercase tracking-wider text-outline-variant">{user.role}</p>
            </div>
          </div>
        )}

        <Link
          href="/auth/logout"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5',
            'font-sans text-sm text-outline-variant',
            'transition-all duration-200 ease-out',
            'hover:bg-status-cancelled hover:text-status-cancelled-fg',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-status-cancelled-fg/40',
          )}
        >
          <LogoutIcon className="size-4 shrink-0" strokeWidth={1.5} />
          Log Out
        </Link>
      </div>
    </aside>
  );
}

export { AdminSidebar };
