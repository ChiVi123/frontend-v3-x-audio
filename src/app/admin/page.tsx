import {
  PackageIcon as InventoryIcon,
  ShoppingCartIcon as OrdersIcon,
  DollarSignIcon as RevenueIcon,
  UsersIcon,
} from 'lucide-react';
import { StatCard } from '~/components/features/admin/dashboard/stat-card';
import { AdminDataTable, type Column } from '~/components/shared/admin-data-table';
import type { OrderStatus } from '~/components/shared/order-status-badge';

/**
 * Admin Dashboard page — `/admin`
 *
 * Layout:
 *   1. Page header — "Overview" title + date
 *   2. StatCard grid — 4 KPI cards (2-col mobile, 4-col desktop)
 *   3. AdminDataTable — Recent Orders (last 5)
 *   4. Secondary row — Top Products (table) + Quick Actions (coming soon)
 *
 * Server Component — no interactivity, all data mock until API ready.
 */

// ── Mock data ─────────────────────────────────────────────────────────────

interface OrderRow {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

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

interface ProductRow {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  stock: string;
}

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

// ── Column definitions ────────────────────────────────────────────────────

const ORDER_COLUMNS: Column<OrderRow>[] = [
  { key: 'id', header: 'Order ID', type: 'text', sortable: true, width: 'w-28' },
  { key: 'customer', header: 'Customer', type: 'text', sortable: true },
  { key: 'product', header: 'Product', type: 'text' },
  { key: 'amount', header: 'Amount', type: 'currency', sortable: true, align: 'text-right', width: 'w-28' },
  { key: 'status', header: 'Status', type: 'status', width: 'w-32' },
  { key: 'date', header: 'Date', type: 'date', sortable: true, width: 'w-36' },
];

const PRODUCT_COLUMNS: Column<ProductRow>[] = [
  { key: 'name', header: 'Product', type: 'text', sortable: true },
  { key: 'category', header: 'Category', type: 'text' },
  {
    key: 'sold',
    header: 'Units Sold',
    type: 'custom',
    sortable: true,
    align: 'text-right',
    width: 'w-28',
    render: (v) => <span className="font-mono text-sm font-medium text-on-surface">{String(v ?? '—')}</span>,
  },
  {
    key: 'revenue',
    header: 'Revenue',
    type: 'currency',
    sortable: true,
    align: 'text-right',
    width: 'w-32',
  },
  {
    key: 'stock',
    header: 'Stock',
    type: 'custom',
    width: 'w-28',
    render: (v) => {
      const isLow = v === 'Low Stock';
      return (
        <span
          className={
            isLow
              ? 'inline-flex items-center gap-1 rounded-full border border-status-low-stock-fg/25 bg-status-low-stock px-2 py-0.5 font-mono text-[10px] font-medium text-status-low-stock-fg'
              : 'inline-flex items-center gap-1 rounded-full border border-status-delivered-fg/20 bg-status-delivered px-2 py-0.5 font-mono text-[10px] font-medium text-status-delivered-fg'
          }
        >
          {isLow && <span className="inline-block size-1.5 rounded-full bg-current" />}
          {String(v ?? '—')}
        </span>
      );
    },
  },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">Dashboard</h2>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            October 2024 — All metrics
          </p>
        </div>
      </div>

      {/* ── StatCard grid — 2-col mobile, 4-col desktop ── */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={RevenueIcon} label="Total Revenue" value="$84,230" trend={12.4} />
          <StatCard icon={OrdersIcon} label="Total Orders" value="1,284" trend={8.1} />
          <StatCard icon={UsersIcon} label="Active Customers" value="3,920" trend={-2.3} />
          <StatCard icon={InventoryIcon} label="Low Stock Items" value="14" trend="Low Stock" variant="warning" />
        </div>
      </section>

      {/* ── Recent Orders table ── */}
      <section aria-label="Recent orders">
        <AdminDataTable
          title="Recent Orders"
          viewAllHref="/admin/orders"
          viewAllLabel="View All Orders"
          columns={ORDER_COLUMNS}
          data={RECENT_ORDERS}
          rowKey="id"
          emptyMessage="No recent orders found."
        />
      </section>

      {/* ── Top Products table ── */}
      <section aria-label="Top products">
        <AdminDataTable
          title="Top Products"
          viewAllHref="/admin/products"
          viewAllLabel="View All Products"
          columns={PRODUCT_COLUMNS}
          data={TOP_PRODUCTS}
          rowKey="id"
          emptyMessage="No product data available."
        />
      </section>
    </div>
  );
}
