export type Group = "A" | "B" | "C" | "D";

export const GROUPS: Group[] = ["A", "B", "C", "D"];

export type Player = {
  id: string;
  name: string;
  joinedAt: string;
  group: Group;
};

export type SetScore = {
  p1: number;
  p2: number;
  tiebreak?: { p1: number; p2: number };
  // Třetí set za stavu 1:1 — supertiebreak do 10 bodů (min. o 2 napřed).
  // Při výpočtu žebříčku se počítá jako set, ale body se nesčítají do gemů.
  superTiebreak?: boolean;
};

export type Match = {
  id: string;
  date: string;
  group: Group;
  player1Id: string;
  player2Id: string;
  sets: SetScore[];
  winnerId: string;
  // Kontumace — poražený dostává 0 bodů místo standardního 1 bodu za prohru.
  forfeit?: boolean;
};

export type StandingRow = {
  playerId: string;
  played: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  points: number;
};
