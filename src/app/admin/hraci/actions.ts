"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import type { Database } from "@/lib/supabase/database.types";

type Group = Database["public"]["Enums"]["league_group"];
const VALID_GROUPS: Group[] = ["1A", "1B", "2", "3"];

export type PlayerFormState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const group = String(formData.get("group") ?? "") as Group;
  const joinedAt = String(formData.get("joined_at") ?? "").trim();

  if (!name) return { error: "Jméno je povinné." } as const;
  if (!VALID_GROUPS.includes(group)) return { error: "Neplatná skupina." } as const;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(joinedAt))
    return { error: "Datum vstupu do ligy je povinné." } as const;

  return { name, group, joinedAt } as const;
}

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
  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const id = await pickFreeId(slugify(parsed.name));
  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({
    id,
    name: parsed.name,
    group: parsed.group,
    joined_at: parsed.joinedAt,
  });
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
  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({
      name: parsed.name,
      group: parsed.group,
      joined_at: parsed.joinedAt,
    })
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
  const { count } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true })
    .or(`player1_id.eq.${id},player2_id.eq.${id}`);
  if ((count ?? 0) > 0) {
    redirect("/admin/hraci?error=has_matches");
  }

  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) redirect(`/admin/hraci?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/hraci");
  revalidatePath("/hraci");
  revalidatePath("/zebricek");
  revalidatePath("/");
  redirect("/admin/hraci");
}
