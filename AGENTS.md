# AGENTS.md

## Project Intent

This is a Next.js admin app for Della Rosee. Future code should be simpler and more modular than much of the current codebase: prefer small files, explicit boundaries, and predictable tests over large component files that mix rendering, state, data shaping, and side effects.

## Core Rules

- Use TypeScript strictly. Avoid `any`; model request, response, and view data with named types.
- Keep code clean, readable, and boring. Prefer obvious names and short functions over clever abstractions.
- Minimize duplication. Extract shared constants, formatters, schemas, and helpers when the same idea appears more than once.
- Preserve existing behavior unless the task explicitly asks for a change.
- Match existing project tools: Next.js App Router, React, Chakra UI, TanStack Query, and service modules under `src/services`.
- Use absolute imports through `@/` for app code.

## Component Structure

Use one component per file for all new or meaningfully changed UI.

Preferred feature shape:

```text
src/components/<feature>/<ComponentName>/
  <ComponentName>.tsx
  use<ComponentName>.tsx
  <ComponentName>.test.tsx
  <ComponentName>.integration.test.tsx
  index.ts
```

For very small shared UI pieces, a flat file is acceptable:

```text
src/components/admin/AdminPagination.tsx
```

Do not add multiple local components to a large page or component file. If a child component has its own props, branches, loading state, formatting, or user interaction, move it to its own file.

## Business Logic

Business logic belongs in `use<ComponentName>.tsx`.

Put these in the hook:

- Form defaults and normalization.
- Derived view models.
- Filtering, sorting, pagination calculations, and data grouping.
- Mutation orchestration and success/error handling.
- Component event handlers when they contain decisions.
- Permission, status, and availability rules.

Keep `<ComponentName>.tsx` focused on rendering:

- Read values and handlers from `use<ComponentName>()`.
- Render Chakra UI and child components.
- Keep inline logic to trivial display checks only.

Shared, non-React logic should live outside the hook in a focused helper module, for example:

```text
src/lib/orders.ts
src/components/orders/order-formatters.ts
```

## Data Access

- Keep API calls in `src/services`.
- Keep query hooks in `src/hooks/query`.
- Keep mutation hooks in `src/hooks/mutations`.
- Components should not call service methods directly unless there is a strong local reason.
- Prefer typed service payloads and typed query results.

## Testing Expectations

Every new feature or changed behavior should include unit and integration coverage.

Unit tests should cover:

- Pure helpers and formatters.
- Hook business logic.
- Validation and normalization rules.
- Conditional behavior and edge cases.

Integration tests should cover:

- User-facing component flows.
- Data loading, empty, error, and success states.
- Form submission and mutation behavior.
- Important interactions across parent and child components.

There is currently no test runner configured in `package.json`. When adding the first tests, add a standard React/Next test setup and scripts such as:

```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage"
}
```

Use React Testing Library for component tests. Mock network/service boundaries; do not mock the component logic being tested.

## Duplication Policy

Before adding a helper, search for an existing one with `rg`.

Extract repeated logic when duplication creates maintenance risk, especially:

- Currency, date, phone, and status formatting.
- Table pagination and filter state.
- Admin form field wrappers.
- Toast and mutation handling patterns.
- Option lists and translation maps.

Do not extract abstractions just to reduce two lines of harmless repetition. Readability wins.

## Styling and UI

- Use Chakra UI primitives and the existing theme tokens.
- Keep admin screens dense, scannable, and operational.
- Use icon buttons for clear icon-only actions and include accessible labels.
- Keep responsive behavior explicit for tables, forms, and action bars.
- Avoid large decorative UI that makes admin workflows slower to scan.

## Quality Checks

Run the relevant checks before handing work back:

```bash
npm run lint
npm run format:check
npm run build
npm run test
```

If a command is unavailable, note that clearly and add the missing script or dependency when the task includes testing setup.

## Review Checklist

Before finishing a change, verify:

- Each component lives in its own file.
- Business logic is in `use<ComponentName>.tsx` or a shared helper.
- Unit tests cover logic and edge cases.
- Integration tests cover user flows.
- Duplicated logic was reused or intentionally left local.
- Types are explicit at module boundaries.
- Existing unrelated changes were not reverted.
