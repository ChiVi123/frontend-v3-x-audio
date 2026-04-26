import { TrendingDownIcon as TrendDownIcon, TrendingUpIcon as TrendUpIcon } from 'lucide-react';
import type { ComponentProps, ElementType } from 'react';
import { cn } from '~/lib/utils';

/**
 * StatCard — Admin dashboard KPI card
 *
 * Matches admin_dashboard.png: icon, label, large value, trend badge.
 * Uses theme tokens — adapts to light/dark/system.
 */

interface StatCardProps extends ComponentProps<'div'> {
  icon: ElementType;
  label: string;
  value: string | number;
  /** Percentage (number) or custom status string */
  trend?: number | string;
  variant?: 'default' | 'warning';
}

function StatCard({ icon: Icon, label, value, trend, variant = 'default', className, ...props }: StatCardProps) {
  const renderTrend = () => {
    if (trend === undefined) return null;

    if (typeof trend === 'number') {
      const positive = trend >= 0;
      return (
        <div
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-0.5',
            positive
              ? 'border-status-delivered-fg/20 bg-status-delivered text-status-delivered-fg'
              : 'border-status-cancelled-fg/20 bg-status-cancelled text-status-cancelled-fg',
          )}
        >
          {positive ? <TrendUpIcon className="size-2.5" /> : <TrendDownIcon className="size-2.5" />}
          <span className="font-mono text-[10px] font-medium">
            {positive ? '+' : ''}
            {trend}%
          </span>
        </div>
      );
    }

    // String status tag
    const isWarning = variant === 'warning' || trend === 'Low Stock';
    return (
      <div
        className={cn(
          'flex items-center gap-1 rounded-full border px-2 py-0.5',
          isWarning
            ? 'border-status-processing-fg/20 bg-status-processing text-status-processing-fg'
            : 'border-outline-variant bg-surface-container text-on-surface-variant',
        )}
      >
        {isWarning && <span className="inline-block size-1.5 rounded-full bg-current" />}
        <span className="font-mono text-[10px] font-medium">{trend}</span>
      </div>
    );
  };

  return (
    <div
      data-slot="stat-card"
      data-variant={variant}
      className={cn(
        'flex flex-col gap-4 rounded-xl border p-5',
        'transition-all duration-200 ease-out',
        variant === 'default' && 'border-surface-container-high bg-surface-container',
        variant === 'warning' && 'border-status-processing-fg/20 bg-surface-container',
        className,
      )}
      {...props}
    >
      {/* Icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-lg',
            variant === 'default' && 'bg-surface-container-high',
            variant === 'warning' && 'bg-status-processing',
          )}
        >
          <Icon
            className={cn(
              'size-4',
              variant === 'default' && 'text-primary',
              variant === 'warning' && 'text-status-processing-fg',
            )}
            strokeWidth={1.5}
          />
        </div>
        {renderTrend()}
      </div>

      {/* Label + value */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
          {label}
        </span>
        <span className="font-heading text-3xl font-medium leading-none tracking-tight text-on-surface">{value}</span>
      </div>
    </div>
  );
}

export { StatCard };
