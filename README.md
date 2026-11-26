# Finnish Flashcards

A minimal Finnish → English flashcard app. Black-and-white monospace theme, keyboard-first, progress saved in localStorage.

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui conventions
- Vitest
- Cloudflare Workers static assets via Wrangler

## Run locally

```bash
nvm use
npm install
npm run dev
```

Open http://localhost:3000.

## Add words

Edit `words.json` in the project root:

```json
[
  { "finnish": "hei", "english": "hello" },
  { "finnish": "vesi", "english": "water" }
]
```

- Both fields are required.
- Duplicate Finnish words are ignored (the first one wins).
- In dev, saving the file reloads the deck. New words are appended to the existing session and progress is kept.
- For a deployed build, rebuild after editing (`npm run build`).

## Add rules

Grammar rules are kept separately from the deck in `rules.json`:

```json
[
  {
    "id": "verb-type-1",
    "title": "Verb type 1",
    "body": "It ends with two vowels. Drop the last letter, which is usually a or ä."
  }
]
```

They show up on the separate `/rules` page, reachable from the **Cards / Rules** nav in the header.

## Controls

| Key          | Action                    |
| ------------ | ------------------------- |
| Space / Enter | Flip the card            |
| ← / →        | Previous / skip           |
| 1 / A        | Mark again (learning)     |
| 2 / K        | Mark known                |
| Esc          | Close dialog              |

## Progress

Known/learning marks and the current session are saved in localStorage under
`finnish-flashcard:session:v1`. The **Reset** button clears them.

## Build & deploy

```bash
npm run build   # static export to ./out
npm run start   # build + wrangler dev (Cloudflare runtime)
npm run deploy  # build + wrangler deploy
```

The Wrangler config (`wrangler.jsonc`) serves `./out` as static assets.

## Tests

```bash
npm test
```
