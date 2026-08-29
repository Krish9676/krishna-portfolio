// lib/content/curves.ts — deterministic curve helpers shared by project pages.
//
// Long series are written as a small number of named anchor points rather than
// as hundreds of literals, for two reasons. The shape stays inspectable in the
// source, and the same distribution can be referenced from more than one
// project page without the two drifting apart — the label-space curve on the
// classifier page and the before/after curve on the data-collection page are
// describing the same thing and have to agree.
//
// Everything here is a pure function of its arguments. No randomness, so server
// and client render identically and a figure does not change between visits.

/**
 * A series of `n` values passing through the given [rank, value] anchors,
 * interpolated geometrically between them.
 *
 * Log-space interpolation rather than linear: these curves are read on a log
 * axis, and linear interpolation between two anchors an order of magnitude
 * apart draws a visible kink that is an artefact of the interpolation rather
 * than a property of the distribution.
 */
export function throughAnchors(
  anchors: [number, number][],
  n = 300
): number[] {
  const sorted = [...anchors].sort((a, b) => a[0] - b[0]);
  return Array.from({ length: n }, (_, i) => {
    const r = i + 1;
    if (r <= sorted[0][0]) return sorted[0][1];
    const last = sorted[sorted.length - 1];
    if (r >= last[0]) return last[1];

    let a = sorted[0];
    let b = last;
    for (let k = 0; k < sorted.length - 1; k++) {
      if (r >= sorted[k][0] && r <= sorted[k + 1][0]) {
        a = sorted[k];
        b = sorted[k + 1];
        break;
      }
    }
    const t =
      (Math.log(r) - Math.log(a[0])) / (Math.log(b[0]) - Math.log(a[0]));
    return Math.max(
      1,
      Math.round(Math.exp(Math.log(a[1]) + t * (Math.log(b[1]) - Math.log(a[1]))))
    );
  });
}

/**
 * One subject's season written as a deterministic departure from a shared
 * baseline curve. Small-multiples grids are only honest if every panel is on
 * the same scale and derived the same way; drawing a dozen panels freehand
 * invites exactly the inconsistency the form exists to expose.
 *
 * `gain` scales the whole season, `lateBy` shifts it right in observation
 * steps, `fadeFrom`/`fadeRate` bleed it away from a given step onward, and
 * `gaps` are indices with no usable observation — returned as null so the line
 * breaks there rather than being drawn through.
 */
export function departureCurve(
  baseline: number[],
  opts: {
    gain?: number;
    lateBy?: number;
    fadeFrom?: number;
    fadeRate?: number;
    gaps?: number[];
  } = {}
): (number | null)[] {
  const { gain = 1, lateBy = 0, fadeFrom = Infinity, fadeRate = 0, gaps = [] } =
    opts;
  const last = baseline[baseline.length - 1];
  return baseline.map((_, i) => {
    if (gaps.includes(i)) return null;
    const src = i - lateBy;
    const base = (src < 0 ? baseline[0] * 0.72 : baseline[src] ?? last) * gain;
    const fade = i > fadeFrom ? Math.pow(1 - fadeRate, i - fadeFrom) : 1;
    return Math.round(base * fade * 1000) / 1000;
  });
}

/**
 * The label distribution of the 300-class pest and disease problem, as it
 * arrives from manual assembly. Referenced by the classifier page (as the
 * constraint) and the data-collection page (as the before curve).
 */
export const labelSpaceBefore = throughAnchors([
  [1, 2600],
  [10, 1400],
  [30, 900],
  [60, 430],
  [100, 210],
  [150, 90],
  [220, 28],
  [300, 6],
]);

/** The same 300 classes after automated collection and filtering. */
export const labelSpaceAfter = throughAnchors([
  [1, 2900],
  [10, 1600],
  [30, 1050],
  [60, 700],
  [100, 560],
  [150, 460],
  [220, 380],
  [300, 270],
]);

/** The level below which a class is not worth training on its own. */
export const trainableFloor = 150;
