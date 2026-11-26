import type { Metadata } from "next";
import { NotesPage } from "@/components/NotesPage";
import { loadVerbTypes } from "@/lib/verb-types";

export const metadata: Metadata = {
  title: "Verb types — Finnish Flashcards",
  description: "Finnish verb types",
};

export default function VerbTypesPage() {
  return (
    <NotesPage
      active="verb-types"
      label="Verb types"
      heading="Verb conjugations"
      itemLabel="verb type"
      indexLabel="Type"
      entries={loadVerbTypes()}
      sourceFile="verb-types.json"
    />
  );
}
