"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  CATEGORY_LABELS,
  GROUPS,
  type Category,
  type Group,
  type Player,
  type SetScore,
} from "@/data/types";
import { categoryHref } from "@/lib/category";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MatchFormState } from "./actions";

// Formát data v lokální časové zóně (YYYY-MM-DD) – nepoužívat toISOString (UTC posun).
function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYmd(value: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return undefined;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Action = (
  state: MatchFormState,
  formData: FormData,
) => Promise<MatchFormState>;

export function MatchForm({
  action,
  category,
  players,
  initial,
  submitLabel,
}: {
  action: Action;
  // Kategorie sekce – zamčená, jen se zobrazí a odešle skrytým polem.
  category: Category;
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

  const [group, setGroup] = useState<Group>(initial?.group ?? "A");
  const [player1Id, setPlayer1Id] = useState<string>(initial?.player1Id ?? "");
  const [player2Id, setPlayer2Id] = useState<string>(initial?.player2Id ?? "");
  const [forfeit, setForfeit] = useState<boolean>(initial?.forfeit ?? false);
  const [forfeitPlayerId, setForfeitPlayerId] = useState<string>(
    initial?.forfeitPlayerId ?? "",
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    initial?.date ? parseYmd(initial.date) : new Date(),
  );
  const [dateOpen, setDateOpen] = useState(false);

  // Vyčistí výběr hráčů (např. po změně skupiny).
  const resetPlayers = () => {
    setPlayer1Id("");
    setPlayer2Id("");
    setForfeitPlayerId("");
  };

  const playersInGroup = useMemo(
    () =>
      players
        .filter((p) => p.category === category && p.group === group)
        .sort((a, b) => a.name.localeCompare(b.name, "cs")),
    [players, category, group],
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
      <input type="hidden" name="category" value={category} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Datum
          </label>
          <input type="hidden" name="date" value={date ? toYmd(date) : ""} />
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4 opacity-60" />
                {date ? dateFormatter.format(date) : "Vyber datum"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setDateOpen(false);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Kategorie
          </label>
          <div className="flex h-9 items-center rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-700">
            {CATEGORY_LABELS[category]}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Skupina
          </label>
          <Select
            name="group"
            value={group}
            onValueChange={(v) => {
              setGroup(v as Group);
              resetPlayers();
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Hráč 1
          </label>
          <Select
            name="player1_id"
            value={player1Id}
            onValueChange={(v) => {
              setPlayer1Id(v);
              if (
                forfeitPlayerId &&
                forfeitPlayerId !== v &&
                forfeitPlayerId !== player2Id
              ) {
                setForfeitPlayerId("");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— vyber —" />
            </SelectTrigger>
            <SelectContent>
              {playersInGroup.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Hráč 2
          </label>
          <Select
            name="player2_id"
            value={player2Id}
            onValueChange={(v) => {
              setPlayer2Id(v);
              if (
                forfeitPlayerId &&
                forfeitPlayerId !== v &&
                forfeitPlayerId !== player1Id
              ) {
                setForfeitPlayerId("");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— vyber —" />
            </SelectTrigger>
            <SelectContent>
              {playersInGroup.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <Input
                  name={`set${i}_p1`}
                  type="number"
                  min={0}
                  defaultValue={s?.p1 ?? 0}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P2 gemy</label>
                <Input
                  name={`set${i}_p2`}
                  type="number"
                  min={0}
                  defaultValue={s?.p2 ?? 0}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P1 TB</label>
                <Input
                  name={`set${i}_tb_p1`}
                  type="number"
                  min={0}
                  defaultValue={s?.tiebreak?.p1 ?? ""}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-500">P2 TB</label>
                <Input
                  name={`set${i}_tb_p2`}
                  type="number"
                  min={0}
                  defaultValue={s?.tiebreak?.p2 ?? ""}
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
                <Input
                  name="set3_p1"
                  type="number"
                  min={0}
                  defaultValue={s?.p1 ?? ""}
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs text-neutral-500">P2 body</label>
                <Input
                  name="set3_p2"
                  type="number"
                  min={0}
                  defaultValue={s?.p2 ?? ""}
                />
              </div>
            </div>
          );
        })()}
      </fieldset>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            name="forfeit"
            checked={forfeit}
            onCheckedChange={(checked) => {
              const next = checked === true;
              setForfeit(next);
              if (!next) setForfeitPlayerId("");
            }}
          />
          Kontumace (vybraný hráč dostane 0 bodů místo 1)
        </label>
        {forfeit && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Kontumovaný hráč
            </label>
            <Select
              name="forfeit_player_id"
              value={forfeitPlayerId}
              onValueChange={setForfeitPlayerId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="— vyber —" />
              </SelectTrigger>
              <SelectContent>
                {player1Id && (
                  <SelectItem value={player1Id}>
                    Hráč 1
                    {playerNameById.get(player1Id)
                      ? ` — ${playerNameById.get(player1Id)}`
                      : ""}
                  </SelectItem>
                )}
                {player2Id && (
                  <SelectItem value={player2Id}>
                    Hráč 2
                    {playerNameById.get(player2Id)
                      ? ` — ${playerNameById.get(player2Id)}`
                      : ""}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {state?.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Ukládám…" : submitLabel}
        </Button>
        <Button asChild variant="outline">
          <Link href={categoryHref("/admin/zapasy", category)}>Zrušit</Link>
        </Button>
      </div>
    </form>
  );
}
