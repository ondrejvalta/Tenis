import Link from "next/link";

const links = [
  { href: "/", label: "Přehled" },
  { href: "/zebricek", label: "Žebříček" },
  { href: "/hraci", label: "Hráči" },
  { href: "/zapasy", label: "Zápasy" },
];

export function Nav() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-block h-3 w-3 rounded-full bg-lime-500" />
          Tenisová liga Dobříš
        </Link>
        <nav className="flex gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
