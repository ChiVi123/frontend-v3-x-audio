import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderStatusBadge } from '~/components/shared/order-status-badge';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'processing' | 'shipped' | 'cancelled';

interface OrderItem {
  name: string;
  qty: number;
  imageSrc: string;
}

interface Order {
  id: string;
  placedAt: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
}

// ── Constants ─────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'cancelled', label: 'Cancelled' },
];

// CTA label per status — matches mockup exactly
const STATUS_CTA: Record<Order['status'], string> = {
  delivered: 'View Details',
  processing: 'Track Order',
  shipped: 'Buy Again',
  cancelled: 'View Details',
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'VX-8892',
    placedAt: 'Oct 24, 2024',
    status: 'delivered',
    items: [
      {
        name: 'X-Series Studio Reference',
        qty: 1,
        imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop',
      },
    ],
    totalAmount: 1299,
  },
  {
    id: 'VX-9021',
    placedAt: 'Nov 02, 2024',
    status: 'processing',
    items: [
      {
        name: 'V-3 Master Audio Cable',
        qty: 2,
        imageSrc: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=120&h=120&fit=crop',
      },
    ],
    totalAmount: 450,
  },
  {
    id: 'VX-8755',
    placedAt: 'Oct 15, 2024',
    status: 'shipped',
    items: [
      {
        name: 'T-Series Tube Amp Mk II',
        qty: 1,
        imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop',
      },
    ],
    totalAmount: 2499,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Sub-components ────────────────────────────────────────────────────────

/**
 * Desktop filter: line-style tabs with gold underline on active
 * Matches order_history_dark_mode_desktop mockup exactly
 */
function DesktopFilterTabs({ active }: { active: FilterTab }) {
  return (
    <div className="hidden border-b border-surface-container-high md:flex">
      {FILTER_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={`/orders?filter=${tab.key}`}
            className={cn(
              'relative px-4 pb-3 font-sans text-sm font-medium transition-colors duration-200',
              isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {tab.label}
            {/* Gold underline for active tab */}
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Mobile filter: pill-style horizontal scroll, active = gold filled
 * Matches order_history_dark_mode_mobile mockup exactly
 */
function MobileFilterPills({ active }: { active: FilterTab }) {
  // Mobile labels differ slightly from desktop
  const mobileTabs = [
    { key: 'all' as FilterTab, label: 'All Orders' },
    { key: 'processing' as FilterTab, label: 'In Progress' },
    { key: 'shipped' as FilterTab, label: 'Completed' },
    { key: 'cancelled' as FilterTab, label: 'Cancelled' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
      {mobileTabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={`/orders?filter=${tab.key}`}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 font-sans text-sm font-medium transition-all duration-200',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-surface-container-high bg-transparent text-on-surface-variant',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Desktop order card — matches order_history_dark_mode_desktop_with_redlines:
 * [thumbnail 60px] [order ID + badge] [product name + qty] [Total Amount label + $X,XXX.XX] [CTA button]
 * All on one horizontal row, padding 24px, radius 12px, border #262626
 */
function DesktopOrderCard({ order }: { order: Order }) {
  const item = order.items[0];
  const ctaLabel = STATUS_CTA[order.status];

  // CTA variant: gold only for "Buy Again", ghost-neutral for others
  const ctaVariant = order.status === 'shipped' ? 'ghost-gold' : 'ghost-neutral';

  return (
    <article className="hidden rounded-xl border border-surface-container-high bg-surface-container transition-colors duration-200 hover:border-outline-variant md:flex md:items-center md:gap-5 md:px-6 md:py-6">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
        <Image src={item.imageSrc} alt={item.name} fill sizes="64px" className="object-cover" />
      </div>

      {/* Order info — grows to fill */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-base text-on-surface">Order #{order.id}</span>
          <OrderStatusBadge status={order.status} dot size="sm" />
        </div>
        <p className="font-mono text-[11px] text-on-surface-variant">Placed on {order.placedAt}</p>
        <p className="mt-0.5 text-sm text-on-surface-variant">
          {item.name}
          <span className="ml-3 text-outline-brand">Qty: {item.qty}</span>
        </p>
      </div>

      {/* Total amount — right-aligned label + value */}
      <div className="flex shrink-0 flex-col items-end gap-0.5 pr-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Total Amount</span>
        <span className="font-mono text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
      </div>

      {/* CTA */}
      <Link href={`/orders/${order.id}`} className="shrink-0">
        <Button variant={ctaVariant} size="sm" className="font-mono text-[11px] uppercase tracking-widest">
          {ctaLabel}
        </Button>
      </Link>
    </article>
  );
}

/**
 * Mobile order card — matches order_history_dark_mode_mobile_with_redlines:
 * - Order # + date top row, status badge top-right
 * - Large thumbnail + product name + specs + price
 * - 2 action buttons side by side (primary gold + secondary outline)
 * - radius 12px, padding inside
 */
function MobileOrderCard({ order }: { order: Order }) {
  const item = order.items[0];
  const ctaLabel = STATUS_CTA[order.status];

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-4 md:hidden">
      {/* Row 1: order meta + status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            Order #{order.id}
          </p>
          <p className="mt-0.5 font-heading text-lg leading-tight text-on-surface">{order.placedAt}</p>
        </div>
        <OrderStatusBadge status={order.status} dot size="sm" />
      </div>

      {/* Row 2: thumbnail + product info */}
      <div className="flex items-start gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
          <Image src={item.imageSrc} alt={item.name} fill sizes="80px" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-heading text-base leading-snug text-on-surface">{item.name}</p>
          <p className="font-mono text-xs text-on-surface-variant">Qty: {item.qty}</p>
          <p className="font-mono text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      {/* Row 3: 2 action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/orders/${order.id}`}>
          <Button variant="gold" size="sm" className="w-full font-mono text-[10px] uppercase tracking-widest">
            {ctaLabel}
          </Button>
        </Link>
        <Link href={`/orders/${order.id}`}>
          <Button variant="ghost-neutral" size="sm" className="w-full font-mono text-[10px] uppercase tracking-widest">
            Details
          </Button>
        </Link>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

interface OrdersPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { filter = 'all' } = await searchParams;
  const activeFilter = filter as FilterTab;

  const filteredOrders = activeFilter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeFilter);

  return (
    <div className="flex flex-col gap-6 py-6 md:py-8">
      {/* ── Page heading ── */}
      <h1 className="font-heading text-4xl text-on-surface md:text-5xl">Order History</h1>

      {/* ── Filters ── */}
      <DesktopFilterTabs active={activeFilter} />
      <MobileFilterPills active={activeFilter} />

      {/* ── Order list ── */}
      <div className="flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border border-surface-container-high bg-surface-container py-16">
            <p className="font-mono text-sm text-on-surface-variant">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id}>
              <DesktopOrderCard order={order} />
              <MobileOrderCard order={order} />
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-xs text-on-surface-variant">
            Showing {filteredOrders.length} of 12 orders
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost-neutral" size="icon-sm" aria-label="Previous page">
              <ChevronLeftIcon className="size-3.5" />
            </Button>
            <Button variant="ghost-neutral" size="icon-sm" aria-label="Next page">
              <ChevronRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
