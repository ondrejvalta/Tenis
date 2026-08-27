"use client";

import { useCollapse } from "@/lib/collapse-store";

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

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="group rounded-lg border border-neutral-200 bg-white"
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
