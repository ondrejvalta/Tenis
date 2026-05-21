"use client";

import { useState, type ReactNode } from "react";

export type TabItem = { id: string; label: string };

export function Tabs({
  tabs,
  children,
}: {
  tabs: TabItem[];
  children: ReactNode[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeIdx = Math.max(
    0,
    tabs.findIndex((t) => t.id === active),
  );

  return (
    <div>
      <div
        role="tablist"
        className="mb-6 flex gap-1 border-b border-neutral-200"
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div>{children[activeIdx]}</div>
    </div>
  );
}
