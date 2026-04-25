import { CheckCircle2, Home, Package, Truck } from 'lucide-react';
import type * as React from 'react';
import { cn } from '~/lib/utils';

/**
 * OrderTrackingBar — Order status stepper
 *
 * Matches order_detail.png:
 * Confirmed → Processing → Shipped → Delivered
 * Active step highlighted in gold, completed steps filled gold,
 * future steps muted.
 *
 * No shadcn equivalent — fully custom per design.
 */

export type TrackingStep = 'confirmed' | 'processing' | 'shipped' | 'delivered';

const STEPS: { key: TrackingStep; label: string; Icon: React.ElementType }[] = [
  { key: 'confirmed', label: 'Confirmed', Icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', Icon: Package },
  { key: 'shipped', label: 'Shipped', Icon: Truck },
  { key: 'delivered', label: 'Delivered', Icon: Home },
];

const STEP_INDEX: Record<TrackingStep, number> = {
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

interface OrderTrackingBarProps extends React.ComponentProps<'ul'> {
  currentStep: TrackingStep;
}

function OrderTrackingBar({ currentStep, className, ...props }: OrderTrackingBarProps) {
  const currentIdx = STEP_INDEX[currentStep];

  return (
    <ul
      data-slot="order-tracking-bar"
      className={cn('w-full', className)}
      aria-label="Order tracking status"
      {...props}
    >
      <div className="relative flex items-start justify-between">
        {/* Connector lines — drawn between steps (100%/8=12.5%)*/}
        <div className="pointer-events-none absolute top-[18px] left-0 right-0 flex items-center px-[12.5%]">
          {STEPS.slice(0, -1).map(({ key }, i) => {
            const isCompleted = i < currentIdx;
            return (
              <div key={key} className="flex-1 relative h-px overflow-hidden" style={{ background: '#292a2a' }}>
                {/* Gold fill for completed segments */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                  style={{
                    width: isCompleted ? '100%' : '0%',
                    background: '#f2ca50',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Steps */}
        {STEPS.map(({ key, label, Icon }, i) => {
          const isCompleted = i < currentIdx;
          const isActive = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <li
              key={key}
              aria-current={isActive ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center gap-2"
              style={{ flex: '1 1 0' }}
            >
              {/* Icon circle */}
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out',
                  // Completed: gold filled
                  isCompleted && 'border-[#f2ca50] bg-[#f2ca50]',
                  // Active: gold border, dark bg, gold icon
                  isActive && 'border-[#f2ca50] bg-[#1e2020] shadow-[0_0_12px_rgba(242,202,80,0.25)]',
                  // Future: muted
                  isFuture && 'border-[#292a2a] bg-[#1a1c1c]',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 transition-colors duration-300',
                    isCompleted && 'text-[#3c2f00]',
                    isActive && 'text-[#f2ca50]',
                    isFuture && 'text-[#4d4635]',
                  )}
                  strokeWidth={isCompleted ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-center font-mono text-[10px] font-medium uppercase tracking-wider transition-colors duration-300',
                  isCompleted && 'text-[#f2ca50]',
                  isActive && 'text-[#e3e2e2]',
                  isFuture && 'text-[#4d4635]',
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </div>
    </ul>
  );
}

export { OrderTrackingBar };
