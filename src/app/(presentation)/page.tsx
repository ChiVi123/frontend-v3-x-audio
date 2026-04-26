import { AISoundQuizBanner } from '~/components/features/home/ai-sound-quiz-banner';
import { CuratedAcousticsSection } from '~/components/features/home/curated-acoustics-section';
import { HeroSection } from '~/components/features/home/hero-section';
import { MasterworksSection } from '~/components/features/home/masterworks-section';
import type { ProductCardProps } from '~/components/features/products/product-card';

/**
 * Home page — matches home.png design
 *
 * Sections:
 * 1. HeroSection — headline + product image
 * 2. AISoundQuizBanner — quiz CTA strip
 * 3. CuratedAcousticsSection — 3 category cards
 * 4. MasterworksSection — featured products grid
 *
 * Server Component — data would come from API in production.
 * Using static mock data for now.
 */

// Static mock data — replace with API calls when backend is ready
const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    id: 'v-series-obsidian',
    name: 'V-Series Obsidian',
    tagline: 'Closed-Back Planar Magnetic',
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    href: '/products/v-series-obsidian',
    specs: ['32Ω', 'Hi-Res Audio'],
    inventoryStatus: 'in_stock',
    badge: 'In Stock',
  },
  {
    id: 'argentum-core-cable',
    name: 'Argentum Core Cable',
    tagline: 'Pure Silver Litz Upgrade',
    price: 450,
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    href: '/products/argentum-core-cable',
    specs: ['4.4mm Balanced', '2-Pin'],
    inventoryStatus: 'in_stock',
  },
  {
    id: 'dap-m1-titanium',
    name: 'DAP M-1 Titanium',
    tagline: 'Reference Portable Player',
    price: 2100,
    imageSrc: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    href: '/products/dap-m1-titanium',
    specs: ['Dual AK4499', 'Class A Amp'],
    inventoryStatus: 'in_stock',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. AI Sound Quiz Banner */}
      <div className="container mx-auto px-6">
        {/* AISoundQuizBanner is 'use client' — wrap in its own section */}
        <AISoundQuizBanner />
      </div>

      {/* 3. Curated Acoustics */}
      <CuratedAcousticsSection />

      {/* 4. Masterworks */}
      <MasterworksSection products={FEATURED_PRODUCTS} />
    </div>
  );
}
