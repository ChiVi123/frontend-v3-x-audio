'use client';

import {
  PackageIcon as InventoryIcon,
  ShoppingCartIcon as OrdersIcon,
  DollarSignIcon as RevenueIcon,
  UsersIcon,
} from 'lucide-react';
import { StatCard } from '~/components/features/admin/dashboard/stat-card';
import { AdminDataTable, type Column } from '~/components/shared/admin-data-table';
import type { OrderStatus } from '~/components/shared/order-status-badge';

// ── Types ─────────────────────────────────────────────────────────────────

interface OrderRow {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface ProductRow {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  stock: string;
}

interface DashboardTablesProps {
  recentOrders: OrderRow[];
  topProducts: ProductRow[];
}

// ── Column definitions live here (Client Component) so render fns are valid ──

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

// ── Stat cards data (defined here to avoid passing icons as props) ──────────

const STAT_CARDS = [
  {
    icon: RevenueIcon,
    label: 'Total Revenue',
    value: '$84,230',
    trend: 12.4 as number | string,
    variant: 'default' as const,
  },
  {
    icon: OrdersIcon,
    label: 'Total Orders',
    value: '1,284',
    trend: 8.1 as number | string,
    variant: 'default' as const,
  },
  {
    icon: UsersIcon,
    label: 'Active Customers',
    value: '3,920',
    trend: -2.3 as number | string,
    variant: 'default' as const,
  },
  {
    icon: InventoryIcon,
    label: 'Low Stock Items',
    value: '14',
    trend: 'Low Stock' as number | string,
    variant: 'warning' as const,
  },
];

// ── Component ──────────────────────────────────────────────────────────────

function DashboardTables({ recentOrders, topProducts }: DashboardTablesProps) {
  return (
    <>
      {/* StatCard grid */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              trend={card.trend}
              variant={card.variant}
            />
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section aria-label="Recent orders">
        <AdminDataTable
          title="Recent Orders"
          viewAllHref="/admin/orders"
          viewAllLabel="View All Orders"
          columns={ORDER_COLUMNS}
          data={recentOrders}
          rowKey="id"
          emptyMessage="No recent orders found."
        />
      </section>

      {/* Top Products */}
      <section aria-label="Top products">
        <AdminDataTable
          title="Top Products"
          viewAllHref="/admin/products"
          viewAllLabel="View All Products"
          columns={PRODUCT_COLUMNS}
          data={topProducts}
          rowKey="id"
          emptyMessage="No product data available."
        />
      </section>
    </>
  );
}

export { DashboardTables };
export type { OrderRow, ProductRow };
