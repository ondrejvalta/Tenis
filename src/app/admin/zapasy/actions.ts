"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { categoryHref } from "@/lib/category";
import type { Database } from "@/lib/supabase/database.types";
import { CATEGORIES, DEFAULT_CATEGORY, type Category } from "@/data/types";
import { parseSets, type ParsedSet } from "./sets";

type Group = Database["public"]["Enums"]["league_group"];
const VALID_GROUPS: Group[] = ["A", "B", "C", "D"];

export type MatchFormState = { error?: string } | undefined;

// Cesta na seznam zápasů pro danou kategorii, volitelně s chybovou hláškou.
function matchesListUrl(category: Category, error?: string): string {
  const base = categoryHref("/admin/zapasy", category);
  if (!error) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}error=${encodeURIComponent(error)}`;
}

type Parsed = {
  date: string;
  group: Group;
  category: Category;
  player1_id: string;
  player2_id: string;
  forfeit: boolean;
  sets: ParsedSet[];
  winner_id: string;
};

async function parseForm(
  formData: FormData,
): Promise<Parsed | { error: string }> {
  const date = String(formData.get("date") ?? "").trim();
  const group = String(formData.get("group") ?? "") as Group;
  const category = String(formData.get("category") ?? "") as Category;
  const player1_id = String(formData.get("player1_id") ?? "");
  const player2_id = String(formData.get("player2_id") ?? "");
  const forfeit = formData.get("forfeit") === "on";
  const forfeit_player_id = String(formData.get("forfeit_player_id") ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Datum je povinné." };
  if (!VALID_GROUPS.includes(group)) return { error: "Neplatná skupina." };
  if (!CATEGORIES.includes(category)) return { error: "Neplatná kategorie." };
  if (!player1_id || !player2_id) return { error: "Vyber oba hráče." };
  if (player1_id === player2_id) return { error: "Hráči musí být různí." };
  if (forfeit) {
    if (!forfeit_player_id)
      return { error: "Vyber kontumovaného hráče." };
    if (forfeit_player_id !== player1_id && forfeit_player_id !== player2_id)
      return { error: "Kontumovaný hráč musí být Hráč 1 nebo Hráč 2." };
  }

  const supabase = await createClient();
  const { data: pls } = await supabase
    .from("players")
    .select("id, group, category")
    .in("id", [player1_id, player2_id]);
  if (!pls || pls.length !== 2)
    return { error: "Jeden z hráčů nebyl nalezen." };
  if (pls.some((p) => p.category !== category))
    return { error: "Oba hráči musí být ve vybrané kategorii." };
  if (pls.some((p) => p.group !== group))
    return { error: "Oba hráči musí být ve vybrané skupině." };

  const parsedSets = parseSets(formData, { requireFirstTwo: !forfeit });
  if ("error" in parsedSets) return parsedSets;
  const { sets, p1SetsWon, p2SetsWon } = parsedSets;

  if (!forfeit && sets.length < 2)
    return { error: "Zápas musí mít aspoň 2 sety." };

  let winner_id: string;
  if (forfeit) {
    winner_id = forfeit_player_id === player1_id ? player2_id : player1_id;
  } else {
    if (p1SetsWon === p2SetsWon)
      return { error: "Zápas nemůže skončit nerozhodně." };
    winner_id = p1SetsWon > p2SetsWon ? player1_id : player2_id;
  }

  return {
    date,
    group,
    category,
    player1_id,
    player2_id,
    forfeit,
    sets,
    winner_id,
  };
}

function revalidateAll(matchId?: string) {
  revalidatePath("/admin/zapasy");
  revalidatePath("/zapasy");
  revalidatePath("/zebricek");
  revalidatePath("/");
  revalidatePath("/hraci");
  if (matchId) revalidatePath(`/admin/zapasy/${matchId}`);
}

export async function createMatch(
  _prev: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  await requireAdmin();
  const parsed = await parseForm(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const id = crypto.randomUUID();

  const { error: insertErr } = await supabase.from("matches").insert({
    id,
    date: parsed.date,
    group: parsed.group,
    category: parsed.category,
    player1_id: parsed.player1_id,
    player2_id: parsed.player2_id,
    winner_id: parsed.winner_id,
    forfeit: parsed.forfeit,
  });
  if (insertErr) return { error: insertErr.message };

  const { error: setsErr } = await supabase
    .from("match_sets")
    .insert(parsed.sets.map((s) => ({ ...s, match_id: id })));
  if (setsErr) {
    await supabase.from("matches").delete().eq("id", id);
    return { error: setsErr.message };
  }

  revalidateAll();
  redirect(matchesListUrl(parsed.category));
}

export async function updateMatch(
  id: string,
  _prev: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  await requireAdmin();
  const parsed = await parseForm(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();

  const { error: updErr } = await supabase
    .from("matches")
    .update({
      date: parsed.date,
      group: parsed.group,
      category: parsed.category,
      player1_id: parsed.player1_id,
      player2_id: parsed.player2_id,
      winner_id: parsed.winner_id,
      forfeit: parsed.forfeit,
    })
    .eq("id", id);
  if (updErr) return { error: updErr.message };

  await supabase.from("match_sets").delete().eq("match_id", id);
  const { error: setsErr } = await supabase
    .from("match_sets")
    .insert(parsed.sets.map((s) => ({ ...s, match_id: id })));
  if (setsErr) return { error: setsErr.message };

  revalidateAll(id);
  redirect(matchesListUrl(parsed.category));
}

export async function deleteMatch(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // Kategorii zápasu zjistíme před smazáním kvůli návratu na správný seznam.
  const { data: existing } = await supabase
    .from("matches")
    .select("category")
    .eq("id", id)
    .maybeSingle();
  const category: Category = existing?.category ?? DEFAULT_CATEGORY;

  await supabase.from("match_sets").delete().eq("match_id", id);
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) redirect(matchesListUrl(category, error.message));

  revalidateAll();
  redirect(matchesListUrl(category));
}
