'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '~/lib/utils';

/**
 * V3-X Audio Slider
 *
 * Used in:
 * 1. Catalog filter — Impedance range (16Ω - 300Ω)
 * 2. VirtualSandbox — LOW / MID / HIGH EQ sliders
 *
 * Per DESIGN.md: "Gold accent for interactive states"
 * Per design mockup: gold thumb, gold filled track
 *
 * - Track: dark surface (#1a1c1c), gold filled range
 * - Thumb: gold (#f2ca50) circle, dark border, subtle shadow
 * - Focus: gold ring
 *
 * Supports both single value and range (two thumbs).
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // Support both controlled and uncontrolled
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        // Vertical support
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        'disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative grow overflow-hidden rounded-full',
          // Horizontal
          'h-1 w-full bg-[#292a2a]',
          // Vertical
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1',
        )}
      >
        {/* Filled range — gold */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'absolute rounded-full bg-[#f2ca50]',
            'data-[orientation=horizontal]:h-full',
            'data-[orientation=vertical]:w-full',
          )}
        />
      </SliderPrimitive.Track>

      {/* Render a thumb for each value */}
      {_values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={`slider-thumb-${i.toString()}`}
          data-slot="slider-thumb"
          className={cn(
            // Shape
            'block size-4 rounded-full',
            // Gold thumb
            'bg-[#f2ca50] border-2 border-[#3c2f00]/30',
            // Shadow for depth on dark bg
            'shadow-[0_0_0_3px_#f2ca50/15]',
            // Transition
            'transition-all duration-200 ease-out',
            // Hover: slightly larger / brighter
            'hover:bg-[#ffe088] hover:shadow-[0_0_0_4px_#f2ca50/25]',
            // Focus
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2ca50]/40 focus-visible:ring-offset-0',
            // Disabled
            'disabled:pointer-events-none',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
