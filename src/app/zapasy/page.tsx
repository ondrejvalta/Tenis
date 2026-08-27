import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CategorySwitch } from "@/components/CategorySwitch";
import { parseCategory } from "@/lib/category";
import { formatScore } from "@/lib/format";
import {
  CATEGORY_LABELS,
  GROUPS,
  type Category,
  type Group,
  type Match,
  type Player,
} from "@/data/types";
import { Tabs } from "./Tabs";

export const metadata = { title: "Zápasy | Tenisová liga Dobříš" };

export default async function ZapasyPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const category = parseCategory((await searchParams).kategorie);
  const [matches, players] = await Promise.all([
    fetchMatches(category),
    fetchPlayers(category),
  ]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Zápasy – {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Aktuální výsledky a kompletní přehled zápasů napříč všemi skupinami ligy.
        </p>
      </div>

      <CategorySwitch basePath="/zapasy" active={category} />

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
            category={category}
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
  category,
  matches,
  playersById,
}: {
  group: Group;
  category: Category;
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
        <CollapsibleSection
          key={key}
          id={`zapasy-${category}-${group}-${key}`}
          defaultOpen={idx === 0}
          title={monthLabel(key)}
          titleClassName="capitalize"
          meta={`${monthMatches.length} ${matchCountLabel(monthMatches.length)}`}
        >
          <ul className="space-y-2 border-t border-neutral-100 p-3">
            {monthMatches.map((m) => {
              const p1 = playersById.get(m.player1Id);
              const p2 = playersById.get(m.player2Id);
              const p1Won = m.winnerId === m.player1Id;
              return (
                <li
                  key={m.id}
                  className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
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
                    <div className="flex shrink-0 items-center gap-2">
                      {m.forfeit && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                          kont.
                        </span>
                      )}
                      <span className="font-mono text-neutral-700">{formatScore(m)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CollapsibleSection>
      ))}
    </div>
  );
}

function matchCountLabel(n: number): string {
  if (n === 1) return "zápas";
  if (n >= 2 && n <= 4) return "zápasy";
  return "zápasů";
}
