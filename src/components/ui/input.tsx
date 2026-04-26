import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * V3-X Audio Input
 *
 * DESIGN.md: "Darker-than-surface background with a subtle bottom border
 * that transforms into a full Gold outline when focused."
 *
 * Uses CSS variable tokens so light/dark/system modes all work correctly.
 */
function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & shape — 8px radius (DESIGN.md "Small" tier)
        'h-10 w-full min-w-0 rounded-lg px-3 py-2 text-sm',
        // Typography
        'font-sans text-on-surface placeholder:text-outline-brand',
        // Surface: input token (surface-container-low in dark, near-white in light)
        'bg-input border border-outline-variant',
        // Transition
        'transition-all duration-200 ease-out outline-none',
        // Focus: gold outline
        'focus-visible:border-primary/80 focus-visible:ring-2 focus-visible:ring-primary/25',
        // File input
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
        // Error state
        'aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
