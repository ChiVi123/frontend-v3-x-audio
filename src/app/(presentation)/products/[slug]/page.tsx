import Link from 'next/link';
import { notFound } from 'next/navigation';
import type React from 'react';
import { ProductInfoPanel } from '~/components/features/product-details/product-info-panel';
import { ProductViewerTabs } from '~/components/features/product-details/product-viewer-tabs';
import { VirtualSandbox } from '~/components/features/product-details/virtual-sandbox';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

/**
 * ProductDetailPage — Server Component.
 *
 * Matches product_detail.png. Server renders everything except:
 * - ProductViewerTabs  → Client (owns tab switching state only)
 * - AddToCartButton    → Client (owns click handler only, leaf inside ProductInfoPanel)
 * - VirtualSandbox     → Client (Web Audio API, canvas)
 *
 * Breadcrumb, ProductInfoPanel, spec chips, price — all server-rendered.
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  series?: string;
  specs: string[];
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  posterUrl: string;
  thumbnails: { src: string; alt?: string }[];
  materials: { label: string; value: string }[];
  breadcrumb: { label: string; href: string }[];
}

// ── Mock data — replace with: await fetchProduct(slug) ────────────────────

const PRODUCTS: Record<string, ProductData> = {
  'aetherius-v1': {
    id: 'aetherius-v1',
    name: 'Aetherius V1',
    description:
      'Planar magnetic architecture engineered for absolute transparency. Hand-assembled with aerospace-grade aluminum and ethically sourced Nappa leather.',
    price: 1299,
    series: 'Master Series',
    specs: ['10Hz - 50kHz', '32Ω Impedance', '420g'],
    inventoryStatus: 'in_stock',
    posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    thumbnails: [
      { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=70', alt: 'Front view' },
      { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&q=70', alt: 'Side view' },
      { src: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=70', alt: 'Cable detail' },
    ],
    materials: [
      { label: 'Housing', value: 'Aerospace-grade aluminum' },
      { label: 'Earpads', value: 'Nappa leather' },
      { label: 'Headband', value: 'Carbon fibre composite' },
      { label: 'Cable', value: 'Litz copper, 4-strand' },
      { label: 'Driver', value: 'Planar magnetic, 50mm' },
      { label: 'Weight', value: '420g' },
    ],
    breadcrumb: [
      { label: 'Over-ear', href: '/catalog?category=over-ear' },
      { label: 'Reference Series', href: '/catalog?category=over-ear' },
      { label: 'Aetherius V1', href: '/products/aetherius-v1' },
    ],
  },
  'aether-v2': {
    id: 'aether-v2',
    name: 'Aether V2',
    description: 'Our flagship tri-brid configuration delivering unmatched resolution and holographic imaging.',
    price: 1299,
    series: 'Flagship IEM',
    specs: ['Tribrid', '32Ω', '5g'],
    inventoryStatus: 'in_stock',
    posterUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    thumbnails: [
      { src: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=70', alt: 'Front view' },
      { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&q=70', alt: 'Side view' },
    ],
    materials: [
      { label: 'Shell', value: 'Medical-grade resin' },
      { label: 'Faceplate', value: 'Stabilised wood' },
      { label: 'Drivers', value: '1DD + 4BA + 2EST' },
      { label: 'Cable', value: 'SPC Litz, 0.78mm 2-pin' },
      { label: 'Weight', value: '5g per side' },
      { label: 'Nozzle', value: 'Stainless steel' },
    ],
    breadcrumb: [
      { label: 'IEM', href: '/catalog?category=iem' },
      { label: 'Aether V2', href: '/products/aether-v2' },
    ],
  },
};

// ── Page ──────────────────────────────────────────────────────────────────

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = PRODUCTS[slug];

  if (!product) notFound();

  return (
    <div className="container mx-auto px-6 py-8">
      {/*
       * Breadcrumb — fully server-rendered.
       * BreadcrumbSeparator renders <li>. To avoid invalid <li>><li> nesting,
       * separators are interleaved as siblings via reduce, not nested inside
       * BreadcrumbItem.
       */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          {product.breadcrumb.reduce<React.ReactNode[]>((acc, crumb, i) => {
            const isLast = i === product.breadcrumb.length - 1;
            const item = (
              <BreadcrumbItem key={crumb.href}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );

            if (i === 0) return [item];

            acc.push(<BreadcrumbSeparator key={`sep-${crumb.href}`} />);
            acc.push(item);
            return acc;
          }, [])}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left — Viewer tabs (Client: tab state only) */}
        <div className="flex flex-col gap-6">
          <ProductViewerTabs
            productName={product.name}
            posterUrl={product.posterUrl}
            thumbnails={product.thumbnails}
            materials={product.materials}
            freqProductName={product.name}
          />
        </div>

        {/* Right — Info panel (Server) + Virtual Sandbox (Client: Web Audio) */}
        <div className="flex flex-col gap-6">
          <ProductInfoPanel
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            series={product.series}
            specs={product.specs}
            inventoryStatus={product.inventoryStatus}
          />
          <VirtualSandbox />
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}
