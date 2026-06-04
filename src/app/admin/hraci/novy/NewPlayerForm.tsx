"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GROUPS } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPlayer, type PlayerFormState } from "../actions";

export function NewPlayerForm() {
  const [state, formAction, pending] = useActionState<PlayerFormState, FormData>(
    createPlayer,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Jméno
        </label>
        <Input name="name" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Skupina
        </label>
        <Select name="group" defaultValue="A">
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
          {pending ? "Ukládám…" : "Vytvořit"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/hraci">Zrušit</Link>
        </Button>
      </div>
    </form>
  );
}
