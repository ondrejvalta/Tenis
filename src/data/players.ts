import type { Player } from "./types";

export const players: Player[] = [
  { id: "p1", name: "Petr Novák", joinedAt: "2026-01-10" },
  { id: "p2", name: "Jan Svoboda", joinedAt: "2026-01-12" },
  { id: "p3", name: "Tomáš Dvořák", joinedAt: "2026-01-15" },
  { id: "p4", name: "Martin Černý", joinedAt: "2026-02-01" },
  { id: "p5", name: "Lukáš Procházka", joinedAt: "2026-02-03" },
  { id: "p6", name: "Pavel Kučera", joinedAt: "2026-02-20" },
  { id: "p7", name: "Jakub Veselý", joinedAt: "2026-03-05" },
  { id: "p8", name: "David Horák", joinedAt: "2026-03-12" },
];

export function getPlayer(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}
