import { matches } from "./matches";
import { players } from "./players";
import type { Match, StandingRow } from "./types";

function emptyRow(playerId: string): StandingRow {
  return {
    playerId,
    played: 0,
    wins: 0,
    losses: 0,
    setsWon: 0,
    setsLost: 0,
    gamesWon: 0,
    gamesLost: 0,
    points: 0,
  };
}

function applyMatch(row: StandingRow, match: Match, isPlayer1: boolean): void {
  row.played += 1;
  const won = match.winnerId === row.playerId;
  if (won) row.wins += 1;
  else row.losses += 1;

  for (const set of match.sets) {
    const my = isPlayer1 ? set.p1 : set.p2;
    const opp = isPlayer1 ? set.p2 : set.p1;
    row.gamesWon += my;
    row.gamesLost += opp;
    if (my > opp) row.setsWon += 1;
    else if (opp > my) row.setsLost += 1;
  }

  // Bodování: výhra 3 b., prohra v rozhodující sadě 1 b., jinak prohra 0 b.
  if (won) {
    row.points += 3;
  } else if (match.sets.length === 3) {
    row.points += 1;
  }
}

export function computeStandings(): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const p of players) rows.set(p.id, emptyRow(p.id));

  for (const m of matches) {
    const r1 = rows.get(m.player1Id);
    const r2 = rows.get(m.player2Id);
    if (r1) applyMatch(r1, m, true);
    if (r2) applyMatch(r2, m, false);
  }

  return Array.from(rows.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aDiffSets = a.setsWon - a.setsLost;
    const bDiffSets = b.setsWon - b.setsLost;
    if (bDiffSets !== aDiffSets) return bDiffSets - aDiffSets;
    const aDiffGames = a.gamesWon - a.gamesLost;
    const bDiffGames = b.gamesWon - b.gamesLost;
    return bDiffGames - aDiffGames;
  });
}
