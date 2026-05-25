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
          Každý bod může rozhodnout. Sledujte aktuální pořadí hráčů i vývoj celé tabulky v průběhu ligy.
        </p>
      </div>

      <div className="space-y-3">
        {GROUPS.map((group, idx) => (
          <GroupTable
            key={group}
            group={group}
            players={players}
            matches={matches}
            playersById={playersById}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

function GroupTable({
  group,
  players,
  matches,
  playersById,
  defaultOpen,
}: {
  group: Group;
  players: Player[];
  matches: Match[];
  playersById: Map<string, Player>;
  defaultOpen?: boolean;
}) {
  const standings = computeStandingsForGroup(group, players, matches);
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-neutral-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 text-neutral-400 transition-transform group-open:rotate-90"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4 2l4 4-4 4V2z" />
          </svg>
          <span className="font-semibold text-neutral-700">Skupina {group}</span>
        </span>
        <span className="text-xs text-neutral-500">
          {standings.length} {standings.length === 1 ? "hráč" : standings.length >= 2 && standings.length <= 4 ? "hráči" : "hráčů"}
        </span>
      </summary>
      <div className="overflow-x-auto border-t border-neutral-100">
        <table className="w-full min-w-[560px] text-sm">
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
    </details>
  );
}
