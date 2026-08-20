# CLAUDE.md — poap-claim-portal

## Project

Gasless POAP / NFT claim portal — a Bun-workspace monorepo and interview demo of an agentic SDLC with Claude.

## Runtime & versions

- Bun 1.3.14 (runtime + package manager + test runner), Node-compat enabled.
- Use `bun` for install/run/test. Never use npm/yarn.

## Commands

| Command | What it does |
| --- | --- |
| `bun install` | Install all workspaces |
| `bun run dev` | Dev all workspaces |
| `bun run build` | Build all workspaces |
| `bun run lint` | Per-app lint via `bun --filter '*'` |
| `bun run lint:root` | Lint root-level config files |
| `bun run typecheck` | Per-app typecheck via `bun --filter '*'` |
| `bun run format` | Prettier write |
| `bun run format:check` | Prettier check |

`bun --filter '*' <script>` skips workspaces that lack the script.

## Workspace layout

- `apps/web` — React + Vite + Tailwind v4 + wagmi/viem.
- `apps/api` — NestJS + Supabase.
- `packages/contracts` and `packages/shared` are **documentation-only** (README stubs). DO NOT add code, package.json, or scripts there.

## Code style

- Prettier: semi, singleQuote, 100 width, trailingComma all, LF.
- ESLint v9 flat config, self-contained per app (no cascade).
- TypeScript strict.
- Tailwind v4 CSS-first via `@theme` tokens in `apps/web/src/index.css` — no JS config, no `tailwind.config.js`.

## Naming

- Files: kebab-case for non-component files, PascalCase for React components.
- Folders: kebab-case.
- NestJS: `*.module.ts`, `*.service.ts`, `*.controller.ts`.
- Tests: `*.spec.ts` co-located.

## Do-not-touch

- `packages/contracts`, `packages/shared` (doc-only).
- `.env` files.
- `bun.lock` (regenerate via `bun install`, never hand-edit).
- `.git` internals.

## Commit convention

Conventional Commits, single-line titles only, no body. Types: feat, fix, docs, style, refactor, test, chore, perf, build, ci. Optional scope: `feat(web): add claim button`. See COMMIT_CONVENTION.md.

## Web3 / on-chain

Solidity contracts are OUT OF SCOPE (doc-only stub). On-chain interactions happen in apps/web via wagmi/viem against a testnet only. Never real funds. Pimlico/bundler/paymaster wiring is described in packages/contracts/README.md.

## Agent usage

- `scout` — recon, where a change belongs.
- `context-builder` — requirements.
- `researcher` — external docs/APIs.
- `planner` — multi-step/risky plans.
- `coder` — code authoring.
- `worker` — scaffolding/config/docs/wiring.
- `reviewer` — diff/plan review.
- `qa` — validation/screenshots.
- `oracle` — second opinions on complex/judgment calls.

## Deeper docs

- `@apps/web/CLAUDE.md`, `@apps/api/CLAUDE.md`.
- `@packages/contracts/README.md`, `@packages/shared/README.md`.
