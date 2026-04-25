import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type * as React from 'react';
import { type InventoryStatus, OrderStatusBadge } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * ProductCard — Core customer-facing product display
 *
 * Matches the catalog.png and home.png (Masterworks section) mockups.
 *
 * Design spec (DESIGN.md):
 * - Card surface: one step lighter than page bg → surface-container (#1e2020)
 * - Photography: high-contrast, pops against dark UI
 * - Spec chips: pill-shaped, tertiary color, subtle border
 * - Gold price text with dark foreground for premium feel
 * - Hover: subtle scale on image (200ms ease-out per spec)
 *
 * Variants:
 * - default: vertical card (catalog grid, 3-col)
 * - compact: horizontal card (smaller grids / related products)
 * - featured: wider aspect ratio for hero product lists
 */

export interface ProductCardProps extends React.ComponentProps<'article'> {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  currency?: string;
  imageSrc: string;
  imageAlt?: string;
  href: string;
  specs?: string[];
  badge?: string;
  inventoryStatus?: InventoryStatus;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

function formatPrice(price: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({
  id,
  name,
  tagline,
  price,
  currency = 'USD',
  imageSrc,
  imageAlt,
  href,
  specs = [],
  badge,
  inventoryStatus = 'in_stock',
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
  variant = 'default',
  className,
  ...props
}: ProductCardProps) {
  const isCompact = variant === 'compact';

  return (
    <article
      data-slot="product-card"
      data-variant={variant}
      className={cn(
        // Base card surface — surface-container (#1e2020), one step above page bg
        'group/card relative flex rounded-2xl border border-border bg-card',
        'transition-all duration-200 ease-out',
        // Hover: very subtle border luminosity shift
        'hover:border-outline-brand',
        // Layout by variant
        variant === 'default' && 'flex-col overflow-hidden',
        variant === 'compact' && 'flex-row items-center gap-4 p-3',
        variant === 'featured' && 'flex-col overflow-hidden',
        className,
      )}
      {...props}
    >
      {/* ── Image container ── */}
      {!isCompact ? (
        <Link href={href} className="relative block overflow-hidden" tabIndex={-1} aria-hidden>
          <div
            className={cn(
              'relative w-full overflow-hidden bg-surface-container-low',
              variant === 'default' && 'aspect-4/5',
              variant === 'featured' && 'aspect-video',
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt ?? name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                'object-cover',
                // Smooth scale on card hover — 200ms ease-out per DESIGN.md
                'transition-transform duration-500 ease-out',
                'group-hover/card:scale-[1.03]',
              )}
            />

            {/* Gradient overlay for text legibility if needed */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/40 via-transparent to-transparent" />
          </div>

          {/* ── Badges overlaid on image ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className="inline-flex items-center rounded-full border border-outline-variant-brand bg-background/80 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
                {badge}
              </span>
            )}
          </div>

          {/* Inventory status — only show if not in stock */}
          {inventoryStatus !== 'in_stock' && (
            <div className="absolute top-3 right-3">
              <OrderStatusBadge status={inventoryStatus} size="sm" dot />
            </div>
          )}

          {/* In-stock dot — subtle, per home.png mockup */}
          {inventoryStatus === 'in_stock' && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-status-delivered-fg/20 bg-status-delivered/80 px-2 py-0.5 backdrop-blur-sm">
              <span className="inline-block size-1.5 rounded-full bg-status-delivered-fg" />
              <span className="font-mono text-[9px] font-medium uppercase tracking-wider text-status-delivered-fg">In Stock</span>
            </div>
          )}
        </Link>
      ) : (
        /* Compact: square thumbnail */
        <Link href={href} className="relative shrink-0 overflow-hidden rounded-xl" tabIndex={-1} aria-hidden>
          <div className="relative size-20 bg-surface-container-low">
            <Image
              src={imageSrc}
              alt={imageAlt ?? name}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 ease-out group-hover/card:scale-105"
            />
          </div>
        </Link>
      )}

      {/* ── Body ── */}
      <div className={cn('flex flex-col', !isCompact && 'flex-1 p-4 pt-3', isCompact && 'flex-1 min-w-0')}>
        {/* Name + wishlist */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={href} className="group/link block outline-none focus-visible:text-primary">
              <h3
                className={cn(
                  'font-heading text-foreground leading-snug',
                  'transition-colors duration-200 ease-out',
                  'group-hover/link:text-primary',
                  !isCompact && 'text-xl',
                  isCompact && 'text-base truncate',
                )}
              >
                {name}
              </h3>
            </Link>
            {tagline && !isCompact && (
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{tagline}</p>
            )}
          </div>

          {/* Wishlist button */}
          {onWishlistToggle && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full text-[#4d4635] hover:text-[#f2ca50] hover:bg-[#f2ca50]/10"
              aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
              onClick={() => onWishlistToggle(id)}
            >
              <Heart
                className={cn('size-4 transition-all duration-200', isWishlisted && 'fill-primary text-primary')}
              />
            </Button>
          )}
        </div>

        {/* Spec chips */}
        {specs.length > 0 && (
          <div className={cn('flex flex-wrap gap-1.5', !isCompact ? 'mt-3' : 'mt-1.5')}>
            {specs.slice(0, isCompact ? 2 : 4).map((s) => (
              <SpecChip key={s} label={s} size="sm" />
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div
          className={cn(
            'flex items-center',
            !isCompact && 'mt-4 border-t border-border pt-3 justify-between',
            isCompact && 'mt-2 justify-between',
          )}
        >
          <span
            className={cn(
              'font-mono font-bold tracking-tight',
              !isCompact && 'text-xl text-primary',
              isCompact && 'text-base text-primary',
            )}
          >
            {formatPrice(price, currency)}
          </span>

          {onAddToCart && !isCompact && (
            <Button
              variant="ghost-gold"
              size="sm"
              className="font-mono text-[11px] uppercase tracking-widest"
              onClick={() => onAddToCart(id)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
