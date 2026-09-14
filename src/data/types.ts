export type Group = "A" | "B" | "C" | "D";

export const GROUPS: Group[] = ["A", "B", "C", "D"];

// Kategorie soutěže – dospělí (výchozí) a děti.
export type Category = "dospeli" | "deti";

export const CATEGORIES: Category[] = ["dospeli", "deti"];

export const CATEGORY_LABELS: Record<Category, string> = {
  dospeli: "Dospělí",
  deti: "Děti",
};

export const DEFAULT_CATEGORY: Category = "dospeli";

export type Player = {
  id: string;
  name: string;
  joinedAt: string;
  group: Group;
  category: Category;
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
  category: Category;
  player1Id: string;
  player2Id: string;
  sets: SetScore[];
  winnerId: string;
  // Kontumace — poražený dostává 0 bodů místo standardního 1 bodu za prohru.
  forfeit?: boolean;
};

// --- Pavouk (vyřazovací strom) ---

// Kola pavouka od osmifinále po finále (16 hráčů / 4 kola).
export type BracketRound =
  | "osmifinale"
  | "ctvrtfinale"
  | "semifinale"
  | "finale";

export const BRACKET_ROUNDS: BracketRound[] = [
  "osmifinale",
  "ctvrtfinale",
  "semifinale",
  "finale",
];

export const BRACKET_ROUND_LABELS: Record<BracketRound, string> = {
  osmifinale: "Osmifinále",
  ctvrtfinale: "Čtvrtfinále",
  semifinale: "Semifinále",
  finale: "Finále",
};

// Počet okýnek (zápasů) v jednotlivých kolech.
export const BRACKET_ROUND_SIZE: Record<BracketRound, number> = {
  osmifinale: 8,
  ctvrtfinale: 4,
  semifinale: 2,
  finale: 1,
};

export type BracketMatch = {
  id: string;
  category: Category;
  round: BracketRound;
  // Okýnko 1..N shora dolů v rámci kola.
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  winnerId: string | null;
  date: string | null;
  sets: SetScore[];
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
