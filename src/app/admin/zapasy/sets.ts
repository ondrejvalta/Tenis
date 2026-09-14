// Sdílené parsování setů z formuláře – používá skupinový zápas i pavouk.

export type ParsedSet = {
  set_number: number;
  p1_games: number;
  p2_games: number;
  tiebreak_p1: number | null;
  tiebreak_p2: number | null;
  super_tiebreak: boolean;
};

export function parseInt0(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function parseIntNullable(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

export type ParsedSets = {
  sets: ParsedSet[];
  p1SetsWon: number;
  p2SetsWon: number;
};

/**
 * Přečte sety 1–3 z formuláře (pole `set{i}_p1`, `set{i}_p2`, `set{i}_tb_p1`,
 * `set{i}_tb_p2`; set 3 je super tiebreak). Když `requireFirstTwo`, jsou sety 1 a 2
 * povinné. Vrací seřazené sety a počet vyhraných setů, nebo chybu.
 */
export function parseSets(
  formData: FormData,
  opts: { requireFirstTwo: boolean },
): ParsedSets | { error: string } {
  const sets: ParsedSet[] = [];
  let p1SetsWon = 0;
  let p2SetsWon = 0;

  for (let i = 1; i <= 3; i++) {
    const p1 = parseInt0(formData.get(`set${i}_p1`));
    const p2 = parseInt0(formData.get(`set${i}_p2`));
    const isSuper = i === 3;
    const tbp1 = isSuper
      ? null
      : parseIntNullable(formData.get(`set${i}_tb_p1`));
    const tbp2 = isSuper
      ? null
      : parseIntNullable(formData.get(`set${i}_tb_p2`));

    const filled = p1 > 0 || p2 > 0;
    if (!filled) {
      if (i <= 2 && opts.requireFirstTwo)
        return { error: `Sety 1 a 2 jsou povinné.` };
      continue;
    }
    if (p1 === p2)
      return { error: `Set ${i}: skóre nemůže být rovné (${p1}:${p2}).` };

    sets.push({
      set_number: i,
      p1_games: p1,
      p2_games: p2,
      tiebreak_p1: tbp1,
      tiebreak_p2: tbp2,
      super_tiebreak: isSuper,
    });
    if (p1 > p2) p1SetsWon++;
    else p2SetsWon++;
  }

  return { sets, p1SetsWon, p2SetsWon };
}
