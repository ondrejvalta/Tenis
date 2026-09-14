"use client";

import { useEffect } from "react";
import { setSectionOpen, useCollapse } from "@/lib/collapse-store";

export function CollapsibleSection({
  id,
  title,
  meta,
  defaultOpen = false,
  titleClassName = "",
  children,
}: {
  /** Stabilní identifikátor sekce (klíč do globálního stavu). */
  id: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useCollapse(id, defaultOpen);

  // Když se na sekci odkáže hashem (#id), rozbal ji a odscrolluj k ní.
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    setSectionOpen(id, true);
    // Scroll až po rozbalení (překreslení), aby doskrolloval na správné místo.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      ),
    );
  }, [id]);

  return (
    <details
      id={id}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="group scroll-mt-4 rounded-lg border border-neutral-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 text-neutral-400 transition-transform group-open:rotate-90"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4 2l4 4-4 4V2z" />
          </svg>
          <span className={`font-semibold text-neutral-700 ${titleClassName}`}>
            {title}
          </span>
        </span>
        {meta != null && (
          <span className="text-xs text-neutral-500">{meta}</span>
        )}
      </summary>
      {children}
    </details>
  );
}
