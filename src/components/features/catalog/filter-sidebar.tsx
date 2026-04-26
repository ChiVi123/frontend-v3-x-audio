'use client';

import { useCallback, useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Slider } from '~/components/ui/slider';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';

/**
 * FilterSidebar — Catalog smart filter panel
 *
 * Matches catalog.png: Driver Type checkboxes, Sound Signature pills,
 * Impedance range slider, In Stock Only switch.
 *
 * onChange renamed to onFilterChange to avoid conflict with
 * HTMLAttributes<HTMLElement>.onChange (ChangeEventHandler).
 */

// ── Types ─────────────────────────────────────────────────────────────────

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
  onFilterChange?: (state: FilterState) => void;
  impedanceMin?: number;
  impedanceMax?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const DRIVER_OPTIONS: DriverType[] = [
  'Dynamic (DD)',
  'Balanced Armature (BA)',
  'Planar Magnetic',
  'Tribrid',
  'Electrostatic',
];

const SOUND_SIG_OPTIONS: SoundSig[] = ['Reference', 'Warm & Smooth', 'V-Shaped', 'Mid-Forward', 'Bright', 'Bass Heavy'];

// Stable ID from driver name — avoids index as key
function toCheckboxId(driver: DriverType): string {
  return `driver-${driver.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
}

// ── Sub-component ──────────────────────────────────────────────────────────

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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
        {label}
      </span>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

function FilterSidebar({ value, onFilterChange, impedanceMin = 8, impedanceMax = 600, className }: FilterSidebarProps) {
  const [internal, setInternal] = useState<FilterState>(() => ({
    driverTypes: [],
    soundSigs: [],
    impedanceRange: [impedanceMin, impedanceMax],
    inStockOnly: false,
  }));

  const state = value ?? internal;

  const update = useCallback(
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
      driverTypes: [],
      soundSigs: [],
      impedanceRange: [impedanceMin, impedanceMax],
      inStockOnly: false,
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
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              'font-mono text-[10px] uppercase tracking-wider',
              'text-outline-brand hover:text-primary',
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
              const id = toCheckboxId(driver);
              const isChecked = state.driverTypes.includes(driver);
              return (
                // key on wrapper div, not on label
                <div key={driver} className="flex items-center gap-2.5">
                  <Checkbox id={id} checked={isChecked} onCheckedChange={() => toggleDriver(driver)} />
                  {/* htmlFor matches Checkbox id — satisfies a11y label rule */}
                  <label
                    htmlFor={id}
                    className={cn(
                      'cursor-pointer text-sm transition-colors duration-200',
                      isChecked ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    {driver}
                  </label>
                </div>
              );
            })}
          </div>
        </FilterSection>

        <hr className="border-surface-container-high" />

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
                    'focus-visible:ring-2 focus-visible:ring-primary/30',
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-surface-container-high bg-transparent text-outline-brand hover:border-outline-variant hover:text-on-surface-variant',
                  )}
                >
                  {sig}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <hr className="border-surface-container-high" />

        {/* ── Impedance Range ── */}
        <FilterSection label="Impedance">
          <div className="flex flex-col gap-3">
            {/* Live range display */}
            <div className="flex justify-between">
              <span className="font-mono text-xs text-on-surface-variant">{state.impedanceRange[0]}Ω</span>
              <span className="font-mono text-xs text-on-surface-variant">{state.impedanceRange[1]}Ω</span>
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
              <span className="font-mono text-[9px] text-outline-variant">{impedanceMin}Ω</span>
              <span className="font-mono text-[9px] text-outline-variant">{impedanceMax}Ω</span>
            </div>
          </div>
        </FilterSection>

        <hr className="border-surface-container-high" />

        {/* ── In Stock Only ── */}
        <div className="flex items-center justify-between">
          <label htmlFor="in-stock-toggle" className="cursor-pointer text-sm text-on-surface-variant">
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
