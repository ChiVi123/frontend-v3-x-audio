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
  bg: string;
  fg: string;
  border: string;
}

const STATUS_MAP: Record<Status, StatusConfig> = {
  // Order statuses
  pending: {
    label: 'Pending',
    bg: '#3a2e10',
    fg: '#e9c349',
    border: 'rgba(233,195,73,0.18)',
  },
  processing: {
    label: 'Processing',
    bg: '#3a2e10',
    fg: '#e9c349',
    border: 'rgba(233,195,73,0.18)',
  },
  shipped: {
    label: 'Shipped',
    bg: '#0f2040',
    fg: '#97b0ff',
    border: 'rgba(151,176,255,0.18)',
  },
  delivered: {
    label: 'Delivered',
    bg: '#0a2318',
    fg: '#6bcf99',
    border: 'rgba(107,207,153,0.18)',
  },
  completed: {
    label: 'Completed',
    bg: '#0a2318',
    fg: '#6bcf99',
    border: 'rgba(107,207,153,0.18)',
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#2a1010',
    fg: '#ffb4ab',
    border: 'rgba(255,180,171,0.18)',
  },
  refunded: {
    label: 'Refunded',
    bg: '#2a1010',
    fg: '#ffb4ab',
    border: 'rgba(255,180,171,0.18)',
  },
  // Inventory statuses
  in_stock: {
    label: 'In Stock',
    bg: '#0a2318',
    fg: '#6bcf99',
    border: 'rgba(107,207,153,0.18)',
  },
  low_stock: {
    label: 'Low Stock',
    bg: '#2e1f08',
    fg: '#e9c349',
    border: 'rgba(233,195,73,0.25)',
  },
  out_of_stock: {
    label: 'Out of Stock',
    bg: '#2a1010',
    fg: '#ffb4ab',
    border: 'rgba(255,180,171,0.18)',
  },
  pre_order: {
    label: 'Pre-order',
    bg: '#0f2040',
    fg: '#97b0ff',
    border: 'rgba(151,176,255,0.18)',
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
        className,
      )}
      style={{
        background: config.bg,
        color: config.fg,
        borderColor: config.border,
      }}
      {...props}
    >
      {dot && (
        <span
          className="inline-block rounded-full shrink-0"
          style={{
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
            background: config.fg,
            opacity: 0.85,
          }}
        />
      )}
      {config.label}
    </span>
  );
}

export { OrderStatusBadge };
