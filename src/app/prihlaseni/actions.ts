"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string } | undefined;

export type ResetRequestState =
  | { error?: string; success?: boolean }
  | undefined;

export type NewPasswordState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Vyplň email i heslo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Nesprávný email nebo heslo." };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordResetAction(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Vyplň email." };
  }

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/potvrzeni?next=/prihlaseni/nove-heslo`,
  });

  if (error) {
    return { error: "Email se nepodařilo odeslat. Zkus to prosím znovu." };
  }

  // Z bezpečnostních důvodů vždy hlásíme úspěch, ať už účet existuje, nebo ne.
  return { success: true };
}

export async function updatePasswordAction(
  _prev: NewPasswordState,
  formData: FormData,
): Promise<NewPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Heslo musí mít alespoň 8 znaků." };
  }
  if (password !== confirm) {
    return { error: "Hesla se neshodují." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Platnost odkazu vypršela. Požádej prosím o nový odkaz.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Heslo se nepodařilo změnit. Zkus to prosím znovu." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}
