import { Suspense } from 'react';
import { CatalogSortControl, FilterSidebarControl } from '~/components/features/catalog/catalog-controls';
import type { SortOption } from '~/components/features/catalog/catalog-header';
import type { DriverType, FilterState, SoundSig } from '~/components/features/catalog/filter-sidebar';
import { LoadMoreButton } from '~/components/features/catalog/load-more-button';
import { ProductCard, type ProductCardProps } from '~/components/features/products/product-card';

/**
 * CatalogPage — Server Component.
 *
 * All filter + sort state lives in URL searchParams.
 * This component reads params, applies filters/sort server-side,
 * and passes already-filtered data to pure presentational components.
 *
 * Client components (FilterSidebarControl, CatalogSortControl) only
 * push new params to the URL — they hold zero data state.
 *
 * URL param schema:
 *   category — string
 *   sort     — 'featured' | 'price-asc' | 'price-desc' | 'newest'
 *   drivers  — comma-separated DriverType values
 *   sigs     — comma-separated SoundSig values
 *   imp_min  — number
 *   imp_max  — number
 *   in_stock — '1'
 */

// ── Constants ─────────────────────────────────────────────────────────────

const IMPEDANCE_MIN = 8;
const IMPEDANCE_MAX = 600;

const CATEGORY_TITLES: Record<string, string> = {
  'over-ear': 'Over-Ear Headphones',
  iem: 'In-Ear Monitors',
  amps: 'DACs & Amplification',
};

// ── Mock data — replace with: await fetchProducts(params) ─────────────────

type ProductWithMeta = ProductCardProps & {
  driverType: DriverType;
  soundSig: SoundSig;
  impedance: number;
  category: string;
};

const ALL_PRODUCTS: ProductWithMeta[] = [
  {
    id: 'aether-v2',
    name: 'Aether V2',
    tagline: 'Our flagship tri-brid configuration delivering unmatched resolution.',
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    href: '/products/aether-v2',
    specs: ['Tribrid', '32Ω'],
    inventoryStatus: 'in_stock',
    badge: 'New',
    driverType: 'Tribrid',
    soundSig: 'Reference',
    impedance: 32,
    category: 'iem',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    tagline: 'A pure planar magnetic design focused on lightning-fast transients.',
    price: 899,
    imageSrc: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    href: '/products/obsidian',
    specs: ['Planar', '18Ω'],
    inventoryStatus: 'in_stock',
    driverType: 'Planar Magnetic',
    soundSig: 'Reference',
    impedance: 18,
    category: 'iem',
  },
  {
    id: 'origin',
    name: 'Origin',
    tagline: "The purist's choice. A single beryllium-coated dynamic driver.",
    price: 599,
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    href: '/products/origin',
    specs: ['Single DD', '64Ω'],
    inventoryStatus: 'in_stock',
    driverType: 'Dynamic (DD)',
    soundSig: 'Warm & Smooth',
    impedance: 64,
    category: 'iem',
  },
  {
    id: 'meridian-ba',
    name: 'Meridian BA',
    tagline: 'Six balanced armature drivers tuned for studio reference accuracy.',
    price: 749,
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    href: '/products/meridian-ba',
    specs: ['6BA', '22Ω'],
    inventoryStatus: 'low_stock',
    driverType: 'Balanced Armature (BA)',
    soundSig: 'Mid-Forward',
    impedance: 22,
    category: 'iem',
  },
  {
    id: 'nova-electrostatic',
    name: 'Nova Electrostatic',
    tagline: 'Electrostatic transducers for the most demanding audiophile.',
    price: 2499,
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    href: '/products/nova-electrostatic',
    specs: ['Electrostatic', '100kΩ'],
    inventoryStatus: 'pre_order',
    badge: 'Pre-order',
    driverType: 'Electrostatic',
    soundSig: 'Bright',
    impedance: 600,
    category: 'iem',
  },
  {
    id: 'aetherius-v1',
    name: 'Aetherius V1',
    tagline: 'Planar magnetic architecture engineered for absolute transparency.',
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    href: '/products/aetherius-v1',
    specs: ['Planar Magnetic', '32Ω'],
    inventoryStatus: 'in_stock',
    driverType: 'Planar Magnetic',
    soundSig: 'Reference',
    impedance: 32,
    category: 'over-ear',
  },
  {
    id: 'cascade-tribrid',
    name: 'Cascade Tribrid',
    tagline: 'DD + BA + EST configuration for a holographic soundstage.',
    price: 1599,
    imageSrc: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    href: '/products/cascade-tribrid',
    specs: ['Tribrid', '16Ω'],
    inventoryStatus: 'in_stock',
    driverType: 'Tribrid',
    soundSig: 'V-Shaped',
    impedance: 16,
    category: 'over-ear',
  },
];

// ── Server-side parse + filter + sort ─────────────────────────────────────

function parseSearchParams(raw: Record<string, string | string[] | undefined>): {
  category?: string;
  sort: SortOption;
  filters: FilterState;
} {
  const str = (key: string) => {
    const v = raw[key];
    return typeof v === 'string' ? v : undefined;
  };

  const impMin = Number(str('imp_min') ?? IMPEDANCE_MIN);
  const impMax = Number(str('imp_max') ?? IMPEDANCE_MAX);
  const driversRaw = str('drivers');
  const sigsRaw = str('sigs');

  return {
    category: str('category'),
    sort: (str('sort') ?? 'featured') as SortOption,
    filters: {
      driverTypes: driversRaw ? (driversRaw.split(',') as DriverType[]) : [],
      soundSigs: sigsRaw ? (sigsRaw.split(',') as SoundSig[]) : [],
      impedanceRange: [Number.isNaN(impMin) ? IMPEDANCE_MIN : impMin, Number.isNaN(impMax) ? IMPEDANCE_MAX : impMax],
      inStockOnly: str('in_stock') === '1',
    },
  };
}

function applyFiltersAndSort(
  products: ProductWithMeta[],
  category: string | undefined,
  sort: SortOption,
  filters: FilterState,
): ProductWithMeta[] {
  let result = products;

  if (category) result = result.filter((p) => p.category === category);
  if (filters.driverTypes.length > 0) result = result.filter((p) => filters.driverTypes.includes(p.driverType));
  if (filters.soundSigs.length > 0) result = result.filter((p) => filters.soundSigs.includes(p.soundSig));

  result = result.filter((p) => p.impedance >= filters.impedanceRange[0] && p.impedance <= filters.impedanceRange[1]);

  if (filters.inStockOnly) result = result.filter((p) => p.inventoryStatus === 'in_stock');

  const sorted = [...result];
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);

  return sorted;
}

// ── Page ──────────────────────────────────────────────────────────────────

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const raw = await searchParams;
  const { category, sort, filters } = parseSearchParams(raw);
  // TODO: Replace ALL_PRODUCTS with fetchProducts(params)
  const products = applyFiltersAndSort(ALL_PRODUCTS, category, sort, filters);
  const title = CATEGORY_TITLES[category ?? ''] ?? 'All Products';

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex gap-8">
        {/* Left: Filter sidebar
            Wrapped in Suspense because useSearchParams() inside makes it
            dynamic — Suspense boundary prevents page-level dynamic opt-in. */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface-container" />}>
            <FilterSidebarControl defaultFilters={filters} impedanceMin={IMPEDANCE_MIN} impedanceMax={IMPEDANCE_MAX} />
          </Suspense>
        </aside>

        {/* Right: Server-rendered product list */}
        <div className="flex flex-1 flex-col gap-8 min-w-0">
          <Suspense fallback={<div className="h-14 animate-pulse rounded-lg bg-surface-container" />}>
            <CatalogSortControl title={title} count={products.length} defaultSort={sort} />
          </Suspense>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map(({ driverType, soundSig, ...product }) => (
                <ProductCard key={product.id} {...product} variant="default" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-20">
              <p className="font-heading text-xl text-on-surface-variant">No products match your filters.</p>
              <p className="font-mono text-xs text-outline-variant">Try adjusting your filter criteria.</p>
            </div>
          )}

          <LoadMoreButton hasMore={false} />
        </div>
      </div>
    </div>
  );
}
