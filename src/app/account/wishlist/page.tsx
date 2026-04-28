import { BellIcon, ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { InventoryStatus } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * Wishlist page — `/wishlist`
 *
 * Desktop  : 3-col product grid, sidebar AccountLayout already provides nav.
 *            Cards: square image, inventory badge (bottom-left overlay),
 *            heart icon (top-right), name + price below, CTA button.
 * Mobile   : 1-col stack, 4:3 aspect-ratio image, name+price inline row,
 *            spec chips row, full-width CTA.
 * Tablet   : 2-col grid (matches tablet mockup).
 *
 * "Out of Stock" cards: image grayscale, CTA → "Notify Me" (ghost-neutral).
 * "Pre-order" cards  : CTA → "Add to Cart" (gold).
 * "In Stock"         : CTA → "Add to Cart" (gold).
 *
 * Server Component — no interactivity; wishlist actions will be Client leaves
 * once API is wired.
 */

// ── Types & Mock data ─────────────────────────────────────────────────────

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  inventoryStatus: InventoryStatus;
  specs: string[];
  href: string;
}

const WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 'ref-monitor',
    name: 'V3-X Reference Monitor',
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    imageAlt: 'V3-X Reference Monitor open-back headphones',
    inventoryStatus: 'in_stock',
    specs: ['32Ω', 'Hi-Res'],
    href: '/products/v3x-reference-monitor',
  },
  {
    id: 'tube-amp',
    name: 'A-Series Tube Amp MkII',
    price: 2450,
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    imageAlt: 'A-Series vacuum tube amplifier',
    inventoryStatus: 'pre_order',
    specs: ['Class A', '25W'],
    href: '/products/a-series-tube-amp',
  },
  {
    id: 'copper-xlr',
    name: 'Signature Copper XLR (2m)',
    price: 480,
    imageSrc: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
    imageAlt: 'Signature copper XLR cable',
    inventoryStatus: 'out_of_stock',
    specs: ['XLR', '6N Copper'],
    href: '/products/signature-copper-xlr',
  },
  {
    id: 'studio-buds',
    name: 'V3-X Mobile Studio Buds',
    price: 299,
    imageSrc: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    imageAlt: 'V3-X wireless studio earbuds',
    inventoryStatus: 'in_stock',
    specs: ['BT 5.3', 'ANC'],
    href: '/products/v3x-studio-buds',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

// Status badge label + classes — inline since we need custom colours matching mockup
const INVENTORY_BADGE: Record<InventoryStatus, { label: string; classes: string }> = {
  in_stock: {
    label: 'In Stock',
    classes: 'bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20',
  },
  pre_order: { label: 'Pre-order', classes: 'bg-status-shipped text-status-shipped-fg border-status-shipped-fg/20' },
  out_of_stock: {
    label: 'Out of Stock',
    classes: 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
  },
  low_stock: {
    label: 'Low Stock',
    classes: 'bg-status-low-stock text-status-low-stock-fg border-status-low-stock-fg/25',
  },
};

// ── WishlistCard — Desktop (square image) ─────────────────────────────────

function WishlistCardDesktop({ item }: { item: WishlistItem }) {
  const badge = INVENTORY_BADGE[item.inventoryStatus];
  const isOOS = item.inventoryStatus === 'out_of_stock';

  return (
    <article className="group flex flex-col border border-surface-container-high bg-surface-container-low transition-colors duration-300 hover:border-primary/50">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            isOOS && 'opacity-60 grayscale',
          )}
        />

        {/* Heart button — top right */}
        <button
          type="button"
          aria-label={`Remove ${item.name} from wishlist`}
          className={cn(
            'absolute right-4 top-4 z-10',
            'flex size-9 items-center justify-center rounded-full',
            'border border-outline-variant bg-background/70 backdrop-blur-sm',
            'transition-colors duration-200 hover:border-primary/60 hover:bg-primary/10',
          )}
        >
          <svg className="size-4 fill-primary text-primary" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Inventory badge — bottom left */}
        <div className="absolute bottom-4 left-4">
          <span
            className={cn(
              'inline-flex items-center rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider',
              badge.classes,
            )}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-medium text-on-surface">{item.name}</h3>
          <span className="font-mono text-xl font-bold text-primary">{formatPrice(item.price)}</span>
        </div>

        {/* CTA */}
        {isOOS ? (
          <Button
            variant="ghost-neutral"
            size="default"
            className="mt-auto w-full font-mono text-[11px] uppercase tracking-widest"
          >
            <BellIcon className="size-3.5" />
            Notify Me
          </Button>
        ) : (
          <Button
            variant="gold"
            size="default"
            className="mt-auto w-full font-mono text-[11px] uppercase tracking-widest"
          >
            <ShoppingCartIcon className="size-3.5" />
            Add to Cart
          </Button>
        )}
      </div>
    </article>
  );
}

// ── WishlistCard — Mobile (4:3 image) ─────────────────────────────────────

function WishlistCardMobile({ item }: { item: WishlistItem }) {
  const badge = INVENTORY_BADGE[item.inventoryStatus];
  const isOOS = item.inventoryStatus === 'out_of_stock';

  return (
    <article className="overflow-hidden rounded-lg border border-surface-container-high bg-surface-container-low">
      {/* Image — 4:3 */}
      <div className="relative aspect-4/3 overflow-hidden bg-surface-container">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="100vw"
          className={cn('object-cover', isOOS && 'opacity-60 grayscale')}
        />

        {/* Heart button */}
        <button
          type="button"
          aria-label={`Remove ${item.name} from wishlist`}
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
        >
          <svg className="size-4 fill-primary text-primary" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Inventory badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={cn(
              'inline-flex items-center rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider',
              badge.classes,
            )}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Name + price inline */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-medium leading-snug text-on-surface">{item.name}</h3>
          <span className="shrink-0 font-mono text-base font-bold text-primary">{formatPrice(item.price)}</span>
        </div>

        {/* Spec chips */}
        {item.specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.specs.map((s) => (
              <SpecChip key={s} label={s} size="sm" />
            ))}
          </div>
        )}

        {/* CTA */}
        {isOOS ? (
          <Button
            variant="ghost-neutral"
            size="default"
            className="h-12 w-full font-mono text-xs uppercase tracking-widest"
          >
            <BellIcon className="size-4" />
            Notify Me
          </Button>
        ) : (
          <Button variant="gold" size="default" className="h-12 w-full font-mono text-xs uppercase tracking-widest">
            <ShoppingCartIcon className="size-4" />
            Add to Cart
          </Button>
        )}
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const count = WISHLIST_ITEMS.length;

  return (
    <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-10 md:pb-10 lg:py-12">
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <h1 className="font-heading text-4xl font-normal text-on-surface md:text-[clamp(2.5rem,5vw,4rem)]">Wishlist</h1>
        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          {count} {count === 1 ? 'item' : 'items'} saved
        </p>
      </header>

      {count === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full border border-surface-container-high bg-surface-container">
            <svg
              className="size-8 text-outline-variant"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-xl text-on-surface">Your wishlist is empty</p>
            <p className="text-sm text-on-surface-variant">Save products you love to revisit them later.</p>
          </div>
          <Button variant="gold" size="default" className="mt-2 font-mono text-xs uppercase tracking-widest" asChild>
            <Link href="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop grid — hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {WISHLIST_ITEMS.map((item) => (
              <WishlistCardDesktop key={item.id} item={item} />
            ))}
          </div>

          {/* Mobile list — hidden on md+ */}
          <div className="flex flex-col gap-6 md:hidden">
            {WISHLIST_ITEMS.map((item) => (
              <WishlistCardMobile key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
