# workflow: investigate

Debug a failure or investigate unclear behavior.

## Steps
1. **scout** (Haiku) — gather logs, stack trace, related files; return compressed context.
2. **researcher** (Sonnet) — only if the cause is external (API behavior, library docs).
3. **coder** (Sonnet) — fix the root cause, not the symptom; smallest diff.
4. **qa** (Sonnet) — confirm the failure is gone + no regression.

## Don't
- Don't patch the symptom. Root-cause first.
- Don't widen scope to a refactor while debugging.
