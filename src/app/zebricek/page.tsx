import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeStandingsForGroup } from "@/data/standings";
import {
  GROUPS,
  type Group,
  type Match,
  type Player,
  type StandingRow,
} from "@/data/types";

export const metadata = { title: "Žebříček | Tenisová liga Dobříš" };

export default async function ZebricekPage() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Žebříček</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Každý bod může rozhodnout o konečném pořadí. Sledujte průběžné
          výsledky, aktuální pořadí hráčů i vývoj celé tabulky v průběhu ligy.
        </p>
      </div>

      {GROUPS.map((group) => (
        <GroupTable
          key={group}
          group={group}
          players={players}
          matches={matches}
          playersById={playersById}
        />
      ))}
    </div>
  );
}

function GroupTable({
  group,
  players,
  matches,
  playersById,
}: {
  group: Group;
  players: Player[];
  matches: Match[];
  playersById: Map<string, Player>;
}) {
  const standings = computeStandingsForGroup(group, players, matches);
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Skupina {group}</h2>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Hráč</th>
              <th className="px-4 py-3 font-medium text-right">Zápasy</th>
              <th className="px-4 py-3 font-medium text-right">Výhry</th>
              <th className="px-4 py-3 font-medium text-right">Prohry</th>
              <th className="px-4 py-3 font-medium text-right">Sety</th>
              <th className="px-4 py-3 font-medium text-right">Gemy</th>
              <th className="px-4 py-3 font-medium text-right">Body</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row: StandingRow, idx: number) => {
              const p = playersById.get(row.playerId);
              return (
                <tr key={row.playerId} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/hraci/${row.playerId}`} className="hover:underline">
                      {p?.name ?? row.playerId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">{row.played}</td>
                  <td className="px-4 py-3 text-right text-emerald-700">{row.wins}</td>
                  <td className="px-4 py-3 text-right text-rose-700">{row.losses}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">
                    {row.setsWon}:{row.setsLost}
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600">
                    {row.gamesWon}:{row.gamesLost}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
