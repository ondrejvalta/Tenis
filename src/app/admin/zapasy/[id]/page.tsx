import { notFound } from "next/navigation";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { MatchForm } from "../MatchForm";
import { updateMatch } from "../actions";

export const metadata = { title: "Upravit zápas – Administrace" };

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [matches, players] = await Promise.all([fetchMatches(), fetchPlayers()]);
  const match = matches.find((m) => m.id === id);
  if (!match) notFound();

  const action = updateMatch.bind(null, match.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Upravit zápas</h1>
      <MatchForm
        action={action}
        players={players}
        initial={{
          date: match.date,
          group: match.group,
          player1Id: match.player1Id,
          player2Id: match.player2Id,
          forfeit: !!match.forfeit,
          sets: match.sets,
        }}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
