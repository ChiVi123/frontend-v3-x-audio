import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '~/lib/utils';

const badgeVariants = cva(
  // Base: pill shape per DESIGN.md — "Pill (100px): Exclusively for status badges and technical tags"
  'group/badge inline-flex h-fit w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border border-transparent px-2.5 py-1 text-xs font-medium transition-all duration-200 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        // ── shadcn originals ──
        default: 'rounded-full bg-primary text-primary-foreground',
        secondary: 'rounded-full bg-secondary text-secondary-foreground',
        destructive: 'rounded-full bg-destructive/15 text-destructive border-destructive/20',
        outline: 'rounded-full border-border text-foreground',
        ghost: 'rounded-full hover:bg-muted hover:text-muted-foreground',

        // ── V3-X Gold / brand badges ──

        /**
         * gold — Premium signifier (NEW, LIMITED, EXCLUSIVE)
         * Per DESIGN.md: Gold accent used with "surgical precision"
         */
        gold: 'rounded-full bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30',

        /**
         * gold-solid — Filled gold (e.g., "In Stock" on hero product cards)
         */
        'gold-solid': 'rounded-full bg-[#f2ca50] text-[#3c2f00] font-semibold border-transparent',

        // ── V3-X Spec chips ──
        // DESIGN.md: "Audio Spec Chips: pill-shaped, Tertiary text, subtle border"
        // Tertiary color from DESIGN.md: #bfcdff

        /**
         * spec — Technical data chip (32Ω, Hi-Res Audio, 4.4mm Balanced)
         * Monospace font applied via text-spec utility on parent or override
         */
        spec: 'rounded-full border border-[#4d4635] bg-[#1e2020] text-[#bfcdff] font-mono text-[0.6875rem] tracking-wide px-2.5 py-0.5',

        /**
         * spec-neutral — Slightly softer for less prominent specs
         */
        'spec-neutral':
          'rounded-full border border-[#4d4635] bg-[#1a1c1c] text-[#d0c5af] font-mono text-[0.6875rem] tracking-wide px-2.5 py-0.5',

        // ── V3-X Order / inventory status badges ──
        // DESIGN.md: "Status: rendered in desaturated tones"
        // Colors mapped from --status-* tokens

        /**
         * status-processing — Amber/gold tone
         */
        'status-processing':
          'rounded-full bg-[var(--status-processing)] text-[var(--status-processing-fg)] border border-[var(--status-processing-fg)]/20',

        /**
         * status-shipped — Blue tone
         */
        'status-shipped':
          'rounded-full bg-[var(--status-shipped)] text-[var(--status-shipped-fg)] border border-[var(--status-shipped-fg)]/20',

        /**
         * status-delivered — Green tone
         */
        'status-delivered':
          'rounded-full bg-[var(--status-delivered)] text-[var(--status-delivered-fg)] border border-[var(--status-delivered-fg)]/20',

        /**
         * status-cancelled — Red tone (desaturated)
         */
        'status-cancelled':
          'rounded-full bg-[var(--status-cancelled)] text-[var(--status-cancelled-fg)] border border-[var(--status-cancelled-fg)]/20',

        /**
         * status-low-stock — Warning amber
         */
        'status-low-stock':
          'rounded-full bg-[var(--status-low-stock)] text-[var(--status-low-stock-fg)] border border-[var(--status-low-stock-fg)]/30',

        /**
         * status-in-stock — Delivered green reused for "In Stock"
         */
        'status-in-stock':
          'rounded-full bg-[var(--status-delivered)] text-[var(--status-delivered-fg)] border border-[var(--status-delivered-fg)]/20',

        /**
         * status-pre-order — Tertiary blue tone
         */
        'status-pre-order':
          'rounded-full bg-[var(--status-shipped)] text-[var(--status-shipped-fg)] border border-[var(--status-shipped-fg)]/20',
      },

      /**
       * dot — Prepend a colored dot indicator (like in order-history mockup)
       * Usage: <Badge variant="status-processing" dot>Processing</Badge>
       */
      dot: {
        true: 'pl-2 before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-current before:opacity-80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      dot: false,
    },
  },
);

function Badge({
  className,
  variant = 'default',
  dot = false,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, dot }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
