import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = { title: "Zapomenuté heslo – Tenisová liga Dobříš" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Zapomenuté heslo
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Zadej svůj email a pošleme ti odkaz pro nastavení nového hesla.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm">
        <Link
          href="/prihlaseni"
          className="text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          Zpět na přihlášení
        </Link>
      </p>
    </div>
  );
}
