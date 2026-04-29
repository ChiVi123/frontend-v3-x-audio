import {
  ChevronUpIcon as SortAscIcon,
  ArrowUpDownIcon as SortBothIcon,
  ChevronDownIcon as SortDescIcon,
  ChevronRightIcon as ViewAllIcon,
} from 'lucide-react';
import { useState } from 'react';
import { type OrderStatus, OrderStatusBadge } from '~/components/shared/order-status-badge';
import { cn } from '~/lib/utils';

/**
 * AdminDataTable — Generic sortable data table for admin views
 *
 * Matches admin_dashboard.png "Recent Orders" and admin_add_product.png.
 * Generic over T — Column<T> definitions drive rendering.
 * Client-side sort, built-in cell renderers.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export type ColumnType = 'text' | 'currency' | 'status' | 'date' | 'custom';

export interface Column<T> {
  /** Must be unique across columns — used as React key */
  key: keyof T & string;
  header: string;
  type?: ColumnType;
  sortable?: boolean;
  // render receives `unknown` so callers can narrow to their concrete row type
  // without forcing T[keyof T] — avoids assignability errors when T is inferred
  // as Record<string, unknown> at the component boundary.
  render?: (value: unknown, row: T) => React.ReactNode;
  align?: 'text-left' | 'text-center' | 'text-right';
  width?: string;
}

type SortDir = 'asc' | 'desc' | null;

interface SortState {
  key: string;
  dir: SortDir;
}

interface AdminDataTableProps<T extends object> {
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  columns: Column<T>[];
  data: T[];
  /** Field whose value is used as row React key — must be unique per row */
  rowKey?: keyof T & string;
  className?: string;
  emptyMessage?: string;
}

// ── Cell renderers ────────────────────────────────────────────────────────

function renderCell<T extends object>(col: Column<T>, row: T): React.ReactNode {
  const value = row[col.key];
  if (col.render) return col.render(value, row);

  switch (col.type) {
    case 'currency':
      return (
        <span className="font-mono text-sm font-medium text-on-surface">
          {typeof value === 'number'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
            : String(value)}
        </span>
      );
    case 'status':
      return <OrderStatusBadge status={String(value) as OrderStatus} dot size="sm" />;
    case 'date':
      return (
        <span className="font-mono text-xs text-on-surface-variant">
          {value instanceof Date
            ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : String(value)}
        </span>
      );
    default:
      return <span className="text-sm text-on-surface-variant">{String(value ?? '—')}</span>;
  }
}

// ── Sort helper ───────────────────────────────────────────────────────────

function sortData<T extends object>(data: T[], sort: SortState): T[] {
  if (!sort.dir) return data;
  return [...data].sort((a, b) => {
    const av = a[sort.key as keyof T];
    const bv = b[sort.key as keyof T];
    if (!av || !bv || av === bv) return 0;
    const cmp = av < bv ? -1 : 1;
    return sort.dir === 'asc' ? cmp : -cmp;
  });
}

// ── Component ─────────────────────────────────────────────────────────────

function AdminDataTable<T extends object>({
  title,
  viewAllHref,
  viewAllLabel = 'View All',
  columns,
  data,
  rowKey = 'id' as keyof T & string,
  className,
  emptyMessage = 'No records found.',
}: AdminDataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: '', dir: null });

  const toggleSort = (key: string) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key ? (prev.dir === 'asc' ? 'desc' : prev.dir === 'desc' ? null : 'asc') : 'asc',
    }));
  };

  const sorted = sort.dir ? sortData(data, sort) : data;

  return (
    <div
      data-slot="admin-data-table"
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-surface-container-high bg-surface-container',
        className,
      )}
    >
      {/* Table title + view-all link */}
      {(title || viewAllHref) && (
        <div className="flex items-center justify-between border-b border-surface-container-high px-5 py-4">
          {title && <h3 className="font-heading text-base text-on-surface">{title}</h3>}
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors duration-200"
            >
              {viewAllLabel}
              <ViewAllIcon className="size-3" />
            </a>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-surface-container-high">
              {/* col.key is unique per table definition — safe as React key */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant',
                    col.align ?? 'text-left',
                    col.width,
                    col.sortable && 'cursor-pointer select-none hover:text-on-surface transition-colors duration-200',
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="shrink-0">
                        {sort.key === col.key && sort.dir === 'asc' && <SortAscIcon className="size-3 text-primary" />}
                        {sort.key === col.key && sort.dir === 'desc' && (
                          <SortDescIcon className="size-3 text-primary" />
                        )}
                        {(sort.key !== col.key || !sort.dir) && <SortBothIcon className="size-3 opacity-30" />}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center font-mono text-xs text-outline-variant">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                // rowKey is guaranteed unique per row (id, sku, etc.)
                <tr
                  key={String((row as Record<string, unknown>)[rowKey])}
                  className="border-b border-surface-container-high last:border-0 transition-colors duration-150 hover:bg-surface-container-high/50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-3.5', col.align ?? 'text-left', col.width)}>
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { AdminDataTable };
