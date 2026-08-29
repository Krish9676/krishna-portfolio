// components/charts/SmallMultiples.tsx
// SparkGrid — many series against one shared baseline, on one shared y scale.
//
// This is the form for the question "which of these is behaving differently",
// which is what regional monitoring and multi-field triage actually ask. A
// single chart with twenty lines answers it badly; twenty small panels on the
// same scale answer it at a glance.
//
// Three rules make it honest:
//   · One y domain for every panel. Per-panel autoscaling makes a flat series
//     look dramatic and is the most common way a small-multiples grid lies.
//   · The baseline is drawn in every panel, so each panel is a comparison
//     rather than a shape.
//   · A null breaks the line, exactly as it does in the main time series. A
//     panel with no observations shows as empty, not as a straight line.

import { ChartFrame, LegendSwatch, palette, scaleLinear } from "./primitives";

export interface SparkCell {
  label: string;
  /** null = not observed */
  values: (number | null)[];
  /** Short status chip, e.g. "-18% vs normal" */
  flag?: string;
  color?: string;
  /** Marks the panel worth looking at first */
  emphasis?: boolean;
}

export function SparkGrid({
  cells,
  baseline,
  yDomain,
  columns = 4,
  seriesLabel = "current",
  baselineLabel = "own prior-season normal",
  cellW = 156,
  cellH = 72,
  title,
  subtitle,
  caption,
  note,
  representative,
}: {
  cells: SparkCell[];
  /** Shared reference curve drawn behind every panel */
  baseline?: number[];
  yDomain: [number, number];
  columns?: number;
  seriesLabel?: string;
  baselineLabel?: string;
  cellW?: number;
  cellH?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
}) {
  const labelH = 17;
  const padX = 12;
  const padY = 10;
  const rows = Math.ceil(cells.length / columns);
  const panelH = cellH + labelH + padY;
  const W = columns * cellW + padX;
  const H = rows * panelH + padY;

  const n = Math.max(
    baseline?.length ?? 0,
    ...cells.map((c) => c.values.length)
  );

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={Math.max(420, W)}
      legend={
        <>
          <LegendSwatch color={palette.green} label={seriesLabel} />
          {baseline && (
            <LegendSwatch color={palette.muted} label={baselineLabel} dash="4 3" />
          )}
          <span className="legend-item">
            <span style={{ color: palette.faint }}>
              one shared y scale — {yDomain[0]} to {yDomain[1]}
            </span>
          </span>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={title ?? "Small multiples grid"}
      >
        {cells.map((cell, idx) => {
          const col = idx % columns;
          const row = Math.floor(idx / columns);
          const x0 = padX / 2 + col * cellW;
          const y0 = padY / 2 + row * panelH + labelH;
          const iw = cellW - 14;
          const sx = scaleLinear([0, Math.max(1, n - 1)], [x0, x0 + iw]);
          const sy = scaleLinear(yDomain, [y0 + cellH, y0 + 4]);
          const c = cell.color ?? palette.green;

          // One path per contiguous observed run — a gap is a gap.
          const segs: string[] = [];
          let run: string[] = [];
          cell.values.forEach((v, i) => {
            if (v === null) {
              if (run.length >= 2) segs.push("M " + run.join(" L "));
              run = [];
            } else {
              run.push(`${sx(i)},${sy(v)}`);
            }
          });
          if (run.length >= 2) segs.push("M " + run.join(" L "));

          return (
            <g key={cell.label}>
              <rect
                x={x0 - 5}
                y={y0 - 2}
                width={iw + 10}
                height={cellH + 6}
                rx="5"
                fill={cell.emphasis ? "rgba(224,103,76,0.07)" : "rgba(20,28,24,0.42)"}
                stroke={
                  cell.emphasis ? "rgba(224,103,76,0.4)" : "rgba(148,176,158,0.12)"
                }
              />
              <text
                x={x0 - 4}
                y={y0 - 8}
                fontSize="10"
                fill={palette.ink}
                fontFamily="var(--font-mono)"
              >
                {cell.label}
              </text>
              {cell.flag && (
                <text
                  x={x0 + iw + 4}
                  y={y0 - 8}
                  textAnchor="end"
                  fontSize="9"
                  fill={cell.emphasis ? palette.red : palette.faint}
                  fontFamily="var(--font-mono)"
                >
                  {cell.flag}
                </text>
              )}
              {baseline && (
                <path
                  d={
                    "M " +
                    baseline.map((v, i) => `${sx(i)},${sy(v)}`).join(" L ")
                  }
                  fill="none"
                  stroke={palette.muted}
                  strokeWidth="1.3"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />
              )}
              {segs.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={c}
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
