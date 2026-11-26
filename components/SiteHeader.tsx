import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  active: "cards" | "rules" | "verb-types";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b-[3px] border-double border-black pb-4">
      <h1 className="text-[18px] font-bold uppercase tracking-[0.03em]">
        Finnish Flashcards
      </h1>
      <nav
        aria-label="Sections"
        className="flex items-center gap-3 text-[13px] uppercase tracking-[0.06em]"
      >
        <NavItem label="Cards" href="/" isActive={active === "cards"} />
        <span className="text-[#c4c4c4]" aria-hidden="true">
          /
        </span>
        <NavItem label="Rules" href="/rules" isActive={active === "rules"} />
        <span className="text-[#c4c4c4]" aria-hidden="true">
          /
        </span>
        <NavItem
          label="Verb types"
          href="/verb-types"
          isActive={active === "verb-types"}
        />
      </nav>
    </header>
  );
}

function NavItem({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive: boolean;
}) {
  const className = cn(
    "transition-colors",
    isActive
      ? "font-bold text-black underline underline-offset-4 decoration-2"
      : "text-[#6b6b6b] hover:text-black hover:underline hover:underline-offset-4",
  );

  return isActive ? (
    <span aria-current="page" className={className}>
      {label}
    </span>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
