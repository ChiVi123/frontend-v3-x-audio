'use client';

import { ImagePlusIcon, Loader2Icon, PlusIcon, XIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { LivePreviewCard, type ProductStatus } from '~/components/features/admin/product-command/live-preview-card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';

/**
 * Admin Add Product page — `/admin/products/new`
 *
 * 'use client' — owns all form state; LivePreviewCard is a real-time mirror.
 *
 * Layout (desktop): 2-col grid — form (left, flex-1) + LivePreviewCard (right, w-80 sticky)
 * Layout (mobile) : stacked — form sections → LivePreviewCard → action buttons
 *
 * Form sections:
 *   1. Basic Info      — Name, Tagline, Category (Select), Series
 *   2. Pricing & Stock — Price, Compare-at Price, Stock Qty, Status (Select)
 *   3. Specifications  — dynamic spec chip list (add/remove tags)
 *   4. Description     — Textarea
 *   5. Media           — image URL input + preview (Cloudinary integration TODO)
 *
 * LivePreviewCard receives debounced values to avoid re-render on every keystroke.
 * Debounce implemented with useRef timeout — avoids useCallback/useMemo because
 * React Compiler handles memoisation; the timeout ref pattern is imperative and
 * cannot be optimised by the compiler.
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  tagline: string;
  category: string;
  series: string;
  price: string;
  comparePrice: string;
  stockQty: string;
  status: ProductStatus;
  description: string;
  imageUrl: string;
  specs: string[];
}

const INITIAL_FORM: FormState = {
  name: '',
  tagline: '',
  category: '',
  series: '',
  price: '',
  comparePrice: '',
  stockQty: '',
  status: 'draft',
  description: '',
  imageUrl: '',
  specs: [],
};

const CATEGORIES = [
  { value: 'over-ear', label: 'Over-ear Headphones' },
  { value: 'iem', label: 'IEM' },
  { value: 'dac-amp', label: 'DAC / Amp' },
  { value: 'cable', label: 'Cables & Accessories' },
  { value: 'microphone', label: 'Microphone' },
  { value: 'speaker', label: 'Studio Monitor' },
];

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-surface-container-high bg-surface-container p-5 md:p-6">
      <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant"
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );
}

function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>;
}

// ── Spec tag input ────────────────────────────────────────────────────────

function SpecTagInput({
  specs,
  onAdd,
  onRemove,
}: {
  specs: string[];
  onAdd: (spec: string) => void;
  onRemove: (spec: string) => void;
}) {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      onAdd(inputVal.trim());
      setInputVal('');
    }
  };

  const handleAdd = () => {
    if (inputVal.trim()) {
      onAdd(inputVal.trim());
      setInputVal('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Existing tags */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specs.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-high px-2.5 py-0.5 font-mono text-[10px] text-on-surface-variant"
            >
              {spec}
              <button
                type="button"
                aria-label={`Remove ${spec}`}
                onClick={() => onRemove(spec)}
                className="text-outline-variant transition-colors hover:text-destructive"
              >
                <XIcon className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "32Ω" — press Enter or comma to add'
          className="flex-1 text-xs"
        />
        <Button
          type="button"
          variant="ghost-neutral"
          size="icon-sm"
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          aria-label="Add spec"
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Image upload area ─────────────────────────────────────────────────────

function ImageUploadArea({ imageUrl, onChange }: { imageUrl: string; onChange: (url: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {/* URL input — Cloudinary upload widget TODO */}
      <FieldGroup>
        <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
        <Input
          id="image-url"
          type="url"
          value={imageUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
        />
      </FieldGroup>

      {/* Drop zone placeholder */}
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed',
          'border-surface-container-high bg-surface-container-low py-8',
          'transition-colors duration-200 hover:border-outline-variant',
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-surface-container-high bg-surface-container">
          <ImagePlusIcon className="size-5 text-outline-variant" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-on-surface-variant">
            Drag & drop or <span className="cursor-pointer text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="font-mono text-[10px] text-outline-variant">PNG, JPG, WEBP — max 10MB</p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AdminAddProductPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [preview, setPreview] = useState<FormState>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced sync to LivePreviewCard — 300ms after last keystroke.
  // useRef timeout: imperative pattern, React Compiler cannot optimise this.
  const syncPreview = useCallback((next: FormState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPreview(next), 300);
  }, []);

  const update = (patch: Partial<FormState>) => {
    const next = { ...form, ...patch };
    setForm(next);
    syncPreview(next);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // TODO: call POST /products with status: 'draft'
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    // TODO: call POST /products with status: 'published'
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
  };

  const addSpec = (spec: string) => {
    if (form.specs.includes(spec)) return;
    update({ specs: [...form.specs, spec] });
  };

  const removeSpec = (spec: string) => {
    update({ specs: form.specs.filter((s) => s !== spec) });
  };

  const priceNum = parseFloat(form.price) || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">Add Product</h2>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          New listing — fill in details below
        </p>
      </div>

      {/* ── Content grid ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* ── Left — form ── */}
        <div className="flex flex-1 flex-col gap-5">
          {/* 1. Basic Info */}
          <FormSection title="Basic Information">
            <FieldGroup>
              <FieldLabel htmlFor="product-name" required>
                Product Name
              </FieldLabel>
              <Input
                id="product-name"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Reference Z-1 Over-ear"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
                placeholder="Short marketing line shown on product card"
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="category" required>
                  Category
                </FieldLabel>
                <Select value={form.category} onValueChange={(v) => update({ category: v })}>
                  <SelectTrigger id="category" className="h-10 w-full" size="default">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="series">Series</FieldLabel>
                <Input
                  id="series"
                  value={form.series}
                  onChange={(e) => update({ series: e.target.value })}
                  placeholder="e.g. Reference Series"
                />
              </FieldGroup>
            </div>
          </FormSection>

          {/* 2. Pricing & Stock */}
          <FormSection title="Pricing & Inventory">
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="price" required>
                  Price (USD)
                </FieldLabel>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="0.00"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="compare-price">Compare-at Price</FieldLabel>
                <Input
                  id="compare-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) => update({ comparePrice: e.target.value })}
                  placeholder="0.00"
                />
              </FieldGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel htmlFor="stock-qty">Stock Quantity</FieldLabel>
                <Input
                  id="stock-qty"
                  type="number"
                  min="0"
                  value={form.stockQty}
                  onChange={(e) => update({ stockQty: e.target.value })}
                  placeholder="0"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select value={form.status} onValueChange={(v) => update({ status: v as ProductStatus })}>
                  <SelectTrigger id="status" className="h-10 w-full" size="default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>
          </FormSection>

          {/* 3. Specifications */}
          <FormSection title="Specifications">
            <SpecTagInput specs={form.specs} onAdd={addSpec} onRemove={removeSpec} />
          </FormSection>

          {/* 4. Description */}
          <FormSection title="Description">
            <FieldGroup>
              <FieldLabel htmlFor="description">Product Description</FieldLabel>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Describe the product in detail — sound signature, build quality, included accessories..."
                className="min-h-32 resize-y"
              />
            </FieldGroup>
          </FormSection>

          {/* 5. Media */}
          <FormSection title="Media">
            <ImageUploadArea imageUrl={form.imageUrl} onChange={(url) => update({ imageUrl: url })} />
          </FormSection>

          {/* Mobile action buttons — above preview on mobile */}
          <div className="flex gap-3 lg:hidden">
            <Button
              variant="ghost-neutral"
              size="default"
              className="flex-1 font-mono text-xs uppercase tracking-widest"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : 'Save Draft'}
            </Button>
            <Button
              variant="gold"
              size="default"
              className="flex-1 font-mono text-xs uppercase tracking-widest"
              onClick={handlePublish}
              disabled={isSaving || !form.name || !form.price}
            >
              {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : 'Publish'}
            </Button>
          </div>
        </div>

        {/* ── Right — LivePreviewCard (sticky desktop) ── */}
        <aside aria-label="Live product preview" className="w-full lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
          <LivePreviewCard
            name={preview.name}
            price={priceNum}
            description={preview.description}
            imageUrl={preview.imageUrl || undefined}
            status={preview.status}
            specs={preview.specs}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isSaving={isSaving}
          />
        </aside>
      </div>
    </div>
  );
}
