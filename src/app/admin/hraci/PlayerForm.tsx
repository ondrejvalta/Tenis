"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CATEGORY_LABELS, GROUPS, type Category, type Group } from "@/data/types";
import { categoryHref } from "@/lib/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlayerFormState } from "./actions";

type Action = (
  state: PlayerFormState,
  formData: FormData,
) => Promise<PlayerFormState>;

export function PlayerForm({
  action,
  category,
  initial,
  submitLabel,
}: {
  action: Action;
  // Kategorie sekce – zamčená, jen se zobrazí a odešle skrytým polem.
  category: Category;
  initial?: { name: string; group: Group };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<PlayerFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="category" value={category} />
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Kategorie
        </label>
        <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          {CATEGORY_LABELS[category]}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Jméno
        </label>
        <Input name="name" required defaultValue={initial?.name ?? ""} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Skupina
        </label>
        <Select name="group" defaultValue={initial?.group ?? "A"}>
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
          <Link href={categoryHref("/admin/hraci", category)}>Zrušit</Link>
        </Button>
      </div>
    </form>
  );
}
