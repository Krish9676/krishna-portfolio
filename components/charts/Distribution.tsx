// components/charts/Distribution.tsx
// RankCurve — a rank-frequency curve, the honest way to show a long tail.
//
// A long-tailed label space is the binding constraint on every wide classifier
// in this portfolio, and a bar chart of five grouped categories hides it
// completely: the grouped bars look balanced while the classes inside them span
// three orders of magnitude. Plotting every class against its rank on a log
// axis is the only form where the tail is visible as a tail.
//
// The log axis is the point, so it is labelled as one and the decade gridlines
// are drawn. A trainable-threshold line turns the curve into a count: how many
// classes sit below the level at which training is worth attempting.

import { AxisLabel, ChartFrame, LegendSwatch, palette, scaleLinear } from "./primitives";

export interface RankSeries {
  name: string;
  color: string;
  /** One value per class, highest first */
  values: number[];
  dash?: string;
}

export function RankCurve({
  series,
  xLabel,
  yLabel,
  threshold,
  domainMax,
  domainMin = 1,
  height = 300,
  regions,
  title,
  subtitle,
  caption,
  note,
  representative,
}: {
  series: RankSeries[];
  xLabel: string;
  yLabel: string;
  /** Horizontal line with a count of what falls below it, per series */
  threshold?: { at: number; label: string; countLabel?: string };
  domainMax?: number;
  domainMin?: number;
  height?: number;
  /** Named spans along the rank axis, e.g. head / mid / tail */
  regions?: { from: number; to: number; label: string }[];
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
}) {
  const W = 700;
  const H = height;
  const m = { top: 18, right: 24, bottom: 46, left: 62 };
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;

  const n = Math.max(...series.map((s) => s.values.length));
  const hi = domainMax ?? Math.max(...series.flatMap((s) => s.values)) * 1.3;

  const sx = scaleLinear([0, Math.max(1, n - 1)], [m.left, m.left + iw]);
  // Log scale, clamped at domainMin so a zero-count class still has a position.
  const lg = (v: number) => Math.log10(Math.max(domainMin, v));
  const sy = scaleLinear([lg(domainMin), lg(hi)], [m.top + ih, m.top]);

  // Only decades that actually fall inside the domain: a gridline for 10^4 on a
  // domain topping out at 4,000 lands above the plot area and drags its label
  // outside the viewBox, where it is silently clipped.
  const decades: number[] = [];
  for (let d = Math.floor(lg(domainMin)); d <= Math.ceil(lg(hi)); d++) {
    const v = Math.pow(10, d);
    if (v >= domainMin && v <= hi) decades.push(v);
  }

  const belowCount = (vals: number[]) =>
    threshold ? vals.filter((v) => v < threshold.at).length : 0;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      legend={
        <>
          {series.map((s) => (
            <LegendSwatch key={s.name} color={s.color} label={s.name} dash={s.dash} />
          ))}
          {threshold && (
            <LegendSwatch color={palette.red} label={threshold.label} dash="6 4" />
          )}
          <span className="legend-item">
            <span style={{ color: palette.faint }}>log scale — each gridline is 10x</span>
          </span>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={`${title ?? "Rank curve"}: ${yLabel} against ${xLabel}`}
      >
        {/* head / mid / tail spans */}
        {regions?.map((rg, i) => (
          <g key={rg.label}>
            <rect
              x={sx(rg.from)}
              y={m.top}
              width={Math.max(0, sx(rg.to) - sx(rg.from))}
              height={ih}
              fill={i % 2 === 0 ? "rgba(56,182,217,0.045)" : "rgba(74,222,128,0.04)"}
            />
            <line
              x1={sx(rg.from)}
              y1={m.top}
              x2={sx(rg.from)}
              y2={m.top + ih}
              stroke="rgba(43,58,50,0.9)"
            />
            <AxisLabel
              x={(sx(rg.from) + sx(rg.to)) / 2}
              y={m.top + 13}
              size={9}
              color="rgba(157,174,164,0.8)"
            >
              {rg.label}
            </AxisLabel>
          </g>
        ))}

        {decades.map((d) => (
          <g key={d}>
            <line
              x1={m.left}
              y1={sy(lg(d))}
              x2={m.left + iw}
              y2={sy(lg(d))}
              stroke={palette.grid}
            />
            <AxisLabel x={m.left - 8} y={sy(lg(d)) + 3.5} anchor="end">
              {d >= 1000 ? `${d / 1000}k` : d}
            </AxisLabel>
          </g>
        ))}

        {threshold && (
          <>
            <rect
              x={m.left}
              y={sy(lg(threshold.at))}
              width={iw}
              height={Math.max(0, m.top + ih - sy(lg(threshold.at)))}
              fill="rgba(224,103,76,0.07)"
            />
            <line
              x1={m.left}
              y1={sy(lg(threshold.at))}
              x2={m.left + iw}
              y2={sy(lg(threshold.at))}
              stroke={palette.red}
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </>
        )}

        {series.map((s) => {
          const d =
            "M " +
            s.values
              .map((v, i) => `${sx(i)},${sy(lg(v))}`)
              .join(" L ");
          return (
            <g key={s.name}>
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth="2.2"
                strokeDasharray={s.dash}
                strokeLinejoin="round"
              />
              {threshold && (
                <AxisLabel
                  x={m.left + iw - 6}
                  y={sy(lg(s.values[s.values.length - 1])) - 8}
                  anchor="end"
                  size={9.5}
                  color={s.color}
                >
                  {`${belowCount(s.values)} ${
                    threshold.countLabel ?? "classes below the line"
                  }`}
                </AxisLabel>
              )}
            </g>
          );
        })}

        <line
          x1={m.left}
          y1={m.top + ih}
          x2={m.left + iw}
          y2={m.top + ih}
          stroke="#2B3A32"
          strokeWidth="1.5"
        />
        {[0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1].map(
          (r) => (
            <g key={r}>
              <line
                x1={sx(r)}
                y1={m.top + ih}
                x2={sx(r)}
                y2={m.top + ih + 4}
                stroke="#2B3A32"
              />
              <AxisLabel x={sx(r)} y={m.top + ih + 16}>
                {r + 1}
              </AxisLabel>
            </g>
          )
        )}
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
