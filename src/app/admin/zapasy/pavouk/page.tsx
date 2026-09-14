import Link from "next/link";
import { fetchBracketMatches, fetchPlayers } from "@/lib/data";
import { formatDate, formatScore } from "@/lib/format";
import {
  BRACKET_ROUNDS,
  BRACKET_ROUND_LABELS,
  type BracketMatch,
  type BracketRound,
  type Player,
} from "@/data/types";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteBracketMatch } from "./actions";

export const metadata = { title: "Pavouk skupiny A-B – Administrace" };

// Popisek okýnka: číslované od 1 shora dolů v rámci kola.
function cellLabel(position: number): string {
  return `Okýnko ${position}`;
}

export default async function AdminBracketPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [bracketMatches, players] = await Promise.all([
    fetchBracketMatches("dospeli"),
    fetchPlayers("dospeli"),
  ]);
  const playersById = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pavouk skupiny A-B
        </h1>
        <Link
          href="/admin/zapasy/pavouk/novy"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Přidat zápas pavouk
        </Link>
      </div>

      <Link
        href="/admin/zapasy"
        className="inline-block text-sm text-neutral-600 hover:text-neutral-900"
      >
        ← Zpět na zápasy
      </Link>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {BRACKET_ROUNDS.map((round, idx) => {
          const roundMatches = bracketMatches
            .filter((m) => m.round === round)
            .slice()
            .sort((a, b) => a.position - b.position);
          if (roundMatches.length === 0) return null;
          return (
            <BracketRoundTable
              key={round}
              round={round}
              matches={roundMatches}
              playersById={playersById}
              defaultOpen={idx === 0}
            />
          );
        })}
      </div>

      {bracketMatches.length === 0 && (
        <p className="text-sm text-neutral-500">
          Zatím žádné zápasy pavouka.
        </p>
      )}
    </div>
  );
}

function BracketRoundTable({
  round,
  matches,
  playersById,
  defaultOpen,
}: {
  round: BracketRound;
  matches: BracketMatch[];
  playersById: Map<string, Player>;
  defaultOpen?: boolean;
}) {
  return (
    <CollapsibleSection
      id={`admin-pavouk-${round}`}
      defaultOpen={defaultOpen}
      title={BRACKET_ROUND_LABELS[round]}
      meta={`${matches.length}`}
    >
      <div className="overflow-x-auto border-t border-neutral-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Okýnko</th>
              <th className="px-4 py-3 font-medium">Datum</th>
              <th className="px-4 py-3 font-medium">Zápas</th>
              <th className="px-4 py-3 font-medium">Skóre</th>
              <th className="px-4 py-3 font-medium text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const p1 = m.player1Id ? playersById.get(m.player1Id) : undefined;
              const p2 = m.player2Id ? playersById.get(m.player2Id) : undefined;
              const p1Won = m.winnerId != null && m.winnerId === m.player1Id;
              const p2Won = m.winnerId != null && m.winnerId === m.player2Id;
              return (
                <tr key={m.id} className="border-t border-neutral-100">
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {cellLabel(m.position)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {m.date ? formatDate(m.date) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={p1Won ? "font-semibold" : ""}>
                        {p1?.name ?? "—"}
                      </span>
                      <span className="text-neutral-400">vs.</span>
                      <span className={p2Won ? "font-semibold" : ""}>
                        {p2?.name ?? "—"}
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-neutral-600">
                    {m.sets.length > 0 ? formatScore(m) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/zapasy/pavouk/${m.id}`}
                        className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50"
                      >
                        Upravit
                      </Link>
                      <DeleteButton
                        action={deleteBracketMatch}
                        id={m.id}
                        confirm="Opravdu chceš smazat tento zápas pavouka?"
                      />
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
