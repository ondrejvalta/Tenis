export type Player = {
  id: string;
  name: string;
  joinedAt: string;
};

export type SetScore = {
  p1: number;
  p2: number;
  tiebreak?: { p1: number; p2: number };
};

export type Match = {
  id: string;
  date: string;
  player1Id: string;
  player2Id: string;
  sets: SetScore[];
  winnerId: string;
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
