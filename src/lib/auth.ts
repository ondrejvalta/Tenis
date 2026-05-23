import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const isCurrentUserAdmin = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data !== null;
});

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/prihlaseni?next=/admin");
  }
  const admin = await isCurrentUserAdmin();
  if (!admin) {
    redirect("/prihlaseni?error=not_admin");
  }
  return user;
}
