"use client";

import { useSyncExternalStore } from "react";

/**
 * Globální stav sbalených / rozbalených sekcí, sdílený napříč stránkami
 * a uložený do localStorage. Klíčem je stabilní `id` sekce.
 */
const STORAGE_KEY = "section-collapse-state";

type CollapseMap = Record<string, boolean>;

let state: CollapseMap = {};
let loaded = false;
const listeners = new Set<() => void>();

/** Jednorázově načte uložený stav z localStorage (jen na klientu). */
function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw) as CollapseMap;
  } catch {
    // localStorage nedostupný / poškozený – zůstáváme na výchozích hodnotách
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Uloží stav sekce a upozorní odběratele. */
export function setSectionOpen(id: string, open: boolean) {
  ensureLoaded();
  if (state[id] === open) return;
  state = { ...state, [id]: open };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage nedostupný – změnu neuložíme, ale in-memory stav platí
  }
  for (const listener of listeners) listener();
}

/**
 * Hook pro jednu kolapsovatelnou sekci. Vrací aktuální stav (sbaleno /
 * rozbaleno) a setter, který se ukládá do globálního stavu i localStorage.
 *
 * Během SSR i prvního (hydratačního) renderu vrací `defaultOpen`, takže
 * nevzniká rozdíl mezi serverem a klientem.
 */
export function useCollapse(id: string, defaultOpen: boolean) {
  const open = useSyncExternalStore(
    subscribe,
    () => {
      ensureLoaded();
      return id in state ? state[id] : defaultOpen;
    },
    () => defaultOpen,
  );

  return {
    open,
    setOpen: (value: boolean) => setSectionOpen(id, value),
  };
}
