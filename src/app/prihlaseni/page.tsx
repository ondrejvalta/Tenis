import { redirect } from "next/navigation";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Přihlášení – Tenisová liga Dobříš" };

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next = "/admin", error } = await searchParams;

  const user = await getCurrentUser();
  if (user && (await isCurrentUserAdmin())) {
    redirect(next.startsWith("/") ? next : "/admin");
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Přihlášení</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Pro přístup do administrace zadej své přihlašovací údaje.
        </p>
      </div>

      {error === "not_admin" && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Tento účet nemá oprávnění administrátora.
        </p>
      )}

      <LoginForm next={next} />
    </div>
  );
}
