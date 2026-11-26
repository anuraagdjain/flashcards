import rawVerbTypes from "../verb-types.json";
import { normaliseRules } from "./rules";
import type { Rule } from "./types";

export function loadVerbTypes(): Rule[] {
  return normaliseRules(rawVerbTypes);
}
