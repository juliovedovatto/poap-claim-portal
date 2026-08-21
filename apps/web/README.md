# POAP Claim Portal — web

The React UI for the claim portal. Built with Vite, Tailwind v4, and wagmi.

## What works now

- Connect an injected wallet (wagmi `injected`).
- Browse claimable events from the API.
- Claim a POAP. The claim writes an idempotent receipt to the API. It does not mint an on-chain token.

## Features

The current build ships the claim flow. The features below are next.

- **Organizer dashboard** — event creators see how many attendees claimed a POAP.
- **Raffle** — a transparent giveaway among the holders of a given POAP.
- **Vote** — multiple-choice polls for the holders of a given POAP.
- **Attendance portfolio** — a wallet's claimed POAPs form an on-chain record of the events it attended.

## Roadmap

- **POAP chat** — a token-gated room for the holders of a given POAP.
- **Community activity** — POAPs surface the most active members of a community.
- **Token-gated social** — holders with shared POAPs connect and talk.
- **More claim methods** — in person, secret word, ETH address, magic link.
- **Cross-industry events** — tech, finance, concerts, sports.

## Run

From the repo root:

```bash
bun run dev
```

This starts the API on port 3000 and this app on port 5173. Open http://localhost:5173.

The app fetches events from `http://localhost:3000/events`. The API must run for events to load.
