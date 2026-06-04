import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { NewPasswordForm } from "./NewPasswordForm";

export const metadata = { title: "Nové heslo – Tenisová liga Dobříš" };

export default async function NewPasswordPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nové heslo</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Zadej nové heslo pro svůj účet.
        </p>
      </div>

      {user ? (
        <NewPasswordForm />
      ) : (
        <div className="space-y-4">
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Odkaz pro obnovu hesla je neplatný nebo jeho platnost vypršela.
          </p>
          <p className="text-center text-sm">
            <Link
              href="/prihlaseni/zapomenute-heslo"
              className="text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              Požádat o nový odkaz
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
