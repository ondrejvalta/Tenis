import Link from "next/link";
import { computeStandings } from "@/data/standings";
import { getPlayer } from "@/data/players";

export const metadata = { title: "Žebříček | Tenisová liga Madison" };

export default function ZebricekPage() {
  const standings = computeStandings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Žebříček</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Bodování: výhra = 3 body, prohra v rozhodující sadě = 1 bod, jinak 0.
          Při shodě bodů rozhoduje setové a poté gemové skóre.
        </p>
      </div>

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
    </div>
  );
}
