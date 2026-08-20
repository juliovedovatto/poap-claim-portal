# Commit Convention

This repo uses Conventional Commits with single-line titles only (no body, no extended description).

## Format

`type[(scope)]: subject` — all lowercase type, imperative subject, ≤72 chars.

## Types

| Type | Use for |
| --- | --- |
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no behavior change |
| `test` | Adding/fixing tests |
| `chore` | Tooling, deps, maintenance |
| `perf` | Performance improvement |
| `build` | Build system changes |
| `ci` | CI configuration |

## Scope

Optional, matches workspace or module: `web`, `api`, `contracts`, `shared`, `claude`, `root`.

Example: `feat(web): add SIWE sign-in button`

## Rules

- Single line only; no body; no bullet points.
- No `Closes #` in the title (use PR body instead).

## Examples

- `feat(web): add SIWE sign-in button`
- `fix(api): validate claim receipt before upsert`
- `docs(claude): document hook behavior`
- `chore(root): add prettier config`
