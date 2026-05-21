import Link from "next/link";
import { computeStandings } from "@/data/standings";
import { matches } from "@/data/matches";
import { getPlayer, players } from "@/data/players";
import { formatDate, formatScore } from "@/lib/format";

export default function Home() {
  const standings = computeStandings().slice(0, 5);
  const recentMatches = matches
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-neutral-200 bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Tenisová liga Madison</h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Amatérská tenisová liga – sledujte žebříček, výsledky zápasů a profily hráčů.
          Aktuálně {players.length} hráčů, {matches.length} odehraných zápasů.
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
          <h2 className="text-xl font-semibold">Top 5 žebříčku</h2>
          <Link href="/zebricek" className="text-sm text-lime-700 hover:underline">
            Celý žebříček →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Hráč</th>
                <th className="px-4 py-3 font-medium text-right">Z</th>
                <th className="px-4 py-3 font-medium text-right">V</th>
                <th className="px-4 py-3 font-medium text-right">P</th>
                <th className="px-4 py-3 font-medium text-right">Body</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, idx) => {
                const p = getPlayer(row.playerId);
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
                    <td className="px-4 py-3 text-right font-semibold">{row.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            const p1 = getPlayer(m.player1Id);
            const p2 = getPlayer(m.player2Id);
            const p1Won = m.winnerId === m.player1Id;
            return (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{formatDate(m.date)}</span>
                  <span className={p1Won ? "font-semibold" : ""}>{p1?.name}</span>
                  <span className="text-neutral-400">vs.</span>
                  <span className={!p1Won ? "font-semibold" : ""}>{p2?.name}</span>
                </div>
                <span className="font-mono text-neutral-700">{formatScore(m)}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
