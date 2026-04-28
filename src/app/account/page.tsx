import { ChevronRightIcon, LogOutIcon, SettingsIcon, ShieldIcon, StarIcon, UserPenIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type OrderStatus, OrderStatusBadge } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * Account Dashboard page
 *
 * Desktop: 12-col grid — Recent Orders (7 cols) + Account Details (5 cols),
 *          then full-width Curated Wishlist (3-col grid), then action buttons row.
 * Mobile:  Stacked sections — Welcome, Recent Orders (with thumbnail), Wishlist (compact row),
 *          Account Details card, Action buttons.
 *
 * Server Component — no interactivity needed; all data is mock until API is wired.
 */

// ── Mock data ─────────────────────────────────────────────────────────────

interface RecentOrder {
  id: string;
  date: string;
  status: OrderStatus;
  productName: string;
  thumbnailSrc: string;
}

const RECENT_ORDERS: RecentOrder[] = [
  {
    id: 'VX-9921',
    date: 'Oct 12',
    status: 'delivered',
    productName: 'V3-Pro Monitor',
    thumbnailSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=96&q=80',
  },
  {
    id: 'VX-1044',
    date: 'Oct 15',
    status: 'shipped',
    productName: 'X-Ternal DAC',
    thumbnailSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=96&q=80',
  },
  {
    id: 'VX-2101',
    date: 'Oct 18',
    status: 'processing',
    productName: 'Precision Cable 3m',
    thumbnailSrc: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=96&q=80',
  },
];

interface WishlistPreviewItem {
  id: string;
  name: string;
  series: string;
  price: number;
  imageSrc: string;
  specs: string[];
}

const WISHLIST_PREVIEW: WishlistPreviewItem[] = [
  {
    id: 'ref-z1',
    name: 'Reference Z-1',
    series: 'Reference Series',
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
    specs: ['32Ω', 'Hi-Res'],
  },
  {
    id: 'condenser-x',
    name: 'Condenser Studio-X',
    series: 'Studio Pro',
    price: 849,
    imageSrc: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
    specs: ['XLR'],
  },
  {
    id: 'analog-mix',
    name: 'Analog Mixer',
    series: 'Analog Core',
    price: 2450,
    imageSrc: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
    specs: ['Tubed'],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

/** Desktop order row */
function DesktopOrderRow({ order }: { order: RecentOrder }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className={cn(
        'flex items-center justify-between rounded-lg border border-surface-container-high bg-surface-container-low px-4 py-3',
        'transition-colors duration-200 hover:border-primary/30',
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-on-surface">Order #{order.id}</span>
        <span className="font-mono text-[10px] text-on-surface-variant">{order.date}, 2024</span>
      </div>
      <div className="flex items-center gap-3">
        <OrderStatusBadge status={order.status} dot size="sm" />
        <ChevronRightIcon className="size-4 text-outline-variant" />
      </div>
    </Link>
  );
}

/** Mobile order row — has thumbnail */
function MobileOrderRow({ order }: { order: RecentOrder }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center gap-3 rounded-lg border border-surface-container-high bg-surface-container p-3"
    >
      {/* Thumbnail */}
      <div className="relative size-12 shrink-0 overflow-hidden rounded border border-surface-container-high bg-surface-container-low">
        <Image src={order.thumbnailSrc} alt={order.productName} fill sizes="48px" className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-sm font-medium text-on-surface">{order.productName}</span>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
        <span className="font-mono text-[10px] text-on-surface-variant">
          Order #{order.id} • {order.date}
        </span>
      </div>
    </Link>
  );
}

/** Wishlist preview card — Desktop 3-col grid */
function WishlistCard({ item }: { item: WishlistPreviewItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-high transition-colors duration-200 hover:border-primary/50">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        <Image
          src={item.imageSrc}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
        {/* Filled heart overlay */}
        <div className="absolute right-3 top-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm">
            <svg className="size-4 fill-primary text-primary" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
          {item.series}
        </span>
        <h3 className="font-heading text-lg font-medium text-on-surface">{item.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-base font-bold text-on-surface">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(
              item.price,
            )}
          </span>
          <div className="flex gap-1">
            {item.specs.map((s) => (
              <SpecChip key={s} label={s} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Compact wishlist row for mobile */
function MobileWishlistRow({ item }: { item: WishlistPreviewItem }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-container-high bg-surface-container p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded border border-surface-container-high bg-surface-container-low">
        <Image src={item.imageSrc} alt={item.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <h3 className="truncate text-sm font-medium text-on-surface">{item.name}</h3>
        <div className="flex flex-wrap gap-1">
          {item.specs.map((s) => (
            <SpecChip key={s} label={s} size="sm" />
          ))}
        </div>
        <span className="font-mono text-sm font-bold text-primary">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(
            item.price,
          )}
        </span>
      </div>
      <svg className="size-5 shrink-0 fill-primary text-primary" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AccountDashboardPage() {
  return (
    <main className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:py-12 pb-24 md:pb-10">
      {/* ── Welcome ── */}
      <section className="mb-8 md:mb-10">
        <h1 className="font-heading text-4xl font-normal text-on-surface md:text-5xl lg:text-[clamp(2.5rem,5vw,4rem)]">
          Welcome back, Alex
        </h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant md:text-sm">
          Curating your precision audio journey.
        </p>
      </section>

      {/* ── Mobile layout ── */}
      <div className="flex flex-col gap-8 md:hidden">
        {/* Recent Orders — mobile */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-surface">
              Recent Orders
            </h2>
            <Link
              href="/orders"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All Orders
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {RECENT_ORDERS.map((order) => (
              <MobileOrderRow key={order.id} order={order} />
            ))}
          </div>
        </section>

        {/* Wishlist Preview — mobile */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-surface">Wishlist</h2>
            <Link
              href="/wishlist"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All Wishlist
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {WISHLIST_PREVIEW.slice(0, 2).map((item) => (
              <MobileWishlistRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Account Details — mobile */}
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-on-surface">
            Account Details
          </h2>
          <div className="relative overflow-hidden rounded-xl border border-surface-container-high bg-surface-container p-5">
            {/* Decorative tonal blob */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-3xl"
              aria-hidden
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  Email Address
                </span>
                <span className="text-sm font-medium text-on-surface">alex.v3x@audiophile.com</span>
              </div>

              <div className="h-px bg-surface-container-high" />

              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  Default Shipping
                </span>
                <p className="text-sm font-medium leading-relaxed text-on-surface">
                  128 Studio Way, Suite 4
                  <br />
                  Brooklyn, NY 11211
                  <br />
                  United States
                </p>
              </div>

              <div className="h-px bg-surface-container-high" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Loyalty Points
                  </span>
                  <span className="font-mono text-xl font-bold text-primary">12,450 pts</span>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary">
                  <StarIcon className="size-5 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons — mobile */}
        <section className="flex flex-col gap-3 pt-2">
          <Button variant="gold" size="lg" className="w-full font-mono text-xs uppercase tracking-widest" asChild>
            <Link href="/profile">
              <UserPenIcon className="size-4" />
              Manage Profile
            </Link>
          </Button>
          <Button
            variant="ghost-neutral"
            size="lg"
            className="w-full font-mono text-xs uppercase tracking-widest"
            asChild
          >
            <Link href="/profile#security">
              <ShieldIcon className="size-4" />
              Security Settings
            </Link>
          </Button>
          <Button
            variant="ghost-neutral"
            size="lg"
            className="w-full font-mono text-xs uppercase tracking-widest text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
            asChild
          >
            <Link href="/auth/logout">
              <LogOutIcon className="size-4" />
              Logout
            </Link>
          </Button>
        </section>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden flex-col gap-8 md:flex">
        {/* Row 1: Recent Orders (7) + Account Details (5) */}
        <div className="grid grid-cols-12 gap-5">
          {/* Recent Orders */}
          <section className="col-span-7">
            <div className="flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-medium text-on-surface">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  View All Orders
                </Link>
              </div>
              <div className="flex flex-col gap-2.5">
                {RECENT_ORDERS.map((order) => (
                  <DesktopOrderRow key={order.id} order={order} />
                ))}
              </div>
            </div>
          </section>

          {/* Account Details */}
          <section className="col-span-5">
            <div className="flex h-full flex-col gap-5 rounded-xl border border-surface-container-high bg-surface-container p-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-2xl font-medium text-on-surface">Account Details</h2>
                <div className="h-1 w-10 rounded-full bg-primary" />
              </div>

              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-on-surface">alex.v@v3-xaudio.com</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Loyalty Tier
                  </span>
                  <div className="flex items-center gap-2">
                    <StarIcon className="size-4 text-primary" strokeWidth={1.5} />
                    <span className="font-mono text-sm font-bold text-primary">Platinum Reference</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Primary Shipping
                  </span>
                  <p className="text-sm leading-relaxed text-on-surface">
                    128 Studio Ave
                    <br />
                    San Francisco, CA 94103
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Row 2: Curated Wishlist — full width */}
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-2xl font-medium text-on-surface">Curated Wishlist</h2>
              <p className="text-sm text-on-surface-variant">Your upcoming studio upgrades.</p>
            </div>
            <Link
              href="/wishlist"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All Wishlist
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {WISHLIST_PREVIEW.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Row 3: Action buttons */}
        <section className="flex flex-wrap gap-3 border-t border-surface-container-high pt-6">
          <Button variant="gold" size="default" className="font-mono text-xs uppercase tracking-widest" asChild>
            <Link href="/profile">
              <UserPenIcon className="size-4" />
              Manage Profile
            </Link>
          </Button>
          <Button
            variant="ghost-neutral"
            size="default"
            className="font-mono text-xs uppercase tracking-widest"
            asChild
          >
            <Link href="/profile#security">
              <SettingsIcon className="size-4" />
              Security Settings
            </Link>
          </Button>
          <Button
            variant="ghost-neutral"
            size="default"
            className="font-mono text-xs uppercase tracking-widest text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
            asChild
          >
            <Link href="/auth/logout">
              <LogOutIcon className="size-4" />
              Logout
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
