import Image from 'next/image';
import Link from 'next/link';
import type * as React from 'react';
import { cn } from '~/lib/utils';

/**
 * CategoryHeroCard — Homepage "Curated Acoustics" section
 *
 * Matches home.png: 3 large cards side by side:
 *   "Over-ear Reference / Precision IEMs / DACs & Amplification"
 *
 * Design:
 * - Full-bleed image background
 * - Dark gradient overlay bottom-up for text legibility
 * - Gold uppercase caption label ("EXPLORE SERIES")
 * - Hover: subtle brightness lift + gold underline on title
 * - 200ms ease-out per DESIGN.md
 */

export interface CategoryHeroCardProps extends React.ComponentProps<'article'> {
  title: string;
  caption: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  /** Aspect ratio of the card image area */
  aspectRatio?: '4/3' | '3/4' | '1/1' | '16/9';
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
        'group/cat relative overflow-hidden rounded-2xl border border-[#292a2a]',
        'transition-all duration-200 ease-out hover:border-[#4d4635]',
        className,
      )}
      {...props}
    >
      <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#f2ca50]/40 rounded-2xl">
        {/* Image */}
        <div className={cn('relative w-full overflow-hidden bg-[#1a1c1c]', `aspect-[${aspectRatio}]`)}>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={cn(
              'object-cover',
              // Subtle brightness on hover
              'brightness-75 transition-all duration-500 ease-out',
              'group-hover/cat:brightness-85 group-hover/cat:scale-[1.03]',
            )}
          />

          {/* Gradient overlay — bottom to mid */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d0e0f]/90 via-[#0d0e0f]/30 to-transparent" />

          {/* Text content — pinned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1.5">
            {/* Title */}
            <h3
              className={cn(
                'font-heading text-xl text-[#e3e2e2] leading-snug',
                'relative inline-block w-fit',
                // Gold underline grows on hover
                'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#f2ca50]',
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
                'text-[#f2ca50] opacity-80',
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
