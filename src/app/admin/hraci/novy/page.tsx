import { PlayerForm } from "../PlayerForm";
import { createPlayer } from "../actions";
import { parseCategory } from "@/lib/category";
import { CATEGORY_LABELS } from "@/data/types";

export const metadata = { title: "Nový hráč – Administrace" };

export default async function NewPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const category = parseCategory((await searchParams).kategorie);
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Nový hráč – {CATEGORY_LABELS[category]}
      </h1>
      <PlayerForm action={createPlayer} category={category} submitLabel="Vytvořit" />
    </div>
  );
}
