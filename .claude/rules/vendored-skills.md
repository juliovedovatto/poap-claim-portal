# vendored-skills

These four skills are verbatim upstream copies — do not edit them:
- `.claude/skills/react-best-practices`
- `.claude/skills/nestjs-best-practices`
- `.claude/skills/supabase-postgres-best-practices`
- `.claude/skills/playwright-skill`

## Rule
- Do NOT edit `SKILL.md`, `rules/`, or `references/` in a vendored skill. Patching upstream advice locally means the file no longer matches its source and rots silently.
- When upstream advice mismatches this repo's stack, annotate it in the app's `CLAUDE.md` (`apps/web` or `apps/api`), not by patching the vendored file.
- The only permitted local edit is the `name:` frontmatter field (required by the Agent Skills spec's name↔dir rule). Leave all other frontmatter and body untouched.
- Custom skills (`claim-portal`, `decompose`, `handoff`, `ponytail`, etc.) are NOT vendored — edit freely.
