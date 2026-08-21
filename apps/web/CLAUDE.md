# CLAUDE.md — apps/web

## Product
This app is the **Gasless POAP / NFT Claim Portal** frontend — a React 18 SPA where a user connects a wallet, browses claimable events, and claims a POAP. Server data comes from the NestJS API (`apps/api`); wallet interaction is via wagmi/viem.

- **React 18** — function components + hooks; no class components.
- **TanStack Query** (`@tanstack/react-query`) for all server state and data fetching (events, claims). Prefer `useQuery` / `useMutation` over hand-rolled fetch state.
- **Tailwind v4** (CSS-first) for styling — utility classes + `@theme` design tokens in `src/index.css`.

## Development workflow — use agents for every change request
Treat every change request as agentic work: match the agent to the task, and never implement before the task is clear.

### Agents (`.claude/agents/`)
| Agent | Use for |
|------|--------|
| `planner` | Multi-step sequencing, risk, tradeoffs, execution plans |
| `coder` | Code authoring — logic, bug fixes, features (smallest correct diff) |
| `researcher` | External research — APIs, libraries, docs, behavior |
| `reviewer` | Review diffs, architecture, risk; produces findings |
| `qa` | Validate behavior, UI, Playwright flows, screenshots, tests |
| `worker` | Non-coding tasks — config, doc edits, wiring, approved handoffs |
| `scout` | Fast codebase recon — where does this change belong |
| `context-builder` | Analyze requirements and build context / meta-prompt |
| `oracle` | Second opinion on a judgment call or complex plan |

Run independent subtasks in parallel; dependent ones as a chain. After implementation, run the green gate, then dispatch `reviewer` → `coder` apply-pass for any findings.

### Skills (`.claude/skills/`)
- **Specific task from the user** → run the **`decompose`** skill *before* implementation: it clarifies scope (asks at most 3 questions if ambiguous), breaks the task into ordered subtasks, dispatches the right agent per subtask, and verifies. Do not jump straight to code.
- **User gives a Jira ticket** (issue key or URL) → run the **`jira-decompose`** skill: it reads the ticket via the Jira MCP, summarizes it into a brief, then hands off to `decompose`.
- While coding, follow the layer best-practices skill: **`react-best-practices`** for this app; use **`agent-browser`** / **`playwright-skill`** for UI verification.
- **Browser verification** — `agent-browser` for quick MCP-driven browser checks/screenshots; `playwright-skill` when authoring a reusable Playwright script (the script itself is the artifact).
- **Too large / near context limit** — Task too large or nearing the context limit → produce a `handoff` doc instead of a half-finished change.
- **Vendored skill note** — `react-best-practices` is vendored upstream; its Next.js/RSC-specific rules (e.g. `server-*`, `next/dynamic`) do NOT apply to this Vite SPA. Do not edit the vendored SKILL.md.
- Keep diffs minimal — apply the **`ponytail`** ladder (write only what the task needs) and run the built-in **`/code-review`** before finishing.

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
