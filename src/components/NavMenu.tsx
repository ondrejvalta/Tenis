"use client";

import { useState } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

export function NavMenu({
  links,
  admin,
  user,
  logoutAction,
}: {
  links: NavLink[];
  admin: boolean;
  user: boolean;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 text-sm md:flex">
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

      {/* Mobile hamburger button */}
      <button
        className="flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Zavřít menu" : "Otevřít menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-neutral-200 bg-white shadow-md md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-neutral-700 hover:bg-neutral-100"
              >
                {l.label}
              </Link>
            ))}
            {admin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 font-medium text-lime-700 hover:bg-lime-50"
              >
                Administrace
              </Link>
            )}
            <div className="mt-1 border-t border-neutral-100 pt-1">
              {user ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-md px-3 py-2.5 text-left text-neutral-500 hover:bg-neutral-100"
                  >
                    Odhlásit
                  </button>
                </form>
              ) : (
                <Link
                  href="/prihlaseni"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-neutral-500 hover:bg-neutral-100"
                >
                  Přihlásit
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
