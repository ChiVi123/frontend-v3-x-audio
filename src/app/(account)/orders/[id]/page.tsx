import {
  CheckCircle2Icon as ConfirmedIcon,
  CreditCardIcon,
  HomeIcon as DeliveredIcon,
  DownloadIcon,
  HeadphonesIcon,
  MapPinIcon,
  PackageIcon as ProcessingIcon,
  TruckIcon as ShippedIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ElementType } from 'react';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────

type TrackingStep = 'confirmed' | 'processing' | 'shipped' | 'delivered';

interface StepConfig {
  key: TrackingStep;
  label: string;
  desktopLabel: string;
  Icon: ElementType;
  timestamp?: string;
}

interface OrderLineItem {
  id: string;
  name: string;
  variant?: string;
  specs?: string[];
  price: number;
  qty: number;
  imageSrc: string;
}

// ── Static config ─────────────────────────────────────────────────────────

const STEPS: StepConfig[] = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    desktopLabel: 'Order Placed',
    Icon: ConfirmedIcon,
    timestamp: 'Oct 24, 10:45 AM',
  },
  {
    key: 'processing',
    label: 'Shipped',
    desktopLabel: 'Processing',
    Icon: ShippedIcon,
    timestamp: 'Oct 26, 02:15 PM',
  },
  {
    key: 'shipped',
    label: 'Out for Delivery',
    desktopLabel: 'Shipped',
    Icon: ProcessingIcon,
    timestamp: undefined, // active — shows "Expected Today"
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desktopLabel: 'Delivered',
    Icon: DeliveredIcon,
    timestamp: undefined,
  },
];

const STEP_INDEX: Record<TrackingStep, number> = {
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

// ── Mock data ─────────────────────────────────────────────────────────────

const MOCK_ORDER = {
  id: 'VX-88921',
  placedAt: 'October 24, 2024 at 14:32 PM',
  currentStep: 'shipped' as TrackingStep,
  items: [
    {
      id: 'item-1',
      name: 'V3-X Master Series',
      variant: 'Obsidian Black',
      specs: ['32Ω', 'Hi-Res'],
      price: 1299,
      qty: 1,
      imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop',
    },
    {
      id: 'item-2',
      name: 'Silver-Core XLR Cable',
      variant: '2.5 Meters',
      specs: [],
      price: 249,
      qty: 1,
      imageSrc: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=160&h=160&fit=crop',
    },
  ] satisfies OrderLineItem[],
  shippingAddress: {
    name: 'Jonathan Sterling',
    line1: '1422 High Fidelity Lane',
    line2: 'Suite 400',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'United States',
  },
  payment: {
    brand: 'Visa',
    last4: '4492',
    exp: '08/26',
  },
  subtotal: 1548,
  shipping: 45,
  shippingType: 'Express',
  taxes: 127.44,
  total: 1720.44,
  statusNote:
    'This order is currently in transit. You will receive a notification once it reaches your local distribution center.',
};

// ── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
}

// ── Desktop: horizontal tracking bar ─────────────────────────────────────
// Matches order_detail_dark_mode_desktop: 4 steps in a row inside a card,
// gold filled circle for completed, gold ring for active, muted for future.

function TrackingBarDesktop({ currentStep }: { currentStep: TrackingStep }) {
  const currentIdx = STEP_INDEX[currentStep];

  return (
    <section aria-label="Order tracking status" className="hidden md:block">
      <div className="relative flex items-start justify-between">
        {/* Connector lines — behind the icons */}
        <div aria-hidden="true" className="pointer-events-none absolute top-[18px] left-0 right-0 flex px-[12.5%]">
          {STEPS.slice(0, -1).map((step, segIdx) => {
            const isCompleted = segIdx < currentIdx;
            return (
              <div key={`seg-${step.key}`} className="relative h-px flex-1 overflow-hidden bg-surface-container-high">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 transition-all duration-500 ease-out',
                    isCompleted ? 'w-full bg-primary' : 'w-0',
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Steps */}
        {STEPS.map(({ key, desktopLabel, Icon }) => {
          const stepIdx = STEP_INDEX[key];
          const isCompleted = stepIdx < currentIdx;
          const isActive = stepIdx === currentIdx;
          const isFuture = stepIdx > currentIdx;

          return (
            <div key={key} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out',
                  isCompleted && 'border-primary bg-primary',
                  isActive &&
                    'border-primary bg-surface-container shadow-[0_0_14px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]',
                  isFuture && 'border-surface-container-high bg-surface-container-low',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 transition-colors duration-300',
                    isCompleted && 'text-primary-foreground',
                    isActive && 'text-primary',
                    isFuture && 'text-outline-variant',
                  )}
                  strokeWidth={isCompleted ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  'text-center font-mono text-[10px] font-medium uppercase tracking-wider transition-colors duration-300',
                  isCompleted && 'text-primary',
                  isActive && 'text-on-surface',
                  isFuture && 'text-outline-variant',
                )}
              >
                {desktopLabel}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Mobile: vertical timeline ─────────────────────────────────────────────
// Matches order_detail_dark_mode_mobile: vertical list, icon left + connector
// line, label bold + timestamp below, active step highlighted gold.

function TrackingTimelineMobile({ currentStep }: { currentStep: TrackingStep }) {
  const currentIdx = STEP_INDEX[currentStep];

  return (
    <section aria-label="Order tracking timeline" className="md:hidden">
      {STEPS.map(({ key, label, Icon, timestamp }, idx) => {
        const stepIdx = STEP_INDEX[key];
        const isCompleted = stepIdx < currentIdx;
        const isActive = stepIdx === currentIdx;
        const isFuture = stepIdx > currentIdx;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={key} className="flex gap-4">
            {/* Left column: icon + vertical connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted && 'border-primary bg-primary',
                  isActive &&
                    'border-primary bg-surface-container shadow-[0_0_12px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]',
                  isFuture && 'border-surface-container-high bg-surface-container-low',
                )}
              >
                <Icon
                  className={cn(
                    'size-3.5',
                    isCompleted && 'text-primary-foreground',
                    isActive && 'text-primary',
                    isFuture && 'text-outline-variant',
                  )}
                  strokeWidth={2}
                />
              </div>

              {/* Vertical connector — only between steps */}
              {!isLast && (
                <div
                  className={cn(
                    'mt-1 min-h-8 w-px flex-1',
                    isCompleted ? 'bg-primary/40' : 'bg-surface-container-high',
                  )}
                />
              )}
            </div>

            {/* Right column: label + timestamp */}
            <div className={cn('flex flex-col', isLast ? 'pb-0' : 'pb-5')}>
              <span
                className={cn(
                  'text-sm font-semibold leading-tight',
                  isCompleted && 'text-on-surface-variant',
                  isActive && 'text-primary',
                  isFuture && 'text-outline-variant',
                )}
              >
                {label}
              </span>

              {/* Timestamp for completed steps */}
              {!isFuture && timestamp && (
                <span className="mt-0.5 font-mono text-[11px] text-on-surface-variant">{timestamp}</span>
              )}

              {/* Active step: "Expected Today" */}
              {isActive && <span className="mt-0.5 font-mono text-[11px] text-primary/80">Expected Today</span>}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ── Line item — desktop table row ─────────────────────────────────────────

function LineItemDesktop({ item }: { item: OrderLineItem }) {
  const subtotal = fmt(item.price * item.qty);

  return (
    <tr className="border-b border-surface-container-high last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
            <Image src={item.imageSrc} alt={item.name} fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <p className="font-heading text-base text-on-surface">{item.name}</p>
            {item.variant && <p className="mt-0.5 text-xs text-on-surface-variant">{item.variant}</p>}
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-mono text-sm text-on-surface">{fmt(item.price)}</td>
      <td className="px-5 py-4 font-mono text-sm text-on-surface">{item.qty}</td>
      <td className="px-5 py-4 font-mono text-sm font-semibold text-on-surface">{subtotal}</td>
    </tr>
  );
}

// ── Line item — mobile card ───────────────────────────────────────────────

function LineItemMobile({ item }: { item: OrderLineItem }) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
        <Image src={item.imageSrc} alt={item.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="font-heading text-base leading-snug text-on-surface">{item.name}</p>
        {item.variant && <p className="text-xs text-on-surface-variant">{item.variant}</p>}
        {item.specs && item.specs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.specs.map((spec) => (
              <SpecChip key={spec} label={spec} size="sm" />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-mono text-xs text-on-surface-variant">Qty: {item.qty}</span>
          <span className="font-mono text-base font-bold text-primary">{fmt(item.price)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id: orderId } = await params;
  const order = MOCK_ORDER; // In production: fetch by orderId

  return (
    <>
      {/* ════════════════════════════════════════════════
          DESKTOP LAYOUT
          grid: [content 1fr] [sidebar 300px]
      ════════════════════════════════════════════════ */}
      <div className="hidden flex-col gap-6 py-8 md:flex">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl text-on-surface">Order #{orderId}</h1>
            <p className="mt-1 font-mono text-xs text-on-surface-variant">Placed on {order.placedAt}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gold" size="sm" className="font-mono text-[11px] uppercase tracking-widest">
              <DownloadIcon className="size-3.5" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm" className="font-mono text-[11px] uppercase tracking-widest">
              Contact Support
            </Button>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* ── LEFT: tracking + items + address/payment ── */}
          <div className="flex flex-col gap-4">
            {/* Tracking card */}
            <div className="rounded-xl border border-surface-container-high bg-surface-container p-6">
              <TrackingBarDesktop currentStep={order.currentStep} />
            </div>

            {/* Product table */}
            <div className="overflow-hidden rounded-xl border border-surface-container-high bg-surface-container">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    {['Product', 'Price', 'Qty', 'Subtotal'].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <LineItemDesktop key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shipping + Payment side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="flex flex-col gap-3 rounded-xl border border-surface-container-high bg-surface-container p-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Shipping Address
                  </span>
                </div>
                <address className="not-italic">
                  <p className="text-sm font-medium text-on-surface">{order.shippingAddress.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && (
                      <>
                        <br />
                        {order.shippingAddress.line2}
                      </>
                    )}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </address>
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-3 rounded-xl border border-surface-container-high bg-surface-container p-4">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Payment Method
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-12 items-center justify-center rounded border border-outline-variant bg-surface-container-high font-mono text-[10px] font-bold text-on-surface">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      {order.payment.brand} ending in {order.payment.last4}
                    </p>
                    <p className="font-mono text-xs text-on-surface-variant">Exp: {order.payment.exp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary sidebar ── */}
          <aside className="flex flex-col gap-4">
            <div className="sticky top-24 flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface">
                Order Summary
              </span>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Subtotal</span>
                  <span className="font-mono text-sm text-on-surface">{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Shipping ({order.shippingType})</span>
                  <span className="font-mono text-sm text-on-surface">{fmt(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Taxes</span>
                  <span className="font-mono text-sm text-on-surface">{fmt(order.taxes)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
                <span className="font-mono text-sm font-semibold uppercase tracking-widest text-on-surface">Total</span>
                <span className="font-mono text-2xl font-bold text-primary">{fmt(order.total)}</span>
              </div>

              {/* Info note */}
              <div className="flex gap-2.5 rounded-lg bg-surface-container-low p-3">
                <svg
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs leading-relaxed text-on-surface-variant">{order.statusNote}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          MOBILE LAYOUT
          Single column, breadcrumb, vertical timeline
      ════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-5 py-5 md:hidden">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant"
        >
          <Link href="/account" className="hover:text-on-surface transition-colors duration-200">
            Account
          </Link>
          <span aria-hidden="true">›</span>
          <Link href="/orders" className="hover:text-on-surface transition-colors duration-200">
            Orders
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-primary">#{orderId}</span>
        </nav>

        {/* Page title */}
        <div>
          <h1 className="font-heading text-3xl text-on-surface">Order Detail</h1>
          <p className="mt-1 font-mono text-[11px] text-on-surface-variant">Placed on Oct 24, 2024</p>
        </div>

        {/* Tracking timeline card */}
        <div className="rounded-xl border border-surface-container-high bg-surface-container p-4">
          <TrackingTimelineMobile currentStep={order.currentStep} />
        </div>

        {/* Items */}
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            Items ({order.items.length})
          </p>
          <div className="mt-2 flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-4">
            {order.items.map((item, idx) => (
              <div key={item.id}>
                <LineItemMobile item={item} />
                {idx < order.items.length - 1 && <div className="mt-4 border-t border-surface-container-high" />}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="flex flex-col gap-3 rounded-xl border border-surface-container-high bg-surface-container p-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-3.5 text-primary" strokeWidth={1.5} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Shipping Address
            </span>
          </div>
          <address className="not-italic">
            <p className="text-sm font-medium text-on-surface">{order.shippingAddress.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              <br />
              {order.shippingAddress.country}
            </p>
          </address>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-3 rounded-xl border border-surface-container-high bg-surface-container p-4">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="size-3.5 text-primary" strokeWidth={1.5} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Payment Method
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-12 items-center justify-center rounded border border-outline-variant bg-surface-container-high font-mono text-[10px] font-bold text-on-surface">
              VISA
            </div>
            <div>
              <p className="text-sm text-on-surface">
                {order.payment.brand} ending in {order.payment.last4}
              </p>
              <p className="font-mono text-xs text-on-surface-variant">Exp: {order.payment.exp}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-3 rounded-xl border border-surface-container-high bg-surface-container p-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface">
            Order Summary
          </span>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Subtotal</span>
              <span className="font-mono text-sm text-on-surface">{fmt(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Shipping</span>
              <span className="font-mono text-sm text-on-surface">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-on-surface-variant">Estimated Tax</span>
              <span className="font-mono text-sm text-on-surface">{fmt(order.taxes)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
            <span className="font-heading text-base font-semibold text-on-surface">Total</span>
            <span className="font-mono text-xl font-bold text-primary">{fmt(order.total)}</span>
          </div>
        </div>

        {/* Mobile CTA buttons — full width stacked */}
        <div className="flex flex-col gap-3 pb-6">
          <Button variant="gold" size="lg" className="w-full font-mono text-[11px] uppercase tracking-widest">
            <DownloadIcon className="size-4" />
            Download Invoice
          </Button>
          <Button variant="ghost-neutral" size="lg" className="w-full font-mono text-[11px] uppercase tracking-widest">
            <HeadphonesIcon className="size-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </>
  );
}
