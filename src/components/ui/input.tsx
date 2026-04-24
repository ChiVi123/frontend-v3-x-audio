import type * as React from 'react';

import { cn } from '~/lib/utils';

/**
 * V3-X Audio Input
 *
 * Per DESIGN.md:
 * "Input Fields: Darker-than-surface background with a subtle bottom border
 *  that transforms into a full Gold outline when focused."
 *
 * Implementation:
 * - bg: surface-container-low (#1a1c1c) — darker than card surface
 * - default border: subtle outline-variant (#4d4635)
 * - focus: full gold ring + gold border color (#f2ca50)
 * - placeholder: on-surface-variant (#d0c5af) — off-white, low vibration
 * - text: on-surface (#e3e2e2)
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & shape — 8px radius per DESIGN.md "Small" tier
        'h-10 w-full min-w-0 rounded-lg px-3 py-2 text-sm',
        // Typography
        'font-sans text-[#e3e2e2] placeholder:text-[#99907c]',
        // Surface: darker-than-card bg + subtle border
        'bg-[#1a1c1c] border border-[#4d4635]',
        // Transition: 200ms ease-out per DESIGN.md
        'transition-all duration-200 ease-out outline-none',
        // Focus: full gold outline (ring + border color shift)
        'focus-visible:border-[#f2ca50]/80 focus-visible:ring-2 focus-visible:ring-[#f2ca50]/25',
        // File input styling
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#e3e2e2]',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#1a1c1c]/50 disabled:opacity-40',
        // Invalid / error state
        'aria-invalid:border-[#ffb4ab]/60 aria-invalid:ring-2 aria-invalid:ring-[#ffb4ab]/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
