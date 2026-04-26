import {
  BatteryIcon as BatteryLifeIcon,
  RadioIcon as DriverIcon,
  ActivityIcon as FrequencyIcon,
  WifiIcon as HiResIcon,
  ZapIcon as ImpedanceIcon,
  MicIcon as MicrophoneIcon,
  GaugeIcon as SensitivityIcon,
  WeightIcon,
  BluetoothIcon as WirelessIcon,
} from 'lucide-react';
import type { ComponentProps, ElementType } from 'react';
import { cn } from '~/lib/utils';

/**
 * SpecChip — Technical specification pill
 *
 * DESIGN.md: "Small, pill-shaped containers with Tertiary text color
 * and subtle border to display technical data (e.g., '32Ω', 'Hi-Res')."
 *
 * Auto-detects icon from label string for common audio spec patterns.
 */

export type SpecType =
  | 'impedance'
  | 'frequency'
  | 'driver'
  | 'weight'
  | 'battery'
  | 'wireless'
  | 'quality'
  | 'connector'
  | 'sensitivity'
  | 'mic'
  | 'generic';

const SPEC_ICONS: Record<SpecType, ElementType | null> = {
  impedance: ImpedanceIcon,
  frequency: FrequencyIcon,
  driver: DriverIcon,
  weight: WeightIcon,
  battery: BatteryLifeIcon,
  wireless: WirelessIcon,
  quality: HiResIcon,
  connector: null,
  sensitivity: SensitivityIcon,
  mic: MicrophoneIcon,
  generic: null,
};

function detectType(label: string): SpecType {
  if (/\d+\s*ω/i.test(label)) return 'impedance';
  if (/hz|khz/i.test(label)) return 'frequency';
  if (/planar|dynamic|ba|tribrid|driver/i.test(label)) return 'driver';
  if (/\d+\s*g$/.test(label.toLowerCase())) return 'weight';
  if (/hour|hr|battery/i.test(label)) return 'battery';
  if (/bluetooth|bt\s*\d|wireless/i.test(label)) return 'wireless';
  if (/hi.res|hires|lossless|dsd|mqa/i.test(label)) return 'quality';
  if (/mm|pin|xlr|balanced|se$/i.test(label)) return 'connector';
  if (/db\/mw|sensitivity/i.test(label)) return 'sensitivity';
  if (/mic|microphone/i.test(label)) return 'mic';
  return 'generic';
}

interface SpecChipProps extends ComponentProps<'span'> {
  label: string;
  type?: SpecType;
  size?: 'sm' | 'md';
}

function SpecChip({ label, type, size = 'sm', className, ...props }: SpecChipProps) {
  const resolvedType = type ?? detectType(label);
  const Icon = SPEC_ICONS[resolvedType];

  return (
    <span
      data-slot="spec-chip"
      className={cn(
        // Pill shape + tertiary color token (light/dark via CSS var)
        'inline-flex items-center gap-1.5 rounded-full border',
        'border-outline-variant bg-surface-container text-tertiary',
        'font-mono font-medium leading-none whitespace-nowrap',
        'transition-all duration-200 ease-out',
        size === 'sm' && 'px-2 py-0.5 text-[10.5px] tracking-wide',
        size === 'md' && 'px-2.5 py-1 text-xs tracking-wide',
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn('shrink-0 text-outline-brand', size === 'sm' ? 'size-2.5' : 'size-3')} strokeWidth={2} />
      )}
      {label}
    </span>
  );
}

export { SpecChip };
