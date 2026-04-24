'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '~/lib/utils';

/**
 * V3-X Audio Checkbox
 *
 * Per DESIGN.md:
 * "Checkboxes/Radios: Custom styled with a Gold fill when active;
 *  the unselected state should be a subtle neutral border."
 *
 * - Unchecked: dark bg (#1a1c1c) + subtle border (#4d4635)
 * - Checked: gold fill (#f2ca50) + dark check icon (#3c2f00)
 * - Indeterminate: gold bg at 60% opacity
 * - Focus: gold ring
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Shape: 4px radius for checkboxes (DESIGN.md "Small" = 8px, halved for checkbox)
        'peer size-4 shrink-0 rounded-[4px]',
        // Unchecked: dark surface + muted border
        'border border-[#4d4635] bg-[#1a1c1c]',
        // Checked: gold fill
        'data-[state=checked]:bg-[#f2ca50] data-[state=checked]:border-[#f2ca50]',
        // Indeterminate
        'data-[state=indeterminate]:bg-[#f2ca50]/60 data-[state=indeterminate]:border-[#f2ca50]/60',
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
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {/* Check icon: dark (#3c2f00) on gold background */}
        <CheckIcon className="size-3 text-[#3c2f00] stroke-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
