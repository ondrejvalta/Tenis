import { notFound } from "next/navigation";
import { fetchBracketMatches, fetchPlayers } from "@/lib/data";
import { BracketMatchForm } from "../BracketMatchForm";
import { updateBracketMatch } from "../actions";

export const metadata = { title: "Upravit zápas pavouk – Administrace" };

export default async function EditBracketMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bracketMatches = await fetchBracketMatches("dospeli");
  const match = bracketMatches.find((m) => m.id === id);
  if (!match) notFound();

  const players = await fetchPlayers("dospeli");
  const abPlayers = players.filter((p) => p.group === "A" || p.group === "B");
  const action = updateBracketMatch.bind(null, match.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Upravit zápas pavouk
      </h1>
      <BracketMatchForm
        action={action}
        players={abPlayers}
        initial={{
          round: match.round,
          position: match.position,
          player1Id: match.player1Id,
          player2Id: match.player2Id,
          date: match.date,
          sets: match.sets,
        }}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
