import type * as React from 'react';
import { cn } from '~/lib/utils';

/**
 * OrderStatusBadge
 *
 * Maps order/inventory status values to the correct visual badge.
 * Used in: Order History, Order Detail, Admin Dashboard table,
 *          Product cards (inventory status).
 *
 * Status tokens defined in globals.css:
 *   --status-processing / -fg
 *   --status-shipped / -fg
 *   --status-delivered / -fg
 *   --status-cancelled / -fg
 *   --status-low-stock / -fg
 *   --status-in-stock (reuses delivered tokens)
 *   --status-pre-order (reuses shipped tokens)
 */

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';

export type InventoryStatus = 'in_stock' | 'out_of_stock' | 'low_stock' | 'pre_order';

type Status = OrderStatus | InventoryStatus;

interface StatusConfig {
  label: string;
  className: string;
  dotClassName: string;
}

const STATUS_MAP: Record<Status, StatusConfig> = {
  // Order statuses
  pending: {
    label: 'Pending',
    className: 'bg-status-processing border-status-processing-fg/20 text-status-processing-fg',
    dotClassName: 'bg-status-processing-fg',
  },
  processing: {
    label: 'Processing',
    className: 'bg-status-processing border-status-processing-fg/20 text-status-processing-fg',
    dotClassName: 'bg-status-processing-fg',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-status-shipped border-status-shipped-fg/20 text-status-shipped-fg',
    dotClassName: 'bg-status-shipped-fg',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-status-delivered border-status-delivered-fg/20 text-status-delivered-fg',
    dotClassName: 'bg-status-delivered-fg',
  },
  completed: {
    label: 'Completed',
    className: 'bg-status-delivered border-status-delivered-fg/20 text-status-delivered-fg',
    dotClassName: 'bg-status-delivered-fg',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-status-cancelled border-status-cancelled-fg/20 text-status-cancelled-fg',
    dotClassName: 'bg-status-cancelled-fg',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-status-cancelled border-status-cancelled-fg/20 text-status-cancelled-fg',
    dotClassName: 'bg-status-cancelled-fg',
  },
  // Inventory statuses
  in_stock: {
    label: 'In Stock',
    className: 'bg-status-delivered border-status-delivered-fg/20 text-status-delivered-fg',
    dotClassName: 'bg-status-delivered-fg',
  },
  low_stock: {
    label: 'Low Stock',
    className: 'bg-status-low-stock border-status-low-stock-fg/20 text-status-low-stock-fg',
    dotClassName: 'bg-status-low-stock-fg',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-status-cancelled border-status-cancelled-fg/20 text-status-cancelled-fg',
    dotClassName: 'bg-status-cancelled-fg',
  },
  pre_order: {
    label: 'Pre-order',
    className: 'bg-status-shipped border-status-shipped-fg/20 text-status-shipped-fg',
    dotClassName: 'bg-status-shipped-fg',
  },
};

interface OrderStatusBadgeProps extends React.ComponentProps<'span'> {
  status: Status;
  /** Show leading dot indicator */
  dot?: boolean;
  size?: 'sm' | 'md';
}

function OrderStatusBadge({ status, dot = false, size = 'sm', className, ...props }: OrderStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.pending;

  return (
    <span
      data-slot="order-status-badge"
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        'transition-all duration-200 ease-out',
        size === 'sm' && 'px-2.5 py-0.5 text-[11px]',
        size === 'md' && 'px-3 py-1 text-xs',
        config.className,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full shrink-0 opacity-85',
            size === 'sm' && 'size-1.5',
            size === 'md' && 'size-2',
            config.dotClassName,
          )}
        />
      )}
      {config.label}
    </span>
  );
}

export { OrderStatusBadge };
