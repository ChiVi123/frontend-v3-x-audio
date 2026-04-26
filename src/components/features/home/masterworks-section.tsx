import Link from 'next/link';
import type { ComponentProps } from 'react';
import { ProductCard, type ProductCardProps } from '~/components/features/products/product-card';
import { cn } from '~/lib/utils';

/**
 * MasterworksSection — Homepage featured products
 *
 * Matches home.png "Masterworks" section:
 * Title + "View All" link, then a 3-col grid of featured ProductCards.
 */

interface MasteworksSectionProps extends ComponentProps<'section'> {
  products: ProductCardProps[];
  title?: string;
  viewAllHref?: string;
}

function MasterworksSection({
  products,
  title = 'Masterworks',
  viewAllHref = '/catalog',
  className,
  ...props
}: MasteworksSectionProps) {
  return (
    <section
      data-slot="masterworks-section"
      aria-labelledby="masterworks-heading"
      className={cn('w-full', className)}
      {...props}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="mb-8 flex items-baseline justify-between">
          <h2 id="masterworks-heading" className="font-heading text-3xl font-normal text-on-surface">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary transition-opacity duration-200 hover:opacity-80"
          >
            View All
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6h7M6.5 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}

export { MasterworksSection };
