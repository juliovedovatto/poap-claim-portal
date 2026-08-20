# CLAUDE.md — apps/api

## Run
- `bun src/main.ts` — start the API (NestJS runs TS directly under bun).
- `bun run dev` — watch mode (`bun --watch src/main.ts`).

## NestJS on Bun
- CommonJS package (no `"type": "module"`). NestJS runs TS directly under bun — no @nestjs/cli, no webpack build.
- Fastify adapter (`@nestjs/platform-fastify`); `@fastify/cors` is bundled, so `app.enableCors(...)` needs no extra dep.
- `experimentalDecorators` + `emitDecoratorMetadata` enabled for NestJS DI.

## Env
- Read `process.env` directly — no `@nestjs/config`. Bun auto-loads `apps/api/.env`.
- Copy `.env.example` to `.env` for real Supabase keys; demo placeholders are safe defaults.

## Structure
- `supabase/` — `SupabaseModule` + `SupabaseService` (wired client; demo uses mock data).
- `claims/` — `ClaimsController`, `ClaimsService`, `ClaimsModule`, `dto/claim.dto.ts`.
- Tests: `*.spec.ts` co-located.

## Validation
- `class-validator` + `class-transformer` (explicit deps — optional peers of `@nestjs/common`).
- Global `ValidationPipe({ whitelist: true, transform: true })` in `main.ts`.

## CORS
- Allows `http://localhost:5173` (the web app dev origin).

## Tests
- `bun test` (bun:test). Plain `new` instantiation (e.g. `new ClaimsService(new SupabaseService())`) — no Nest TestingModule.

## Build
- `tsc --noEmit` gate. NestJS runs TS directly under bun — do NOT use `bun build`.

## Do-not-touch
- Real `.env` files.
- `bun.lock` (regenerate via `bun install`, never hand-edit).
