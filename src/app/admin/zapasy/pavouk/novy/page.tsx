import { fetchPlayers } from "@/lib/data";
import { BracketMatchForm } from "../BracketMatchForm";
import { createBracketMatch } from "../actions";

export const metadata = { title: "Nový zápas pavouk – Administrace" };

export default async function NewBracketMatchPage() {
  const players = await fetchPlayers("dospeli");
  const abPlayers = players.filter((p) => p.group === "A" || p.group === "B");
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Nový zápas pavouk
      </h1>
      <BracketMatchForm
        action={createBracketMatch}
        players={abPlayers}
        submitLabel="Vytvořit"
      />
    </div>
  );
}
