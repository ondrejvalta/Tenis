"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categoryHref } from "@/lib/category";
import { CATEGORIES, CATEGORY_LABELS } from "@/data/types";

export type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "menu"; label: string; basePath: string };

// Odkazy na kategorie (Dospělí / Děti) pro danou sekci.
function categoryLinks(basePath: string) {
  return CATEGORIES.map((category) => ({
    href: categoryHref(basePath, category),
    label: CATEGORY_LABELS[category],
  }));
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform ${className}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M2 4l4 4 4-4H2z" />
    </svg>
  );
}

export function NavMenu({
  links,
  admin,
  user,
  logoutAction,
}: {
  links: NavItem[];
  admin: boolean;
  user: boolean;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  // basePath právě otevřeného desktop dropdownu, nebo null.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  // Zavření dropdownu po kliknutí mimo nebo klávesou Escape.
  useEffect(() => {
    if (!openDropdown) return;
    function onPointerDown(e: PointerEvent) {
      if (!desktopNavRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdown]);

  return (
    <>
      {/* Desktop nav */}
      <nav ref={desktopNavRef} className="hidden items-center gap-1 text-sm md:flex">
        {links.map((item) =>
          item.type === "link" ? (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ) : (
            <div key={item.basePath} className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((cur) =>
                    cur === item.basePath ? null : item.basePath,
                  )
                }
                aria-haspopup="menu"
                aria-expanded={openDropdown === item.basePath}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 ${
                  openDropdown === item.basePath ? "bg-neutral-100" : ""
                }`}
              >
                {item.label}
                <Chevron
                  className={`text-neutral-400 ${
                    openDropdown === item.basePath ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === item.basePath && (
                <div className="absolute left-0 top-full z-50 min-w-40 pt-1">
                  <div className="overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-md">
                    {categoryLinks(item.basePath).map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
        )}
        {admin && (
          <Link
            href="/admin"
            className="rounded-md px-3 py-1.5 font-medium text-lime-700 hover:bg-lime-50"
          >
            Administrace
          </Link>
        )}
        {user ? (
          <form action={logoutAction} onSubmit={(e) => { if (!window.confirm("Opravdu se chceš odhlásit?")) e.preventDefault(); }}>
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
            {links.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-neutral-700 hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.basePath}>
                  <div className="px-3 pb-1 pt-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {item.label}
                  </div>
                  {categoryLinks(item.basePath).map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 pl-6 text-neutral-700 hover:bg-neutral-100"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ),
            )}
            {admin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-md px-3 py-2.5 font-medium text-lime-700 hover:bg-lime-50"
              >
                Administrace
              </Link>
            )}
            <div className="mt-1 border-t border-neutral-100 pt-1">
              {user ? (
                <form action={logoutAction} onSubmit={(e) => { if (!window.confirm("Opravdu se chceš odhlásit?")) e.preventDefault(); }}>
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
