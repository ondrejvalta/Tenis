import { notFound } from "next/navigation";
import { fetchPlayers } from "@/lib/data";
import { PlayerForm } from "../PlayerForm";
import { updatePlayer } from "../actions";

export const metadata = { title: "Upravit hráče – Administrace" };

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const players = await fetchPlayers();
  const player = players.find((p) => p.id === id);
  if (!player) notFound();

  const action = updatePlayer.bind(null, player.id);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Upravit: {player.name}
      </h1>
      <PlayerForm
        action={action}
        initial={{
          name: player.name,
          group: player.group,
          joinedAt: player.joinedAt,
        }}
        submitLabel="Uložit změny"
      />
    </div>
  );
}
