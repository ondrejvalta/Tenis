import type { Match } from "./types";

export const matches: Match[] = [
  {
    id: "m1",
    date: "2026-03-15",
    player1Id: "p1",
    player2Id: "p2",
    sets: [{ p1: 6, p2: 3 }, { p1: 6, p2: 4 }],
    winnerId: "p1",
  },
  {
    id: "m2",
    date: "2026-03-18",
    player1Id: "p3",
    player2Id: "p4",
    sets: [{ p1: 4, p2: 6 }, { p1: 6, p2: 2 }, { p1: 7, p2: 5 }],
    winnerId: "p3",
  },
  {
    id: "m3",
    date: "2026-03-22",
    player1Id: "p5",
    player2Id: "p6",
    sets: [{ p1: 6, p2: 1 }, { p1: 6, p2: 2 }],
    winnerId: "p5",
  },
  {
    id: "m4",
    date: "2026-03-25",
    player1Id: "p1",
    player2Id: "p3",
    sets: [{ p1: 3, p2: 6 }, { p1: 6, p2: 7, tiebreak: { p1: 5, p2: 7 } }],
    winnerId: "p3",
  },
  {
    id: "m5",
    date: "2026-04-02",
    player1Id: "p2",
    player2Id: "p4",
    sets: [{ p1: 6, p2: 4 }, { p1: 6, p2: 3 }],
    winnerId: "p2",
  },
  {
    id: "m6",
    date: "2026-04-08",
    player1Id: "p5",
    player2Id: "p1",
    sets: [{ p1: 2, p2: 6 }, { p1: 4, p2: 6 }],
    winnerId: "p1",
  },
  {
    id: "m7",
    date: "2026-04-12",
    player1Id: "p7",
    player2Id: "p8",
    sets: [{ p1: 6, p2: 4 }, { p1: 3, p2: 6 }, { p1: 6, p2: 4 }],
    winnerId: "p7",
  },
  {
    id: "m8",
    date: "2026-04-18",
    player1Id: "p3",
    player2Id: "p5",
    sets: [{ p1: 6, p2: 2 }, { p1: 6, p2: 4 }],
    winnerId: "p3",
  },
  {
    id: "m9",
    date: "2026-04-25",
    player1Id: "p6",
    player2Id: "p7",
    sets: [{ p1: 4, p2: 6 }, { p1: 6, p2: 7, tiebreak: { p1: 4, p2: 7 } }],
    winnerId: "p7",
  },
  {
    id: "m10",
    date: "2026-05-02",
    player1Id: "p2",
    player2Id: "p8",
    sets: [{ p1: 6, p2: 3 }, { p1: 4, p2: 6 }, { p1: 6, p2: 4 }],
    winnerId: "p2",
  },
  {
    id: "m11",
    date: "2026-05-08",
    player1Id: "p1",
    player2Id: "p7",
    sets: [{ p1: 6, p2: 4 }, { p1: 7, p2: 5 }],
    winnerId: "p1",
  },
  {
    id: "m12",
    date: "2026-05-15",
    player1Id: "p4",
    player2Id: "p6",
    sets: [{ p1: 6, p2: 2 }, { p1: 6, p2: 1 }],
    winnerId: "p4",
  },
];

export function getMatchesForPlayer(playerId: string): Match[] {
  return matches
    .filter((m) => m.player1Id === playerId || m.player2Id === playerId)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}
