import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";

export const metadata = { title: "Administrace – Tenisová liga Dobříš" };

export default async function AdminPage() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administrace</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Správa hráčů a zápasů ligy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/hraci"
          className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
        >
          <div className="text-sm text-neutral-500">Hráči</div>
          <div className="mt-1 text-2xl font-semibold">{players.length}</div>
          <div className="mt-2 text-sm text-lime-700">Spravovat hráče →</div>
        </Link>
        <Link
          href="/admin/zapasy"
          className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
        >
          <div className="text-sm text-neutral-500">Zápasy</div>
          <div className="mt-1 text-2xl font-semibold">{matches.length}</div>
          <div className="mt-2 text-sm text-lime-700">Spravovat zápasy →</div>
        </Link>
      </div>
    </div>
  );
}
