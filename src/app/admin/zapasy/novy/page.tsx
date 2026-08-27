import { fetchPlayers } from "@/lib/data";
import { MatchForm } from "../MatchForm";
import { createMatch } from "../actions";
import { parseCategory } from "@/lib/category";
import { CATEGORY_LABELS } from "@/data/types";

export const metadata = { title: "Nový zápas – Administrace" };

export default async function NewMatchPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const category = parseCategory((await searchParams).kategorie);
  const players = await fetchPlayers(category);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Nový zápas – {CATEGORY_LABELS[category]}
      </h1>
      <MatchForm
        action={createMatch}
        category={category}
        players={players}
        submitLabel="Vytvořit"
      />
    </div>
  );
}
