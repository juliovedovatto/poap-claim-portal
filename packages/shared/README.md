# packages/shared (documentation stub)

> Cross-package schemas and types are OUT OF SCOPE for this demo. This README documents the shared layer that would sit between `apps/web`, `apps/api`, and `packages/contracts`, for completeness. No code is committed; `packages/shared` is NOT a Bun workspace (no `package.json`).

## What it would contain (if implemented)

- Zod input schemas: SIWE nonce verification, claim request, event payload, attendee payload.
- Shared TypeScript types: `Event`, `Attendee`, `ClaimReceipt`.
- ABI re-exports from `packages/contracts` (compiled JSON).
- A SIWE nonce verifier helper.

## How it would be consumed (if implemented)

`apps/web` and `apps/api` would import via the workspace package name, e.g. `@poap-claim-portal/shared`.

## How this demo handles types instead

Because `packages/shared` is stub-only, each app defines its own local types:

- `apps/api` owns API request/response types and writes them locally.
- `apps/web` owns frontend types locally.
- Types are NOT imported across packages; there is no cross-workspace type import. This keeps `bun run typecheck` self-contained per app and avoids a shared-package build step.

## Status

Documentation-only. No code, no build, no tests in this repo.
