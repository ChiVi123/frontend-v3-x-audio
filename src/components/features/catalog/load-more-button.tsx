'use client';

import type { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * LoadMoreButton — Catalog infinite-scroll trigger
 *
 * Matches catalog.png "Load More Models" button.
 * Outlined style, centered below the product grid.
 */
interface LoadMoreButtonProps extends ComponentProps<'div'> {
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

function LoadMoreButton({ onLoadMore, isLoading = false, hasMore = true, className, ...props }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div data-slot="load-more" className={cn('flex justify-center pt-4', className)} {...props}>
      <Button
        variant="outline"
        size="lg"
        className="min-w-52 font-mono text-[11px] uppercase tracking-widest"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? 'Loading…' : 'Load More Models'}
      </Button>
    </div>
  );
}

export { LoadMoreButton };
