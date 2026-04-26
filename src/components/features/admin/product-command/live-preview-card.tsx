'use client';

import { ImageIcon as ImagePlaceholderIcon } from 'lucide-react';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { OrderStatusBadge } from '~/components/shared/order-status-badge';
import { SpecChip } from '~/components/shared/spec-chip';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * LivePreviewCard — Admin Add/Edit Product real-time preview
 *
 * Matches admin_add_product.png right panel.
 * All values driven by debounced parent form state — purely presentational.
 * Uses next/image for the uploaded product image preview.
 */

export type ProductStatus = 'draft' | 'published' | 'archived';

interface LivePreviewCardProps extends ComponentProps<'div'> {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  status?: ProductStatus;
  /** spec string[] used as React keys — must be unique per product */
  specs?: string[];
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isSaving?: boolean;
}

// Static class maps — all values known at build time so Tailwind JIT picks them up
const STATUS_BADGE_CLASSES: Record<ProductStatus, string> = {
  draft: 'border-outline-variant bg-surface-container-high text-on-surface-variant',
  published: 'border-status-delivered-fg/20 bg-status-delivered text-status-delivered-fg',
  archived: 'border-status-cancelled-fg/20 bg-status-cancelled text-status-cancelled-fg',
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

function formatPrice(price?: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price ?? 0);
}

function LivePreviewCard({
  name,
  price,
  description,
  imageUrl,
  status = 'draft',
  specs = [],
  onSaveDraft,
  onPublish,
  isSaving = false,
  className,
  ...props
}: LivePreviewCardProps) {
  const isEmpty = !name && !description && !imageUrl;

  return (
    <div
      data-slot="live-preview-card"
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container',
        className,
      )}
      {...props}
    >
      {/* Live Preview header */}
      <div className="flex items-center gap-2 border-b border-surface-container-high px-4 py-2.5">
        {/* Animated live dot — decorative */}
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-delivered-fg opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-status-delivered-fg" />
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Live Preview
        </span>
      </div>

      {/* Image area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container-low">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name ?? 'Product preview'}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-all duration-300"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-outline-variant">
            <ImagePlaceholderIcon className="size-10" strokeWidth={1} />
            <span className="font-mono text-[10px] uppercase tracking-widest">No image</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + status */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-heading text-xl leading-snug transition-colors duration-200',
                name ? 'text-on-surface' : 'text-outline-variant',
              )}
            >
              {name || 'Product Name'}
            </h3>

            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
                STATUS_BADGE_CLASSES[status],
              )}
            >
              {STATUS_LABELS[status]}
            </span>
          </div>

          {/* Price */}
          <span
            className={cn(
              'font-mono text-2xl font-bold tracking-tight transition-colors duration-200',
              price && price > 0 ? 'text-primary' : 'text-outline-variant',
            )}
          >
            {formatPrice(price)}
          </span>
        </div>

        {/* Spec chips — spec string as key (unique within a product) */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specs.map((spec) => (
              <SpecChip key={spec} label={spec} size="sm" />
            ))}
          </div>
        )}

        {/* Description */}
        <p
          className={cn(
            'text-xs leading-relaxed transition-colors duration-200',
            description ? 'text-on-surface-variant' : 'text-outline-variant',
          )}
        >
          {description ||
            (isEmpty
              ? 'Enter details in the form to see them reflected in the live preview.'
              : 'No description provided.')}
        </p>

        {/* Inventory status — visible only when published */}
        {status === 'published' && <OrderStatusBadge status="in_stock" dot size="sm" className="w-fit" />}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 border-t border-surface-container-high p-4">
        <Button
          variant="ghost-neutral"
          size="sm"
          className="flex-1 font-mono text-[11px] uppercase tracking-widest"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          Save Draft
        </Button>
        <Button
          variant="gold"
          size="sm"
          className="flex-1 font-mono text-[11px] uppercase tracking-widest"
          onClick={onPublish}
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}

export { LivePreviewCard };
