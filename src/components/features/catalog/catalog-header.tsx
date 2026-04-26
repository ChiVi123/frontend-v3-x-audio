'use client';

import type { ComponentProps } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { cn } from '~/lib/utils';

/**
 * CatalogHeader — Top bar for the catalog grid
 *
 * Matches catalog.png: category title, product count, Sort By select.
 * Client component because of the Select interaction.
 */

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

interface CatalogHeaderProps extends ComponentProps<'div'> {
  title: string;
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

function CatalogHeader({ title, count, sort, onSortChange, className, ...props }: CatalogHeaderProps) {
  return (
    <div data-slot="catalog-header" className={cn('flex items-end justify-between gap-4', className)} {...props}>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-4xl font-normal text-on-surface">{title}</h1>
        <p className="font-mono text-xs text-on-surface-variant">Showing {count} precision-engineered models</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Sort by:</span>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="h-8 min-w-36 border-outline-variant bg-surface-container font-mono text-xs text-on-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="font-mono text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export { CatalogHeader };
