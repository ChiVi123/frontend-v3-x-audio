'use client';

import { CheckIcon as CheckmarkIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * V3-X Audio Checkbox
 *
 * DESIGN.md: "Gold fill when active; subtle neutral border when unselected."
 * Uses primary/primary-foreground tokens for consistent light + dark theming.
 */
function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Shape — 4px radius (smaller than button, intentional for form controls)
        'peer size-4 shrink-0 rounded',
        // Unchecked: input surface + muted border
        'border border-outline-variant bg-input',
        // Checked: primary (gold) fill
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        // Indeterminate
        'data-[state=indeterminate]:bg-primary/60 data-[state=indeterminate]:border-primary/60',
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
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {/* Dark icon on gold background — primary-foreground ensures contrast */}
        <CheckmarkIcon className="size-3 text-primary-foreground stroke-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
