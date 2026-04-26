import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

const badgeVariants = cva(
  // Base — pill shape (DESIGN.md: "Pill: Exclusively for status badges and technical tags")
  'group/badge inline-flex h-fit w-fit shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap border border-transparent font-medium transition-all duration-200 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        // ── shadcn originals ──
        default: 'rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs',
        secondary: 'rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs',
        destructive: 'rounded-full bg-destructive/15 text-destructive border-destructive/20 px-2.5 py-0.5 text-xs',
        outline: 'rounded-full border-border text-foreground px-2.5 py-0.5 text-xs',

        // ── V3-X: Gold signifier (NEW, LIMITED, EXCLUSIVE) ──
        gold: 'rounded-full bg-primary/15 text-primary border border-primary/30 px-2.5 py-0.5 text-xs',

        // ── V3-X: Filled gold (hero "In Stock" overlay) ──
        'gold-solid': 'rounded-full bg-primary text-primary-foreground font-semibold px-2.5 py-0.5 text-xs',

        // ── V3-X: Technical spec chip (32Ω, Hi-Res Audio) ──
        // DESIGN.md: "Tertiary text, subtle border, pill-shaped"
        spec: 'rounded-full border-outline-variant bg-surface-container text-tertiary font-mono text-[0.6875rem] tracking-wide px-2.5 py-0.5',

        'spec-neutral':
          'rounded-full border-outline-variant bg-surface-container-low text-on-surface-variant font-mono text-[0.6875rem] tracking-wide px-2.5 py-0.5',

        // ── Order status badges — use CSS variable tokens ──
        'status-processing':
          'rounded-full bg-status-processing text-status-processing-fg border-status-processing-fg/20 px-2.5 py-0.5 text-[11px]',
        'status-shipped':
          'rounded-full bg-status-shipped text-status-shipped-fg border-status-shipped-fg/20 px-2.5 py-0.5 text-[11px]',
        'status-delivered':
          'rounded-full bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20 px-2.5 py-0.5 text-[11px]',
        'status-cancelled':
          'rounded-full bg-status-cancelled text-status-cancelled-fg border-status-cancelled-fg/20 px-2.5 py-0.5 text-[11px]',
        'status-low-stock':
          'rounded-full bg-status-low-stock text-status-low-stock-fg border-status-low-stock-fg/25 px-2.5 py-0.5 text-[11px]',
        'status-in-stock':
          'rounded-full bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20 px-2.5 py-0.5 text-[11px]',
        'status-pre-order':
          'rounded-full bg-status-shipped text-status-shipped-fg border-status-shipped-fg/20 px-2.5 py-0.5 text-[11px]',
      },

      // Prepend a dot indicator (order-history style)
      dot: {
        true: 'before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-current before:opacity-80',
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
}: ComponentProps<'span'> &
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
