'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * V3-X Audio Switch
 *
 * DESIGN.md: Gold track when on, subtle muted track when off.
 * Used in catalog filter "In Stock Only" toggle.
 */
function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Track shape
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
        // Off: input surface + muted border
        'border border-outline-variant bg-input',
        // On: primary (gold) track
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        // Transition
        'transition-all duration-200 ease-out outline-none',
        // Focus
        'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/80',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb shape
          'pointer-events-none block size-3.5 rounded-full shadow-sm',
          // Off: muted thumb
          'bg-outline-brand translate-x-0.5',
          // On: dark thumb on gold track (primary-foreground)
          'data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-primary-foreground',
          // Slide transition
          'transition-transform duration-200 ease-out',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
