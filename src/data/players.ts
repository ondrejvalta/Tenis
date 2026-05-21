import type { Group, Player } from "./types";

export const players: Player[] = [
  // Skupina 1A
  { id: "p1", name: "Petr Novák", joinedAt: "2026-01-10", group: "1A" },
  { id: "p2", name: "Jan Svoboda", joinedAt: "2026-01-12", group: "1A" },
  { id: "p3", name: "Tomáš Dvořák", joinedAt: "2026-01-15", group: "1A" },
  { id: "p9", name: "Marek Pokorný", joinedAt: "2026-01-20", group: "1A" },
  { id: "p10", name: "Filip Bartoš", joinedAt: "2026-01-22", group: "1A" },
  { id: "p11", name: "Jiří Marek", joinedAt: "2026-01-25", group: "1A" },
  { id: "p12", name: "Roman Růžička", joinedAt: "2026-02-04", group: "1A" },
  { id: "p13", name: "Vojtěch Havel", joinedAt: "2026-02-10", group: "1A" },

  // Skupina 1B
  { id: "p4", name: "Martin Černý", joinedAt: "2026-02-01", group: "1B" },
  { id: "p5", name: "Lukáš Procházka", joinedAt: "2026-02-03", group: "1B" },
  { id: "p6", name: "Pavel Kučera", joinedAt: "2026-02-20", group: "1B" },
  { id: "p14", name: "Adam Šimek", joinedAt: "2026-02-22", group: "1B" },
  { id: "p15", name: "Ondřej Beneš", joinedAt: "2026-02-25", group: "1B" },
  { id: "p16", name: "Štěpán Krejčí", joinedAt: "2026-02-28", group: "1B" },
  { id: "p17", name: "Michal Vaněk", joinedAt: "2026-03-02", group: "1B" },
  { id: "p18", name: "Tomáš Pospíšil", joinedAt: "2026-03-04", group: "1B" },

  // Skupina 2
  { id: "p7", name: "Jakub Veselý", joinedAt: "2026-03-05", group: "2" },
  { id: "p8", name: "David Horák", joinedAt: "2026-03-12", group: "2" },
  { id: "p19", name: "Daniel Mašek", joinedAt: "2026-03-14", group: "2" },
  { id: "p20", name: "Karel Sedlák", joinedAt: "2026-03-17", group: "2" },
  { id: "p21", name: "Václav Kovář", joinedAt: "2026-03-20", group: "2" },
  { id: "p22", name: "Patrik Novotný", joinedAt: "2026-03-23", group: "2" },
  { id: "p23", name: "Radek Hájek", joinedAt: "2026-03-26", group: "2" },
  { id: "p24", name: "Matěj Doležal", joinedAt: "2026-03-29", group: "2" },

  // Skupina 3
  { id: "p25", name: "Aleš Kratochvíl", joinedAt: "2026-04-01", group: "3" },
  { id: "p26", name: "Lubomír Janda", joinedAt: "2026-04-03", group: "3" },
  { id: "p27", name: "Zdeněk Štěpán", joinedAt: "2026-04-05", group: "3" },
  { id: "p28", name: "Miroslav Soukup", joinedAt: "2026-04-07", group: "3" },
  { id: "p29", name: "Jaroslav Fiala", joinedAt: "2026-04-09", group: "3" },
  { id: "p30", name: "Richard Bláha", joinedAt: "2026-04-11", group: "3" },
  { id: "p31", name: "Ivan Polák", joinedAt: "2026-04-13", group: "3" },
  { id: "p32", name: "Stanislav Urban", joinedAt: "2026-04-15", group: "3" },
];

export function getPlayer(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getPlayersByGroup(group: Group): Player[] {
  return players.filter((p) => p.group === group);
}
