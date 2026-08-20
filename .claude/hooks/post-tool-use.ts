#!/usr/bin/env bun
/**
 * PostToolUse hook (Claude Code) — runs AFTER Edit, Write.
 * Formats the edited file with Prettier. PostToolUse cannot block; stderr on exit 0
 * goes to the debug log only. Exit 2 surfaces stderr to Claude (reserved for real warnings).
 */
const input = JSON.parse(await Bun.stdin.text());
const tool: string = input.tool_name;
const ti: Record<string, unknown> = input.tool_input ?? {};

if (tool === 'Edit' || tool === 'Write') {
  const file = String(ti.file_path ?? '');
  if (file) {
    try {
      const proc = Bun.spawn(['bunx', 'prettier', '--write', file], {
        stdout: 'ignore',
        stderr: 'pipe',
      });
      await proc.exited;
    } catch {
      // prettier not installed yet — ignore silently.
    }
  }
}

process.exit(0);
