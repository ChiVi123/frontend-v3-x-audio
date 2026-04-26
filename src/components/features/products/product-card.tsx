import { HeartIcon as WishlistIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { type InventoryStatus, OrderStatusBadge } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * ProductCard — Core customer-facing product display
 *
 * Variants:
 * - default  : vertical card (catalog grid, 3-col)
 * - compact  : horizontal thumbnail card
 * - featured : wide aspect ratio (homepage Masterworks)
 *
 * DESIGN.md: "Card surface one step lighter than page background."
 * → bg-surface-container (adapts to light/dark via CSS var)
 */

export interface ProductCardProps extends ComponentProps<'article'> {
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
        'group/card relative flex rounded-2xl border border-surface-container-high bg-surface-container',
        'transition-all duration-200 ease-out hover:border-outline-variant',
        variant === 'default' && 'flex-col overflow-hidden',
        variant === 'compact' && 'flex-row items-center gap-4 p-3',
        variant === 'featured' && 'flex-col overflow-hidden',
        className,
      )}
      {...props}
    >
      {/* ── Image area ── */}
      {isCompact ? (
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
      ) : (
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
              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
            />
            {/* Subtle gradient for text legibility on image */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-container/40 via-transparent to-transparent" />
          </div>

          {/* Badge overlaid on image */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full border border-outline-variant bg-background/80 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Inventory status — top right */}
          <div className="absolute top-3 right-3">
            {inventoryStatus === 'in_stock' ? (
              <div className="flex items-center gap-1.5 rounded-full border border-status-delivered-fg/20 bg-status-delivered/80 px-2 py-0.5 backdrop-blur-sm">
                <span className="inline-block size-1.5 rounded-full bg-status-delivered-fg" />
                <span className="font-mono text-[9px] font-medium uppercase tracking-wider text-status-delivered-fg">
                  In Stock
                </span>
              </div>
            ) : (
              <OrderStatusBadge status={inventoryStatus} size="sm" dot />
            )}
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
                  'font-heading text-on-surface leading-snug',
                  'transition-colors duration-200 ease-out group-hover/link:text-primary',
                  !isCompact && 'text-xl',
                  isCompact && 'text-base truncate',
                )}
              >
                {name}
              </h3>
            </Link>
            {tagline && !isCompact && (
              <p className="mt-0.5 text-xs text-outline-brand leading-relaxed line-clamp-2">{tagline}</p>
            )}
          </div>

          {onWishlistToggle && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full text-outline-variant hover:text-primary hover:bg-primary/10"
              aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
              onClick={() => onWishlistToggle(id)}
            >
              <WishlistIcon
                className={cn('size-4 transition-all duration-200', isWishlisted && 'fill-primary text-primary')}
              />
            </Button>
          )}
        </div>

        {/* Spec chips — use spec string as key (unique per product) */}
        {specs.length > 0 && (
          <div className={cn('flex flex-wrap gap-1.5', !isCompact ? 'mt-3' : 'mt-1.5')}>
            {specs.slice(0, isCompact ? 2 : 4).map((spec) => (
              <SpecChip key={spec} label={spec} size="sm" />
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div
          className={cn(
            'flex items-center',
            !isCompact && 'mt-4 border-t border-surface-container-high pt-3 justify-between',
            isCompact && 'mt-2 justify-between',
          )}
        >
          <span
            className={cn(
              'font-mono font-bold tracking-tight text-primary',
              !isCompact && 'text-xl',
              isCompact && 'text-base',
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
