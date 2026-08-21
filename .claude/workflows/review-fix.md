# workflow: review-fix

Review an existing diff or change, then apply findings honestly.

## When
A change exists (uncommitted or a commit) and needs a review pass.

## Steps
1. **reviewer** (Sonnet; Opus if risky) — enumerate findings with file paths + severity (BLOCKER / MAJOR / MINOR / INFO). Do not fix.
2. **coder** (Sonnet) — apply-pass: carry the findings verbatim as immutable spec. Apply ALL of them; don't re-rank or skip. Do NOT commit.
3. Re-verify the full green gate — the apply gate.

## Rule (do not break)
The reviewer enumerates; the coder applies verbatim; the orchestrator dispatches + verifies — the orchestrator does NOT edit in the apply step. See `.claude/agents/coder.md`.
