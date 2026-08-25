// components/charts/TimeSeries.tsx
// A time series that refuses to lie about gaps.
//   · No line is drawn across an interval with no observation — the blind span
//     gets a hatched band and a count.
//   · Provenance is texture, not colour: optical solid, fused dashed,
//     radar dash-dot, reconstructed dotted. It is the same quantity at a
//     different confidence, so a colour change would imply a different
//     measurement. Colour is reserved for magnitude and for series identity.
//   · Markers only on directly observed points. A dot asserts "we saw this".

import {
  AxisLabel,
  ChartFrame,
  GapPattern,
  LegendSwatch,
  niceTicks,
  palette,
  scaleLinear,
} from "./primitives";

export type Provenance = "optical" | "fused" | "radar" | "reconstructed";

const dashFor: Record<Provenance, string | undefined> = {
  optical: undefined,
  fused: "7 4",
  radar: "9 3 2 3",
  reconstructed: "2 3",
};

export interface SeriesPoint {
  /** Position on the x axis (interval index, day-after-sowing, week, …) */
  x: number;
  /** null = not observed. The line breaks here; it is never interpolated across. */
  y: number | null;
  source?: Provenance;
  /** Optional uncertainty band around y */
  lo?: number;
  hi?: number;
  tip?: string;
}

export interface Series {
  name: string;
  color: string;
  points: SeriesPoint[];
  /** Draw the lo/hi envelope as a filled band */
  band?: boolean;
  /** Force one texture for the whole series, ignoring per-point provenance */
  dash?: string;
}

interface Props {
  series: Series[];
  yLabel: string;
  xLabel: string;
  /** Tick label per x position, e.g. interval dates */
  xTicks?: { x: number; label: string }[];
  yDomain?: [number, number];
  /** Shaded, named phases along the x axis, e.g. growth stages */
  phases?: { from: number; to: number; label: string }[];
  /** Vertical event markers, e.g. sowing / harvest */
  events?: { x: number; label: string; color?: string }[];
  height?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  representative?: boolean;
  showProvenanceLegend?: boolean;
}

export default function TimeSeries({
  series,
  yLabel,
  xLabel,
  xTicks,
  yDomain,
  phases,
  events,
  height = 260,
  title,
  subtitle,
  caption,
  representative,
  showProvenanceLegend,
}: Props) {
  const W = 760;
  const H = height;
  const m = { top: 16, right: 18, bottom: 42, left: 52 };
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;

  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);

  const numeric = series.flatMap((s) =>
    s.points.flatMap((p) =>
      [p.y, p.lo, p.hi].filter((v): v is number => typeof v === "number")
    )
  );
  const yMin = yDomain ? yDomain[0] : Math.min(0, ...numeric);
  const yMax = yDomain ? yDomain[1] : Math.max(...numeric) * 1.08;

  const sx = scaleLinear([xMin, xMax], [m.left, m.left + iw]);
  const sy = scaleLinear([yMin, yMax], [m.top + ih, m.top]);
  const yTicks = niceTicks(yMin, yMax, 5);

  // Contiguous runs of unobserved points, taken from the first series only —
  // the gap structure is a property of the acquisition record, not of a series.
  const gapRuns: { from: number; to: number; n: number }[] = [];
  const base = series[0]?.points ?? [];
  let run: number[] = [];
  base.forEach((p, i) => {
    if (p.y === null) {
      run.push(p.x);
      if (i === base.length - 1 && run.length)
        gapRuns.push({ from: run[0], to: run[run.length - 1], n: run.length });
    } else if (run.length) {
      gapRuns.push({ from: run[0], to: run[run.length - 1], n: run.length });
      run = [];
    }
  });

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      legend={
        <>
          {series.map((s) => (
            <LegendSwatch key={s.name} color={s.color} label={s.name} dash={s.dash} />
          ))}
          {showProvenanceLegend && (
            <>
              <LegendSwatch color={palette.muted} label="optical" />
              <LegendSwatch color={palette.muted} label="fused" dash="7 4" />
              <LegendSwatch color={palette.muted} label="radar" dash="9 3 2 3" />
              <LegendSwatch color={palette.muted} label="reconstructed" dash="2 3" />
            </>
          )}
          {gapRuns.length > 0 && (
            <span className="legend-item">
              <svg width="22" height="12" aria-hidden="true">
                <rect x="1" y="1" width="20" height="10" fill="url(#gap-hatch)" />
              </svg>
              <span>not observed</span>
            </span>
          )}
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={`${title ?? "Time series"}: ${yLabel} against ${xLabel}`}
      >
        <GapPattern />

        {/* growth-stage / phase bands */}
        {phases?.map((ph) => (
          <g key={`${ph.label}-${ph.from}-${ph.to}`}>
            <rect
              x={sx(ph.from)}
              y={m.top}
              width={Math.max(0, sx(ph.to) - sx(ph.from))}
              height={ih}
              fill="rgba(56,182,217,0.045)"
            />
            <line
              x1={sx(ph.from)}
              y1={m.top}
              x2={sx(ph.from)}
              y2={m.top + ih}
              stroke="rgba(43,58,50,0.9)"
              strokeWidth="1"
            />
            <AxisLabel
              x={(sx(ph.from) + sx(ph.to)) / 2}
              y={m.top + 12}
              size={9}
              color="rgba(157,174,164,0.75)"
            >
              {ph.label}
            </AxisLabel>
          </g>
        ))}

        {/* y grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              y1={sy(t)}
              x2={m.left + iw}
              y2={sy(t)}
              stroke={palette.grid}
              strokeWidth="1"
            />
            <AxisLabel x={m.left - 8} y={sy(t) + 3.5} anchor="end">
              {t}
            </AxisLabel>
          </g>
        ))}

        {/* unobserved spans */}
        {gapRuns.map((g) => {
          const half =
            base.length > 1 ? (sx(base[1].x) - sx(base[0].x)) / 2 : 6;
          const x0 = sx(g.from) - half;
          const x1 = sx(g.to) + half;
          return (
            <g key={`${g.from}-${g.to}`}>
              <rect
                x={x0}
                y={m.top}
                width={Math.max(3, x1 - x0)}
                height={ih}
                fill="url(#gap-hatch)"
              />
              <AxisLabel x={(x0 + x1) / 2} y={m.top + ih - 8} size={9} color={palette.muted}>
                {g.n === 1 ? "1 gap" : `${g.n} gaps`}
              </AxisLabel>
            </g>
          );
        })}

        {/* uncertainty bands */}
        {series
          .filter((s) => s.band)
          .map((s) => {
            const pts = s.points.filter(
              (p) => typeof p.lo === "number" && typeof p.hi === "number"
            );
            if (pts.length < 2) return null;
            const top = pts.map((p) => `${sx(p.x)},${sy(p.hi as number)}`);
            const bot = pts
              .slice()
              .reverse()
              .map((p) => `${sx(p.x)},${sy(p.lo as number)}`);
            return (
              <polygon
                key={`${s.name}-band`}
                points={[...top, ...bot].join(" ")}
                fill={s.color}
                opacity="0.14"
              />
            );
          })}

        {/* series lines — one path per contiguous observed run, per texture */}
        {series.map((s) => {
          const segs: { d: string; dash?: string }[] = [];
          let cur: SeriesPoint[] = [];
          const flush = () => {
            if (cur.length >= 2) {
              // split further by provenance so texture changes mid-run
              let sub: SeriesPoint[] = [cur[0]];
              for (let i = 1; i < cur.length; i++) {
                const prev = cur[i - 1].source ?? "optical";
                const now = cur[i].source ?? "optical";
                sub.push(cur[i]);
                if (now !== prev || i === cur.length - 1) {
                  if (sub.length >= 2) {
                    segs.push({
                      d:
                        "M " +
                        sub
                          .map((p) => `${sx(p.x)},${sy(p.y as number)}`)
                          .join(" L "),
                      dash: s.dash ?? dashFor[now],
                    });
                  }
                  sub = [cur[i]];
                }
              }
            } else if (cur.length === 1) {
              segs.push({
                d: `M ${sx(cur[0].x)},${sy(cur[0].y as number)} L ${sx(cur[0].x)},${sy(cur[0].y as number)}`,
                dash: undefined,
              });
            }
            cur = [];
          };
          s.points.forEach((p) => {
            if (p.y === null) flush();
            else cur.push(p);
          });
          flush();

          return (
            <g key={s.name}>
              {segs.map((sg, i) => (
                <path
                  key={i}
                  d={sg.d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.2"
                  strokeDasharray={sg.dash}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {/* markers only where directly observed */}
              {s.points
                .filter((p) => p.y !== null && (p.source ?? "optical") === "optical")
                .map((p) => (
                  <circle
                    key={`${s.name}-${p.x}`}
                    cx={sx(p.x)}
                    cy={sy(p.y as number)}
                    r="3"
                    fill={palette.surface}
                    stroke={s.color}
                    strokeWidth="1.8"
                  >
                    {p.tip && <title>{p.tip}</title>}
                  </circle>
                ))}
            </g>
          );
        })}

        {/* events */}
        {events?.map((e) => (
          <g key={`${e.label}-${e.x}`}>
            <line
              x1={sx(e.x)}
              y1={m.top}
              x2={sx(e.x)}
              y2={m.top + ih}
              stroke={e.color ?? palette.amber}
              strokeWidth="1.4"
              strokeDasharray="4 3"
            />
            <AxisLabel
              x={sx(e.x)}
              y={m.top - 4}
              size={9}
              color={e.color ?? palette.amber}
            >
              {e.label}
            </AxisLabel>
          </g>
        ))}

        {/* axes */}
        <line
          x1={m.left}
          y1={m.top + ih}
          x2={m.left + iw}
          y2={m.top + ih}
          stroke="#2B3A32"
          strokeWidth="1.5"
        />
        {xTicks?.map((t) => (
          <g key={t.x}>
            <line
              x1={sx(t.x)}
              y1={m.top + ih}
              x2={sx(t.x)}
              y2={m.top + ih + 4}
              stroke="#2B3A32"
            />
            <AxisLabel x={sx(t.x)} y={m.top + ih + 16}>
              {t.label}
            </AxisLabel>
          </g>
        ))}
        <AxisLabel x={m.left + iw / 2} y={H - 6} size={10} color={palette.muted}>
          {xLabel}
        </AxisLabel>
        <AxisLabel
          x={14}
          y={m.top + ih / 2}
          size={10}
          color={palette.muted}
          rotate={-90}
        >
          {yLabel}
        </AxisLabel>
      </svg>
    </ChartFrame>
  );
}
