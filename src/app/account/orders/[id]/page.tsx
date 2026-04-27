import { CreditCardIcon, DownloadIcon, HeadsetIcon, TruckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { OrderTrackingBar, type TrackingStep } from '~/components/features/orders/order-tracking-bar';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * OrderDetailPage — Server Component matching order_detail.png.
 *
 * Layout: 2-col (items left, summary sidebar right).
 * Sections: OrderTrackingBar, Items list, Shipping + Payment info cards.
 * Summary sidebar: line items, total, Download Invoice + Contact Support CTAs.
 *
 * TODO: Replace mock data with real API call:
 *   const order = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`).then(r => r.json());
 */

// ── Mock data types ────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  imageSrc: string;
  price: number;
  qty: number;
  specs: string[];
}

interface OrderData {
  id: string;
  placedAt: string;
  status: TrackingStep;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment: {
    brand: string;
    last4: string;
  };
}

// ── Mock ───────────────────────────────────────────────────────────────────

const MOCK_ORDER: OrderData = {
  id: 'VX-88921',
  placedAt: 'October 24, 2024',
  status: 'shipped',
  items: [
    {
      id: 'item-1',
      name: 'Reference Over-Ear Headphones V3',
      imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=75',
      price: 1299,
      qty: 1,
      specs: ['32Ω', 'Black/Gold'],
    },
    {
      id: 'item-2',
      name: 'Audiophile Grade Braided Cable',
      imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=75',
      price: 149,
      qty: 1,
      specs: ['2m', 'Copper'],
    },
  ],
  subtotal: 1448,
  shipping: 25,
  shippingLabel: 'Express',
  tax: 147.3,
  total: 1620.3,
  shippingAddress: {
    name: 'Alex Mercer',
    line1: '1012 Precision Way, Suite 400',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    country: 'United States',
  },
  payment: {
    brand: 'VISA',
    last4: '4242',
  },
};

// ── Sub-components ────────────────────────────────────────────────────────

function SectionCard({ className, children }: ComponentProps<'div'>) {
  return (
    <div className={cn('rounded-xl border border-surface-container-high bg-surface-container p-5', className)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex items-center gap-2">{children}</div>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = await params;

  // TODO: fetch real order — const order = await getOrder(orderId);
  const order = { ...MOCK_ORDER, id: orderId };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      {/* ── Page header ── */}
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-outline-brand transition-colors hover:text-primary"
        >
          ← Order History
        </Link>
        <h1 className="font-heading text-4xl font-medium text-on-surface">Order #{order.id}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Placed on {order.placedAt}</p>
      </div>

      {/* ── 2-col layout ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Left column ── */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Tracking status */}
          <SectionCard>
            <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Tracking Status
            </p>
            <OrderTrackingBar currentStep={order.status} />
          </SectionCard>

          {/* Items */}
          <SectionCard className="gap-0 p-0">
            <div className="border-b border-surface-container-high px-5 py-4">
              <h2 className="font-heading text-xl font-medium text-on-surface">Items</h2>
            </div>
            <ul className="divide-y divide-surface-container-high">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Product image */}
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-low">
                    <Image src={item.imageSrc} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>

                  {/* Name + specs */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <p className="text-sm font-medium text-on-surface leading-snug">{item.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.specs.map((spec) => (
                        <SpecChip key={spec} label={spec} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Price + qty */}
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-bold text-primary">{formatCurrency(item.price)}</p>
                    <p className="font-mono text-[10px] text-on-surface-variant">Qty: {item.qty}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Shipping + Payment — 2-col */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Shipping address */}
            <SectionCard>
              <SectionLabel>
                <TruckIcon className="size-4 text-primary" strokeWidth={1.5} />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                  Shipping Address
                </span>
              </SectionLabel>
              <address className="not-italic text-sm leading-relaxed text-on-surface-variant">
                <p className="font-medium text-on-surface">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </SectionCard>

            {/* Payment method */}
            <SectionCard>
              <SectionLabel>
                <CreditCardIcon className="size-4 text-primary" strokeWidth={1.5} />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                  Payment Method
                </span>
              </SectionLabel>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {/* VISA badge */}
                  <span className="inline-flex items-center rounded border border-outline-variant bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-on-surface">
                    {order.payment.brand}
                  </span>
                  <span className="text-sm text-on-surface">Ending in {order.payment.last4}</span>
                </div>
                <p className="text-xs text-on-surface-variant">Billing address matches shipping</p>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ── Right column: Summary sidebar ── */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0">
          <SectionCard className="sticky top-24">
            <h2 className="mb-5 font-heading text-xl font-medium text-on-surface">Summary</h2>

            {/* Line items */}
            <dl className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <dt className="text-on-surface-variant">Subtotal</dt>
                <dd className="font-mono text-on-surface">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-on-surface-variant">Shipping ({order.shippingLabel})</dt>
                <dd className="font-mono text-on-surface">{formatCurrency(order.shipping)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-on-surface-variant">Estimated Tax</dt>
                <dd className="font-mono text-on-surface">{formatCurrency(order.tax)}</dd>
              </div>

              <div className="my-1 h-px bg-surface-container-high" />

              <div className="flex justify-between">
                <dt className="text-base font-medium text-on-surface">Total</dt>
                <dd className="font-mono text-base font-bold text-primary">{formatCurrency(order.total)}</dd>
              </div>
            </dl>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="gold" size="default" className="w-full font-mono text-[11px] uppercase tracking-widest">
                <DownloadIcon className="size-4" />
                Download Invoice
              </Button>
              <Button
                variant="ghost-neutral"
                size="default"
                className="w-full font-mono text-[11px] uppercase tracking-widest"
              >
                <HeadsetIcon className="size-4" />
                Contact Support
              </Button>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
