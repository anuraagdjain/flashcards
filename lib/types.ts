export type Word = {
  id: string;
  finnish: string;
  english: string;
};

export type WordStatus = "known" | "learning";

export type SessionMode = "all" | "learning";

export type Session = {
  order: number[];
  position: number;
  statuses: Record<string, WordStatus>;
  mode: SessionMode;
  reviewed: number;
  again: number;
};
