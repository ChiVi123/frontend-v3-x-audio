import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

/**
 * HeroSection — Homepage above-the-fold section
 *
 * Matches home.png: left text block with serif headline + gold accent,
 * right side product image, "Explore Collection" CTA.
 * Dark background with subtle grid overlay for depth.
 */

interface HeroSectionProps extends ComponentProps<'section'> {
  headline?: string;
  headlineAccent?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

function HeroSection({
  headline = 'Crafted for the',
  headlineAccent = 'Golden Ear',
  description = 'Experience the profound silence between the notes. Our precision-engineered audio components deliver uncompromised clarity and uncompromising luxurious aesthetics for the true audiophile.',
  ctaLabel = 'Explore Collection',
  ctaHref = '/catalog',
  imageSrc = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  imageAlt = 'V3-X Premium Headphones',
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section
      data-slot="hero-section"
      aria-label="Hero"
      className={cn('relative min-h-[560px] w-full overflow-hidden', 'bg-background', className)}
      {...props}
    >
      {/* Subtle noise texture overlay for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto grid min-h-[560px] grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        {/* Left — Text block */}
        <div className="flex flex-col gap-6 lg:max-w-lg">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-4xl font-normal leading-tight text-on-surface sm:text-5xl lg:text-6xl">
              {headline}
              <br />
              <span className="text-primary">{headlineAccent}</span>
            </h1>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">{description}</p>

          <div className="flex items-center gap-4 pt-2">
            <Button asChild variant="gold" size="lg" className="font-mono text-[11px] uppercase tracking-widest">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>

        {/* Right — Product image */}
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              'relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-2xl',
              'border border-surface-container-high',
              'bg-surface-container-low',
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Subtle gold vignette at bottom */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent" />
          </div>

          {/* Decorative gold ring accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 -right-8 size-48 rounded-full border border-primary/10 opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -right-4 size-32 rounded-full border border-primary/15 opacity-40"
          />
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
