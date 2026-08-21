# CLAUDE.md — apps/api

## Product
This service is the **Gasless POAP / NFT Claim Portal** backend — a NestJS REST API that owns off-chain state (events, attendees, claim receipts) and is the source of truth the React web app reads from. It is designed to sit in front of **Supabase** (Postgres + RLS) for persistence and auth, and to coordinate the documented on-chain claim flow.

- **NestJS** (Fastify adapter) running TypeScript directly on **Bun** — no `@nestjs/cli`, no webpack build.
- **Supabase** for database / auth / storage (Postgres + Row-Level Security). The demo currently uses mock data in `SupabaseService`; the Supabase client is wired and ready.
- **class-validator** + **class-transformer** for DTO validation at the trust boundary.

## Development workflow — use agents for every change request
Treat every change request as agentic work: match the agent to the task, and never implement before the task is clear.

### Agents (`.claude/agents/`)
| Agent | Use for |
|------|--------|
| `planner` | Multi-step sequencing, risk, tradeoffs, execution plans |
| `coder` | Code authoring — logic, bug fixes, features (smallest correct diff) |
| `researcher` | External research — APIs, libraries, docs, behavior |
| `reviewer` | Review diffs, architecture, risk; produces findings |
| `qa` | Validate behavior, endpoints, Playwright flows, tests |
| `worker` | Non-coding tasks — config, doc edits, wiring, approved handoffs |
| `scout` | Fast codebase recon — where does this change belong |
| `context-builder` | Analyze requirements and build context / meta-prompt |
| `oracle` | Second opinion on a judgment call or complex plan |

Run independent subtasks in parallel; dependent ones as a chain. After implementation, run the green gate, then dispatch `reviewer` → `coder` apply-pass for any findings.

### Skills (`.claude/skills/`)
- **Specific task from the user** → run the **`decompose`** skill *before* implementation: it clarifies scope (asks at most 3 questions if ambiguous), breaks the task into ordered subtasks, dispatches the right agent per subtask, and verifies. Do not jump straight to code.
- **User gives a Jira ticket** (issue key or URL) → run the **`jira-decompose`** skill: it reads the ticket via the Jira MCP, summarizes it into a brief, then hands off to `decompose`.
- While coding, follow the layer best-practices skills: **`nestjs-best-practices`** for this app; **`supabase-postgres-best-practices`** when touching schema / RLS / queries / Supabase; use **`agent-browser`** / **`playwright-skill`** to verify the API end-to-end from the browser.
- **Browser verification** — `agent-browser` for quick MCP-driven browser checks/screenshots; `playwright-skill` when authoring a reusable Playwright script (the script itself is the artifact).
- **Too large / near context limit** — Task too large or nearing the context limit → produce a `handoff` doc instead of a half-finished change.
- Keep diffs minimal — apply the **`ponytail`** ladder (write only what the task needs) and run the built-in **`/code-review`** before finishing.

## Run
- `bun src/main.ts` — start the API (NestJS runs TS directly under bun).
- `bun run dev` — watch mode (`bun --watch src/main.ts`).

## NestJS on Bun
- CommonJS package (no `"type": "module"`). NestJS runs TS directly under bun — no @nestjs/cli, no webpack build.
- Fastify adapter (`@nestjs/platform-fastify`); `@fastify/cors` is bundled, so `app.enableCors(...)` needs no extra dep.
- `experimentalDecorators` + `emitDecoratorMetadata` enabled for NestJS DI.

## Env
- Read `process.env` directly — no `@nestjs/config`. Bun auto-loads `apps/api/.env`.
- Copy `.env.example` to `.env` for real Supabase keys; demo placeholders are safe defaults.

## Structure
- `supabase/` — `SupabaseModule` + `SupabaseService` (wired client; demo uses mock data).
- `claims/` — `ClaimsController`, `ClaimsService`, `ClaimsModule`, `dto/claim.dto.ts`.
- Tests: `*.spec.ts` co-located.

## Validation
- `class-validator` + `class-transformer` (explicit deps — optional peers of `@nestjs/common`).
- Global `ValidationPipe({ whitelist: true, transform: true })` in `main.ts`.

## CORS
- Allows `http://localhost:5173` (the web app dev origin).

## Tests
- `bun test` (bun:test). Plain `new` instantiation (e.g. `new ClaimsService(new SupabaseService())`) — no Nest TestingModule.

## Build
- `tsc --noEmit` gate. NestJS runs TS directly under bun — do NOT use `bun build`.

## Do-not-touch
- Real `.env` files.
- `bun.lock` (regenerate via `bun install`, never hand-edit).
