import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { formatDate, formatScore } from "@/lib/format";
import { GROUPS, type Group, type Match, type Player } from "@/data/types";
import { Tabs } from "./Tabs";

export const metadata = { title: "Zápasy | Tenisová liga Dobříš" };

export default async function ZapasyPage() {
  const [matches, players] = await Promise.all([fetchMatches(), fetchPlayers()]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Zápasy</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Všech {matches.length} odehraných zápasů, rozdělených do tří skupin.
        </p>
      </div>

      <Tabs
        tabs={GROUPS.map((g) => ({
          id: g,
          label: `Skupina ${g} (${matches.filter((m) => m.group === g).length})`,
        }))}
      >
        {GROUPS.map((g) => (
          <GroupMatches
            key={g}
            group={g}
            matches={matches}
            playersById={playersById}
          />
        ))}
      </Tabs>
    </div>
  );
}

function GroupMatches({
  group,
  matches,
  playersById,
}: {
  group: Group;
  matches: Match[];
  playersById: Map<string, Player>;
}) {
  const sorted = matches
    .filter((m) => m.group === group)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const months = new Map<string, Match[]>();
  for (const m of sorted) {
    const key = m.date.slice(0, 7);
    const arr = months.get(key) ?? [];
    arr.push(m);
    months.set(key, arr);
  }

  const monthLabel = (key: string) => {
    const [y, mo] = key.split("-");
    const d = new Date(Number(y), Number(mo) - 1, 1);
    return d.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
  };

  const entries = Array.from(months.entries());

  return (
    <div className="space-y-3">
      {entries.map(([key, monthMatches], idx) => (
        <details
          key={key}
          open={idx === 0}
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
              <span className="font-semibold capitalize text-neutral-700">
                {monthLabel(key)}
              </span>
            </span>
            <span className="text-xs text-neutral-500">
              {monthMatches.length} {matchCountLabel(monthMatches.length)}
            </span>
          </summary>
          <ul className="space-y-2 border-t border-neutral-100 p-3">
            {monthMatches.map((m) => {
              const p1 = playersById.get(m.player1Id);
              const p2 = playersById.get(m.player2Id);
              const p1Won = m.winnerId === m.player1Id;
              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm"
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
        </details>
      ))}
    </div>
  );
}

function matchCountLabel(n: number): string {
  if (n === 1) return "zápas";
  if (n >= 2 && n <= 4) return "zápasy";
  return "zápasů";
}
