import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const adminLinks = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/hraci", label: "Hráči" },
  { href: "/admin/zapasy", label: "Zápasy" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <nav className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-sm">
        {adminLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
