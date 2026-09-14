import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  BracketMatch,
  BracketRound,
  Category,
  Group,
  Match,
  Player,
  SetScore,
} from "@/data/types";

type DbMatchSet = {
  set_number: number;
  p1_games: number;
  p2_games: number;
  tiebreak_p1: number | null;
  tiebreak_p2: number | null;
  super_tiebreak: boolean;
};

type DbMatchWithSets = {
  id: string;
  date: string;
  group: Group;
  category: Category;
  player1_id: string;
  player2_id: string;
  winner_id: string;
  forfeit: boolean;
  match_sets: DbMatchSet[];
};

function toSetScore(row: DbMatchSet): SetScore {
  const set: SetScore = { p1: row.p1_games, p2: row.p2_games };
  if (row.tiebreak_p1 !== null && row.tiebreak_p2 !== null) {
    set.tiebreak = { p1: row.tiebreak_p1, p2: row.tiebreak_p2 };
  }
  if (row.super_tiebreak) set.superTiebreak = true;
  return set;
}

function toMatch(row: DbMatchWithSets): Match {
  const sets = row.match_sets
    .slice()
    .sort((a, b) => a.set_number - b.set_number)
    .map(toSetScore);
  const match: Match = {
    id: row.id,
    date: row.date,
    group: row.group,
    category: row.category,
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    sets,
    winnerId: row.winner_id,
  };
  if (row.forfeit) match.forfeit = true;
  return match;
}

export const fetchPlayers = cache(
  async (category?: Category): Promise<Player[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("players")
      .select("id, name, joined_at, group, category");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw new Error(`fetchPlayers: ${error.message}`);
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      joinedAt: p.joined_at,
      group: p.group,
      category: p.category,
    }));
  },
);

export const fetchMatches = cache(
  async (category?: Category): Promise<Match[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("matches")
      .select(
        "id, date, group, category, player1_id, player2_id, winner_id, forfeit, match_sets (set_number, p1_games, p2_games, tiebreak_p1, tiebreak_p2, super_tiebreak)",
      )
      .order("date", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw new Error(`fetchMatches: ${error.message}`);
    return (data as DbMatchWithSets[]).map(toMatch);
  },
);

type DbBracketMatchWithSets = {
  id: string;
  date: string | null;
  round: BracketRound;
  position: number;
  category: Category;
  player1_id: string | null;
  player2_id: string | null;
  winner_id: string | null;
  bracket_match_sets: DbMatchSet[];
};

function toBracketMatch(row: DbBracketMatchWithSets): BracketMatch {
  const sets = row.bracket_match_sets
    .slice()
    .sort((a, b) => a.set_number - b.set_number)
    .map(toSetScore);
  return {
    id: row.id,
    category: row.category,
    round: row.round,
    position: row.position,
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    winnerId: row.winner_id,
    date: row.date,
    sets,
  };
}

export const fetchBracketMatches = cache(
  async (category: Category = "dospeli"): Promise<BracketMatch[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bracket_matches")
      .select(
        "id, date, round, position, category, player1_id, player2_id, winner_id, bracket_match_sets (set_number, p1_games, p2_games, tiebreak_p1, tiebreak_p2, super_tiebreak)",
      )
      .eq("category", category);
    if (error) throw new Error(`fetchBracketMatches: ${error.message}`);
    return (data as DbBracketMatchWithSets[]).map(toBracketMatch);
  },
);
