// lib/gridArt.ts
// Field masks written as ASCII so the pixel budget is visible in the source.
// '.' is outside the parcel; a digit is a class value for that 10 m pixel.
// Writing them this way keeps the honest constraint in plain sight: a field
// this size really does only carry this many pixels.

export function parseGrid(rows: string[]): (number | null)[][] {
  return rows.map((r) =>
    r.split("").map((ch) => (ch === "." || ch === " " ? null : Number(ch)))
  );
}

export function gridCount(rows: string[]) {
  const cells = parseGrid(rows).flat();
  const live = cells.filter((v): v is number => v !== null);
  const byClass = new Map<number, number>();
  live.forEach((v) => byClass.set(v, (byClass.get(v) ?? 0) + 1));
  return {
    total: live.length,
    /** hectares, at 0.01 ha per 10 m pixel */
    hectares: Math.round(live.length * 0.01 * 100) / 100,
    pct: (cls: number) =>
      Math.round(((byClass.get(cls) ?? 0) / live.length) * 100),
  };
}
