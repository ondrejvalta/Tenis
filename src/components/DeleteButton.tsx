"use client";

import { useRef } from "react";

export function DeleteButton({
  action,
  id,
  label = "Smazat",
  confirm: confirmMsg = "Opravdu chceš smazat tento záznam?",
}: {
  action: (data: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirm?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMsg)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md border border-red-200 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  );
}
