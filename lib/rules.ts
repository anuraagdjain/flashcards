import rawRules from "../rules.json";
import type { Rule } from "./types";

type RawRule = {
  id?: unknown;
  title?: unknown;
  body?: unknown;
};

/** Turns the raw contents of rules.json into clean rules. */
export function normaliseRules(entries: unknown): Rule[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  const seen = new Set<string>();
  const rules: Rule[] = [];

  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const { id, title, body } = entry as RawRule;
    if (typeof title !== "string" || typeof body !== "string") {
      continue;
    }

    const heading = title.trim();
    const text = body.trim();
    if (!heading || !text) {
      continue;
    }

    const ruleId =
      typeof id === "string" && id.trim()
        ? id.trim()
        : heading.toLocaleLowerCase("fi");

    if (seen.has(ruleId)) {
      continue;
    }

    seen.add(ruleId);
    rules.push({ id: ruleId, title: heading, body: text });
  }

  return rules;
}

export function loadRules(): Rule[] {
  return normaliseRules(rawRules);
}
