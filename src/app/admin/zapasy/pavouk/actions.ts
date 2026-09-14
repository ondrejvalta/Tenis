"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  BRACKET_ROUNDS,
  BRACKET_ROUND_SIZE,
  type BracketRound,
} from "@/data/types";
import { parseSets, type ParsedSet } from "../sets";

export type BracketMatchFormState = { error?: string } | undefined;

const LIST_URL = "/admin/zapasy/pavouk";

// Cesta na seznam zápasů pavouka, volitelně s chybovou hláškou.
function listUrl(error?: string): string {
  return error ? `${LIST_URL}?error=${encodeURIComponent(error)}` : LIST_URL;
}

type Parsed = {
  round: BracketRound;
  position: number;
  player1_id: string | null;
  player2_id: string | null;
  winner_id: string | null;
  date: string | null;
  sets: ParsedSet[];
};

async function parseForm(
  formData: FormData,
): Promise<Parsed | { error: string }> {
  const round = String(formData.get("round") ?? "") as BracketRound;
  const position = Number(String(formData.get("position") ?? ""));
  const dateRaw = String(formData.get("date") ?? "").trim();
  const player1_id = String(formData.get("player1_id") ?? "").trim() || null;
  const player2_id = String(formData.get("player2_id") ?? "").trim() || null;

  if (!BRACKET_ROUNDS.includes(round)) return { error: "Neplatné kolo." };
  if (
    !Number.isInteger(position) ||
    position < 1 ||
    position > BRACKET_ROUND_SIZE[round]
  )
    return { error: "Neplatné okýnko." };
  if (dateRaw && !/^\d{4}-\d{2}-\d{2}$/.test(dateRaw))
    return { error: "Neplatné datum." };
  const date = dateRaw || null;

  if (player1_id && player2_id && player1_id === player2_id)
    return { error: "Hráči musí být různí." };

  // Ověření hráčů (pokud jsou vyplněni) – dospělí ze skupiny A nebo B.
  const ids = [player1_id, player2_id].filter((v): v is string => v !== null);
  if (ids.length > 0) {
    const supabase = await createClient();
    const { data: pls } = await supabase
      .from("players")
      .select("id, group, category")
      .in("id", ids);
    if (!pls || pls.length !== ids.length)
      return { error: "Jeden z hráčů nebyl nalezen." };
    if (pls.some((p) => p.category !== "dospeli"))
      return { error: "Hráči musí být z kategorie Dospělí." };
    if (pls.some((p) => p.group !== "A" && p.group !== "B"))
      return { error: "Hráči musí být ze skupiny A nebo B." };
  }

  const parsedSets = parseSets(formData, { requireFirstTwo: false });
  if ("error" in parsedSets) return parsedSets;
  const { sets, p1SetsWon, p2SetsWon } = parsedSets;

  let winner_id: string | null = null;
  if (sets.length > 0) {
    if (!player1_id || !player2_id)
      return { error: "Pro zadání setů musí být vybráni oba hráči." };
    if (p1SetsWon === p2SetsWon)
      return { error: "Zápas nemůže skončit nerozhodně." };
    winner_id = p1SetsWon > p2SetsWon ? player1_id : player2_id;
  }

  return { round, position, player1_id, player2_id, winner_id, date, sets };
}

function revalidateAll(matchId?: string) {
  revalidatePath(LIST_URL);
  revalidatePath("/zebricek");
  if (matchId) revalidatePath(`${LIST_URL}/${matchId}`);
}

// Přeloží chybu unikátního klíče (obsazené okýnko) na srozumitelnou hlášku.
function mapInsertError(message: string): string {
  if (message.includes("bracket_matches_category_round_position_key"))
    return "V tomto okýnku už zápas existuje. Uprav ho místo vytváření nového.";
  return message;
}

export async function createBracketMatch(
  _prev: BracketMatchFormState,
  formData: FormData,
): Promise<BracketMatchFormState> {
  await requireAdmin();
  const parsed = await parseForm(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const id = crypto.randomUUID();

  const { error: insertErr } = await supabase.from("bracket_matches").insert({
    id,
    category: "dospeli",
    round: parsed.round,
    position: parsed.position,
    player1_id: parsed.player1_id,
    player2_id: parsed.player2_id,
    winner_id: parsed.winner_id,
    date: parsed.date,
  });
  if (insertErr) return { error: mapInsertError(insertErr.message) };

  if (parsed.sets.length > 0) {
    const { error: setsErr } = await supabase
      .from("bracket_match_sets")
      .insert(parsed.sets.map((s) => ({ ...s, bracket_match_id: id })));
    if (setsErr) {
      await supabase.from("bracket_matches").delete().eq("id", id);
      return { error: setsErr.message };
    }
  }

  revalidateAll();
  redirect(LIST_URL);
}

export async function updateBracketMatch(
  id: string,
  _prev: BracketMatchFormState,
  formData: FormData,
): Promise<BracketMatchFormState> {
  await requireAdmin();
  const parsed = await parseForm(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();

  const { error: updErr } = await supabase
    .from("bracket_matches")
    .update({
      round: parsed.round,
      position: parsed.position,
      player1_id: parsed.player1_id,
      player2_id: parsed.player2_id,
      winner_id: parsed.winner_id,
      date: parsed.date,
    })
    .eq("id", id);
  if (updErr) return { error: mapInsertError(updErr.message) };

  await supabase.from("bracket_match_sets").delete().eq("bracket_match_id", id);
  if (parsed.sets.length > 0) {
    const { error: setsErr } = await supabase
      .from("bracket_match_sets")
      .insert(parsed.sets.map((s) => ({ ...s, bracket_match_id: id })));
    if (setsErr) return { error: setsErr.message };
  }

  revalidateAll(id);
  redirect(LIST_URL);
}

export async function deleteBracketMatch(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("bracket_match_sets").delete().eq("bracket_match_id", id);
  const { error } = await supabase
    .from("bracket_matches")
    .delete()
    .eq("id", id);
  if (error) redirect(listUrl(error.message));

  revalidateAll();
  redirect(LIST_URL);
}
