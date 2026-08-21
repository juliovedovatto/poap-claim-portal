# How the portal works (full vision)

> Target vision: all features implemented, including the on-chain mint and SIWE auth.
> The current demo ships only the claim flow, with an in-memory receipt. The rest is target architecture.

## Actors

- **User** — opens the dApp with an injected wallet (MetaMask).
- **dApp (`apps/web`)** — React + wagmi. Lists events and fires the claim.
- **API (`apps/api`)** — NestJS on Bun. Validates the claim and writes the receipt.
- **Supabase** — Postgres with RLS. Stores events and receipts.
- **Bundler (Pimlico)** — sends the UserOperation to the Entry Point (ERC-4337).
- **Paymaster (Pimlico)** — pays the gas. Gasless for the user.
- **Badge.sol** — ERC-721 soulbound. Mints the POAP.

## Flow

```
  USER (wallet)
     │  1. connect (wagmi injected)
     ▼
  dApp (apps/web · React + wagmi)
     │  2. SIWE sign  →  API (apps/api)  →  Supabase (RLS, JWT with event_id claim)
     │  3. GET /events
     │  4. "Claim POAP" → builds a UserOperation (ERC-4337): claim(eventId, merkleProof)
     ▼
  Bundler (Pimlico)
     │  5. submit UserOp
     ▼
  Entry Point (ERC-4337)
     │  6. Paymaster (Pimlico) pays the gas → gasless
     ▼
  Badge.sol (ERC-721 soulbound)
     │  7. checks the Merkle allowlist
     │  8. mint POAP → user's wallet
     ▼
  event Claimed(eventId, attendee, txHash)
     │  9. API writes receipt { txHash } to Supabase (only after UserOp success)
     ▼
  Features on-chain / off-chain:
    • Organizer dashboard  (claim count per event, via Supabase)
    • Raffle               (draw among POAP holders)
    • Vote                 (multiple-choice vote among holders)
    • Attendance portfolio (wallet's POAPs, read on-chain)
```

## Step by step

1. **Connect** — the user connects the wallet (wagmi `injected`).
2. **SIWE** — the user signs a message. The API validates the signature and issues a Supabase JWT with the `event_id` claim.
3. **Browse** — the dApp lists events from the API (`GET /events`).
4. **Claim** — the user clicks "Claim POAP". The dApp builds a UserOperation (ERC-4337) that calls `Badge.claim(eventId, merkleProof)`.
5. **Gasless** — the Paymaster pays the gas. The Bundler sends the UserOp to the Entry Point.
6. **On-chain** — the contract checks the Merkle allowlist and mints a soulbound POAP to the user.
7. **Receipt** — the `Claimed(eventId, attendee, txHash)` event fires. The API writes the receipt `{ txHash }` to Supabase, only after the UserOp succeeds.
8. **Portfolio** — the user's wallet now holds the POAP on-chain. The portfolio features read that history.

## What each feature uses

- **Organizer dashboard** — reads receipts from Supabase (claim count per event).
- **Raffle** — draws among the holders of a POAP (reads on-chain).
- **Vote** — sends a multiple-choice vote to the holders of a POAP.
- **Attendance portfolio** — lists a wallet's POAPs (reads on-chain).

## Notes

- The POAP is soulbound: it does not transfer. It proves attendance.
- RLS in Supabase: the user reads only their receipts; the organizer reads those of their event.
- The Paymaster sets the gas budget per event.

## Claude workflow (how the portal was built)

The portal is the artifact of an agentic SDLC with Claude Code: skills, subagents, hooks, and MCP servers orchestrate the build. The commit history shows the step by step.

### Pieces

- **Skills** — `claim-portal` (claim architecture), `ponytail` (YAGNI ladder), `react-best-practices` / `nestjs-best-practices` / `supabase-postgres-best-practices` (vendored), `decompose` (breaks the task into agents), `handoff` (session continuity), `agent-browser` (Playwright UI check).
- **Subagents + model routing** — `scout` and `context-builder` (haiku, read), `coder`, `worker`, `reviewer`, `qa`, `researcher` (sonnet, write), `planner` and `oracle` (opus, judgment).
- **Hooks** — `PreToolUse` blocks destructive commands and writes to protected paths; `PostToolUse` runs prettier on edit; `Stop` enforces the green gate.
- **MCP servers** — GitHub (PRs/issues), Supabase (DB/auth), Context7 (live docs), Playwright (browser), Serena (semantic navigation), Jira (tickets).
- **Rules** — `.claude/rules/`: `docs-honesty` (do not describe the unimplemented as present), `code-style`, `security`, `testing`, `vendored-skills`.
- **Workflows** — `.claude/workflows/`: `feature`, `review-fix`, `investigate`, `research`, `plan`, `orchestrate` playbooks.

### Power commands

- **`/loop [interval] [prompt]`** — runs a prompt on an interval. Useful to poll a deploy or monitor PRs. Ex.: `/loop 5m "check if deploy finished"`.
- **`/simplify [focus]`** — reviews changed files for reuse, quality, and efficiency. Spawns three review agents in parallel, aggregates the findings, and applies the fixes. Run after every feature.
- **`/batch [instruction]`** — orchestrates large-scale changes in parallel. Decomposes into 5-30 units, spawns one agent per unit in an isolated worktree, and creates PRs. Ex.: `/batch "migrate src/ from Solid to React"`.
- **`/code-review`** — analyzes local commits ahead of upstream and uncommitted changes in the working tree.

### Reviewing open PRs

A second pair of eyes catches bugs before `main`. Reading the diff by hand is slow. When a teammate opens a PR — or you want a sanity check on your own — let Claude review it.

Prerequisites: Git and the GitHub CLI (`gh`) set up.

```
  Open PR (teammate or own)
     │
     │  /review <PR_NUMBER>   (Git + gh CLI)
     ▼
  Claude pulls the PR (diff + context)
     │
     ▼
  Structured review:
    • bugs
    • risky changes
    • what to fix
     │
     ▼
  Decision: approve, request changes, or apply fixes
```

Ex.: `/review 1234`. Claude delivers the review like a careful reviewer.

### Review→fix loop

```
  Task
     │
     ▼
  scout (haiku) ── recon ──▶ compressed context
     │
     ▼
  planner (opus) ── plan ──▶ steps + risks
     │
     ▼
  coder (sonnet) ── implements ──▶ diff
     │
     ▼
  reviewer (sonnet/opus) ── review ──▶ findings (BLOCKER/MAJOR/MINOR/INFO)
     │
     ▼
  coder (sonnet) ── apply-pass ──▶ findings become immutable spec
     │
     ▼
  green gate (Stop hook): lint + typecheck + typecheck:hooks + test + build
     │
     ▼
  commit (Conventional Commits, single-line)
```

### Green gate

The Stop hook blocks "done" until these pass: `lint` (0 errors), `typecheck`, `typecheck:hooks`, `test`, `build`. A change that affects runtime gets a boot-smoke of the API: `GET /events`, `POST /claims`, `GET /events/1abc` → 404.

### Honesty

The `docs-honesty` rule requires: never describe unimplemented behavior in the present tense. The target architecture (SIWE, gasless mint, dashboard) sits under "Documented target architecture (out of scope)". The current demo ships only the claim flow.

### Jira flow: ticket → PR

The full development flow, from ticket to PR. Uses the agents with model routing.

1. **Requirement** — the `jira-decompose` skill reads the ticket via Jira MCP and pulls the requirement.
2. **Plan** — the `planner` (opus) + `decompose` skill breaks the ticket into steps. It proposes a breakdown or a direct action.
3. **Second opinion** — the `oracle` (opus) validates the plan. Only if risky or complex.
4. **Implement** — `coder` (logic) and/or `worker` (scaffold, config, docs) run the steps and prepare everything.
5. **Review→fix loop** — the `reviewer` enumerates findings (BLOCKER/MAJOR/MINOR/INFO). The `coder` runs the apply-pass: findings become immutable spec, applied verbatim, no re-ranking or skipping. Re-verify the green gate. Repeat until the reviewer clears.
6. **Ship** — commit (Conventional Commits, single-line) and open the PR.

```
  Jira ticket
     │  jira-decompose (skill) + Jira MCP → requirement
     ▼
  planner (opus) + decompose → plan (breakdown or direct action)
     │
     ▼
  oracle (opus) → second opinion  (if risky or complex)
     │
     ▼
  aligned → coder (logic) and/or worker (scaffold / config / docs)
     │
     ▼
  loop review→fix:
    reviewer ──▶ findings ──▶ coder apply-pass ──▶ green gate
       ▲                                          │
       └───────────── not clean, repeat ───────────┘
     │ clean
     ▼
  commit (Conventional Commits) → open PR → delivery
```

### Worktrees (parallel work)

Worktrees enable parallel work. Each `coder` or `worker` runs in a separate git worktree. They do not clash. One writer per worktree.

`.worktreeinclude` copies gitignored files (e.g. `apps/api/.env`) into each new worktree. So each worktree can run the API without its own keys.

`/batch` uses this: it decomposes into 5-30 units, spawns one agent per unit in an isolated worktree, and creates one PR per unit.

```
  Plan with N independent units
     │
     ├─▶ worktree A → coder   → diff A → PR A
     ├─▶ worktree B → coder   → diff B → PR B
     └─▶ worktree C → worker  → diff C → PR C
```

Only parallelize when tasks are truly independent. Fan-out multiplies tokens.
