import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeStandingsForGroup } from "@/data/standings";
import { formatDate, formatScore } from "@/lib/format";

export default async function HracDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);
  const player = players.find((p) => p.id === id);
  if (!player) notFound();

  const playersById = new Map(players.map((p) => [p.id, p]));
  const playerMatches = matches
    .filter((m) => m.player1Id === id || m.player2Id === id)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  const standings = computeStandingsForGroup(player.group, players, matches);
  const myRow = standings.find((r) => r.playerId === id);
  const rank = standings.findIndex((r) => r.playerId === id) + 1;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/hraci" className="text-sm text-neutral-500 hover:underline">
          ← Zpět na hráče
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{player.name}</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Skupina {player.group}
        </p>
      </div>

      {myRow && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={`Pořadí ve sk. ${player.group}`} value={`#${rank}`} />
          <Stat label="Body" value={String(myRow.points)} />
          <Stat label="Výhry / prohry" value={`${myRow.wins} / ${myRow.losses}`} />
          <Stat
            label="Sety / gemy"
            value={`${myRow.setsWon}:${myRow.setsLost} · ${myRow.gamesWon}:${myRow.gamesLost}`}
          />
        </div>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Zápasy</h2>
        {playerMatches.length === 0 ? (
          <p className="text-sm text-neutral-500">Žádné zápasy.</p>
        ) : (
          <ul className="space-y-2">
            {playerMatches.map((m) => {
              const isP1 = m.player1Id === id;
              const opponentId = isP1 ? m.player2Id : m.player1Id;
              const opponent = playersById.get(opponentId);
              const won = m.winnerId === id;
              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500">{formatDate(m.date)}</span>
                    <span
                      className={
                        won
                          ? "rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700"
                          : "rounded bg-rose-100 px-1.5 py-0.5 text-xs font-semibold text-rose-700"
                      }
                    >
                      {won ? "V" : "P"}
                    </span>
                    <span className="text-neutral-400">vs.</span>
                    <Link href={`/hraci/${opponentId}`} className="font-medium hover:underline">
                      {opponent?.name ?? opponentId}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.forfeit && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                        kont.
                      </span>
                    )}
                    <span className="font-mono text-neutral-700">{formatScore(m, isP1)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
