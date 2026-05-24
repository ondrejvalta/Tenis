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
    forfeitPlayerId?: string;
    sets: SetScore[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<MatchFormState, FormData>(
    action,
    undefined,
  );

  const [group, setGroup] = useState<Group>(initial?.group ?? "1A");
  const [player1Id, setPlayer1Id] = useState<string>(initial?.player1Id ?? "");
  const [player2Id, setPlayer2Id] = useState<string>(initial?.player2Id ?? "");
  const [forfeit, setForfeit] = useState<boolean>(initial?.forfeit ?? false);
  const [forfeitPlayerId, setForfeitPlayerId] = useState<string>(
    initial?.forfeitPlayerId ?? "",
  );
  const playersInGroup = useMemo(
    () =>
      players
        .filter((p) => p.group === group)
        .sort((a, b) => a.name.localeCompare(b.name, "cs")),
    [players, group],
  );
  const playerNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of players) m.set(p.id, p.name);
    return m;
  }, [players]);

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
            value={player1Id}
            onChange={(e) => {
              setPlayer1Id(e.target.value);
              if (forfeitPlayerId && forfeitPlayerId !== e.target.value && forfeitPlayerId !== player2Id) {
                setForfeitPlayerId("");
              }
            }}
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
            value={player2Id}
            onChange={(e) => {
              setPlayer2Id(e.target.value);
              if (forfeitPlayerId && forfeitPlayerId !== e.target.value && forfeitPlayerId !== player1Id) {
                setForfeitPlayerId("");
              }
            }}
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
          Sety 1 a 2 jsou povinné (kromě kontumace), set 3 (Super TB) jen za
          stavu 1:1. Tiebreak vyplň jen pokud byl.
        </p>
        {[1, 2].map((i) => {
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
            </div>
          );
        })}
        {(() => {
          const s = get(2);
          return (
            <div className="grid grid-cols-12 items-end gap-2 border-t border-neutral-100 pt-3">
              <div className="col-span-3 text-sm text-neutral-500">
                3. Super TB
              </div>
              <div className="col-span-3">
                <label className="block text-xs text-neutral-500">P1 body</label>
                <input
                  name="set3_p1"
                  type="number"
                  min={0}
                  defaultValue={s?.p1 ?? ""}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs text-neutral-500">P2 body</label>
                <input
                  name="set3_p2"
                  type="number"
                  min={0}
                  defaultValue={s?.p2 ?? ""}
                  className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
            </div>
          );
        })()}
      </fieldset>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="forfeit"
            type="checkbox"
            checked={forfeit}
            onChange={(e) => {
              setForfeit(e.target.checked);
              if (!e.target.checked) setForfeitPlayerId("");
            }}
          />
          Kontumace (vybraný hráč dostane 0 bodů místo 1)
        </label>
        {forfeit && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Kontumovaný hráč
            </label>
            <select
              name="forfeit_player_id"
              required={forfeit}
              value={forfeitPlayerId}
              onChange={(e) => setForfeitPlayerId(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">— vyber —</option>
              {player1Id && (
                <option value={player1Id}>
                  Hráč 1{playerNameById.get(player1Id) ? ` — ${playerNameById.get(player1Id)}` : ""}
                </option>
              )}
              {player2Id && (
                <option value={player2Id}>
                  Hráč 2{playerNameById.get(player2Id) ? ` — ${playerNameById.get(player2Id)}` : ""}
                </option>
              )}
            </select>
          </div>
        )}
      </div>

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
