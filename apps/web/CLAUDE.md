# CLAUDE.md — apps/web

## Run
- `bun run dev` — Vite dev server (default port 5173).
- `bun run build` — `tsc --noEmit && vite build`.

## Stack
- React 18 + Vite 5 + Tailwind v4 CSS-first.
- Design tokens live in `src/index.css` via `@theme` — NO JS config, NO `tailwind.config.js`.
- wagmi ^2 + viem ^2 for on-chain; `@tanstack/react-query` for data fetching.

## Aliases
- `@` → `./src` (tsconfig `paths` + Vite resolve).

## Lint
- ESLint v9 flat config (`eslint.config.mjs`), self-contained.
- react-hooks `recommended-latest`; react-refresh plugin.

## Tests
- `bun test` (bun:test). Co-located `*.spec.ts` (e.g. `src/lib/format.spec.ts`).

## Build
- `tsc --noEmit && vite build`. TypeScript strict.

## Do-not-touch
- `src/index.css` `@theme` tokens are the design-system source — change deliberately.
- No `tailwind.config.js` — Tailwind v4 is CSS-first.
- Real `.env` files; `bun.lock`.
