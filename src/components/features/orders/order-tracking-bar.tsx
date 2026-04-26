import {
  CheckCircle2Icon as ConfirmedIcon,
  HomeIcon as DeliveredIcon,
  PackageIcon as ProcessingIcon,
  TruckIcon as ShippedIcon,
} from 'lucide-react';
import type { ElementType } from 'react';
import { cn } from '~/lib/utils';

/**
 * OrderTrackingBar — Order status stepper
 *
 * Matches order_detail.png: Confirmed → Processing → Shipped → Delivered
 * No shadcn equivalent — fully custom.
 * Uses theme tokens for light/dark compatibility.
 */

export type TrackingStep = 'confirmed' | 'processing' | 'shipped' | 'delivered';

interface StepConfig {
  key: TrackingStep;
  label: string;
  Icon: ElementType;
}

const STEPS: StepConfig[] = [
  { key: 'confirmed', label: 'Confirmed', Icon: ConfirmedIcon },
  { key: 'processing', label: 'Processing', Icon: ProcessingIcon },
  { key: 'shipped', label: 'Shipped', Icon: ShippedIcon },
  { key: 'delivered', label: 'Delivered', Icon: DeliveredIcon },
];

const STEP_INDEX: Record<TrackingStep, number> = {
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

interface OrderTrackingBarProps {
  currentStep: TrackingStep;
  className?: string;
}

function OrderTrackingBar({ currentStep, className }: OrderTrackingBarProps) {
  const currentIdx = STEP_INDEX[currentStep];

  return (
    <ul data-slot="order-tracking-bar" aria-label="Order tracking status" className={cn('w-full', className)}>
      <div className="relative flex items-start justify-between">
        {/* Connector lines — absolutely positioned between steps, divide space to eighths for equal spacing (4 steps = 3 segments, so 8ths, 100% / 8 = 12.5% for each segment.) */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[18px] left-0 right-0 flex items-center px-[12.5%]"
        >
          {STEPS.slice(0, -1).map((step, segIdx) => {
            const isCompleted = segIdx < currentIdx;
            return (
              <div key={`seg-${step.key}`} className="relative flex-1 h-px overflow-hidden bg-surface-container-high">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 transition-all duration-500 ease-out',
                    isCompleted ? 'w-full bg-primary' : 'w-0',
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Steps — keyed by step.key (stable string), not index */}
        {STEPS.map(({ key, label, Icon }) => {
          const stepIdx = STEP_INDEX[key];
          const isCompleted = stepIdx < currentIdx;
          const isActive = stepIdx === currentIdx;
          const isFuture = stepIdx > currentIdx;

          return (
            <li
              key={key}
              aria-current={isActive ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center gap-2 flex-1"
            >
              {/* Icon circle */}
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2',
                  'transition-all duration-300 ease-out',
                  isCompleted && 'border-primary bg-primary',
                  isActive &&
                    'border-primary bg-surface-container shadow-[0_0_12px_color-mix(in_oklab,var(--color-primary)_25%,transparent)]',
                  isFuture && 'border-surface-container-high bg-surface-container-low',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 transition-colors duration-300',
                    isCompleted && 'text-primary-foreground',
                    isActive && 'text-primary',
                    isFuture && 'text-outline-variant',
                  )}
                  strokeWidth={isCompleted ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-center font-mono text-[10px] font-medium uppercase tracking-wider',
                  'transition-colors duration-300',
                  isCompleted && 'text-primary',
                  isActive && 'text-on-surface',
                  isFuture && 'text-outline-variant',
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
