import type { Match } from "@/data/types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function formatScore(match: Match, fromPlayer1Perspective = true): string {
  return match.sets
    .map((s) => {
      const a = fromPlayer1Perspective ? s.p1 : s.p2;
      const b = fromPlayer1Perspective ? s.p2 : s.p1;
      const tb = s.tiebreak
        ? ` (${fromPlayer1Perspective ? s.tiebreak.p1 : s.tiebreak.p2}-${
            fromPlayer1Perspective ? s.tiebreak.p2 : s.tiebreak.p1
          })`
        : "";
      return `${a}:${b}${tb}`;
    })
    .join(", ");
}
