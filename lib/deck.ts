import rawWords from "../words.json";
import type { Session, SessionMode, Word, WordStatus } from "./types";

type RawWord = {
  finnish?: unknown;
  english?: unknown;
};

/**
 * Turns the raw contents of words.json into a clean deck.
 * Entries with missing fields and duplicate Finnish words are ignored.
 */
export function normaliseWords(entries: unknown): Word[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  const seen = new Set<string>();
  const words: Word[] = [];

  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const { finnish, english } = entry as RawWord;
    if (typeof finnish !== "string" || typeof english !== "string") {
      continue;
    }

    const fi = finnish.trim().normalize("NFC");
    const en = english.trim();
    if (!fi || !en) {
      continue;
    }

    const id = fi.toLocaleLowerCase("fi");
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    words.push({ id, finnish: fi, english: en });
  }

  return words;
}

export function loadWords(): Word[] {
  return normaliseWords(rawWords);
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function allIndices(words: readonly Word[]): number[] {
  return words.map((_, index) => index);
}

export function createSession(
  words: readonly Word[],
  statuses: Record<string, WordStatus> = {},
  mode: SessionMode = "all",
): Session {
  const order = allIndices(words).filter(
    (index) => mode === "all" || statuses[words[index].id] === "learning",
  );

  return {
    order,
    position: 0,
    statuses: { ...statuses },
    mode,
    reviewed: 0,
    again: 0,
  };
}

/**
 * Reconciles a stored session with the current deck so that words added to
 * words.json show up without wiping the learner's progress.
 */
export function mergeSession(session: Session, words: readonly Word[]): Session {
  const seen = new Set<number>();
  const order: number[] = [];

  for (const index of session.order) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= words.length ||
      seen.has(index)
    ) {
      continue;
    }

    seen.add(index);
    order.push(index);
  }

  for (const index of allIndices(words)) {
    if (seen.has(index)) {
      continue;
    }

    if (
      session.mode === "learning" &&
      session.statuses[words[index].id] !== "learning"
    ) {
      continue;
    }

    order.push(index);
  }

  return {
    ...session,
    order,
    position: Math.min(Math.max(0, session.position), order.length),
  };
}

export function countStatuses(
  words: readonly Word[],
  statuses: Record<string, WordStatus>,
): { known: number; learning: number; unseen: number } {
  let known = 0;
  let learning = 0;

  for (const word of words) {
    const status = statuses[word.id];
    if (status === "known") {
      known += 1;
    } else if (status === "learning") {
      learning += 1;
    }
  }

  return {
    known,
    learning,
    unseen: Math.max(0, words.length - known - learning),
  };
}
