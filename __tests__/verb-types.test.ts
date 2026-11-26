import { describe, expect, it } from "vitest";
import { loadVerbTypes } from "../lib/verb-types";

describe("verb types", () => {
  it("loads verb types from verb-types.json", () => {
    const types = loadVerbTypes();

    expect(types.length).toBeGreaterThan(0);
    expect(types[0].title).toBe("Verb type 1");
  });
});
