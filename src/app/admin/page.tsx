import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { categoryHref } from "@/lib/category";
import { CATEGORIES, CATEGORY_LABELS } from "@/data/types";

export const metadata = { title: "Administrace – Tenisová liga Dobříš" };

export default async function AdminPage() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administrace</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Správa hráčů a zápasů ligy podle kategorie.
        </p>
      </div>

      {CATEGORIES.map((category) => {
        const playerCount = players.filter(
          (p) => p.category === category,
        ).length;
        const matchCount = matches.filter(
          (m) => m.category === category,
        ).length;
        return (
          <section key={category} className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={categoryHref("/admin/hraci", category)}
                className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="text-sm text-neutral-500">Hráči</div>
                <div className="mt-1 text-2xl font-semibold">{playerCount}</div>
                <div className="mt-2 text-sm text-lime-700">
                  Spravovat hráče →
                </div>
              </Link>
              <Link
                href={categoryHref("/admin/zapasy", category)}
                className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="text-sm text-neutral-500">Zápasy</div>
                <div className="mt-1 text-2xl font-semibold">{matchCount}</div>
                <div className="mt-2 text-sm text-lime-700">
                  Spravovat zápasy →
                </div>
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}
