# packages/contracts (documentation stub)

> Solidity / on-chain contracts are OUT OF SCOPE for this demo. The candidate is a web developer (React / NestJS / Supabase). This README documents the contract layer that would back the gasless claim portal, for completeness. No `.sol` files are committed.

## What it would contain

- **`Badge.sol`** — a soulbound ERC-721 (proof of attendance). Built on OpenZeppelin v5: overrides `_update` to revert on transfers (soulbound) and implements ERC-5192 `locked()` returning `true`. `mint(to, eventId, uri)` is restricted to the paymaster contract.
- **`ClaimPaymaster.sol`** — an ERC-4337 paymaster. It implements `validatePaymasterUserOp` (bundlers call `handleOps` on the EntryPoint; paymasters only validate and sponsor). It sponsors gas for eligible `claim` calls within a per-event gas budget.
- **`claim(eventId, proof)`** — guarded by a Merkle allowlist. The Merkle leaf binds `(account, eventId)` together to prevent proof replay across events or accounts. Under ERC-4337, `msg.sender` is the user's smart account, so the leaf binds the smart-account address.
- Emits **`Claimed(uint256 indexed eventId, address indexed attendee)`** on success. The transaction hash is NOT available on-chain at emit time; it is indexed off-chain from the receipt.

## Tooling

- Foundry (preferred) or Hardhat; Solidity `0.8.24`.
- Deploy to a testnet only (Sepolia / Base Sepolia). Never mainnet, never real funds.

## ABI export

The compiled ABI (JSON) would be exported and re-exported through `packages/shared` so `apps/web` (wagmi/viem) and `apps/api` consume the same contract interface.

## Off-chain coordination

`apps/api` writes a `claim_receipts` row ONLY after observing the `Claimed` event on-chain (via the Pimlico bundler or an Alchemy log backfill). The write is idempotent on `(event_id, attendee)` so reorgs or retried UserOperations do not produce duplicate receipts.

## Status

Documentation-only. No build, no tests, no deployment in this repo.
