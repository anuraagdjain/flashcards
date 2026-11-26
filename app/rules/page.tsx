import type { Metadata } from "next";
import { NotesPage } from "@/components/NotesPage";
import { loadRules } from "@/lib/rules";

export const metadata: Metadata = {
  title: "Rules — Finnish Flashcards",
  description: "Finnish grammar rules",
};

export default function RulesPage() {
  return (
    <NotesPage
      active="rules"
      label="Rules"
      heading="Grammar notes"
      itemLabel="rule"
      indexLabel="Rule"
      entries={loadRules()}
      sourceFile="rules.json"
    />
  );
}
