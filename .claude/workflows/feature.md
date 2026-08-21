# workflow: feature

Implement a new, scoped feature end-to-end.

## When
A change needs real code in one or two modules and has a clear spec.

## Steps
1. **scout** (Haiku) — recon the affected files; return compressed context (paths, blast radius). Skip if scope is already obvious.
2. **planner** (Opus) — only if scope is unclear or risky; else propose the plan yourself.
3. **coder** (Sonnet) — implement the smallest correct diff; re-verify the green gate.
4. **qa** (Sonnet) — validate behavior + boot-smoke if the change can affect runtime.
5. **reviewer** (Sonnet) — review the diff; escalate to Opus if risky or complex.
6. **coder** (Sonnet) — apply-pass on the reviewer's findings verbatim; re-verify the gate.

## Gate
`bun run lint` + `typecheck` + `typecheck:hooks` + `test` + `build`; boot-smoke the API if touched (see `testing.md` rule).

## Don't
- Don't skip the reviewer for non-trivial diffs.
- Don't let scout plan — it only reconnoiters.
