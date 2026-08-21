# security

Basic security checks for this web3 demo. Run on any change touching wallets, the API boundary, or Supabase.

## Wallet / web3
- The only wallet action in the implemented flow is connecting (`useAccount`); the claim POST sends the address as `attendee`. Do not add signing or `eth_sendTransaction` flows without explicit ask.
- Treat the connected address as an identity, NOT as trusted input — never the sole authorization for a privileged action.
- Testnet only. Never real funds or mainnet contracts.

## API boundary (`apps/api`)
- Validate all input with `class-validator` DTOs (`whitelist: true` strips unknown fields). Never trust raw body/query params.
- Reject non-integer ids with `Number(id)` + `Number.isInteger`, not `parseInt` (which accepts `"1abc"`).
- Keep CORS scoped to the web dev origin; never `*`.
- Return minimal data; no stack traces or internals in errors.

## Supabase / data
- RLS on every user-data table; default-deny. Never read user data with the service-role key from the API — use the user's JWT.
- Secrets in env / Supabase Vault, never in the repo. `.mcp.json` tokens are placeholders only.

## Secrets
- No real keys, mnemonics, or private keys in the repo. `.env*` is gitignored.
- Don't log secrets, JWTs, or full request bodies.

## Dependencies
- Don't add a dependency without a reason; prefer stdlib. New deps → check it's maintained and has no known advisories.
