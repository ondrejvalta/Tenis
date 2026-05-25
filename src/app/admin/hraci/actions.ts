"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import type { Database } from "@/lib/supabase/database.types";

type Group = Database["public"]["Enums"]["league_group"];
const VALID_GROUPS: Group[] = ["A", "B", "C", "D"];

export type PlayerFormState = { error?: string } | undefined;

async function pickFreeId(base: string): Promise<string> {
  const supabase = await createClient();
  let id = base || "hrac";
  let n = 2;
  while (true) {
    const { data } = await supabase
      .from("players")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!data) return id;
    id = `${base}-${n++}`;
  }
}

export async function createPlayer(
  _prev: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const group = String(formData.get("group") ?? "") as Group;
  if (!name) return { error: "Jméno je povinné." };
  if (!VALID_GROUPS.includes(group))
    return { error: "Neplatná skupina." };

  const id = await pickFreeId(slugify(name));
  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({ id, name, group });
  if (error) return { error: error.message };

  revalidatePath("/admin/hraci");
  revalidatePath("/hraci");
  revalidatePath("/zebricek");
  revalidatePath("/");
  redirect("/admin/hraci");
}

export async function updatePlayer(
  id: string,
  _prev: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const group = String(formData.get("group") ?? "") as Group;
  if (!name) return { error: "Jméno je povinné." };
  if (!VALID_GROUPS.includes(group))
    return { error: "Neplatná skupina." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({ name, group })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/hraci");
  revalidatePath("/hraci");
  revalidatePath(`/hraci/${id}`);
  revalidatePath("/zebricek");
  revalidatePath("/");
  redirect("/admin/hraci");
}

export async function deletePlayer(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { error: matchesError } = await supabase
    .from("matches")
    .delete()
    .or(`player1_id.eq.${id},player2_id.eq.${id}`);
  if (matchesError) redirect(`/admin/hraci?error=${encodeURIComponent(matchesError.message)}`);

  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) redirect(`/admin/hraci?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/hraci");
  revalidatePath("/hraci");
  revalidatePath("/zebricek");
  revalidatePath("/");
  redirect("/admin/hraci");
}
