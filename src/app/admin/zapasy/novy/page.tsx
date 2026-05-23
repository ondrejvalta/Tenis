import { fetchPlayers } from "@/lib/data";
import { MatchForm } from "../MatchForm";
import { createMatch } from "../actions";

export const metadata = { title: "Nový zápas – Administrace" };

export default async function NewMatchPage() {
  const players = await fetchPlayers();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nový zápas</h1>
      <MatchForm action={createMatch} players={players} submitLabel="Vytvořit" />
    </div>
  );
}
