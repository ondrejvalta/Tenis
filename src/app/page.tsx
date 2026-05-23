import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeStandingsForGroup } from "@/data/standings";
import { formatDate, formatScore } from "@/lib/format";
import { GROUPS, type Group, type Match, type Player } from "@/data/types";

export default async function Home() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);
  const playersById = new Map(players.map((p) => [p.id, p]));
  const recentMatches = matches
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-neutral-200 bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Tenisová liga Dobříš</h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Amatérská tenisová liga pro hráče všech úrovní. Čtyři skupiny,
          napínavé zápasy a aktuální žebříčky na jednom místě. Sledujte
          výsledky, statistiky i profily hráčů a mějte přehled o dění v celé
          lize.
        </p>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Aktuálně hraje {players.length} hráčů a bylo odehráno{" "}
          {matches.length} zápasů.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/zebricek"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Zobrazit žebříček
          </Link>
          <Link
            href="/zapasy"
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Výsledky zápasů
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Vedoucí ve skupinách</h2>
          <Link href="/zebricek" className="text-sm text-lime-700 hover:underline">
            Celý žebříček →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <GroupTopCard
              key={group}
              group={group}
              players={players}
              matches={matches}
              playersById={playersById}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Poslední výsledky</h2>
          <Link href="/zapasy" className="text-sm text-lime-700 hover:underline">
            Všechny zápasy →
          </Link>
        </div>
        <ul className="space-y-2">
          {recentMatches.map((m) => {
            const p1 = playersById.get(m.player1Id);
            const p2 = playersById.get(m.player2Id);
            const p1Won = m.winnerId === m.player1Id;
            return (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{formatDate(m.date)}</span>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700">
                    Sk. {m.group}
                  </span>
                  <span className={p1Won ? "font-semibold" : ""}>{p1?.name}</span>
                  <span className="text-neutral-400">vs.</span>
                  <span className={!p1Won ? "font-semibold" : ""}>{p2?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {m.forfeit && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                      kont.
                    </span>
                  )}
                  <span className="font-mono text-neutral-700">{formatScore(m)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function GroupTopCard({
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
  const top = computeStandingsForGroup(group, players, matches).slice(0, 3);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2 text-sm font-semibold">
        Skupina {group}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {top.map((row, idx) => {
            const p = playersById.get(row.playerId);
            return (
              <tr key={row.playerId} className="border-t border-neutral-100 first:border-t-0">
                <td className="px-3 py-2 text-neutral-500">{idx + 1}</td>
                <td className="px-3 py-2 font-medium">
                  <Link href={`/hraci/${row.playerId}`} className="hover:underline">
                    {p?.name ?? row.playerId}
                  </Link>
                </td>
                <td className="px-3 py-2 text-right font-semibold">{row.points} b.</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
