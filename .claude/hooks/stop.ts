#!/usr/bin/env bun
/**
 * Stop hook (Claude Code) — runs when Claude tries to end the turn.
 * Green gate: if deps are installed, run `bun run lint:root` and `bun run typecheck`;
 * exit 2 (with reason) to block finishing if they fail, so Claude keeps working.
 * If deps are not installed yet, approve silently (exit 0).
 * Claude Code force-ends the turn after 8 consecutive blocks.
 */
import { existsSync } from 'node:fs';

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

if (!existsSync(`${projectDir}/node_modules`)) {
  process.exit(0);
}

async function run(cmd: string[]): Promise<{ ok: boolean; out: string }> {
  const proc = Bun.spawn(cmd, { cwd: projectDir, stdout: 'pipe', stderr: 'pipe' });
  const out =
    (await new Response(proc.stdout).text()) + (await new Response(proc.stderr).text());
  await proc.exited;
  return { ok: proc.exitCode === 0, out };
}

const lint = await run(['bun', 'run', 'lint:root']);
if (!lint.ok) {
  console.error(`[stop] lint failed — fix before finishing:\n${lint.out}`);
  process.exit(2);
}

const tc = await run(['bun', 'run', 'typecheck']);
if (!tc.ok) {
  console.error(`[stop] typecheck failed — fix before finishing:\n${tc.out}`);
  process.exit(2);
}

process.exit(0);
