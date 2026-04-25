'use client';

import * as React from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';

/**
 * FilterSidebar — Catalog smart filter panel
 *
 * Matches catalog.png left panel:
 * - Driver Type (checkboxes)
 * - Sound Signature (pill toggle buttons)
 * - Impedance range (dual-thumb slider)
 * - In Stock Only (switch)
 * - Clear All
 *
 * State is managed locally and exposed via onFilterChange callback.
 * In production: sync to URL search params with nuqs or useSearchParams.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type DriverType = 'Dynamic (DD)' | 'Balanced Armature (BA)' | 'Planar Magnetic' | 'Tribrid' | 'Electrostatic';
export type SoundSig = 'Reference' | 'Warm & Smooth' | 'V-Shaped' | 'Mid-Forward' | 'Bright' | 'Bass Heavy';

export interface FilterState {
  driverTypes: DriverType[];
  soundSigs: SoundSig[];
  impedanceRange: [number, number];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  className?: string;
  value?: FilterState;
  /**
   * Renamed from `onChange` to avoid conflict with
   * HTMLAttributes<HTMLElement>.onChange (ChangeEventHandler).
   */
  onFilterChange?: (state: FilterState) => void;
  /** Lower bound for impedance slider. Default: 8 */
  impedanceMin?: number;
  /** Upper bound for impedance slider. Default: 600 */
  impedanceMax?: number;
}

const DEFAULT_FILTER: FilterState = {
  driverTypes: [],
  soundSigs: [],
  impedanceRange: [16, 300],
  inStockOnly: false,
};

const DRIVER_OPTIONS: DriverType[] = [
  'Dynamic (DD)',
  'Balanced Armature (BA)',
  'Planar Magnetic',
  'Tribrid',
  'Electrostatic',
];

const SOUND_SIG_OPTIONS: SoundSig[] = ['Reference', 'Warm & Smooth', 'V-Shaped', 'Mid-Forward', 'Bright', 'Bass Heavy'];

// ── Sub-components ─────────────────────────────────────────────────────────

function FilterSection({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#99907c]">{label}</span>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

function FilterSidebar({ value, onFilterChange, impedanceMin = 8, impedanceMax = 600, className }: FilterSidebarProps) {
  const [internal, setInternal] = React.useState<FilterState>(() => ({
    ...DEFAULT_FILTER,
    impedanceRange: [impedanceMin, impedanceMax],
  }));

  // Controlled: use value prop; Uncontrolled: use internal state
  const state = value ?? internal;

  const update = React.useCallback(
    (patch: Partial<FilterState>) => {
      const next = { ...state, ...patch };
      setInternal(next);
      onFilterChange?.(next);
    },
    [state, onFilterChange],
  );

  const toggleDriver = (driver: DriverType) => {
    const next = state.driverTypes.includes(driver)
      ? state.driverTypes.filter((d) => d !== driver)
      : [...state.driverTypes, driver];
    update({ driverTypes: next });
  };

  const toggleSig = (sig: SoundSig) => {
    const next = state.soundSigs.includes(sig) ? state.soundSigs.filter((s) => s !== sig) : [...state.soundSigs, sig];
    update({ soundSigs: next });
  };

  const clearAll = () => {
    const reset: FilterState = {
      ...DEFAULT_FILTER,
      impedanceRange: [impedanceMin, impedanceMax],
    };
    setInternal(reset);
    onFilterChange?.(reset);
  };

  const hasActiveFilters =
    state.driverTypes.length > 0 ||
    state.soundSigs.length > 0 ||
    state.inStockOnly ||
    state.impedanceRange[0] !== impedanceMin ||
    state.impedanceRange[1] !== impedanceMax;

  return (
    <aside data-slot="filter-sidebar" className={cn('flex w-full flex-col', className)}>
      {/* ── Header ── */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e3e2e2]">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              'font-mono text-[10px] uppercase tracking-wider',
              'text-[#99907c] hover:text-[#f2ca50]',
              'transition-colors duration-200 ease-out',
              'underline underline-offset-2',
            )}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* ── Driver Type ── */}
        <FilterSection label="Driver Type">
          <div className="flex flex-col gap-2.5">
            {DRIVER_OPTIONS.map((driver) => {
              const id = `driver-${driver.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
              const isChecked = state.driverTypes.includes(driver);
              return (
                /*
                 * Fix 1: key on the wrapper <div>, not on <label>.
                 * Fix 2: <label> associated to <Checkbox> via matching htmlFor / id.
                 *         This satisfies the "form label must be associated with an input" rule
                 *         because Radix Checkbox renders a <button role="checkbox"> with that id.
                 */
                <div key={driver} className="flex items-center gap-2.5">
                  <Checkbox id={id} checked={isChecked} onCheckedChange={() => toggleDriver(driver)} />
                  <label
                    htmlFor={id}
                    className={cn(
                      'cursor-pointer text-sm transition-colors duration-200',
                      isChecked ? 'text-[#e3e2e2]' : 'text-[#d0c5af] hover:text-[#e3e2e2]',
                    )}
                  >
                    {driver}
                  </label>
                </div>
              );
            })}
          </div>
        </FilterSection>

        <div className="h-px bg-[#292a2a]" />

        {/* ── Sound Signature ── */}
        <FilterSection label="Sound Signature">
          <div className="flex flex-wrap gap-2">
            {SOUND_SIG_OPTIONS.map((sig) => {
              const isActive = state.soundSigs.includes(sig);
              return (
                <button
                  key={sig}
                  type="button"
                  onClick={() => toggleSig(sig)}
                  className={cn(
                    'rounded-full border px-3 py-1 font-sans text-xs font-medium',
                    'transition-all duration-200 ease-out outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[#f2ca50]/30',
                    isActive
                      ? 'border-[#f2ca50]/50 bg-[#f2ca50]/10 text-[#f2ca50]'
                      : 'border-[#292a2a] bg-transparent text-[#99907c] hover:border-[#4d4635] hover:text-[#d0c5af]',
                  )}
                >
                  {sig}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <div className="h-px bg-[#292a2a]" />

        {/* ── Impedance Range ── */}
        <FilterSection label="Impedance">
          <div className="flex flex-col gap-3">
            {/* Live range display */}
            <div className="flex justify-between">
              <span className="font-mono text-xs text-[#d0c5af]">{state.impedanceRange[0]}Ω</span>
              <span className="font-mono text-xs text-[#d0c5af]">{state.impedanceRange[1]}Ω</span>
            </div>

            <Slider
              min={impedanceMin}
              max={impedanceMax}
              step={1}
              value={state.impedanceRange}
              onValueChange={(v) => update({ impedanceRange: v as [number, number] })}
            />

            {/* Absolute bounds hint */}
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-[#4d4635]">{impedanceMin}Ω</span>
              <span className="font-mono text-[9px] text-[#4d4635]">{impedanceMax}Ω</span>
            </div>
          </div>
        </FilterSection>

        <div className="h-px bg-[#292a2a]" />

        {/* ── In Stock Only ── */}
        <div className="flex items-center justify-between">
          <label htmlFor="in-stock-toggle" className="cursor-pointer text-sm text-[#d0c5af]">
            In Stock Only
          </label>
          <Switch
            id="in-stock-toggle"
            checked={state.inStockOnly}
            onCheckedChange={(v) => update({ inStockOnly: v })}
          />
        </div>
      </div>
    </aside>
  );
}

export { FilterSidebar };
