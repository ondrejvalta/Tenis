"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Database } from "@/lib/supabase/database.types";

type Group = Database["public"]["Enums"]["league_group"];
const VALID_GROUPS: Group[] = ["A", "B", "C", "D"];

export type MatchFormState = { error?: string } | undefined;

type ParsedSet = {
  set_number: number;
  p1_games: number;
  p2_games: number;
  tiebreak_p1: number | null;
  tiebreak_p2: number | null;
  super_tiebreak: boolean;
};

type Parsed = {
  date: string;
  group: Group;
  player1_id: string;
  player2_id: string;
  forfeit: boolean;
  sets: ParsedSet[];
  winner_id: string;
};

function parseInt0(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function parseIntNullable(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

async function parseForm(
  formData: FormData,
): Promise<Parsed | { error: string }> {
  const date = String(formData.get("date") ?? "").trim();
  const group = String(formData.get("group") ?? "") as Group;
  const player1_id = String(formData.get("player1_id") ?? "");
  const player2_id = String(formData.get("player2_id") ?? "");
  const forfeit = formData.get("forfeit") === "on";
  const forfeit_player_id = String(formData.get("forfeit_player_id") ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Datum je povinné." };
  if (!VALID_GROUPS.includes(group)) return { error: "Neplatná skupina." };
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
    .select("id, group")
    .in("id", [player1_id, player2_id]);
  if (!pls || pls.length !== 2)
    return { error: "Jeden z hráčů nebyl nalezen." };
  if (pls.some((p) => p.group !== group))
    return { error: "Oba hráči musí být ve vybrané skupině." };

  const sets: ParsedSet[] = [];
  let p1SetsWon = 0;
  let p2SetsWon = 0;

  for (let i = 1; i <= 3; i++) {
    const p1 = parseInt0(formData.get(`set${i}_p1`));
    const p2 = parseInt0(formData.get(`set${i}_p2`));
    const isSuper = i === 3;
    const tbp1 = isSuper ? null : parseIntNullable(formData.get(`set${i}_tb_p1`));
    const tbp2 = isSuper ? null : parseIntNullable(formData.get(`set${i}_tb_p2`));

    const filled = p1 > 0 || p2 > 0;
    if (!filled) {
      if (i <= 2 && !forfeit) return { error: `Sety 1 a 2 jsou povinné.` };
      continue;
    }
    if (p1 === p2)
      return { error: `Set ${i}: skóre nemůže být rovné (${p1}:${p2}).` };

    sets.push({
      set_number: i,
      p1_games: p1,
      p2_games: p2,
      tiebreak_p1: tbp1,
      tiebreak_p2: tbp2,
      super_tiebreak: isSuper,
    });
    if (p1 > p2) p1SetsWon++;
    else p2SetsWon++;
  }

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
  redirect("/admin/zapasy");
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
  redirect("/admin/zapasy");
}

export async function deleteMatch(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("match_sets").delete().eq("match_id", id);
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) redirect(`/admin/zapasy?error=${encodeURIComponent(error.message)}`);

  revalidateAll();
  redirect("/admin/zapasy");
}
