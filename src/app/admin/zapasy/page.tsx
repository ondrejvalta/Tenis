import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { formatDate, formatScore } from "@/lib/format";
import {
  CATEGORY_LABELS,
  GROUPS,
  type Group,
  type Match,
  type Player,
} from "@/data/types";
import { categoryHref, parseCategory } from "@/lib/category";
import { CategorySwitch } from "@/components/CategorySwitch";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { deleteMatch } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata = { title: "Správa zápasů – Administrace" };

type SearchParams = Promise<{ error?: string; kategorie?: string }>;

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, kategorie } = await searchParams;
  const category = parseCategory(kategorie);
  const [matches, players] = await Promise.all([
    fetchMatches(category),
    fetchPlayers(category),
  ]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Zápasy – {CATEGORY_LABELS[category]}
        </h1>
        <div className="flex gap-2">
          {category === "dospeli" && (
            <Link
              href="/admin/zapasy/pavouk"
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              Zápasy pavouk
            </Link>
          )}
          <Link
            href={categoryHref("/admin/zapasy/novy", category)}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            + Přidat zápas
          </Link>
        </div>
      </div>

      <CategorySwitch basePath="/admin/zapasy" active={category} />

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {GROUPS.map((group, idx) => {
          const groupMatches = matches
            .filter((m) => m.group === group)
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date));
          if (groupMatches.length === 0) return null;
          return (
            <MatchesTable
              key={group}
              group={group}
              matches={groupMatches}
              playersById={playersById}
              defaultOpen={idx === 0}
            />
          );
        })}
      </div>

      {matches.length === 0 && (
        <p className="text-sm text-neutral-500">
          Zatím žádné zápasy v této kategorii.
        </p>
      )}
    </div>
  );
}

function MatchesTable({
  group,
  matches,
  playersById,
  defaultOpen,
}: {
  group: Group;
  matches: Match[];
  playersById: Map<string, Player>;
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleSection
      id={`admin-zapasy-skupina-${group}`}
      defaultOpen={defaultOpen}
      title={`Skupina ${group}`}
      meta={`${matches.length} ${matchCountLabel(matches.length)}`}
    >
      <div className="overflow-x-auto border-t border-neutral-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Datum</th>
              <th className="px-4 py-3 font-medium">Zápas</th>
              <th className="px-4 py-3 font-medium">Skóre</th>
              <th className="px-4 py-3 font-medium text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const p1 = playersById.get(m.player1Id);
              const p2 = playersById.get(m.player2Id);
              const p1Won = m.winnerId === m.player1Id;
              return (
                <tr key={m.id} className="border-t border-neutral-100">
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {formatDate(m.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={p1Won ? "font-semibold" : ""}>
                        {p1?.name}
                      </span>
                      <span className="text-neutral-400">vs.</span>
                      <span className={!p1Won ? "font-semibold" : ""}>
                        {p2?.name}
                      </span>
                      {m.forfeit && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                          kont.
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-neutral-600">
                    {formatScore(m)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/zapasy/${m.id}`}
                        className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                      >
                        Upravit
                      </Link>
                      <DeleteButton action={deleteMatch} id={m.id} confirm="Opravdu chceš smazat tento zápas?" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

function matchCountLabel(n: number): string {
  if (n === 1) return "zápas";
  if (n >= 2 && n <= 4) return "zápasy";
  return "zápasů";
}
