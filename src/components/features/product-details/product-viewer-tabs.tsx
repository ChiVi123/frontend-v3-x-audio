'use client';

import { useState } from 'react';
import {
  FrequencyResponseGraph,
  SAMPLE_FLAT_CURVE,
  SAMPLE_V_CURVE,
} from '~/components/features/product-details/frequency-response-graph';
import { ThreeSixtyViewer } from '~/components/features/product-details/three-sixty-viewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';

/**
 * ProductViewerTabs — Client Component.
 *
 * Owns ONLY the active tab state. Everything else (breadcrumb, product info,
 * spec chips, pricing) is server-rendered in the parent page.
 *
 * Receives pre-resolved data as props from the Server Component — no fetching.
 */

type ActiveTab = '360' | 'frequency' | 'materials';

interface Material {
  label: string;
  value: string;
}

interface ProductViewerTabsProps {
  productName: string;
  posterUrl: string;
  thumbnails: { src: string; alt?: string }[];
  materials: Material[];
  freqProductName: string;
}

function ProductViewerTabs({ productName, posterUrl, thumbnails, materials, freqProductName }: ProductViewerTabsProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('360');

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="flex flex-col gap-0">
      <TabsContent value="360" className="mt-0">
        <ThreeSixtyViewer posterUrl={posterUrl} thumbnails={thumbnails} productName={productName} />
      </TabsContent>

      <TabsContent value="frequency" className="mt-0">
        <FrequencyResponseGraph
          data={SAMPLE_FLAT_CURVE}
          productName={freqProductName}
          compareData={SAMPLE_V_CURVE}
          compareName="Reference Curve"
        />
      </TabsContent>

      <TabsContent value="materials" className="mt-0">
        <div
          className={cn(
            'flex min-h-64 flex-col gap-4 rounded-xl border border-surface-container-high',
            'bg-surface-container-low p-6',
          )}
        >
          <h3 className="font-heading text-xl text-on-surface">Materials & Construction</h3>
          <div className="grid grid-cols-2 gap-3">
            {materials.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</span>
                <span className="text-sm text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Tab triggers — below the content, matching product_detail.png */}
      <TabsList variant="line" className="mt-2 w-fit gap-0 bg-transparent">
        <TabsTrigger value="360" className="font-mono text-xs uppercase tracking-wider">
          360 View
        </TabsTrigger>
        <TabsTrigger value="frequency" className="font-mono text-xs uppercase tracking-wider">
          Frequency Graph
        </TabsTrigger>
        <TabsTrigger value="materials" className="font-mono text-xs uppercase tracking-wider">
          Materials
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export { ProductViewerTabs };
export type { ProductViewerTabsProps, Material };
