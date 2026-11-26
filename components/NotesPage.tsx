import { SiteHeader } from "@/components/SiteHeader";
import type { Rule } from "@/lib/types";

const labelClass =
  "text-[13px] font-bold uppercase tracking-[0.04em] leading-[24px] sm:text-right sm:pr-[28px] sm:pt-9 pt-6 pb-2 sm:pb-0 border-t border-black sm:border-t-0";
const contentClass =
  "border-l-0 sm:border-l border-dashed border-black pl-0 sm:pl-[28px] pt-0 sm:pt-9";

type NotesPageProps = {
  active: "rules" | "verb-types";
  label: string;
  heading: string;
  itemLabel: string;
  indexLabel: string;
  entries: Rule[];
  sourceFile: string;
};

export function NotesPage({
  active,
  label,
  heading,
  itemLabel,
  indexLabel,
  entries,
  sourceFile,
}: NotesPageProps) {
  const pluralLabel = `${itemLabel}s`;

  return (
    <div className="mx-auto max-w-[980px] px-5 py-8 sm:px-[32px] sm:py-12">
      <SiteHeader active={active} />

      <main>
        <section className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
          <div className={labelClass}>{label}</div>
          <div className={contentClass}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[15px] font-bold">{heading}</p>
              <p className="text-[13px] text-[#6b6b6b]">
                {entries.length} {entries.length === 1 ? itemLabel : pluralLabel}
              </p>
            </div>

            {entries.length === 0 ? (
              <p className="mt-4 text-sm text-[#6b6b6b]">
                No entries yet. Add them to {sourceFile}.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {entries.map((entry, index) => (
                  <li key={entry.id} className="border border-black p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-[13px] font-bold uppercase tracking-[0.04em]">
                        {entry.title}
                      </h2>
                      <span className="text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
                        {indexLabel} {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#6b6b6b]">{entry.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

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
        <span>
          {entries.length} {pluralLabel} · edit {sourceFile} to add more
        </span>
      </footer>
    </div>
  );
}
