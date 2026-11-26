# Finnish Flashcards

Next.js 15 app (App Router, static export) for practising Finnish → English vocabulary.

## Stack

- TypeScript, React 19, Next.js 15 (static export), Tailwind CSS
- No backend — all state in localStorage
- Cloudflare Workers static assets via Wrangler (`wrangler.jsonc`)

## Key Files

| File | Purpose |
| --- | --- |
| `words.json` | The deck: `[{ "finnish": "...", "english": "..." }]` |
| `rules.json` | Grammar rules, maintained separately from the deck |
| `verb-types.json` | Verb type notes, separate from rules |
| `lib/deck.ts` | Deck loading, session creation, merge/shuffle/count helpers |
| `lib/rules.ts` | Rule loading and normalisation |
| `lib/verb-types.ts` | Verb type loading |
| `lib/storage.ts` | localStorage persistence for the session |
| `components/SiteHeader.tsx` | Shared header with Cards / Rules / Verb types nav |
| `components/NotesPage.tsx` | Shared layout for rules and verb types pages |
| `components/FlashcardApp.tsx` | Main UI: deck stats, controls, summary |
| `app/rules/page.tsx` | Separate rules page (`/rules`) |
| `app/verb-types/page.tsx` | Separate verb types page (`/verb-types`) |
| `components/Flashcard.tsx` | 3D flip card |
| `__tests__/deck.test.ts` | Tests for deck logic |

## Session Shape

```ts
order: number[]                  // word indices in this session
position: number                 // current index into order
statuses: Record<string, WordStatus> // keyed by lowercased Finnish word
mode: "all" | "learning"
reviewed: number
again: number
```

## Behaviour

- Progress is per Finnish word, so editing `words.json` keeps existing marks.
- New words are appended to a stored session by `mergeSession`.
- "Again" marks a card `learning`; "Got it" marks it `known`.
- Summary offers a review session containing only `learning` cards.
- Keyboard shortcuts: Space/Enter flip, ←/→ prev/skip, 1/A again, 2/K known.

## Commands

- `npm run dev` — next dev
- `npm test` — vitest
- `npm run build` — static export to `./out`
- `npm run deploy` — build + `wrangler deploy`
