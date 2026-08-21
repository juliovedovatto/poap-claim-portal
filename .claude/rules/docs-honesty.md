# docs-honesty

Writing rule for README, CLAUDE.md, and SKILL.md — the honesty bar that four shipped defects of this class made necessary.

## Rule
- Never describe unimplemented behavior in the present tense. "The app does X" requires X to exist in `src/`.
- Aspirational / out-of-scope architecture (SIWE auth, gasless ERC-4337 mint, on-chain Merkle allowlist, dashboard) goes under an explicit **"Documented target architecture (out of scope)"** heading — never interleaved with implemented features.
- Before claiming a capability (a skill, a hook, a tool) in docs, confirm it is committed and present. "Used during the build but not committed" must be labeled as such.
- Describe what `git log` actually shows; don't claim a "documented commit history" or PRs that don't exist.

## Why
The repo already shipped and corrected four defects of this class (README SIWE/gasless claim, README "documented commit history" with an empty git log, README listing uncommitted skills, claim-portal SKILL.md Architecture asserting SIWE+dashboard). This rule is the durable fix.
