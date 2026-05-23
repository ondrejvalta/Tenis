"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { GROUPS, type Group, type Player, type SetScore } from "@/data/types";
import type { MatchFormState } from "./actions";

type Action = (
  state: MatchFormState,
  formData: FormData,
) => Promise<MatchFormState>;

export function MatchForm({
  action,
  players,
  initial,
  submitLabel,
}: {
  action: Action;
  players: Player[];
  initial?: {
    date: string;
    group: Group;
    player1Id: string;
    player2Id: string;
    forfeit: boolean;
    sets: SetScore[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<MatchFormState, FormData>(
    action,
    undefined,
  );

  const [group, setGroup] = useState<Group>(initial?.group ?? "1A");
  const playersInGroup = useMemo(
    () =>
      players
        .filter((p) => p.group === group)
        .sort((a, b) => a.name.localeCompare(b.name, "cs")),
    [players, group],
  );

  const initSets: SetScore[] = initial?.sets ?? [
    { p1: 0, p2: 0 },
    { p1: 0, p2: 0 },
  ];
  const get = (i: number): SetScore | undefined => initSets[i];

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Datum
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={
              initial?.date ?? new Date().toISOString().slice(0, 10)
            }
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Skupina
          </label>
          <select
            name="group"
            value={group}
            onChange={(e) => setGroup(e.target.value as Group)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Hráč 1
          </label>
          <select
            name="player1_id"
            required
            defaultValue={initial?.player1Id ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">— vyber —</option>
            {playersInGroup.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Hráč 2
          </label>
          <select
            name="player2_id"
            required
            defaultValue={initial?.player2Id ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">— vyber —</option>
            {playersInGroup.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="space-y-2 rounded-lg border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium text-neutral-700">
          Sety
        </legend>
        <p className="text-xs text-neutral-500">
          Sety 1 a 2 jsou povinné, set 3 jen za stavu 1:1. Tiebreak / super
          tiebreak vyplň jen pokud byl.
        </p>
        {[1, 2, 3].map((i) => {
          const s = get(i - 1);
          return (
            <div
              key={i}
              className="grid grid-cols-12 items-end gap-2 border-t border-neutral-100 pt-3 first:border-t-0 first:pt-0"
            >
              <div className="col-span-1 text-sm text-neutral-500">{i}.</div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P1 gemy</label>
                <input
                  name={`set${i}_p1`}
                  type="number"
                  min={0}
                  defaultValue={s?.p1 ?? 0}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P2 gemy</label>
                <input
                  name={`set${i}_p2`}
                  type="number"
                  min={0}
                  defaultValue={s?.p2 ?? 0}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P1 TB</label>
                <input
                  name={`set${i}_tb_p1`}
                  type="number"
                  min={0}
                  defaultValue={s?.tiebreak?.p1 ?? ""}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P2 TB</label>
                <input
                  name={`set${i}_tb_p2`}
                  type="number"
                  min={0}
                  defaultValue={s?.tiebreak?.p2 ?? ""}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <input
                  id={`set${i}_super`}
                  name={`set${i}_super`}
                  type="checkbox"
                  defaultChecked={s?.superTiebreak ?? false}
                />
                <label htmlFor={`set${i}_super`} className="text-xs text-neutral-600">
                  Super TB
                </label>
              </div>
            </div>
          );
        })}
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="forfeit"
          type="checkbox"
          defaultChecked={initial?.forfeit ?? false}
        />
        Kontumace (poražený dostane 0 bodů místo 1)
      </label>

      {state?.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Ukládám…" : submitLabel}
        </button>
        <Link
          href="/admin/zapasy"
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
