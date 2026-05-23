import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/prihlaseni/actions";

const links = [
  { href: "/", label: "Přehled" },
  { href: "/zebricek", label: "Žebříček" },
  { href: "/zapasy", label: "Zápasy" },
  { href: "/hraci", label: "Hráči" },
  { href: "/pravidla", label: "Pravidla" },
];

export async function Nav() {
  const user = await getCurrentUser();
  const admin = user ? await isCurrentUserAdmin() : false;

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Image src="/logo_tenis_dobris.png" alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          Tenisová liga Dobříš
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
          {admin && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-1.5 font-medium text-lime-700 hover:bg-lime-50"
            >
              Administrace
            </Link>
          )}
          {user ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                Odhlásit
              </button>
            </form>
          ) : (
            <Link
              href="/prihlaseni"
              className="rounded-md px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            >
              Přihlásit
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
