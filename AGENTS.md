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
- **Build Tool**: [Turbopack](https://turbopack.dev/)

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

- Prefer `const` over `let`.
- Don't use `any` type. Safety first. If it's unavoidable, add biome suppression.
- Code line width is 120 characters.
- Always use semicolon.
- React component should be functional component, not class component or arrow function.
- React component name should be PascalCase.
- React component file name should be kebab-case.
- Do not prefix interface names with 'I'.

## Git
- Use conventional commits: feat:, fix:, docs:, style:, refactor:, perf:, test:, chore:
- Keep commits focused; one logical change per commit

## Task Management

- Maintain a `todo-list.md` in the `docs/` directory to track non-compliance issues and pending features.
- Section header format: `# [Short Description] [Created Date: YYYY-MM-DD] [Completed Date: YYYY-MM-DD or Pending]`
- Use markdown checkboxes `[ ]` for tasks.
- Keep the list updated as progress is made.