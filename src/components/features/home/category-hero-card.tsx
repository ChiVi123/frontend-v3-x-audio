import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

/**
 * CategoryHeroCard — Homepage "Curated Acoustics" section
 *
 * DESIGN.md: Full-bleed image, gradient overlay, gold underline on hover.
 * No template literals in className — aspect ratio mapped to explicit classes.
 */

// Explicit aspect ratio classes — avoids template literal in className
const ASPECT_CLASSES = {
  '4/3': 'aspect-4/3',
  '3/4': 'aspect-3/4',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
} as const;

export interface CategoryHeroCardProps extends ComponentProps<'article'> {
  title: string;
  caption: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  aspectRatio?: keyof typeof ASPECT_CLASSES;
}

function CategoryHeroCard({
  title,
  caption,
  href,
  imageSrc,
  imageAlt,
  aspectRatio = '3/4',
  className,
  ...props
}: CategoryHeroCardProps) {
  return (
    <article
      data-slot="category-hero-card"
      className={cn(
        'group/cat relative overflow-hidden rounded-2xl border border-surface-container-high',
        'transition-all duration-200 ease-out hover:border-outline-variant',
        className,
      )}
      {...props}
    >
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl">
        {/* Image container */}
        <div className={cn('relative w-full overflow-hidden bg-surface-container-low', ASPECT_CLASSES[aspectRatio])}>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={cn(
              'object-cover brightness-75',
              'transition-all duration-500 ease-out',
              'group-hover/cat:brightness-85 group-hover/cat:scale-[1.03]',
            )}
          />

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent" />

          {/* Text content pinned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1.5">
            {/* Title with gold underline that grows on hover */}
            <h3
              className={cn(
                'font-heading text-xl text-on-surface leading-snug',
                'relative inline-block w-fit',
                'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-primary',
                'after:w-0 after:transition-all after:duration-300 after:ease-out',
                'group-hover/cat:after:w-full',
              )}
            >
              {title}
            </h3>

            {/* Caption — gold uppercase tracked */}
            <span
              className={cn(
                'font-mono text-[10px] font-semibold uppercase tracking-[0.18em]',
                'text-primary opacity-80',
                'transition-opacity duration-200 group-hover/cat:opacity-100',
              )}
            >
              {caption}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export { CategoryHeroCard };
