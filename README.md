# poap-claim-portal

Gasless POAP / NFT claim portal — a demo monorepo built to showcase real Claude AI usage across the SDLC.

## What it is

A demo NFT claim portal and honest job-interview artifact for agentic coding with Claude: skills, subagents, hooks, MCP servers, and a documented commit history.

**What IS implemented:**
- **Wallet connect** via wagmi (`apps/web`) — the connected wallet address is the attendee identity (the web3 tie-in).
- **API-backed event list** — `apps/web` fetches events from the NestJS API (`GET /events`).
- **Idempotent claim receipts** — the claim button POSTs `{ eventId, attendee }` to the API (`POST /claims`), which writes an in-memory claim receipt.

**What is DOCUMENTED as target architecture but OUT OF SCOPE for this demo:**
- **SIWE JWT auth** (`useSignMessage` → Supabase JWT with custom claims).
- **The on-chain gasless ERC-4337 mint** — a UserOperation sponsored by a Pimlico paymaster calling `Badge.claim`, via the contract layer in `packages/contracts`.
- An off-chain attendance **dashboard**.

The web app and API are wired together into one flow; there is no real on-chain mint in this demo.

## Tech stack

- **Bun 1.3.14** + workspaces (monorepo runtime, package manager, test runner)
- **apps/web** — React 18 + Vite + Tailwind v4 (CSS-first tokens, no JS config) + wagmi v2 + viem v2
- **apps/api** — NestJS on Bun + Supabase (Postgres + RLS)
- **packages/contracts** — Solidity contract specs (documentation-only stub, out of scope for this demo)
- **packages/shared** — cross-package schemas (documentation-only stub)

## Monorepo layout

```
poap-claim-portal/
├── CLAUDE.md              # project conventions auto-loaded by Claude
├── README.md
├── COMMIT_CONVENTION.md
├── package.json           # bun workspaces root
├── bunfig.toml
├── eslint.config.mjs      # root flat config (root-level files only)
├── .prettierrc / .prettierignore
├── .gitignore / .gitattributes
├── .claude/
│   ├── settings.json      # hooks (PreToolUse / PostToolUse / Stop)
│   ├── agents/            # subagent roster (coder, reviewer, qa, ...)
│   └── skills/            # 10 committed skills (see "Built with Claude AI")
├── apps/
│   ├── web/               # React 18 + Vite + Tailwind v4 + wagmi/viem
│   └── api/               # NestJS on Bun + Supabase
└── packages/
    ├── contracts/         # README only (Solidity — out of scope)
    └── shared/            # README only
```

## Getting started

```bash
bun install
cp apps/api/.env.example apps/api/.env   # API env (bun loads apps/api/.env)
bun run dev            # runs all workspaces
bun run lint           # per-app lint via bun --filter
bun run typecheck      # per-app typecheck via bun --filter
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Runs `dev` in every workspace that defines it |
| `bun run build` | Builds every workspace that defines it |
| `bun run lint` | Runs each app's self-contained ESLint v9 flat config |
| `bun run lint:root` | Lints root-level config files only |
| `bun run typecheck` | Typechecks every workspace that defines it |
| `bun run format` | Prettier write across the repo |
| `bun run format:check` | Prettier check across the repo |

## Built with Claude AI (interview evidence)

This repo is the artifact of an agentic SDLC run with Claude Code:

- **Skills** — committed in `.claude/skills/`: `claim-portal` (repo-specific claim/event architecture), `ponytail` (write-less / YAGNI ladder), `decompose` (clarify → break down → dispatch agents), `jira-decompose` (read a Jira ticket → run decompose), `handoff` (session-continuity transfer docs), `supabase-postgres-best-practices` (vendored from Supabase — 33 references), `agent-browser` (Playwright MCP UI verification), `playwright-skill` (code-first Playwright automation, vendored from lackeyjb), `react-best-practices` (vendored from Vercel — 70 rules), `nestjs-best-practices` (vendored from Kadajett — 40 rules). External/global skills used during the build but not committed here: `superpowers`, `frontend-design`, `plugin-dev`.
- **Subagents** — `scout` (recon), `context-builder` (requirements), `researcher` (external docs), `planner` (multi-step plans), `coder` (code), `worker` (scaffolding/docs), `reviewer` (review), `qa` (validation), `oracle` (second opinions).
- **Built-in skills** — the `coder` agent runs the bundled `/code-review` (formerly `/simplify`) review pass plus the ponytail YAGNI ladder before finishing.
- **Hooks** — `PreToolUse` (validation), `PostToolUse` (prettier on edit), `Stop` (refuse "done" until lint/typecheck/tests pass).
- **MCP servers** — GitHub, Supabase, Context7, Playwright, Serena, Jira (Atlassian).
- **CLAUDE.md** — project conventions auto-loaded each session.

The commit history documents the step-by-step build: scaffolding → tooling → apps → validation.

## Disclaimers

Demo only. No real funds, no mainnet contracts. Solidity contracts are documentation-only stubs (out of the candidate's domain). Contains no confidential data or third-party code.

## Hooks & MCP servers (agent evidence)

### Hooks (`.claude/settings.json`)

- **PreToolUse** — runs before `Bash`, `Edit`, and `Write`. Blocks destructive Bash commands (`git push`, `git reset --hard`, `git commit --no-verify`, `rm -rf /`, `dd` to block devices) and writes to do-not-touch paths (`packages/contracts`, `packages/shared`, `.git`, `bun.lock`, real `.env` files).
- **PostToolUse** — runs after `Edit`/`Write` and formats the edited file with Prettier (format-on-save).
- **Stop** — green gate: once deps are installed, blocks finishing the turn until `bun run lint:root`, `bun run typecheck`, `bun run test`, and `bun run typecheck:hooks` pass.

Hooks are committed in the repo and run via `bun ${CLAUDE_PROJECT_DIR}/.claude/hooks/*.ts` (absolute paths, so they work from any cwd).

### MCP servers (`.mcp.json`)

- **GitHub** — PR review, issues, repo management.
- **Supabase** — auth, DB, storage, edge functions for the Supabase project.
- **Context7** — live library/framework docs to stop hallucinated APIs.
- **Playwright** — real browser automation and E2E UI verification.
- **Serena** — semantic code navigation across the monorepo.
- **Jira (Atlassian)** — read Jira issues/tickets via the official Atlassian remote MCP (OAuth, no secrets in repo). Used by the `jira-decompose` skill.

> **Note:** secret values in `.mcp.json` are placeholders — replace them with real tokens and never commit real secrets. Hooks committed in `.claude/settings.json` execute without a trust dialog on a cloned repo in `claude -p`/SDK sessions; this is a deliberate, reviewed choice for this demo.
