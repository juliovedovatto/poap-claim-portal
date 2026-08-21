---
name: agent-browser
description: Drive a real browser via the Playwright MCP — navigate, click, fill, screenshot, and assert on DOM, console, and network. Use for UI verification, E2E checks, visual smoke tests, and debugging the React web app. Wraps the playwright MCP server configured in .mcp.json.
---

# agent-browser

> Wraps the **playwright** MCP server configured in `.mcp.json` (`@executeautomation/playwright-mcp-server`).

## When to use
- Verify a React component actually renders and responds (not just "it builds").
- Smoke-test the claim flow end-to-end against the running NestJS API.
- Capture a screenshot for evidence / regression.
- Catch console errors and failed network requests after a change.

## Workflow
1. Ensure the app is running (`bun --filter @poap-claim-portal/web dev`; API on :3000).
2. Navigate to the dev URL.
3. Act: open the "Connect wallet" affordance, fill any inputs, click "Claim POAP".
4. Assert: the claim receipt state appears; no console errors; the POST /claims returned 200.
5. Screenshot the result; save under `~/tmp/.pi` or the repo's `docs/screenshots/`.
6. Tear down the browser session.

## Rules
- One assertion path at a time; don't bundle unrelated flows.
- If a selector is fragile, prefer role/text locators over CSS paths.
- Never store credentials in scripts — read from env.
- Fail loudly on console errors during a happy path.
