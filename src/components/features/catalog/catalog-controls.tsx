'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CatalogHeader, type SortOption } from '~/components/features/catalog/catalog-header';
import { FilterSidebar, type FilterState } from '~/components/features/catalog/filter-sidebar';

/**
 * URL param schema for catalog:
 *   sort     — 'featured' | 'price-asc' | 'price-desc' | 'newest'
 *   drivers  — comma-separated DriverType values
 *   sigs     — comma-separated SoundSig values
 *   imp_min  — impedance range min (omit when at floor)
 *   imp_max  — impedance range max (omit when at ceiling)
 *   in_stock — '1' when true
 */

interface UseUrlParamsReturn {
  pushParams: (patch: Record<string, string | null>) => void;
}

/** Shared hook — pushes patches onto URL search params without full navigation */
function useUrlParams(): UseUrlParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return { pushParams };
}

// ── FilterSidebarControl ──────────────────────────────────────────────────

interface FilterSidebarControlProps {
  defaultFilters: FilterState;
  impedanceMin: number;
  impedanceMax: number;
}

/**
 * FilterSidebarControl — Thin client wrapper around FilterSidebar.
 * Converts filter changes into URL search params.
 */
function FilterSidebarControl({ defaultFilters, impedanceMin, impedanceMax }: FilterSidebarControlProps) {
  const { pushParams } = useUrlParams();

  const handleFilterChange = useCallback(
    (state: FilterState) => {
      pushParams({
        drivers: state.driverTypes.length > 0 ? state.driverTypes.join(',') : null,
        sigs: state.soundSigs.length > 0 ? state.soundSigs.join(',') : null,
        imp_min: state.impedanceRange[0] !== impedanceMin ? String(state.impedanceRange[0]) : null,
        imp_max: state.impedanceRange[1] !== impedanceMax ? String(state.impedanceRange[1]) : null,
        in_stock: state.inStockOnly ? '1' : null,
      });
    },
    [pushParams, impedanceMin, impedanceMax],
  );

  return (
    <FilterSidebar
      value={defaultFilters}
      onFilterChange={handleFilterChange}
      impedanceMin={impedanceMin}
      impedanceMax={impedanceMax}
    />
  );
}

// ── CatalogSortControl ────────────────────────────────────────────────────

interface CatalogSortControlProps {
  title: string;
  count: number;
  defaultSort: SortOption;
}

/**
 * CatalogSortControl — Thin client wrapper around CatalogHeader.
 * Converts sort changes into URL search params.
 */
function CatalogSortControl({ title, count, defaultSort }: CatalogSortControlProps) {
  const { pushParams } = useUrlParams();

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      pushParams({ sort: sort === 'featured' ? null : sort });
    },
    [pushParams],
  );

  return <CatalogHeader title={title} count={count} sort={defaultSort} onSortChange={handleSortChange} />;
}

export { FilterSidebarControl, CatalogSortControl };
export type { FilterSidebarControlProps, CatalogSortControlProps };
