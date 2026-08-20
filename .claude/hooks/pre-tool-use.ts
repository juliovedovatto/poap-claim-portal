#!/usr/bin/env bun
/**
 * PreToolUse hook (Claude Code) — runs BEFORE Bash, Edit, Write.
 * stdin JSON: { session_id, prompt_id, transcript_path, cwd, permission_mode,
 *               hook_event_name, tool_name, tool_input, tool_use_id }
 * Exit 0 = allow. Exit 2 = block (stderr is shown to Claude so it can self-correct).
 */
const BLOCKED_BASH = [
  /\bgit\s+push\b/,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+commit\s+--no-verify\b/,
  /\brm\s+-rf\s+\/(?:\s|$)/,
  /\bdd\s+.*of=\/dev\//,
];

// Protected directories: allow only the listed filenames; block everything else.
const PROTECTED_DIRS = [
  { prefix: 'packages/contracts/', allowFiles: ['README.md'] },
  { prefix: 'packages/shared/', allowFiles: ['README.md'] },
  { prefix: '.git/', allowFiles: [] },
];

const input = JSON.parse(await Bun.stdin.text());
const tool: string = input.tool_name;
const ti: Record<string, unknown> = input.tool_input ?? {};

function deny(msg: string): never {
  console.error(`[pre-tool-use] BLOCKED: ${msg}`);
  process.exit(2);
}

if (tool === 'Bash') {
  const cmd = String(ti.command ?? '');
  for (const p of BLOCKED_BASH) if (p.test(cmd)) deny(`destructive command not allowed: ${cmd}`);
} else if (tool === 'Write' || tool === 'Edit') {
  const fp = String(ti.file_path ?? '');
  for (const { prefix, allowFiles } of PROTECTED_DIRS) {
    if (fp.includes(prefix)) {
      const rel = fp.slice(fp.indexOf(prefix) + prefix.length);
      if (!allowFiles.includes(rel)) deny(`path is do-not-touch: ${fp}`);
    }
  }
  if (/(^|\/)bun\.lock$/.test(fp)) deny(`bun.lock is managed by bun install: ${fp}`);
  if (/\.env$/.test(fp) && !/\.env\.example$/.test(fp)) {
    deny(`editing a real .env is not allowed: ${fp}`);
  }
}

process.exit(0);
