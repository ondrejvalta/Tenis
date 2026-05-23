import Link from "next/link";
import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeStandingsForGroup } from "@/data/standings";
import { formatDate } from "@/lib/format";
import { GROUPS, type Group, type Match, type Player } from "@/data/types";

export const metadata = { title: "Hráči | Tenisová liga Dobříš" };

export default async function HraciPage() {
  const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hráči</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Seznam všech {players.length} hráčů ligy, rozdělených do tří skupin.
        </p>
      </div>

      {GROUPS.map((group) => (
        <GroupSection
          key={group}
          group={group}
          players={players}
          matches={matches}
        />
      ))}
    </div>
  );
}

function GroupSection({
  group,
  players,
  matches,
}: {
  group: Group;
  players: Player[];
  matches: Match[];
}) {
  const groupPlayers = players.filter((p) => p.group === group);
  const standings = computeStandingsForGroup(group, players, matches);
  const statsById = new Map(standings.map((s) => [s.playerId, s]));
  const sorted = groupPlayers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "cs"));

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">
        Skupina {group}{" "}
        <span className="text-sm font-normal text-neutral-500">
          ({groupPlayers.length} hráčů)
        </span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
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
                    <div className="mt-0.5 text-xs text-neutral-500">
                      V lize od {formatDate(p.joinedAt)}
                    </div>
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
    </section>
  );
}
