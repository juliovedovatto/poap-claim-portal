# POAP Claim Portal — api

The NestJS API for the claim portal. Runs on Bun.

## Endpoints

- `GET /events` — list claimable events. Returns an array of events.
- `GET /events/:id` — one event by id. Returns 404 for a bad id like `1abc`.
- `POST /claims` — record a claim. Body: `{ "eventId": number, "attendee": string }`. Returns a receipt `{ eventId, attendee, claimedAt, txHash }`. Idempotent: the same attendee and event return the same receipt. Returns 400 if the body fails validation.

## Behavior

- Input validation runs through `class-validator` (`whitelist`, `transform`). Bad input returns 400.
- CORS allows the web origin `http://localhost:5173`.
- Claims live in memory. They reset when the API restarts. The `SupabaseService` is a stub, not a real database.

## Features

The current build ships the claim endpoints. The features below are next.

- **Organizer dashboard** — report claim counts per event.
- **Raffle** — pick a winner among the holders of a given POAP.
- **Vote** — tally multiple-choice votes from POAP holders.
- **Attendance portfolio** — return the set of POAPs a wallet holds.

## Roadmap

- **POAP chat** — message storage for token-gated rooms.
- **Community activity** — rank members by claim count.
- **Token-gated social** — match holders by shared POAPs.
- **More claim methods** — secret word, ETH address, magic link.
- **Cross-industry events** — event types beyond tech.
- **Supabase persistence** — store claims and events in Postgres with RLS.

## Run

From the repo root:

```bash
bun run dev
```

This starts the API on port 3000 and the web app on port 5173. The API must run for the web app to load events.
