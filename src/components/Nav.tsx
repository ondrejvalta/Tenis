import Link from "next/link";
import Image from "next/image";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/prihlaseni/actions";
import { NavMenu } from "./NavMenu";

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
    <header className="relative border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Image src="/logo_tenis_dobris.png" alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          ATL Dobříš
        </Link>
        <NavMenu links={links} admin={admin} user={!!user} logoutAction={logoutAction} />
      </div>
    </header>
  );
}
