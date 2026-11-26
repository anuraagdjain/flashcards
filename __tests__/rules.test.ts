import { describe, expect, it } from "vitest";
import { loadRules, normaliseRules } from "../lib/rules";

describe("rules", () => {
  it("loads rules from rules.json", () => {
    expect(Array.isArray(loadRules())).toBe(true);
  });

  it("ignores invalid and duplicate rules", () => {
    const rules = normaliseRules([
      { title: "Rule", body: "Body" },
      { title: "Rule", body: "Duplicate" },
      { title: "", body: "No title" },
      null,
    ]);

    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe("rule");
  });
});
