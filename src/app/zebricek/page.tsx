import Link from "next/link";
import { fetchBracketMatches, fetchMatches, fetchPlayers } from "@/lib/data";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { CategorySwitch } from "@/components/CategorySwitch";
import { Bracket } from "@/components/Bracket";
import { parseCategory } from "@/lib/category";
import { computeStandingsForGroup } from "@/data/standings";
import {
  CATEGORY_LABELS,
  GROUPS,
  type Category,
  type Group,
  type Match,
  type Player,
  type StandingRow,
} from "@/data/types";

export const metadata = { title: "Žebříček | Tenisová liga Dobříš" };

export default async function ZebricekPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const category = parseCategory((await searchParams).kategorie);
  const [players, matches, bracketMatches] = await Promise.all([
    fetchPlayers(category),
    fetchMatches(category),
    category === "dospeli" ? fetchBracketMatches("dospeli") : Promise.resolve([]),
  ]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Žebříček – {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Každý bod může rozhodnout. Sledujte aktuální pořadí hráčů i vývoj celé tabulky v průběhu ligy.
        </p>
      </div>

      <CategorySwitch basePath="/zebricek" active={category} />

      <div className="space-y-3">
        {GROUPS.map((group, idx) => (
          <GroupTable
            key={group}
            group={group}
            category={category}
            players={players}
            matches={matches}
            playersById={playersById}
            defaultOpen={idx === 0}
          />
        ))}

        {category === "dospeli" && (
          <CollapsibleSection
            id="zebricek-dospeli-pavouk"
            title="Pavouk skupiny A-B"
          >
            <div className="border-t border-neutral-100">
              <Bracket matches={bracketMatches} playersById={playersById} />
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}

function GroupTable({
  group,
  category,
  players,
  matches,
  playersById,
  defaultOpen,
}: {
  group: Group;
  category: Category;
  players: Player[];
  matches: Match[];
  playersById: Map<string, Player>;
  defaultOpen?: boolean;
}) {
  const standings = computeStandingsForGroup(group, players, matches);
  return (
    <CollapsibleSection
      id={`zebricek-${category}-skupina-${group}`}
      defaultOpen={defaultOpen}
      title={`Skupina ${group}`}
      meta={`${standings.length} ${standings.length === 1 ? "hráč" : standings.length >= 2 && standings.length <= 4 ? "hráči" : "hráčů"}`}
    >
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
              <th className="px-4 py-3 font-medium text-right">Gamy</th>
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
    </CollapsibleSection>
  );
}
