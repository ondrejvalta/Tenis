import type { Group, Match, Player, StandingRow } from "./types";

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
    if (!set.superTiebreak) {
      row.gamesWon += my;
      row.gamesLost += opp;
    }
    if (my > opp) row.setsWon += 1;
    else if (opp > my) row.setsLost += 1;
  }

  // Bodování: výhra 3 b., prohra 1 b., kontumace (prohra) 0 b.
  if (won) {
    row.points += 3;
  } else if (!match.forfeit) {
    row.points += 1;
  }
}

function setDiff(r: StandingRow): number {
  return r.setsWon - r.setsLost;
}

function gameDiff(r: StandingRow): number {
  return r.gamesWon - r.gamesLost;
}

// Mini-tabulka jen z duelů mezi hráči se stejným počtem bodů.
function headToHeadRanking(
  tied: StandingRow[],
  groupMatches: Match[],
): Map<string, StandingRow> {
  const ids = new Set(tied.map((t) => t.playerId));
  const h2h = new Map<string, StandingRow>();
  for (const t of tied) h2h.set(t.playerId, emptyRow(t.playerId));

  for (const m of groupMatches) {
    if (!ids.has(m.player1Id) || !ids.has(m.player2Id)) continue;
    const r1 = h2h.get(m.player1Id);
    const r2 = h2h.get(m.player2Id);
    if (r1) applyMatch(r1, m, true);
    if (r2) applyMatch(r2, m, false);
  }
  return h2h;
}

function sortStandings(
  rows: StandingRow[],
  groupMatches: Match[],
): StandingRow[] {
  // 1) primárně podle bodů
  const byPoints = rows.slice().sort((a, b) => b.points - a.points);

  // 2) při shodě: vzájemný zápas → set diff → game diff
  const result: StandingRow[] = [];
  let i = 0;
  while (i < byPoints.length) {
    let j = i;
    while (j < byPoints.length && byPoints[j].points === byPoints[i].points) j++;
    const tied = byPoints.slice(i, j);

    if (tied.length === 1) {
      result.push(tied[0]);
    } else {
      const h2h = headToHeadRanking(tied, groupMatches);
      tied.sort((a, b) => {
        const ha = h2h.get(a.playerId)!;
        const hb = h2h.get(b.playerId)!;
        if (hb.points !== ha.points) return hb.points - ha.points;
        const sd = setDiff(b) - setDiff(a);
        if (sd !== 0) return sd;
        return gameDiff(b) - gameDiff(a);
      });
      result.push(...tied);
    }
    i = j;
  }
  return result;
}

export function computeStandings(
  players: Player[],
  matches: Match[],
): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const p of players) rows.set(p.id, emptyRow(p.id));

  for (const m of matches) {
    const r1 = rows.get(m.player1Id);
    const r2 = rows.get(m.player2Id);
    if (r1) applyMatch(r1, m, true);
    if (r2) applyMatch(r2, m, false);
  }

  return sortStandings(Array.from(rows.values()), matches);
}

export function computeStandingsForGroup(
  group: Group,
  players: Player[],
  matches: Match[],
): StandingRow[] {
  const groupPlayers = players.filter((p) => p.group === group);
  const groupMatches = matches.filter((m) => m.group === group);
  return computeStandings(groupPlayers, groupMatches);
}
