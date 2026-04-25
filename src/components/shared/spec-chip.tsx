import { Activity, Battery, Bluetooth, Gauge, Mic, Radio, Weight, Wifi, Zap } from 'lucide-react';
import type * as React from 'react';
import { cn } from '~/lib/utils';

/**
 * SpecChip — Technical specification pill
 *
 * Per DESIGN.md:
 * "Audio Spec Chips: Small, pill-shaped containers with Tertiary text color
 *  and subtle border to display technical data (e.g., '32Ω', 'Hi-Res')."
 *
 * Auto-detects icon from spec type string for common audio specs.
 * Falls back to no icon for unknown types.
 *
 * Usage:
 *   <SpecChip label="32Ω" type="impedance" />
 *   <SpecChip label="Hi-Res Audio" type="quality" />
 *   <SpecChip label="4.4mm Balanced" />
 */

type SpecType =
  | 'impedance' // Ω values
  | 'frequency' // Hz–kHz range
  | 'driver' // driver type
  | 'weight' // grams
  | 'battery' // hours
  | 'wireless' // bluetooth / wifi
  | 'quality' // Hi-Res, Lossless
  | 'connector' // 4.4mm, 3.5mm, 2-pin
  | 'sensitivity' // dB/mW
  | 'mic' // microphone
  | 'generic';

const SPEC_ICONS: Record<SpecType, React.ElementType | null> = {
  impedance: Zap,
  frequency: Activity,
  driver: Radio,
  weight: Weight,
  battery: Battery,
  wireless: Bluetooth,
  quality: Wifi,
  connector: null,
  sensitivity: Gauge,
  mic: Mic,
  generic: null,
};

/**
 * Auto-detect spec type from label string if type not provided.
 * Covers the most common audio spec patterns seen in mockups.
 */
function detectType(label: string): SpecType {
  const l = label.toLowerCase();
  if (/\d+\s*ω/i.test(label)) return 'impedance';
  if (/hz|khz/i.test(label)) return 'frequency';
  if (/planar|dynamic|ba|tribrid|driver/i.test(l)) return 'driver';
  if (/\d+\s*g$/.test(l)) return 'weight';
  if (/hour|hr|battery/i.test(l)) return 'battery';
  if (/bluetooth|bt\s*\d|wireless/i.test(l)) return 'wireless';
  if (/hi.res|hires|lossless|dsd|mqa/i.test(l)) return 'quality';
  if (/mm|pin|xlr|balanced|se$/i.test(l)) return 'connector';
  if (/db\/mw|sensitivity/i.test(l)) return 'sensitivity';
  if (/mic|microphone/i.test(l)) return 'mic';
  return 'generic';
}

interface SpecChipProps extends React.ComponentProps<'span'> {
  label: string;
  type?: SpecType;
  /** Slightly larger variant for product detail page */
  size?: 'sm' | 'md';
}

function SpecChip({ label, type, size = 'sm', className, ...props }: SpecChipProps) {
  const resolvedType = type ?? detectType(label);
  const Icon = SPEC_ICONS[resolvedType];

  return (
    <span
      data-slot="spec-chip"
      className={cn(
        // Pill shape per DESIGN.md
        'inline-flex items-center gap-1.5 rounded-full border',
        // Colors: tertiary text (#bfcdff) + surface-container bg + outline-variant border
        'border-border bg-card text-on-surface-variant',
        // Typography: monospace + tracked
        'font-mono font-medium leading-none whitespace-nowrap',
        // Transition
        'transition-all duration-200 ease-out',
        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-[10.5px] tracking-wide',
        size === 'md' && 'px-2.5 py-1 text-xs tracking-wide',
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn('shrink-0 text-muted-foreground', size === 'sm' ? 'size-2.5' : 'size-3')} strokeWidth={2} />
      )}
      {label}
    </span>
  );
}

export { SpecChip, type SpecType };
