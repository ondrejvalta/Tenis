"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label = "Zpět" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-sm text-neutral-500 hover:underline"
    >
      <span aria-label={label}>←</span> {label}
    </button>
  );
}
