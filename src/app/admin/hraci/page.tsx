import Link from "next/link";
import { fetchPlayers } from "@/lib/data";
import { CATEGORY_LABELS, GROUPS, type Player } from "@/data/types";
import { categoryHref, parseCategory } from "@/lib/category";
import { CategorySwitch } from "@/components/CategorySwitch";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { deletePlayer } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata = { title: "Správa hráčů – Administrace" };

type SearchParams = Promise<{ error?: string; kategorie?: string }>;

export default async function AdminPlayersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, kategorie } = await searchParams;
  const category = parseCategory(kategorie);
  const players = await fetchPlayers(category);
  const sorted = players
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "cs"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hráči – {CATEGORY_LABELS[category]}
        </h1>
        <Link
          href={categoryHref("/admin/hraci/novy", category)}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Přidat hráče
        </Link>
      </div>

      <CategorySwitch basePath="/admin/hraci" active={category} />

      {error === "has_matches" && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Hráče nelze smazat, dokud má v DB zápasy. Smaž nejprve jeho zápasy.
        </p>
      )}
      {error && error !== "has_matches" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {GROUPS.map((group, idx) => {
          const groupPlayers = sorted.filter((p) => p.group === group);
          if (groupPlayers.length === 0) return null;
          return (
            <PlayersTable
              key={group}
              group={group}
              players={groupPlayers}
              defaultOpen={idx === 0}
            />
          );
        })}
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-neutral-500">
          Zatím žádní hráči v této kategorii.
        </p>
      )}
    </div>
  );
}

function PlayersTable({
  group,
  players,
  defaultOpen,
}: {
  group: string;
  players: Player[];
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleSection
      id={`admin-hraci-skupina-${group}`}
      defaultOpen={defaultOpen}
      title={`Skupina ${group}`}
      meta={`${players.length} ${playerCountLabel(players.length)}`}
    >
      <div className="overflow-x-auto border-t border-neutral-100">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Hráč</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-neutral-500">{p.id}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hraci/${p.id}`}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                    >
                      Upravit
                    </Link>
                    <DeleteButton action={deletePlayer} id={p.id} confirm="Opravdu chceš smazat tohoto hráče?" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

function playerCountLabel(n: number): string {
  if (n === 1) return "hráč";
  if (n >= 2 && n <= 4) return "hráči";
  return "hráčů";
}
