import type { Session, WordStatus } from "./types";

const STORAGE_KEY = "finnish-flashcard:session:v1";

function parseStatuses(value: unknown): Record<string, WordStatus> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const statuses: Record<string, WordStatus> = {};

  for (const [key, status] of Object.entries(value)) {
    if (status === "known" || status === "learning") {
      statuses[key] = status;
    }
  }

  return statuses;
}

function parseCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<Session> | null;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.order) ||
      typeof parsed.position !== "number"
    ) {
      return null;
    }

    return {
      order: parsed.order.filter(
        (value): value is number =>
          typeof value === "number" && Number.isInteger(value),
      ),
      position: parseCount(parsed.position),
      statuses: parseStatuses(parsed.statuses),
      mode: parsed.mode === "learning" ? "learning" : "all",
      reviewed: parseCount(parsed.reviewed),
      again: parseCount(parsed.again),
    };
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Progress is best-effort when storage is unavailable or full.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
