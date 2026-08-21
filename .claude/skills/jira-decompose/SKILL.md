---
name: jira-decompose
description: Read a Jira ticket via the Jira (Atlassian) MCP server, extract its summary, description, and acceptance criteria, then hand the ticket to the decompose skill to clarify scope, break it into subtasks, and dispatch the right agents to deliver it. Use when a Jira issue key or URL is the starting point for a feature or bug task. Requires the jira MCP server in .mcp.json (OAuth via Atlassian).
---

# jira-decompose

Turn a Jira ticket into shipped work: read it, then decompose it.

## Step 1 — Read the ticket
Given a Jira issue key (e.g. `PROJ-123`) or URL:
1. Use the **jira** MCP server (Atlassian Rovo MCP, `https://mcp.atlassian.com/v1/mcp/authv2`) to fetch the issue: summary, description, priority, status, labels/components, and any acceptance criteria (often in the description or a custom field).
2. Also pull linked issues and existing sub-tasks, but treat them as context — do not blindly inherit them as the plan.
3. If the MCP call fails (no auth, no site), STOP and tell the user to complete the OAuth login / configure the site. Do not invent ticket contents.

## Step 2 — Summarize into a task brief
Write a 3–6 line brief:
- One-line goal.
- Acceptance criteria (bullet list; if none are stated, derive the minimum and flag them as assumptions).
- In-scope layers (web / api / db) inferred from the ticket.
- Out-of-scope / assumptions to confirm.

## Step 3 — Hand to decompose
Invoke the **decompose** skill (`.claude/skills/decompose/SKILL.md`) with the brief:
- **decompose Step 1 (clarify)** — if the ticket is ambiguous, ask the user at most 3 questions; otherwise proceed.
- **decompose Step 2 (break down)** — subtasks with goal / files / agent / verification.
- **decompose Step 3 (dispatch)** — `planner`, `coder`, `researcher`, `reviewer`, `qa`, `worker`, `scout`, `oracle`.
- **decompose Step 4 (verify & synthesize)** — green gate + reviewer→coder apply-pass.

## Step 4 — Report
Report: ticket key + summary, the clarified brief, the subtask plan, which agent ran each, the green-gate result, and a comment-ready note to post back to the Jira ticket (paste it back via the MCP if the user wants).

## Rules
- Never assume ticket contents you did not read from Jira.
- Do not widen scope beyond the ticket; if a subtask needs work outside the ticket, ask the user.
- Keep credentials/OAuth out of the repo — the jira MCP handles auth at runtime.
- Follow the repo's architecture (`claim-portal` skill) and the layer best-practices skills (`react-best-practices` / `nestjs-best-practices` / `supabase-postgres-best-practices`).
