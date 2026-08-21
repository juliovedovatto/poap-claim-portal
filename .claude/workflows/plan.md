# workflow: plan

Plan complex, multi-step, or risky work before touching code.

## Steps
1. **context-builder** (Haiku) — analyze requirements + codebase; produce a meta-prompt + constraints.
2. **planner** (Opus) — break into ordered steps; flag risks + tradeoffs; propose a reviewable plan.
3. **oracle** (Opus) — second opinion on the plan, only if it's high-risk or judgment-heavy.

## Don't
- Don't call planner for simple plans — propose the approach yourself and ask the user.
- Don't call oracle as a default post-coder reviewer (it's for plan / decision second opinions).
