import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Group, Match, Player, SetScore } from "@/data/types";

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
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    sets,
    winnerId: row.winner_id,
  };
  if (row.forfeit) match.forfeit = true;
  return match;
}

export const fetchPlayers = cache(async (): Promise<Player[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, joined_at, group");
  if (error) throw new Error(`fetchPlayers: ${error.message}`);
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    joinedAt: p.joined_at,
    group: p.group,
  }));
});

export const fetchMatches = cache(async (): Promise<Match[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, date, group, player1_id, player2_id, winner_id, forfeit, match_sets (set_number, p1_games, p2_games, tiebreak_p1, tiebreak_p2, super_tiebreak)",
    )
    .order("date", { ascending: false });
  if (error) throw new Error(`fetchMatches: ${error.message}`);
  return (data as DbMatchWithSets[]).map(toMatch);
});
