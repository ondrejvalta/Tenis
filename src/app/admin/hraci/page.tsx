import Link from "next/link";
import { fetchPlayers } from "@/lib/data";
import { CATEGORY_LABELS, GROUPS } from "@/data/types";
import { categoryHref, parseCategory } from "@/lib/category";
import { CategorySwitch } from "@/components/CategorySwitch";
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

      {GROUPS.map((group) => {
        const groupPlayers = sorted.filter((p) => p.group === group);
        if (groupPlayers.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Skupina {group} · {groupPlayers.length}
            </h2>
            <ul className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              {groupPlayers.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5 text-sm last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500">{p.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/hraci/${p.id}`}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                    >
                      Upravit
                    </Link>
                    <DeleteButton action={deletePlayer} id={p.id} confirm="Opravdu chceš smazat tohoto hráče?" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {sorted.length === 0 && (
        <p className="text-sm text-neutral-500">
          Zatím žádní hráči v této kategorii.
        </p>
      )}
    </div>
  );
}
