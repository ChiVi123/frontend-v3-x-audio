<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# FRONTEND RULES — V3-X Audio

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) v1.3.11 & [Node.js](https://nodejs.org/) v25.1.0

- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.x.x

- **UI Framework**: [React](https://react.dev/) v19.x

- **Next.js**: [Next.js](https://nextjs.org/) v16.x

- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4

- **Build Tool**: [Turbopack](https://turbopack.dev/) & [React Compiler](https://react.dev/compiler)

## Folder Structure
```
src/
├─ app/
├─ components/
│  ├─ ui/
│  ├─ layouts/
│  ├─ features/
│  └─ shared/
├─ lib/
├─ types/
└─ ...
```

## Response Format

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error responses:

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Validation failed"
}
```

## Code style

- Prefer const over let.

- Do not use any type. Safety first. If absolutely unavoidable, add a comment explaining why and suppress with Biome.

- Code line width is 120 characters.

- Always use semicolon.

- React component should be functional component, not class component or arrow function.

- React component name should be PascalCase.

- React component file name should be kebab-case.

- Do not prefix interface names with 'I'.

- Importing React: Use `import * as React from 'react'` only when you need the namespace for types. For type imports, use `import type { ... } from 'react'`. In other cases, remove the import line.

- Inline styles: Never use inline styles (`style={}`). In unavoidable cases, add a comment explaining why.

## Best Practices (Additional Rules)

### Theming & Responsive

- Support light, dark, and system themes. Implement using Tailwind's dark mode strategy (class-based) and a theme provider.

- Always follow Tailwind CSS responsive design standards (use `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes). Mobile-first approach.

### Next.js Specifics

- Images: Always use Next.js Image component (`next/image`). Do not use plain `<img>` tags.

- Navigation: For client-side transitions between pages, always use Next.js Link component (`next/link`).

- `page.tsx` files must be Server Components by default. Do not add `"use client"` unless strictly necessary.

### Tailwind CSS v4

- Use the latest Tailwind CSS v4 syntax. Do not rely on v3 deprecated utilities.

- No template literals for class names. Write explicit Tailwind classes.

  - ❌ Bad: `className={cn('...', aspect-[${aspectRatio}])}`

  - ✅ Good: `className="aspect-video"` or `className="aspect-4/3"`

  - If dynamic classes are needed, use complete class strings or map values to predefined classes.

- Do not use transition-all. Use specific transition properties (transition-colors, transition-transform, transition-opacity, etc.). If transition-all is absolutely necessary, add a comment explaining the reason.

### Semantic HTML & Accessibility

- Use proper semantic elements (<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>). Avoid generic <div> soup.

### React & Performance

- The project uses React Compiler. If you use `useCallback`, `useMemo`, `useTransition`, or similar hooks, add a comment explaining why the compiler cannot optimize that specific case.

- Never use array index as key for mapped elements. Use a stable unique identifier.

### Icons

- When using icons, rename them with a context prefix and `Icon` suffix.

  - Example: GridIcon for a grid icon used in category context → `CategoryGridIcon`.

### Third-party Components

- Before creating or modifying a component, check if shadcn/ui provides a suitable component. If yes, reuse it. If not, build custom but follow all rules above.

### Comments

- Write comments in English.

- Do not comment on obvious code (e.g., `// increment counter` for `count++`). Comment only the "why", not the "what".

## Server-First Architecture (Next.js App Router)

### Core Rule

Every component starts as a Server Component. Only convert to `'use client'` when the component **directly** requires one of:

- Browser APIs (`window`, `document`, `navigator`, Web Audio API, Canvas, WebGL)
- React state (`useState`, `useReducer`)
- React lifecycle effects (`useEffect`, `useLayoutEffect`)
- Event handlers that depend on client state
- Next.js client hooks (`useRouter`, `usePathname`, `useSearchParams`)

If none of the above apply, the component **must** remain a Server Component.

### Decision Tree

```
Does this component need browser APIs, state, or client hooks?
├── NO  → Server Component (default)
└── YES → Can the interactive part be extracted into a smaller child?
          ├── YES → Keep parent as Server Component, extract a focused Client Component leaf
          └── NO  → Client Component (document why)
```

### Client Component Patterns

**❌ Wrong — entire page/section becomes a client boundary unnecessarily:**

```tsx
'use client';
// Owns state + renders breadcrumb + info panel + price + specs
function ProductDetailClient({ product }) {
  const [activeTab, setActiveTab] = useState('360');
  return (
    <>
      <Breadcrumb ... />        {/* pure display — doesn't need client */}
      <ProductInfoPanel ... />  {/* pure display — doesn't need client */}
      <Tabs value={activeTab} onChange={setActiveTab} ... />
    </>
  );
}
```

**✅ Correct — extract the minimal interactive piece:**

```tsx
// product-detail-page.tsx — Server Component
export default async function ProductDetailPage({ params }) {
  const product = await fetchProduct(params.slug); // server data fetch
  return (
    <>
      <Breadcrumb ... />          {/* Server — pure display */}
      <ProductInfoPanel ... />    {/* Server — pure display */}
      <ProductViewerTabs ... />   {/* Client — owns activeTab state ONLY */}
      <AddToCartButton ... />     {/* Client — owns onClick ONLY */}
    </>
  );
}

// product-viewer-tabs.tsx — Client Component
'use client';
function ProductViewerTabs(props) {
  const [activeTab, setActiveTab] = useState('360'); // only reason to be client
  return <Tabs value={activeTab} onValueChange={setActiveTab} ... />;
}
```

### URL State vs. Component State

Interactive UI that **filters, sorts, or paginates data** must use URL search params — not `useState`.

- URL state → shareable, bookmarkable, SEO-friendly, server-renderable
- Component state → ephemeral, lost on refresh, forces client boundary on data

**❌ Wrong — filter logic on client, component owns data state:**

```tsx
'use client';
function CatalogClient({ allProducts }) {
  const [sort, setSort] = useState('featured');
  const [filters, setFilters] = useState({ ... });
  const filtered = allProducts.filter(...).sort(...); // client-side
  return <ProductGrid products={filtered} />;
}
```

**✅ Correct — URL params drive server filter, thin client pushes params:**

```tsx
// catalog/page.tsx — Server Component
export default async function CatalogPage({ searchParams }) {
  const { sort, filters } = parseSearchParams(await searchParams);
  const products = await fetchProducts({ sort, filters }); // server-side
  return (
    <>
      <FilterSidebarControl defaultFilters={filters} />  {/* Client: pushes URL only */}
      <CatalogSortControl defaultSort={sort} />          {/* Client: pushes URL only */}
      <ProductGrid products={products} />                {/* Server: pure display */}
    </>
  );
}

// catalog-controls.tsx — Client Component
'use client';
function FilterSidebarControl({ defaultFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Only responsibility: push new params to URL on filter change
  const handleChange = (state) => {
    const params = new URLSearchParams(searchParams.toString());
    // ... build params ...
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return <FilterSidebar value={defaultFilters} onFilterChange={handleChange} />;
}
```

### `useSearchParams()` and Suspense

Any Client Component that calls `useSearchParams()` must be wrapped in `<Suspense>` at the Server Component boundary. Without it, Next.js opts the entire page into dynamic rendering.

```tsx
// ✅ Required pattern
<Suspense fallback={<FilterSidebarSkeleton />}>
  <FilterSidebarControl defaultFilters={filters} />
</Suspense>
```

### Data Fetching

- **Always fetch data in Server Components** (`page.tsx`, `layout.tsx`, or async Server Components).
- **Never** fetch data inside Client Components on initial render (`useEffect(() => fetch(...))`) — this causes waterfalls and duplicates round trips.
- Pass fetched data **down as props** to both Server and Client children.

```tsx
// ✅ Correct — fetch in Server Component, pass down
export default async function ProductDetailPage({ params }) {
  const product = await fetchProduct(params.slug); // one server round trip
  return <ProductViewerTabs posterUrl={product.posterUrl} thumbnails={product.thumbnails} />;
}

// ❌ Wrong — fetch inside Client Component
'use client';
function ProductViewerTabs({ slug }) {
  const [product, setProduct] = useState(null);
  useEffect(() => { fetch(`/api/products/${slug}`).then(...); }, [slug]); // client waterfall
}
```

### Naming Convention

| Suffix / Location | Meaning |
|---|---|
| `page.tsx` | Always Server Component unless explicitly noted |
| `layout.tsx` | Always Server Component unless explicitly noted |
| `*-client.tsx` | **Avoid this pattern** — it suggests an entire section was needlessly made client-side. Prefer specific names that describe the narrow responsibility: `*-tabs.tsx`, `*-controls.tsx`, `*-button.tsx` |
| `use client` at top | Component has a specific, documented reason to be a Client Component |

### Checklist Before Adding `'use client'`

Before adding `'use client'` to any component, confirm:

- [ ] This component directly uses a browser API, state hook, or client hook
- [ ] I cannot extract the interactive part into a smaller leaf component
- [ ] If it touches URL-driven data (filters, sort, pagination) → I am using `useRouter` + `useSearchParams` to push URL params, not `useState` to hold data
- [ ] If it uses `useSearchParams()` → a `<Suspense>` boundary wraps it in the parent Server Component

## Git

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`

- Keep commits focused; one logical change per commit

## Task Management

- Maintain a `todo-list.md` in the `docs/` directory to track non-compliance issues and pending features.

- Section header format: `# [Short Description] [Created Date: YYYY-MM-DD] [Completed Date: YYYY-MM-DD or Pending]`

- Use markdown checkboxes `[ ]` for tasks.

- Keep the list updated as progress is made.
