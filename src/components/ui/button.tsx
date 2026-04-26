import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
  // Base — 8px radius (DESIGN.md "Small" tier), 200ms ease-out
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // ── shadcn originals ──
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border-border bg-transparent hover:bg-accent hover:text-accent-foreground dark:bg-input/20 dark:hover:bg-input/40',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline',

        // ── V3-X: Solid gold CTA (DESIGN.md: "Solid Gold background with Dark text") ──
        gold: 'bg-primary text-primary-foreground font-semibold tracking-wide hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/40',

        // ── V3-X: Ghost with gold border + gold text ──
        'ghost-gold':
          'border-outline-variant bg-transparent text-primary hover:bg-primary/10 hover:border-primary/60 active:bg-primary/15 focus-visible:ring-primary/30',

        // ── V3-X: Neutral ghost for non-primary actions on dark surfaces ──
        'ghost-neutral':
          'border-outline-variant text-on-surface-variant bg-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-brand active:bg-surface-container-high',
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
}: ComponentProps<'button'> &
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
