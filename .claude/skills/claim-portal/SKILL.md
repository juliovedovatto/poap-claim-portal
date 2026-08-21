---
name: claim-portal
description: Guides work on the Gasless POAP / NFT Claim Portal — SIWE auth, claims CRUD, Supabase RLS per event, wagmi hook wiring, and the gasless (ERC-4337 paymaster) claim architecture. Use when adding or changing a claim flow, event, attendee, or on-chain interaction in this monorepo.
license: MIT
---

# claim-portal skill

## Architecture
- `apps/web` — React 18 + Vite + Tailwind v4 (CSS `@theme` tokens in `src/index.css`, NO JS config) + wagmi v2 + viem v2. Wallet connect, event list, claim button.
- `apps/api` — NestJS on Bun + Supabase (Postgres + RLS). Owns off-chain state: events, attendees, claim receipts.
- `packages/contracts` and `packages/shared` are documentation-only stubs (do NOT add code there).

## The claim flow

**Implemented flow (this demo):**
1. User connects a wallet in `apps/web` (`useAccount`) — the wallet address is the attendee identity.
2. `apps/web` fetches events from the NestJS API (`GET /events`).
3. The claim button POSTs `{ eventId, attendee }` to the API (`POST /claims`).
4. The API writes an idempotent claim receipt (in-memory) and returns it.

**Documented target architecture (out of scope / contract layer):**
1. User signs SIWE in `apps/web` (wagmi `useSignMessage`) → `apps/api` verifies → mints a Supabase JWT with custom claims (`event_id`).
2. User fetches an event + their Merkle proof from `apps/api`.
3. Gasless claim: `apps/web` builds a UserOperation; a Pimlico verifying paymaster sponsors gas; the entrypoint calls `Badge.claim(eventId, proof)` (contract layer in `packages/contracts`).
4. On `Claimed` event, `apps/api` writes a `claim_receipts` row (RLS: only the event organizer / the attendee themselves can read their own).
5. Dashboard charts claims per event.

## How to add a feature
1. **Schema/RLS** — define the table + RLS policy in Supabase (organizer writes; users read their own rows).
2. **API** — add a NestJS module (`*.module.ts` + `*.service.ts` + `*.controller.ts`) in `apps/api`.
3. **Frontend** — add a wagmi hook + component in `apps/web`; style with Tailwind v4 utility classes + the `@theme` tokens.
4. **Types** — define types locally in the app that owns them (`apps/api` owns API types, `apps/web` owns frontend types). Do NOT create a cross-package import via `packages/shared` — it is documentation-only and is not a workspace. If both apps need the same type, duplicate it in each app for this demo.
5. **Tests** — co-locate `*.spec.ts`; run the green gate.
6. **Green gate** — `bun run lint && bun run typecheck` must pass before finishing (the Stop hook enforces this once deps are installed).

## Conventions (see CLAUDE.md)
- Tailwind v4 CSS-first: add tokens under `@theme` in `apps/web/src/index.css`. No `tailwind.config.js`.
- ESLint v9 flat config is self-contained per app (no cascade).
- Prettier: single quotes, 100 cols, semi, trailingComma all.
- Commits: Conventional Commits, single-line titles, e.g. `feat(web): add claim button`.
- Testnet only. Never real funds. Solidity contracts are out of scope (doc-only).

## Do-not-touch
`packages/contracts`, `packages/shared`, `.git`, `bun.lock`, real `.env` files.
