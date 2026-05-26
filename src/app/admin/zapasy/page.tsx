import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { formatDate, formatScore } from "@/lib/format";
import { deleteMatch } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata = { title: "Správa zápasů – Administrace" };

type SearchParams = Promise<{ error?: string }>;

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const [matches, players] = await Promise.all([fetchMatches(), fetchPlayers()]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Zápasy</h1>
        <Link
          href="/admin/zapasy/novy"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Přidat zápas
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <ul className="min-w-[640px] bg-white">
        {matches.map((m) => {
          const p1 = playersById.get(m.player1Id);
          const p2 = playersById.get(m.player2Id);
          const p1Won = m.winnerId === m.player1Id;
          return (
            <li
              key={m.id}
              className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5 text-sm last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-24 text-neutral-500">
                  {formatDate(m.date)}
                </span>
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700">
                  Sk. {m.group}
                </span>
                <span className={p1Won ? "font-semibold" : ""}>{p1?.name}</span>
                <span className="text-neutral-400">vs.</span>
                <span className={!p1Won ? "font-semibold" : ""}>{p2?.name}</span>
                <span className="font-mono text-neutral-600">
                  {formatScore(m)}
                </span>
                {m.forfeit && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                    kont.
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/zapasy/${m.id}`}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                >
                  Upravit
                </Link>
                <DeleteButton action={deleteMatch} id={m.id} confirm="Opravdu chceš smazat tento zápas?" />
              </div>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}
