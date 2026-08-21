# workflows

Dynamic agent orchestration playbooks + model routing for this repo. These are **reference docs** (loaded on demand), not auto-run scripts. Each playbook names the agents, the order, and the recommended model tier per step.

## Model routing (save tokens)

Pick the cheapest tier that can do the step; escalate only when the step needs it.

| Tier | Model (latest 4.x) | Cost | Use for |
|------|--------------------|------|---------|
| Haiku | `claude-3-5-haiku-latest` (→ Haiku 4.x when released) | $ | Read, recon, file scans, simple classify, scaffolding |
| Sonnet | `claude-sonnet-4-5` | $$ | Implementation, tests, research, standard review, QA |
| Opus | `claude-opus-4-1` | $$$$ | Hard planning, judgment, second opinions, risky refactors, deep review |

Default: Sonnet for write steps, Haiku for read steps, Opus sparingly for judgment.

## Per-agent default model (applied in `.claude/agents/*.md` frontmatter)

| Agent | Tier | Why |
|-------|------|-----|
| scout | Haiku | pure recon — fast + cheap |
| context-builder | Haiku | file reads / analysis |
| researcher | Sonnet | needs synthesis quality |
| planner | Opus | hard reasoning, tradeoffs |
| oracle | Opus | judgment / second opinion |
| coder | Sonnet | implementation workhorse |
| reviewer | Sonnet (→ Opus for complex) | most reviews are mechanical |
| qa | Sonnet | needs to interpret behavior |
| worker | Sonnet | runs validation |

## Playbooks
- `feature.md` — implement a new feature
- `review-fix.md` — review a change and apply findings
- `investigate.md` — debug / investigate
- `research.md` — external research
- `plan.md` — complex planning with a second opinion
- `orchestrate.md` — parallel / dynamic fan-out (worktrees)
