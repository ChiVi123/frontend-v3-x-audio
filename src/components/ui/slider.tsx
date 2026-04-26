'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * V3-X Audio Slider
 *
 * Used in: catalog Impedance filter (range / two thumbs),
 *          VirtualSandbox EQ (single value per band).
 *
 * DESIGN.md: Gold thumb + gold filled range track.
 * Uses primary token so it adapts to light/dark automatically.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  // Determine number of thumbs from value/defaultValue for key generation
  const thumbCount = Array.isArray(value) ? value.length : Array.isArray(defaultValue) ? defaultValue.length : 1;

  // Stable keys for min/max thumbs — never use index
  const thumbKeys = thumbCount === 2 ? ['thumb-min', 'thumb-max'] : ['thumb-single'];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        'disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-full bg-surface-container-high',
          'h-1 w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1',
        )}
      >
        {/* Filled range — gold (primary) */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute rounded-full bg-primary',
            'data-[orientation=horizontal]:h-full',
            'data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>

      {/* Named thumb keys — no index used */}
      {thumbKeys.map((key) => (
        <SliderPrimitive.Thumb
          key={key}
          data-slot="slider-thumb"
          className={cn(
            'block size-4 rounded-full',
            // Gold thumb with dark border for contrast
            'bg-primary border-2 border-primary-foreground/30',
            // Subtle glow
            'shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_15%,transparent)]',
            // Hover: brighter + larger glow
            'hover:shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]',
            // Transition
            'transition-all duration-200 ease-out',
            // Focus
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            // Disabled
            'disabled:pointer-events-none',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
