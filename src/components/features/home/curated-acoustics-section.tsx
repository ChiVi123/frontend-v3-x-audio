import type { ComponentProps } from 'react';
import { CategoryHeroCard, type CategoryHeroCardProps } from '~/components/features/home/category-hero-card';
import { cn } from '~/lib/utils';

/**
 * CuratedAcousticsSection — Homepage category browse section
 *
 * Matches home.png "Curated Acoustics" section:
 * 3 CategoryHeroCards: Over-ear, IEM, DACs & Amplification.
 * The center card is taller (3/4 aspect) for visual hierarchy.
 */

interface CuratedAcousticsSectionProps extends ComponentProps<'section'> {
  categories?: CategoryHeroCardProps[];
}

const DEFAULT_CATEGORIES: CategoryHeroCardProps[] = [
  {
    title: 'Over-ear Reference',
    caption: 'Explore Series',
    href: '/catalog?category=over-ear',
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    aspectRatio: '3/4',
  },
  {
    title: 'Precision IEMs',
    caption: 'Intimate Detail',
    href: '/catalog?category=iem',
    imageSrc: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    aspectRatio: '3/4',
  },
  {
    title: 'DACs & Amplification',
    caption: 'Pure Power',
    href: '/catalog?category=amps',
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    aspectRatio: '3/4',
  },
];

function CuratedAcousticsSection({
  categories = DEFAULT_CATEGORIES,
  className,
  ...props
}: CuratedAcousticsSectionProps) {
  return (
    <section
      data-slot="curated-acoustics-section"
      aria-labelledby="curated-acoustics-heading"
      className={cn('w-full', className)}
      {...props}
    >
      <div className="container mx-auto px-6">
        <h2 id="curated-acoustics-heading" className="mb-8 font-heading text-3xl font-normal text-on-surface">
          Curated Acoustics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <CategoryHeroCard key={cat.href} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { CuratedAcousticsSection };
