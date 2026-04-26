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

## Git

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`

- Keep commits focused; one logical change per commit

## Task Management

- Maintain a `todo-list.md` in the `docs/` directory to track non-compliance issues and pending features.

- Section header format: `# [Short Description] [Created Date: YYYY-MM-DD] [Completed Date: YYYY-MM-DD or Pending]`

- Use markdown checkboxes `[ ]` for tasks.

- Keep the list updated as progress is made.