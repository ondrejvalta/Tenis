"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  BRACKET_ROUNDS,
  BRACKET_ROUND_LABELS,
  BRACKET_ROUND_SIZE,
  type BracketRound,
  type Player,
  type SetScore,
} from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import type { BracketMatchFormState } from "./actions";

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

// Sentinel pro „prázdné" okýnko (Radix Select nepovoluje prázdnou hodnotu).
const NONE = "__none__";

// Popisky okýnek pro dané kolo (číslovaná od 1 shora dolů).
function positionOptions(round: BracketRound): { value: string; label: string }[] {
  const size = BRACKET_ROUND_SIZE[round];
  return Array.from({ length: size }, (_, i) => {
    const pos = i + 1;
    return { value: String(pos), label: `Okýnko ${pos}` };
  });
}

type Action = (
  state: BracketMatchFormState,
  formData: FormData,
) => Promise<BracketMatchFormState>;

export function BracketMatchForm({
  action,
  players,
  initial,
  submitLabel,
}: {
  action: Action;
  // Hráči skupin A a B (kategorie Dospělí).
  players: Player[];
  initial?: {
    round: BracketRound;
    position: number;
    player1Id: string | null;
    player2Id: string | null;
    date: string | null;
    sets: SetScore[];
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    BracketMatchFormState,
    FormData
  >(action, undefined);

  const [round, setRound] = useState<BracketRound>(
    initial?.round ?? "osmifinale",
  );
  const [position, setPosition] = useState<string>(
    initial ? String(initial.position) : "1",
  );
  const [player1Id, setPlayer1Id] = useState<string>(
    initial?.player1Id ?? NONE,
  );
  const [player2Id, setPlayer2Id] = useState<string>(
    initial?.player2Id ?? NONE,
  );
  const [date, setDate] = useState<Date | undefined>(() =>
    initial?.date ? parseYmd(initial.date) : new Date(),
  );
  const [dateOpen, setDateOpen] = useState(false);

  const sortedPlayers = useMemo(
    () =>
      players
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "cs")),
    [players],
  );

  const positions = useMemo(() => positionOptions(round), [round]);

  const initSets: SetScore[] = initial?.sets ?? [
    { p1: 0, p2: 0 },
    { p1: 0, p2: 0 },
  ];
  const get = (i: number): SetScore | undefined => initSets[i];

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="hidden"
        name="player1_id"
        value={player1Id === NONE ? "" : player1Id}
      />
      <input
        type="hidden"
        name="player2_id"
        value={player2Id === NONE ? "" : player2Id}
      />
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
            Kolo
          </label>
          <Select
            name="round"
            value={round}
            onValueChange={(v) => {
              setRound(v as BracketRound);
              setPosition("1");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRACKET_ROUNDS.map((r) => (
                <SelectItem key={r} value={r}>
                  {BRACKET_ROUND_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Skupina (okýnko)
          </label>
          <Select name="position" value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {positions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
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
          <Select value={player1Id} onValueChange={setPlayer1Id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— vyber —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— (prázdné) —</SelectItem>
              {sortedPlayers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.group})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Hráč 2
          </label>
          <Select value={player2Id} onValueChange={setPlayer2Id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— vyber —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— (prázdné) —</SelectItem>
              {sortedPlayers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.group})
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
          Sety vyplň jen u odehraných zápasů. Set 3 (Super TB) jen za stavu 1:1.
          Tiebreak vyplň jen pokud byl.
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
          <Link href="/admin/zapasy/pavouk">Zrušit</Link>
        </Button>
      </div>
    </form>
  );
}
