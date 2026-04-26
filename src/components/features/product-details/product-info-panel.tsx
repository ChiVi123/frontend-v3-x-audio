import type { ComponentProps } from 'react';
import { AddToCartButton } from '~/components/features/product-details/add-to-cart-button';
import { OrderStatusBadge } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { cn } from '~/lib/utils';

/**
 * ProductInfoPanel — Server Component.
 *
 * Matches product_detail.png right panel:
 * - Series badge + inventory status badge
 * - Product name (Playfair Display heading)
 * - Description
 * - Price (gold mono)
 * - Spec chips
 * - AddToCartButton (Client Component leaf — isolated interactivity)
 *
 * No props that require client state. Pure display driven by server data.
 */

interface ProductInfoPanelProps extends ComponentProps<'div'> {
  id: string;
  name: string;
  description?: string;
  price: number;
  series?: string;
  specs?: string[];
  inventoryStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

function ProductInfoPanel({
  id,
  name,
  description,
  price,
  series,
  specs = [],
  inventoryStatus = 'in_stock',
  className,
  ...props
}: ProductInfoPanelProps) {
  return (
    <div data-slot="product-info-panel" className={cn('flex flex-col gap-5', className)} {...props}>
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {series && (
          <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            {series}
          </span>
        )}
        <OrderStatusBadge status={inventoryStatus} dot size="sm" />
      </div>

      {/* Name */}
      <h1 className="font-heading text-4xl font-normal leading-tight text-on-surface lg:text-5xl">{name}</h1>

      {/* Description */}
      {description && <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>}

      {/* Price */}
      <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatPrice(price)}</p>

      <hr className="border-surface-container-high" />

      {/* Spec chips */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specs.map((spec) => (
            <SpecChip key={spec} label={spec} size="md" />
          ))}
        </div>
      )}

      {/* Add to cart — Client Component leaf, isolated so the panel stays server-rendered */}
      <AddToCartButton productId={id} productName={name} />
    </div>
  );
}

export { ProductInfoPanel };
