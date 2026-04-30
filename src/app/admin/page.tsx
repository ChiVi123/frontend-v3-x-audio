import type { OrderRow, ProductRow } from '~/components/features/admin/dashboard/dashboard-tables';
import { DashboardTables } from '~/components/features/admin/dashboard/dashboard-tables';

/**
 * Admin Dashboard page — `/admin`
 * Server Component — data fetching only. Rendering delegated to DashboardTables
 * (Client Component) to avoid passing render functions across the server/client boundary.
 */

const RECENT_ORDERS: OrderRow[] = [
  {
    id: 'VX-9021',
    customer: 'Alex Thompson',
    product: 'Reference Z-1',
    amount: 1299,
    status: 'delivered',
    date: 'Oct 24, 2024',
  },
  {
    id: 'VX-8894',
    customer: 'Jordan Lee',
    product: 'A-Series Tube Amp MkII',
    amount: 2450,
    status: 'shipped',
    date: 'Oct 15, 2024',
  },
  {
    id: 'VX-8711',
    customer: 'Morgan Chen',
    product: 'Condenser Studio-X',
    amount: 849,
    status: 'processing',
    date: 'Sep 30, 2024',
  },
  {
    id: 'VX-8620',
    customer: 'Riley Park',
    product: 'Signature Copper XLR',
    amount: 480,
    status: 'delivered',
    date: 'Sep 22, 2024',
  },
  {
    id: 'VX-8504',
    customer: 'Sam Rivera',
    product: 'V3-X Studio Buds',
    amount: 299,
    status: 'cancelled',
    date: 'Sep 15, 2024',
  },
];

const TOP_PRODUCTS: ProductRow[] = [
  { id: 'ref-z1', name: 'Reference Z-1', category: 'Over-ear', sold: 142, revenue: 184458, stock: 'In Stock' },
  {
    id: 'tube-amp',
    name: 'A-Series Tube Amp MkII',
    category: 'Amplifier',
    sold: 87,
    revenue: 213150,
    stock: 'Low Stock',
  },
  { id: 'studio-x', name: 'Condenser Studio-X', category: 'Microphone', sold: 203, revenue: 172347, stock: 'In Stock' },
  { id: 'copper-xlr', name: 'Signature Copper XLR', category: 'Cable', sold: 318, revenue: 152640, stock: 'In Stock' },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">Dashboard</h2>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            October 2024 — All metrics
          </p>
        </div>
      </div>

      {/* All interactive sections in Client Component */}
      <DashboardTables recentOrders={RECENT_ORDERS} topProducts={TOP_PRODUCTS} />
    </div>
  );
}
