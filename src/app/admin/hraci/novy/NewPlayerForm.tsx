"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GROUPS } from "@/data/types";
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
        <input
          name="name"
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-lime-600 focus:outline-none focus:ring-1 focus:ring-lime-600"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Skupina
        </label>
        <select
          name="group"
          defaultValue="3"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
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
          {pending ? "Ukládám…" : "Vytvořit"}
        </button>
        <Link
          href="/admin/hraci"
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
