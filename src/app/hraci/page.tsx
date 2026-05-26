import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeStandingsForGroup } from "@/data/standings";
import { GROUPS, type Group, type Match, type Player } from "@/data/types";

export const metadata = { title: "Hráči | Tenisová liga Dobříš" };

export default async function HraciPage() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hráči</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Sledujte profily všech účastníků ligy, jejich úspěšnost, odehrané zápasy a statistiky sezóny.
        </p>
      </div>

      <div className="space-y-3">
        {GROUPS.map((group, idx) => (
          <GroupSection
            key={group}
            group={group}
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
  players,
  matches,
  defaultOpen,
}: {
  group: Group;
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
    <details
      open={defaultOpen}
      className="group rounded-lg border border-neutral-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 text-neutral-400 transition-transform group-open:rotate-90"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4 2l4 4-4 4V2z" />
          </svg>
          <span className="font-semibold text-neutral-700">Skupina {group}</span>
        </span>
        <span className="text-xs text-neutral-500">
          {groupPlayers.length} {groupPlayers.length === 1 ? "hráč" : groupPlayers.length >= 2 && groupPlayers.length <= 4 ? "hráči" : "hráčů"}
        </span>
      </summary>
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
    </details>
  );
}
