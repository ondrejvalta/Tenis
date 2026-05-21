import Link from "next/link";
import { matches } from "@/data/matches";
import { getPlayer } from "@/data/players";
import { formatDate, formatScore } from "@/lib/format";

export const metadata = { title: "Zápasy | Tenisová liga Madison" };

export default function ZapasyPage() {
  const sorted = matches.slice().sort((a, b) => b.date.localeCompare(a.date));

  // Seskupení podle měsíce
  const groups = new Map<string, typeof sorted>();
  for (const m of sorted) {
    const key = m.date.slice(0, 7);
    const arr = groups.get(key) ?? [];
    arr.push(m);
    groups.set(key, arr);
  }

  const monthLabel = (key: string) => {
    const [y, mo] = key.split("-");
    const d = new Date(Number(y), Number(mo) - 1, 1);
    return d.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Zápasy</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Všech {matches.length} odehraných zápasů, řazeno od nejnovějších.
        </p>
      </div>

      {Array.from(groups.entries()).map(([key, group]) => (
        <section key={key}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {monthLabel(key)}
          </h2>
          <ul className="space-y-2">
            {group.map((m) => {
              const p1 = getPlayer(m.player1Id);
              const p2 = getPlayer(m.player2Id);
              const p1Won = m.winnerId === m.player1Id;
              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-neutral-500">{formatDate(m.date)}</span>
                    <Link
                      href={`/hraci/${m.player1Id}`}
                      className={`hover:underline ${p1Won ? "font-semibold" : ""}`}
                    >
                      {p1?.name}
                    </Link>
                    <span className="text-neutral-400">vs.</span>
                    <Link
                      href={`/hraci/${m.player2Id}`}
                      className={`hover:underline ${!p1Won ? "font-semibold" : ""}`}
                    >
                      {p2?.name}
                    </Link>
                  </div>
                  <span className="font-mono text-neutral-700">{formatScore(m)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
