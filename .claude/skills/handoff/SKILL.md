---
name: handoff
description: Hand a fresh AI-agent session exactly what it needs to continue a task — extracts decisions, current state, blockers, failed approaches, and files-to-read into a short transfer doc plus a paste-ready first message. Use when a session is hitting context limits or work is moving to a new session. Vendored reference to klittle32/handoff-skill.
---

# handoff

> Vendored reference of [klittle32/handoff-skill](https://github.com/klittle32/handoff-skill). Invoked via `/handoff <goal>`.

## What it does
You name the goal for the *next* session; the skill extracts only what that session needs — decisions, current state, blockers, the files to read, the approaches that already failed — into a short, disposable transfer document plus a paste-ready first message. It is goal-directed extraction, not a lossy summary. The handoff doc is a *map* to your work, not a copy of it.

## Produces
1. A handoff file at `/tmp/agent-handoffs/<date>-<slug>.md`.
2. A copy-paste block to start the next session.

## Handoff doc shape
```
---
title: "Handoff — <goal>"
created: <date>
goal: "<goal for next session>"
workspace: "<cwd>"
---
# Handoff — <goal>
**Next session goal:** <goal>
## Suggested first message
<paste-ready block>
## Decisions (do not re-litigate)
- ...
## Current state
| Area | Status |
| COMPLETED | ... |
| IN PROGRESS | ... |
| NEXT | ... |
| BLOCKERS | ... |
## Failed approaches (avoid repeating)
- ...
## Relevant files (read order)
1. ...
## Suggested skills
- ...
```

## Paste-ready first message
```
Continue from /tmp/agent-handoffs/<date>-<slug>.md.
Goal for this session: <goal>.
Read the handoff file in full first. Key artifacts: <files>.
```

## Continuing from a handoff
1. Start a new session.
2. Paste the Suggested first message.
3. Read the handoff file in full — it is the map.
4. Follow it to the referenced artifacts and pick up the work.

Cold-start handoffs (no prior decisions or artifacts) legitimately omit the optional sections.
