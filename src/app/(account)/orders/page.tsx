import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type OrderStatus, OrderStatusBadge } from '~/components/shared/order-status-badge';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * OrderHistoryPage — Server Component matching order_history.png.
 *
 * Layout: management console header with status filter tabs.
 * Order cards in a responsive 2-col grid.
 * Each card: order ID (strikethrough if cancelled), date, status badge,
 *   product image + name + specs + price, total amount, action CTA.
 *
 * Status filter tabs driven by searchParams (URL param) — Server-rendered,
 * no client state needed.
 *
 * TODO: Replace mock data with real API:
 *   const orders = await fetch(`${NEXT_PUBLIC_API_URL}/orders?status=${status}`).then(r => r.json());
 */

// ── Types ─────────────────────────────────────────────────────────────────

type FilterStatus = 'all' | 'pending' | 'processing' | 'completed';

interface OrderSummaryItem {
  id: string;
  name: string;
  imageSrc: string;
  qty: number;
  specs: string; // pre-formatted: "Qty: 1 • Carbon Black • 32Ω"
  price: number;
}

interface OrderSummary {
  id: string;
  displayId: string; // "#VX-8892"
  date: string;
  status: OrderStatus;
  item: OrderSummaryItem; // design shows 1 primary item per card
  totalAmount: number;
  totalNote?: string; // "incl. tax & shipping" or "Refunded"
}

// ── Mock data ─────────────────────────────────────────────────────────────

const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 'VX-8892',
    displayId: '#VX-8892',
    date: 'Oct 24, 2023',
    status: 'completed',
    item: {
      id: 'item-1',
      name: 'Aether Over-Ear Monitors',
      imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=75',
      qty: 1,
      specs: 'Qty: 1 • Carbon Black • 32Ω',
      price: 899,
    },
    totalAmount: 924.5,
    totalNote: 'incl. tax & shipping',
  },
  {
    id: 'VX-8910',
    displayId: '#VX-8910',
    date: 'Nov 02, 2023',
    status: 'processing',
    item: {
      id: 'item-2',
      name: 'Nova Tube Amplifier',
      imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=75',
      qty: 1,
      specs: 'Qty: 1 • Brushed Aluminum',
      price: 1450,
    },
    totalAmount: 1485,
    totalNote: 'incl. tax & shipping',
  },
  {
    id: 'VX-8755',
    displayId: '#VX-8755',
    date: 'Sep 15, 2023',
    status: 'cancelled',
    item: {
      id: 'item-3',
      name: 'OFC Silver Audio Cables',
      imageSrc: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=75',
      qty: 2,
      specs: 'Qty: 2 • 2.5m Pair',
      price: 120,
    },
    totalAmount: 255,
    totalNote: 'Refunded',
  },
];

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function getActionForStatus(order: OrderSummary): { label: string; variant: 'gold' | 'ghost-neutral' } {
  if (order.status === 'cancelled' || order.status === 'refunded')
    return { label: 'Reorder', variant: 'ghost-neutral' };
  if (order.status === 'processing') return { label: 'Track Order', variant: 'gold' };
  return { label: 'View Details', variant: 'ghost-neutral' };
}

// ── Sub-components ────────────────────────────────────────────────────────

function OrderCard({ order }: { order: OrderSummary }) {
  const isCancelled = order.status === 'cancelled';
  const action = getActionForStatus(order);

  return (
    <article
      data-slot="order-card"
      className="flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container"
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-surface-container-high px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'font-mono text-sm font-semibold text-on-surface',
              isCancelled && 'text-outline-variant line-through',
            )}
          >
            {order.displayId}
          </span>
          <span className="font-mono text-xs text-on-surface-variant">{order.date}</span>
        </div>
        <OrderStatusBadge status={order.status} dot size="sm" />
      </div>

      {/* Item row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-low">
          <Image src={order.item.imageSrc} alt={order.item.name} fill sizes="64px" className="object-cover" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-on-surface">{order.item.name}</p>
            <p className="mt-0.5 font-mono text-xs text-on-surface-variant">{order.item.specs}</p>
          </div>
          <span className="shrink-0 font-mono text-sm font-bold text-primary">{formatCurrency(order.item.price)}</span>
        </div>
      </div>

      {/* Card footer — total + CTA */}
      <div className="flex items-center justify-between border-t border-surface-container-high px-5 py-3.5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Total Amount</p>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold text-on-surface">{formatCurrency(order.totalAmount)}</span>
            {order.totalNote && <span className="font-mono text-[10px] text-outline-brand">{order.totalNote}</span>}
          </div>
        </div>
        <Link href={`/orders/${order.id}`}>
          <Button variant={action.variant} size="sm" className="font-mono text-[11px] uppercase tracking-widest">
            {action.label}
          </Button>
        </Link>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function OrderHistoryPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = 'all' } = await searchParams;
  const activeFilter = (FILTER_TABS.find((t) => t.value === status)?.value ?? 'all') as FilterStatus;

  // Filter mock data (real implementation: pass status to API)
  const orders =
    activeFilter === 'all'
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter(
          (o) => o.status === activeFilter || (activeFilter === 'completed' && o.status === 'completed'),
        );

  return (
    <div className="px-8 py-8">
      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-on-surface">Order History</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Review and manage your recent high-fidelity purchases.</p>
        </div>
        <Button variant="gold" size="sm" className="shrink-0 font-mono text-[11px] uppercase tracking-widest">
          <DownloadIcon className="size-3.5" />
          Export CSV
        </Button>
      </div>

      {/* ── Status filter tabs ── */}
      <nav
        aria-label="Filter orders by status"
        className="mb-6 flex items-center gap-1 border-b border-surface-container-high"
      >
        {FILTER_TABS.map((tab) => {
          const isActive = tab.value === activeFilter;
          return (
            <Link
              key={tab.value}
              href={`/orders?status=${tab.value}`}
              className={cn(
                'relative pb-3 pt-1 px-3',
                'font-mono text-[11px] font-semibold uppercase tracking-widest',
                'transition-colors duration-200',
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {/* Gold underline indicator */}
              {isActive && (
                <span aria-hidden className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Orders grid ── */}
      {orders.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-outline-variant">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
