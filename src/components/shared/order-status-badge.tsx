import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * OrderStatusBadge
 *
 * Maps order/inventory status to the correct badge style using
 * CSS variable tokens defined in globals.css.
 * No inline styles — all colors via Tailwind token classes.
 */

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';

export type InventoryStatus = 'in_stock' | 'out_of_stock' | 'low_stock' | 'pre_order';

type Status = OrderStatus | InventoryStatus;

// All class strings are static so Tailwind's JIT picks them up at build time
const STATUS_CLASSES: Record<Status, { label: string; classes: string }> = {
  pending: {
    label: 'Pending',
    classes: 'bg-status-processing text-status-processing-fg border-status-processing-fg/20',
  },
  processing: {
    label: 'Processing',
    classes: 'bg-status-processing text-status-processing-fg border-status-processing-fg/20',
  },
  shipped: {
    label: 'Shipped',
    classes: 'bg-status-shipped text-status-shipped-fg border-status-shipped-fg/20',
  },
  delivered: {
    label: 'Delivered',
    classes: 'bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-status-cancelled text-status-cancelled-fg border-status-cancelled-fg/20',
  },
  refunded: {
    label: 'Refunded',
    classes: 'bg-status-cancelled text-status-cancelled-fg border-status-cancelled-fg/20',
  },
  in_stock: {
    label: 'In Stock',
    classes: 'bg-status-delivered text-status-delivered-fg border-status-delivered-fg/20',
  },
  low_stock: {
    label: 'Low Stock',
    classes: 'bg-status-low-stock text-status-low-stock-fg border-status-low-stock-fg/25',
  },
  out_of_stock: {
    label: 'Out of Stock',
    classes: 'bg-status-cancelled text-status-cancelled-fg border-status-cancelled-fg/20',
  },
  pre_order: {
    label: 'Pre-order',
    classes: 'bg-status-shipped text-status-shipped-fg border-status-shipped-fg/20',
  },
};

interface OrderStatusBadgeProps extends ComponentProps<'span'> {
  status: Status;
  dot?: boolean;
  size?: 'sm' | 'md';
}

function OrderStatusBadge({ status, dot = false, size = 'sm', className, ...props }: OrderStatusBadgeProps) {
  const config = STATUS_CLASSES[status] ?? STATUS_CLASSES.pending;

  return (
    <span
      data-slot="order-status-badge"
      data-status={status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        'transition-all duration-200 ease-out',
        config.classes,
        size === 'sm' && 'px-2.5 py-0.5 text-[11px]',
        size === 'md' && 'px-3 py-1 text-xs',
        className,
      )}
      {...props}
    >
      {/* Dot uses bg-current — inherits text color, no inline style needed */}
      {dot && <span className="inline-block size-1.5 rounded-full bg-current opacity-85 shrink-0" />}
      {config.label}
    </span>
  );
}

export { OrderStatusBadge };
