import {
  BRACKET_ROUNDS,
  BRACKET_ROUND_LABELS,
  BRACKET_ROUND_SIZE,
  type BracketMatch,
  type BracketRound,
  type Player,
} from "@/data/types";

// Počet vyhraných setů hráče 1 (super tiebreak se počítá jako set).
function setWins(m: BracketMatch): { p1: number; p2: number } {
  let p1 = 0;
  let p2 = 0;
  for (const s of m.sets) {
    if (s.p1 > s.p2) p1++;
    else if (s.p2 > s.p1) p2++;
  }
  return { p1, p2 };
}

function PlayerRow({
  name,
  score,
  winner,
}: {
  name: string | null;
  score: number | null;
  winner: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-1.5">
      <span
        className={`truncate ${winner ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
      >
        {name ?? "—"}
      </span>
      <span
        className={`shrink-0 font-mono text-xs ${winner ? "font-semibold text-neutral-900" : "text-neutral-500"}`}
      >
        {score ?? ""}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  playersById,
}: {
  match: BracketMatch | undefined;
  playersById: Map<string, Player>;
}) {
  const p1 = match?.player1Id ? playersById.get(match.player1Id) : undefined;
  const p2 = match?.player2Id ? playersById.get(match.player2Id) : undefined;
  const wins = match ? setWins(match) : null;
  const played = !!match && match.sets.length > 0;
  const p1Won = !!match && match.winnerId != null && match.winnerId === match.player1Id;
  const p2Won = !!match && match.winnerId != null && match.winnerId === match.player2Id;

  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-white shadow-sm">
      <PlayerRow
        name={p1?.name ?? null}
        score={played ? (wins?.p1 ?? null) : null}
        winner={p1Won}
      />
      <div className="border-t border-neutral-100" />
      <PlayerRow
        name={p2?.name ?? null}
        score={played ? (wins?.p2 ?? null) : null}
        winner={p2Won}
      />
    </div>
  );
}

// Sloupec spojnic mezi kolem s `count` páry (tj. `count` okýnky v dalším kole).
function ConnectorColumn({ count }: { count: number }) {
  return (
    <div className="flex w-8 shrink-0 flex-col">
      {/* mezera pod hlavičkou kola */}
      <div className="mb-2 h-8" />
      <div className="flex flex-1 flex-col">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex flex-1">
            {/* levá půlka: horní (25 %) a dolní (75 %) spojnice + svislé spojení */}
            <div className="relative w-1/2">
              <div className="absolute inset-x-0 top-1/4 bottom-1/4 border-t-2 border-b-2 border-r-2 border-neutral-300" />
            </div>
            {/* pravá půlka: výstup do dalšího okýnka (50 %) */}
            <div className="relative w-1/2">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-neutral-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoundColumn({
  round,
  matchesByPosition,
  playersById,
}: {
  round: BracketRound;
  matchesByPosition: Map<number, BracketMatch>;
  playersById: Map<string, Player>;
}) {
  const size = BRACKET_ROUND_SIZE[round];
  return (
    <div className="flex min-w-[190px] flex-1 flex-col">
      <div className="mb-2 flex h-8 items-center justify-center rounded-md bg-neutral-50 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {BRACKET_ROUND_LABELS[round]}
      </div>
      <div className="flex flex-1 flex-col">
        {Array.from({ length: size }, (_, i) => (
          <div key={i} className="flex flex-1 items-center py-1.5">
            <MatchCard
              match={matchesByPosition.get(i + 1)}
              playersById={playersById}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Bracket({
  matches,
  playersById,
}: {
  matches: BracketMatch[];
  playersById: Map<string, Player>;
}) {
  // Uspořádání zápasů do mřížky [kolo][okýnko].
  const byRound = new Map<BracketRound, Map<number, BracketMatch>>();
  for (const round of BRACKET_ROUNDS) byRound.set(round, new Map());
  for (const m of matches) byRound.get(m.round)?.set(m.position, m);

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex min-w-[820px] items-stretch">
        {BRACKET_ROUNDS.map((round, idx) => (
          <div key={round} className="flex flex-1">
            <RoundColumn
              round={round}
              matchesByPosition={byRound.get(round)!}
              playersById={playersById}
            />
            {idx < BRACKET_ROUNDS.length - 1 && (
              <ConnectorColumn
                count={BRACKET_ROUND_SIZE[BRACKET_ROUNDS[idx + 1]]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
