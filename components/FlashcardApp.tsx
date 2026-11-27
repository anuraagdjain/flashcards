"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  List,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Flashcard } from "@/components/Flashcard";
import { SiteHeader } from "@/components/SiteHeader";
import { WordsDialog } from "@/components/WordsDialog";
import {
  countStatuses,
  createSession,
  loadWords,
  mergeSession,
  shuffle,
} from "@/lib/deck";
import { clearSession, loadSession, saveSession } from "@/lib/storage";
import type { Session, SessionMode, Word, WordStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const labelClass =
  "text-[13px] font-bold uppercase tracking-[0.04em] leading-[24px] sm:text-right sm:pr-[28px] sm:pt-9 pt-6 pb-2 sm:pb-0 border-t border-black sm:border-t-0";
const contentClass =
  "border-l-0 sm:border-l border-dashed border-black pl-0 sm:pl-[28px] pt-0 sm:pt-9";

const buttonClass =
  "inline-flex items-center justify-center gap-2 border border-black px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

const navButtonClass =
  "inline-flex items-center justify-center gap-1.5 border border-black px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black";

const kbdClass =
  "border border-current px-1.5 py-0.5 text-[10px] leading-none";

// Module state survives client-side navigation but resets on a full page load.
let hasShuffledForThisPageLoad = false;

type StatusCounts = {
  known: number;
  learning: number;
  unseen: number;
};

export function FlashcardApp() {
  const words = useMemo(() => loadWords(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const stored = loadSession();
    const base = stored ? mergeSession(stored, words) : createSession(words);

    // Shuffle once per full page load. Navigating to another route and back
    // remounts this component, but the module stays loaded, so the stored
    // order and position are restored unchanged.
    if (hasShuffledForThisPageLoad) {
      setSession(base);
      return;
    }

    hasShuffledForThisPageLoad = true;
    setSession({ ...base, order: shuffle(base.order), position: 0 });
  }, [words]);

  useEffect(() => {
    if (session) {
      saveSession(session);
    }
  }, [session]);

  const statuses = useMemo(
    () => session?.statuses ?? {},
    [session?.statuses],
  );
  const counts = useMemo(
    () => countStatuses(words, statuses),
    [words, statuses],
  );

  const total = session?.order.length ?? 0;
  const currentWord =
    session && session.position < total
      ? words[session.order[session.position]]
      : null;
  const finished = session !== null && session.position >= total;

  const advance = useCallback(() => {
    setFlipped(false);
    setSession((prev) =>
      prev
        ? {
            ...prev,
            position: Math.min(prev.position + 1, prev.order.length),
          }
        : prev,
    );
  }, []);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setSession((prev) =>
      prev ? { ...prev, position: Math.max(0, prev.position - 1) } : prev,
    );
  }, []);

  const rate = useCallback(
    (status: WordStatus) => {
      const word = currentWord;
      if (!word) {
        return;
      }

      setFlipped(false);
      setSession((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          position: Math.min(prev.position + 1, prev.order.length),
          statuses: { ...prev.statuses, [word.id]: status },
          reviewed: prev.reviewed + 1,
          again: prev.again + (status === "learning" ? 1 : 0),
        };
      });
    },
    [currentWord],
  );

  const startSession = useCallback(
    (mode: SessionMode) => {
      setSession(createSession(words, session?.statuses ?? {}, mode));
      setFlipped(false);
    },
    [session?.statuses, words],
  );

  const shuffleRemaining = useCallback(() => {
    setFlipped(false);
    setSession((prev) => {
      if (!prev || prev.position >= prev.order.length) {
        return prev;
      }

      const head = prev.order.slice(0, prev.position);
      const [current, ...rest] = prev.order.slice(prev.position);

      return {
        ...prev,
        order: [...head, current, ...shuffle(rest)],
      };
    });
  }, []);

  const shuffleAll = useCallback(() => {
    const next = createSession(words, session?.statuses ?? {}, "all");
    setSession({ ...next, order: shuffle(next.order) });
    setFlipped(false);
  }, [session?.statuses, words]);

  const resetProgress = useCallback(() => {
    clearSession();
    setSession(createSession(words));
    setFlipped(false);
    setShowReset(false);
  }, [words]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (showWords || showReset) {
        if (event.key === "Escape") {
          setShowWords(false);
          setShowReset(false);
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const isInteractive = target?.closest(
        "button, a, input, textarea, select, [role='button']",
      );

      if (
        (event.code === "Space" || event.key === "Enter") &&
        isInteractive
      ) {
        // Let the focused control handle its own activation.
        return;
      }

      if (event.key === "Escape") {
        (document.activeElement as HTMLElement | null)?.blur();
        return;
      }

      if (!session) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }

      if (event.key === "ArrowRight" && currentWord) {
        event.preventDefault();
        advance();
        return;
      }

      if (!currentWord) {
        return;
      }

      if (event.code === "Space" || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
        return;
      }

      if (flipped && (event.key === "1" || event.key.toLowerCase() === "a")) {
        event.preventDefault();
        rate("learning");
        return;
      }

      if (flipped && (event.key === "2" || event.key.toLowerCase() === "k")) {
        event.preventDefault();
        rate("known");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    advance,
    currentWord,
    flipped,
    goPrev,
    rate,
    session,
    showReset,
    showWords,
  ]);

  return (
    <div className="mx-auto max-w-[980px] px-5 py-8 sm:px-[32px] sm:py-12">
      <SiteHeader active="cards" />

      {!session ? (
        <p className="text-sm text-[#6b6b6b]">Loading deck…</p>
      ) : (
        <main>
          <p className="sr-only" aria-live="polite">
            {finished
              ? "Session complete"
              : currentWord
                ? `${currentWord.finnish}${flipped ? `, ${currentWord.english}` : ""}`
                : ""}
          </p>

          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
              <div className={labelClass}>Deck</div>
              <div className={contentClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-bold">
                      {session.mode === "learning"
                        ? "Review session"
                        : "Full deck"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#6b6b6b]">
                      {finished
                        ? "Session complete"
                        : `${total - session.position} of ${total} left this session`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ToolButton
                      onClick={() => setShowWords(true)}
                      icon={<List size={13} />}
                    >
                      Words
                    </ToolButton>
                    <ToolButton
                      onClick={shuffleRemaining}
                      icon={<Shuffle size={13} />}
                      disabled={finished}
                    >
                      Shuffle
                    </ToolButton>
                    <ToolButton
                      onClick={() => setShowReset(true)}
                      icon={<RotateCcw size={13} />}
                    >
                      Reset
                    </ToolButton>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    known={counts.known}
                    learning={counts.learning}
                    total={words.length}
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
                  <span>
                    <span className="font-bold text-black">{counts.known}</span>{" "}
                    known
                  </span>
                  <span>
                    <span className="font-bold text-black">
                      {counts.learning}
                    </span>{" "}
                    learning
                  </span>
                  <span>
                    <span className="font-bold text-black">{counts.unseen}</span>{" "}
                    new
                  </span>
                  <span className="sm:ml-auto">{words.length} words total</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
              <div className={labelClass}>Card</div>
              <div className={contentClass}>
                {words.length === 0 ? (
                  <EmptyDeck />
                ) : finished ? (
                  <SessionSummary
                    session={session}
                    words={words}
                    counts={counts}
                    onReviewLearning={() => startSession("learning")}
                    onStudyAll={() => startSession("all")}
                    onShuffleAll={shuffleAll}
                  />
                ) : currentWord ? (
                  <>
                    <Flashcard
                      word={currentWord}
                      position={session.position}
                      total={total}
                      flipped={flipped}
                      status={session.statuses[currentWord.id]}
                      onFlip={() => setFlipped((value) => !value)}
                    />

                    <div className="mt-3">
                      {flipped ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => rate("learning")}
                            className={cn(buttonClass, "justify-between")}
                          >
                            <span className="inline-flex items-center gap-2">
                              <RotateCcw size={14} /> Again
                            </span>
                            <kbd className={kbdClass}>1</kbd>
                          </button>
                          <button
                            type="button"
                            onClick={() => rate("known")}
                            className={cn(
                              buttonClass,
                              "justify-between bg-black text-white hover:bg-white hover:text-black",
                            )}
                          >
                            <span className="inline-flex items-center gap-2">
                              <Check size={14} /> Got it
                            </span>
                            <kbd className={kbdClass}>2</kbd>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFlipped(true)}
                          className={cn(
                            buttonClass,
                            "w-full justify-between",
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Eye size={14} /> Show answer
                          </span>
                          <kbd className={kbdClass}>Space</kbd>
                        </button>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={session.position === 0}
                        className={navButtonClass}
                      >
                        <ArrowLeft size={13} /> Prev
                      </button>
                      <button
                        type="button"
                        onClick={shuffleRemaining}
                        title="Shuffle the remaining cards"
                        className={navButtonClass}
                      >
                        <Shuffle size={13} /> Shuffle
                      </button>
                      <button
                        type="button"
                        onClick={advance}
                        className={navButtonClass}
                      >
                        Skip <ArrowRight size={13} />
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
              <div className={labelClass}>Keys</div>
              <div className={contentClass}>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.06em] text-[#6b6b6b]">
                  <Shortcut keys="Space" label="flip" />
                  <Shortcut keys="← / →" label="prev / skip" />
                  <Shortcut keys="1" label="again" />
                  <Shortcut keys="2" label="got it" />
                  <Shortcut keys="Esc" label="close dialogs" />
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-2 border-t border-black pt-4 text-[13px] text-[#6b6b6b]">
        <span>
          Created by{" "}
          <a
            href="https://adja.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline underline-offset-2 transition-[text-decoration-thickness] hover:decoration-2"
          >
            Anuraag Jain
          </a>
        </span>
        <span>{words.length} words</span>
      </footer>

      {showWords ? (
        <WordsDialog
          words={words}
          statuses={statuses}
          onClose={() => setShowWords(false)}
        />
      ) : null}

      {showReset ? (
        <ConfirmDialog
          onConfirm={resetProgress}
          onCancel={() => setShowReset(false)}
        />
      ) : null}
    </div>
  );
}

function ProgressBar({
  known,
  learning,
  total,
}: {
  known: number;
  learning: number;
  total: number;
}) {
  const knownPercent = total > 0 ? (known / total) * 100 : 0;
  const learningPercent = total > 0 ? (learning / total) * 100 : 0;

  return (
    <div
      className="h-3 border border-black p-[2px]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={Math.max(total, 1)}
      aria-valuenow={known}
      aria-label={`${known} of ${total} words known`}
    >
      <div className="flex h-full w-full overflow-hidden">
        <div
          className="h-full bg-black transition-[width] duration-300"
          style={{ width: `${knownPercent}%` }}
        />
        <div
          className="h-full bg-[#b5b5b5] transition-[width] duration-300"
          style={{ width: `${learningPercent}%` }}
        />
      </div>
    </div>
  );
}

function ToolButton({
  onClick,
  icon,
  children,
  disabled = false,
}: {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={navButtonClass}
    >
      {icon}
      {children}
    </button>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <kbd className="border border-black px-1.5 py-0.5 text-[10px] leading-none text-black">
        {keys}
      </kbd>
      {label}
    </span>
  );
}

function SessionSummary({
  session,
  words,
  counts,
  onReviewLearning,
  onStudyAll,
  onShuffleAll,
}: {
  session: Session;
  words: Word[];
  counts: StatusCounts;
  onReviewLearning: () => void;
  onStudyAll: () => void;
  onShuffleAll: () => void;
}) {
  const learningWords = words.filter(
    (word) => session.statuses[word.id] === "learning",
  );
  const nothingQueued = session.order.length === 0;

  return (
    <div className="border border-black">
      <div className="border-b border-dashed border-black p-6 text-center sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
          {nothingQueued ? "Nothing queued" : "Session complete"}
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {nothingQueued
            ? "You're all caught up"
            : `${session.reviewed} ${
                session.reviewed === 1 ? "card" : "cards"
              } reviewed`}
        </h2>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          {nothingQueued
            ? "No cards are marked as learning."
            : `${session.again} marked again · ${counts.known} known · ${counts.learning} learning`}
        </p>
      </div>

      {learningWords.length > 0 ? (
        <div className="border-b border-dashed border-black p-6 sm:p-8">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em]">
            Needs another look
          </h3>
          <ul className="max-h-64 divide-y divide-dashed divide-black/30 overflow-y-auto">
            {learningWords.map((word) => (
              <li
                key={word.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2 text-sm"
              >
                <span className="font-bold">{word.finnish}</span>
                <span className="text-[#6b6b6b]">{word.english}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 p-6 sm:p-8">
        {learningWords.length > 0 ? (
          <button
            type="button"
            onClick={onReviewLearning}
            className={cn(
              buttonClass,
              "bg-black text-white hover:bg-white hover:text-black",
            )}
          >
            Review learning ({learningWords.length})
          </button>
        ) : null}
        <button type="button" onClick={onStudyAll} className={buttonClass}>
          Study all
        </button>
        <button type="button" onClick={onShuffleAll} className={buttonClass}>
          Shuffle &amp; start
        </button>
      </div>
    </div>
  );
}

function EmptyDeck() {
  return (
    <div className="border border-black p-8 text-center sm:p-12">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
        Empty deck
      </p>
      <h2 className="mt-2 text-2xl font-bold">No words yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[#6b6b6b]">
        Add Finnish → English pairs to{" "}
        <code className="border border-black bg-[#f4f4f4] px-1 py-0.5 text-[13px] text-black">
          words.json
        </code>{" "}
        in the project root, then refresh.
      </p>
    </div>
  );
}
