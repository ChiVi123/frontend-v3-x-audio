import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';

import { cn } from '~/lib/utils';

const buttonVariants = cva(
  // Base: consistent with DESIGN.md — 8px radius for buttons, 200ms ease-out transitions
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // ── shadcn originals (kept for compatibility) ──
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border-border bg-transparent hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/20 dark:hover:bg-input/40',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/60',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline',

        // ── V3-X Gold variants (per DESIGN.md spec) ──

        /**
         * gold — Primary CTA
         * Solid gold background + dark text. Highest contrast.
         * "Primary Buttons: Solid Gold background with Dark text."
         */
        gold: 'bg-[#f2ca50] text-[#3c2f00] border-transparent hover:bg-[#e9c349] active:bg-[#d4af37] focus-visible:ring-[#f2ca50]/40 font-semibold tracking-wide',

        /**
         * ghost-gold — Secondary CTA
         * Ghost style with gold border + gold text.
         * "Secondary Buttons: Ghost style with medium-contrast neutral border."
         * Elevated to gold border for brand clarity on dark surfaces.
         */
        'ghost-gold':
          'border border-[#4d4635] text-[#f2ca50] bg-transparent hover:bg-[#f2ca50]/10 hover:border-[#f2ca50]/60 active:bg-[#f2ca50]/15 focus-visible:ring-[#f2ca50]/30',

        /**
         * ghost-neutral — True secondary ghost per DESIGN.md
         * Neutral border, off-white text. For non-primary actions on dark.
         */
        'ghost-neutral':
          'border border-[#4d4635] text-[#d0c5af] bg-transparent hover:bg-[#1e2020] hover:text-[#e3e2e2] hover:border-[#99907c] active:bg-[#292a2a]',
      },
      size: {
        default: 'h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-lg px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-2 px-6 text-base tracking-wide',
        xl: 'h-14 gap-2 px-8 text-base tracking-widest uppercase font-semibold',
        icon: 'size-10',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
