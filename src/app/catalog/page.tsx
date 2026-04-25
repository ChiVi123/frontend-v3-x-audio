import { ChevronDown } from 'lucide-react';
import { FilterSidebar } from '~/components/features/catalog/filter-sidebar';
import { ProductCard } from '~/components/features/products/product-card';
import { MainFooter } from '~/components/layouts/main-footer';
import { MainHeader } from '~/components/layouts/main-header';
import { Button } from '~/components/ui/button';

export default function CatalogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <MainHeader />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Sidebar ── */}
          <div className="w-full lg:w-64 shrink-0">
            <FilterSidebar impedanceMin={16} impedanceMax={300} />
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-heading tracking-tight">In-Ear Monitors</h1>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Showing 24 precision-engineered models
                </p>
              </div>

              <div className="flex items-center gap-2 font-sans text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <button
                  type="button"
                  className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Featured <ChevronDown className="size-4" />
                </button>
              </div>
            </div>

            <div className="h-px bg-border mb-8" />

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <ProductCard
                id="c1"
                name="Aether V2"
                tagline="Our flagship tri-brid configuration delivering unmatched resolution and soundstage."
                price={1299}
                imageSrc="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800"
                href="/products/aether-v2"
                specs={['TRI-BRID', '32Ω']}
                badge="Premium"
              />
              <ProductCard
                id="c2"
                name="Obsidian"
                tagline="A pure planar magnetic design focused on lightning-fast transients and deep sub-bass."
                price={899}
                imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
                href="/products/obsidian"
                specs={['PLANAR', '18Ω']}
              />
              <ProductCard
                id="c3"
                name="Origin"
                tagline="The purist's choice. A single beryllium coated dynamic driver for perfect coherence."
                price={599}
                imageSrc="https://images.unsplash.com/photo-1546435770-a3e426544a79?q=80&w=800"
                href="/products/origin"
                specs={['SINGLE DD', '64Ω']}
              />
              {/* Adding more mock items to fill the grid as in the screenshot */}
              <ProductCard
                id="c4"
                name="Nocturne"
                tagline="A dark, lush sound signature perfect for relaxed late-night listening sessions."
                price={749}
                imageSrc="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800"
                href="/products/nocturne"
                specs={['6 BA', '24Ω']}
              />
              <ProductCard
                id="c5"
                name="Titan"
                tagline="Massive soundstage with visceral bass response that doesn't bleed into the mids."
                price={1100}
                imageSrc="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800"
                href="/products/titan"
                specs={['DD+4BA', '14Ω']}
                badge="Limited"
              />
              <ProductCard
                id="c6"
                name="Elysium"
                tagline="True high-fidelity IEM with electrostatic tweeters for air and sparkle like no other."
                price={1899}
                imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
                href="/products/elysium"
                specs={['EST+BA+DD', '20Ω']}
              />
            </div>

            {/* Load More */}
            <div className="mt-20 flex justify-center pb-24">
              <Button
                variant="outline"
                className="border-primary/30 text-foreground/80 hover:bg-primary/5 hover:border-primary/50 hover:text-primary rounded-full px-14 h-12 font-heading text-sm transition-all duration-300"
              >
                Load More Models
              </Button>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
