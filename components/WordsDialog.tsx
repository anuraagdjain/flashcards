"use client";

import { Modal } from "@/components/Modal";
import type { Word, WordStatus } from "@/lib/types";

type WordsDialogProps = {
  words: Word[];
  statuses: Record<string, WordStatus>;
  onClose: () => void;
};

export function WordsDialog({ words, statuses, onClose }: WordsDialogProps) {
  return (
    <Modal title={`All words (${words.length})`} onClose={onClose}>
      {words.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[#6b6b6b]">
          No words yet. Add some to words.json.
        </p>
      ) : (
        <ul className="divide-y divide-dashed divide-black/30">
          {words.map((word, index) => {
            const status = statuses[word.id];

            return (
              <li
                key={word.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-5 py-2.5 text-sm"
              >
                <span className="w-6 shrink-0 text-[11px] tabular-nums text-[#6b6b6b]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-bold">{word.finnish}</span>
                <span className="ml-auto text-right text-[#6b6b6b]">
                  {word.english}
                </span>
                <span
                  className={`w-16 shrink-0 text-right text-[10px] uppercase tracking-[0.06em] ${
                    status ? "font-bold text-black" : "text-[#6b6b6b]"
                  }`}
                >
                  {status ?? "new"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
