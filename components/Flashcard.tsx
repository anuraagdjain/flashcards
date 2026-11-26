"use client";

import { cn } from "@/lib/utils";
import type { Word, WordStatus } from "@/lib/types";

type FlashcardProps = {
  word: Word;
  position: number;
  total: number;
  flipped: boolean;
  status?: WordStatus;
  onFlip: () => void;
};

export function Flashcard({
  word,
  position,
  total,
  flipped,
  status,
  onFlip,
}: FlashcardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={
        flipped
          ? `Hide translation for ${word.finnish}`
          : `Reveal translation for ${word.finnish}`
      }
      className="flip-card block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <div className={cn("flip-inner", flipped && "is-flipped")}>
        <div className="flip-face border border-black bg-white p-6 sm:p-8">
          <CardMeta
            left="Suomi"
            right={`${position + 1} / ${total}`}
            status={status}
          />
          <div className="flex flex-1 items-center justify-center py-6">
            <span className="break-words text-center text-[clamp(2.25rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
              {word.finnish}
            </span>
          </div>
          <p className="text-center text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
            Click card or press Space to reveal
          </p>
        </div>

        <div className="flip-face flip-face-back border border-black bg-black p-6 text-white sm:p-8">
          <CardMeta
            left="English"
            right={`${position + 1} / ${total}`}
            status={status}
            dark
          />
          <div className="flex flex-1 items-center justify-center py-6">
            <span className="break-words text-center text-[clamp(1.75rem,6vw,3.75rem)] font-bold leading-[1.1] tracking-tight">
              {word.english}
            </span>
          </div>
          <p className="text-center text-[11px] uppercase tracking-[0.08em] text-white/60">
            1 again · 2 got it
          </p>
        </div>
      </div>
    </button>
  );
}

function CardMeta({
  left,
  right,
  status,
  dark = false,
}: {
  left: string;
  right: string;
  status?: WordStatus;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.08em]",
        dark ? "text-white/60" : "text-[#6b6b6b]",
      )}
    >
      <span>{left}</span>
      <span className="flex items-center gap-2">
        {status ? (
          <span
            className={cn(
              "border px-1.5 py-0.5 text-[10px] leading-none",
              dark ? "border-white/40" : "border-black",
            )}
          >
            {status}
          </span>
        ) : null}
        <span>{right}</span>
      </span>
    </div>
  );
}
