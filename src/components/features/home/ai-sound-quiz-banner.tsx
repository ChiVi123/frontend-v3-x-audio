'use client';

import { ChevronRightIcon as NavigateIcon, WavesIcon as SoundWaveIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * AISoundQuizBanner — Homepage AI Sound Profile Quiz entry point
 *
 * Matches home.png: horizontal banner strip with pulse animation,
 * gold left accent, "Start Calibration" CTA.
 *
 * onStart callback triggers the quiz dialog in the parent.
 */

interface AISoundQuizBannerProps extends ComponentProps<'section'> {
  onStart?: () => void;
  ctaLabel?: string;
  description?: string;
}

function AISoundQuizBanner({
  onStart,
  ctaLabel = 'Start Calibration',
  description = 'Calibrate your listening experience based on your unique physiological hearing curve.',
  className,
  ...props
}: AISoundQuizBannerProps) {
  return (
    <section
      data-slot="ai-sound-quiz-banner"
      aria-label="AI Sound Profile Quiz"
      className={cn(
        'relative flex items-center gap-5 overflow-hidden',
        // Gold left accent line — via pseudo element
        'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary/60',
        'rounded-xl border border-surface-container-high bg-surface-container px-6 py-4',
        className,
      )}
      {...props}
    >
      {/* ── Animated icon ── */}
      <div className="relative shrink-0" aria-hidden>
        {/* Pulse ring — decorative */}
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex size-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high">
          <SoundWaveIcon className="size-5 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Text ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="font-heading text-base text-on-surface">AI Sound Profile Quiz</p>
        <p className="text-xs text-outline-brand leading-relaxed truncate">{description}</p>
      </div>

      {/* ── CTA ── */}
      <Button
        variant="ghost-gold"
        size="sm"
        className="shrink-0 font-mono text-[11px] uppercase tracking-widest"
        onClick={onStart}
      >
        {ctaLabel}
        <NavigateIcon className="ml-1 size-3" />
      </Button>
    </section>
  );
}

export { AISoundQuizBanner };
