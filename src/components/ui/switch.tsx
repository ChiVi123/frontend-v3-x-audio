'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import type * as React from 'react';

import { cn } from '~/lib/utils';

/**
 * V3-X Audio Switch
 *
 * Per DESIGN.md philosophy — gold when active, subtle when off.
 * Used in catalog filter: "In Stock Only" toggle.
 *
 * - Off: dark track (#1a1c1c) + muted border, white thumb
 * - On: gold track (#f2ca50), dark thumb (#3c2f00)
 * - Thumb: smooth slide transition 200ms
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Track shape & size
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
        // Off state track
        'border border-[#4d4635] bg-[#1a1c1c]',
        // On state track: gold
        'data-[state=checked]:bg-[#f2ca50] data-[state=checked]:border-[#f2ca50]',
        // Transition
        'transition-all duration-200 ease-out outline-none',
        // Focus
        'focus-visible:ring-2 focus-visible:ring-[#f2ca50]/30 focus-visible:border-[#f2ca50]/80',
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
          // Off: off-white thumb
          'bg-[#99907c] translate-x-0.5',
          // On: dark thumb on gold track
          'data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-[#3c2f00]',
          // Slide transition
          'transition-transform duration-200 ease-out',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
