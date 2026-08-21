---
name: decompose
description: Break a non-trivial task into clear subtasks, dispatch the right subagent per subtask, and ask clarifying questions when requirements are ambiguous. Use when given a feature or multi-step task — it clarifies scope first, then decomposes and orchestrates agents (planner, coder, researcher, reviewer, qa, worker, scout, oracle) to deliver it. Stops to ask the user before acting on unclear requirements.
---

# decompose

Take a task. Clarify it. Break it down. Dispatch agents. Deliver it.

## Step 1 — Clarify (do NOT skip)
Before any work, decide if the task is clear enough to act:
- If **clear**: proceed to Step 2.
- If **ambiguous** (missing scope, unknown acceptance criteria, undefined edge cases, unclear "done"): STOP and ask the user **at most 3 focused questions** in one batch — not a drip of questions. Examples: "What's the acceptance criterion?", "Which layers are in scope (web/api/db)?", "Is there a real Supabase project or in-memory only?"

Do not guess on irreversible or cross-cutting decisions. Do not invent requirements.

## Step 2 — Break down
Split the task into ordered, independently-verifiable subtasks. Each subtask must have:
- A one-line goal.
- The files/layers it touches.
- The agent best suited to do it.
- A verification step (how we know it's done).

Use the **claim-portal** skill to stay inside the repo's architecture. Use **ponytail** to keep each subtask's diff minimal.

## Step 3 — Dispatch
Map subtasks to agents (defined in `.claude/agents/`):
| Need | Agent |
|------|-------|
| Plan sequencing, risk, tradeoffs | `planner` |
| Code authoring (logic, bug fix, feature) | `coder` |
| External research (APIs, libs, docs) | `researcher` |
| Review diff / architecture / risk | `reviewer` |
| Validate behavior, UI, screenshots, tests | `qa` |
| Non-coding wiring, config, doc edits | `worker` |
| Fast codebase recon | `scout` |
| Second opinion on a judgment call | `oracle` |

Run independent subtasks in parallel; run dependent ones as a chain. Wait for each phase before the next.

## Step 4 — Verify & synthesize
- After implementation, run the green gate (`bun run lint && bun run typecheck && bun run test`).
- Dispatch `reviewer` then a `coder` apply-pass for any findings.
- Report: what each subtask did, which agent ran it, green-gate result, and any open questions.

## Rules
- Never widen scope beyond the clarified task.
- If a subtask hits a new ambiguity, ask the user — do not silently expand scope.
- Keep the user informed of progress; don't disappear into a long chain without a status.
