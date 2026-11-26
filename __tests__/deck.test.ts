import { describe, expect, it } from "vitest";
import {
  countStatuses,
  createSession,
  mergeSession,
  normaliseWords,
  shuffle,
} from "../lib/deck";
import type { Word } from "../lib/types";

const words: Word[] = [
  { id: "hei", finnish: "hei", english: "hello" },
  { id: "vesi", finnish: "vesi", english: "water" },
  { id: "kissa", finnish: "kissa", english: "cat" },
];

describe("normaliseWords", () => {
  it("trims entries and ignores invalid rows", () => {
    const result = normaliseWords([
      { finnish: "  hei ", english: " hello " },
      { finnish: "", english: "empty" },
      { finnish: "kissa", english: 42 },
      null,
      "not a word",
    ]);

    expect(result).toEqual([{ id: "hei", finnish: "hei", english: "hello" }]);
  });

  it("deduplicates by Finnish word", () => {
    const result = normaliseWords([
      { finnish: "Kissa", english: "cat" },
      { finnish: "kissa", english: "cat (duplicate)" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].english).toBe("cat");
  });
});

describe("shuffle", () => {
  it("keeps every item exactly once", () => {
    const result = shuffle([1, 2, 3, 4, 5]);

    expect(result).toHaveLength(5);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("createSession", () => {
  it("queues the full deck", () => {
    const session = createSession(words);

    expect(session.order).toEqual([0, 1, 2]);
    expect(session.position).toBe(0);
    expect(session.mode).toBe("all");
  });

  it("queues only learning cards in review mode", () => {
    const session = createSession(
      words,
      { vesi: "learning", kissa: "known" },
      "learning",
    );

    expect(session.order).toEqual([1]);
  });
});

describe("mergeSession", () => {
  it("keeps progress and appends words added to words.json", () => {
    const stored = createSession(words.slice(0, 2), { hei: "known" });
    stored.position = 1;

    const merged = mergeSession(stored, words);

    expect(merged.order).toEqual([0, 1, 2]);
    expect(merged.position).toBe(1);
    expect(merged.statuses.hei).toBe("known");
  });

  it("drops stale indices and clamps the position", () => {
    const stored = {
      ...createSession(words),
      order: [0, 1, 99],
      position: 99,
    };

    const merged = mergeSession(stored, words);

    expect(merged.order).toEqual([0, 1, 2]);
    expect(merged.position).toBe(3);
  });

  it("only appends new learning cards to a review session", () => {
    const stored = createSession(
      words.slice(0, 1),
      { hei: "learning" },
      "learning",
    );

    const merged = mergeSession(stored, words);

    expect(merged.order).toEqual([0]);
  });
});

describe("countStatuses", () => {
  it("counts known, learning, and unseen words", () => {
    expect(
      countStatuses(words, { hei: "known", vesi: "learning" }),
    ).toEqual({ known: 1, learning: 1, unseen: 1 });
  });
});
