# testing

Additive to `CLAUDE.md:Commands` and `apps/api:Tests` — only the rules not already stated there.

## What to test (priority order)
- Pure logic first: formatters, parsers, reducers, DTO validation, service methods (inputs + edges).
- API: one test per endpoint — happy path + one rejection (bad/missing input, not-found).
- Web: unit-test pure helpers (`src/lib/*.spec.ts`); don't unit-test JSX rendering for this demo.

## Determinism
- Pin locale/timezone in date tests (`en-US` + `UTC`); no `Date.now()` without freezing. (A real past bug here was a locale/timezone-dependent date test.)

## Anti-over-mocking
- Don't mock so much that the test passes regardless of behavior. Prefer plain instantiation (`new ClaimsService(new SupabaseService())`) over the Nest TestingModule unless DI wiring is under test.

Green-gate commands and the Stop-hook enforcement live in `CLAUDE.md` and `.claude/hooks/stop.ts` — not duplicated here.
