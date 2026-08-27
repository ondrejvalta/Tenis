import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CategorySwitch } from "@/components/CategorySwitch";
import { parseCategory } from "@/lib/category";
import { computeStandingsForGroup } from "@/data/standings";
import {
  CATEGORY_LABELS,
  GROUPS,
  type Category,
  type Group,
  type Match,
  type Player,
} from "@/data/types";

export const metadata = { title: "Hráči | Tenisová liga Dobříš" };

export default async function HraciPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const category = parseCategory((await searchParams).kategorie);
  const [players, matches] = await Promise.all([
    fetchPlayers(category),
    fetchMatches(category),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Hráči – {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Sledujte profily všech účastníků ligy, jejich úspěšnost, odehrané zápasy a statistiky sezóny.
        </p>
      </div>

      <CategorySwitch basePath="/hraci" active={category} />

      <div className="space-y-3">
        {GROUPS.map((group, idx) => (
          <GroupSection
            key={group}
            group={group}
            category={category}
            players={players}
            matches={matches}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}

function GroupSection({
  group,
  category,
  players,
  matches,
  defaultOpen,
}: {
  group: Group;
  category: Category;
  players: Player[];
  matches: Match[];
  defaultOpen?: boolean;
}) {
  const groupPlayers = players.filter((p) => p.group === group);
  const standings = computeStandingsForGroup(group, players, matches);
  const statsById = new Map(standings.map((s) => [s.playerId, s]));
  const sorted = groupPlayers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "cs"));

  return (
    <CollapsibleSection
      id={`hraci-${category}-skupina-${group}`}
      defaultOpen={defaultOpen}
      title={`Skupina ${group}`}
      meta={`${groupPlayers.length} ${groupPlayers.length === 1 ? "hráč" : groupPlayers.length >= 2 && groupPlayers.length <= 4 ? "hráči" : "hráčů"}`}
    >
      <ul className="grid gap-3 border-t border-neutral-100 p-3 sm:grid-cols-2">
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
    </CollapsibleSection>
  );
}
