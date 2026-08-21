# workflow: orchestrate (dynamic / parallel)

Run independent work in parallel; chain dependent steps.

## When
Multiple independent tasks (research both sides, fix N unrelated files) or a multi-phase plan.

## Patterns
- **Parallel fan-out** — dispatch independent agents at once (two `researcher`s on different queries; multiple `coder`s in separate worktrees). Wait for all, then synthesize.
- **Chain** — sequential dependent steps (scout → coder → reviewer → coder-fix).
- **Worktree isolation** — give parallel `coder`s separate git worktrees so they don't clobber each other; one writer per worktree. See `.worktreeinclude` for files copied into each worktree.

## Token note
Parallel fan-out multiplies tokens — fan out only when tasks are truly independent. Use Haiku agents (scout) for parallel recon to keep the fan-out cheap.

## Don't
- Don't fan out for sequential work — it adds overhead + coordination cost.
- Don't run parallel writers in the same cwd without worktree isolation.
