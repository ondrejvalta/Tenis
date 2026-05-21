import Link from "next/link";
import { players } from "@/data/players";
import { computeStandings } from "@/data/standings";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Hráči | Tenisová liga Madison" };

export default function HraciPage() {
  const standings = computeStandings();
  const statsById = new Map(standings.map((s) => [s.playerId, s]));
  const sorted = players.slice().sort((a, b) => a.name.localeCompare(b.name, "cs"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hráči</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Seznam všech {players.length} hráčů ligy.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {sorted.map((p) => {
          const s = statsById.get(p.id);
          return (
            <li key={p.id}>
              <Link
                href={`/hraci/${p.id}`}
                className="block rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      V lize od {formatDate(p.joinedAt)}
                    </div>
                  </div>
                  {s && (
                    <div className="text-right text-sm">
                      <div className="font-semibold">{s.points} b.</div>
                      <div className="text-xs text-neutral-500">
                        {s.wins}V / {s.losses}P
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
