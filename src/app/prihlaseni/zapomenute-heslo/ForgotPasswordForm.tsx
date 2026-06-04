"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  requestPasswordResetAction,
  type ResetRequestState,
} from "../actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(
    requestPasswordResetAction,
    undefined,
  );

  if (state?.success) {
    return (
      <p className="rounded-md border border-lime-200 bg-lime-50 px-3 py-2 text-sm text-lime-800">
        Pokud k zadanému emailu existuje účet, poslali jsme na něj odkaz pro
        nastavení nového hesla. Zkontroluj si schránku.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state?.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Odesílám…" : "Odeslat odkaz"}
      </Button>
    </form>
  );
}
