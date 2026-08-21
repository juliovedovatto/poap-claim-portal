# code-style

Additive to root `CLAUDE.md` (Code style / Naming) — only the rules not already stated there.

## Naming specifics
- `camelCase` for variables/functions, `PascalCase` for components/types/modules, `CONSTANT_CASE` for env-like constants.
- Files: `kebab-case` for non-component, `PascalCase.tsx` for components only.

## TypeScript strictness
- No `any`. No `@ts-ignore`; use `@ts-expect-error` with a reason only when unavoidable.

Formatting, React, NestJS, and diff-scope rules live in root `CLAUDE.md` and the app `CLAUDE.md`s — not duplicated here.
