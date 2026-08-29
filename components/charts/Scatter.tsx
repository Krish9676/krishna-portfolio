// components/charts/Scatter.tsx
// Validation and calibration plots — the form that shows agreement rather than
// asserting it. Two rules the rest of the site's charts also follow:
//   · The 1:1 line is drawn, not implied. A predicted-against-observed panel
//     without it invites the reader to read any rising cloud as agreement.
//   · A tolerance is drawn as a band, because "within 10%" is an area in this
//     space, and drawing it as one stops it from being argued about.
// Error bars are vertical only: the x axis carries the reference measurement,
// and its own uncertainty is a different claim that belongs in the caption.

import {
  AxisLabel,
  ChartFrame,
  LegendSwatch,
  niceTicks,
  palette,
  scaleLinear,
} from "./primitives";

export interface ScatterPoint {
  x: number;
  y: number;
  /** Vertical interval around y, e.g. a published prediction range */
  lo?: number;
  hi?: number;
  color?: string;
  tip?: string;
  /** Drawn hollow — a point the system declined to stand behind */
  flagged?: boolean;
}

export interface ScatterSeries {
  name: string;
  color: string;
  points: ScatterPoint[];
}

export function ScatterPlot({
  series,
  xLabel,
  yLabel,
  domain,
  yDomain,
  identity = true,
  identityLabel = "1:1 — exact agreement",
  tolerance,
  toleranceLabel,
  stats,
  bands,
  height = 340,
  title,
  subtitle,
  caption,
  note,
  representative,
  flaggedLabel,
}: {
  series: ScatterSeries[];
  xLabel: string;
  yLabel: string;
  /** Shared axis domain. Both axes use it unless yDomain overrides. */
  domain: [number, number];
  yDomain?: [number, number];
  identity?: boolean;
  identityLabel?: string;
  /** Fractional band around the identity line, e.g. 0.1 for plus or minus 10% */
  tolerance?: number;
  toleranceLabel?: string;
  /** Small figures printed in the corner: n, RMSE, whatever the panel earns */
  stats?: { label: string; value: string }[];
  /** Named horizontal regions, e.g. decision bands on a score axis */
  bands?: { from: number; to: number; label: string; color: string }[];
  height?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  flaggedLabel?: string;
}) {
  const W = 620;
  const H = height;
  const m = { top: 18, right: 20, bottom: 46, left: 58 };
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;

  const yd = yDomain ?? domain;
  const sx = scaleLinear(domain, [m.left, m.left + iw]);
  const sy = scaleLinear(yd, [m.top + ih, m.top]);
  const xTicks = niceTicks(domain[0], domain[1], 5);
  const yTicks = niceTicks(yd[0], yd[1], 5);

  // The identity line is only meaningful where both axes cover the value.
  const idFrom = Math.max(domain[0], yd[0]);
  const idTo = Math.min(domain[1], yd[1]);
  const hasIdentity = identity && idTo > idFrom;

  const tolPoly =
    tolerance && hasIdentity
      ? [
          [sx(idFrom), sy(Math.min(yd[1], idFrom * (1 + tolerance)))],
          [sx(idTo), sy(Math.min(yd[1], idTo * (1 + tolerance)))],
          [sx(idTo), sy(Math.max(yd[0], idTo * (1 - tolerance)))],
          [sx(idFrom), sy(Math.max(yd[0], idFrom * (1 - tolerance)))],
        ]
          .map((p) => p.join(","))
          .join(" ")
      : "";

  const anyFlagged = series.some((s) => s.points.some((p) => p.flagged));
  const statW = 152;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={460}
      legend={
        <>
          {series.map((s) => (
            <LegendSwatch key={s.name} color={s.color} label={s.name} shape="dot" />
          ))}
          {hasIdentity && (
            <LegendSwatch color={palette.ink} label={identityLabel} dash="5 4" />
          )}
          {tolerance !== undefined && (
            <span className="legend-item">
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="2" fill="rgba(74,222,128,0.22)" />
              </svg>
              <span>
                {toleranceLabel ?? `within ${Math.round(tolerance * 100)}%`}
              </span>
            </span>
          )}
          {anyFlagged && (
            <span className="legend-item">
              <svg width="14" height="14" aria-hidden="true">
                <circle
                  cx="7"
                  cy="7"
                  r="4.5"
                  fill="none"
                  stroke={palette.muted}
                  strokeWidth="1.6"
                  strokeDasharray="2 2"
                />
              </svg>
              <span>{flaggedLabel ?? "flagged, not published"}</span>
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
        aria-label={`${title ?? "Scatter plot"}: ${yLabel} against ${xLabel}`}
      >
        {/* named y regions, drawn first so everything else sits on top */}
        {bands?.map((b) => (
          <g key={b.label}>
            <rect
              x={m.left}
              y={sy(b.to)}
              width={iw}
              height={Math.max(0, sy(b.from) - sy(b.to))}
              fill={b.color}
              opacity="0.08"
            />
            <AxisLabel x={m.left + iw - 6} y={sy(b.to) + 12} anchor="end" size={9}>
              {b.label}
            </AxisLabel>
          </g>
        ))}

        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              x1={m.left}
              y1={sy(t)}
              x2={m.left + iw}
              y2={sy(t)}
              stroke={palette.grid}
            />
            <AxisLabel x={m.left - 8} y={sy(t) + 3.5} anchor="end">
              {t}
            </AxisLabel>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line
              x1={sx(t)}
              y1={m.top}
              x2={sx(t)}
              y2={m.top + ih}
              stroke={palette.grid}
            />
            <AxisLabel x={sx(t)} y={m.top + ih + 16}>
              {t}
            </AxisLabel>
          </g>
        ))}

        {tolPoly && <polygon points={tolPoly} fill="rgba(74,222,128,0.16)" />}

        {hasIdentity && (
          <line
            x1={sx(idFrom)}
            y1={sy(idFrom)}
            x2={sx(idTo)}
            y2={sy(idTo)}
            stroke={palette.ink}
            strokeWidth="1.6"
            strokeDasharray="5 4"
            opacity="0.75"
          />
        )}

        {series.map((s) => (
          <g key={s.name}>
            {s.points.map((p, i) => {
              const c = p.color ?? s.color;
              const cx = sx(p.x);
              const cy = sy(p.y);
              return (
                <g key={i}>
                  {typeof p.lo === "number" && typeof p.hi === "number" && (
                    <>
                      <line
                        x1={cx}
                        y1={sy(p.lo)}
                        x2={cx}
                        y2={sy(p.hi)}
                        stroke={c}
                        strokeWidth="1.6"
                        opacity="0.5"
                      />
                      <line
                        x1={cx - 3.5}
                        y1={sy(p.hi)}
                        x2={cx + 3.5}
                        y2={sy(p.hi)}
                        stroke={c}
                        strokeWidth="1.4"
                        opacity="0.5"
                      />
                      <line
                        x1={cx - 3.5}
                        y1={sy(p.lo)}
                        x2={cx + 3.5}
                        y2={sy(p.lo)}
                        stroke={c}
                        strokeWidth="1.4"
                        opacity="0.5"
                      />
                    </>
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.4"
                    fill={p.flagged ? "none" : c}
                    stroke={p.flagged ? c : palette.surface}
                    strokeWidth={p.flagged ? 1.7 : 1}
                    strokeDasharray={p.flagged ? "2 2" : undefined}
                  >
                    {p.tip && <title>{p.tip}</title>}
                  </circle>
                </g>
              );
            })}
          </g>
        ))}

        {/* stat block, bottom-right inside the plot */}
        {stats && stats.length > 0 && (
          <g>
            <rect
              x={m.left + iw - statW}
              y={m.top + ih - 12 - stats.length * 15}
              width={statW - 6}
              height={stats.length * 15 + 6}
              rx="4"
              fill="rgba(8,11,10,0.82)"
              stroke="rgba(148,176,158,0.18)"
            />
            {stats.map((s, i) => {
              const ty = m.top + ih - 17 - (stats.length - 1 - i) * 15;
              return (
                <g key={s.label}>
                  <AxisLabel x={m.left + iw - statW + 8} y={ty} anchor="start" size={9.5}>
                    {s.label}
                  </AxisLabel>
                  <AxisLabel
                    x={m.left + iw - 14}
                    y={ty}
                    anchor="end"
                    size={9.5}
                    color={palette.ink}
                  >
                    {s.value}
                  </AxisLabel>
                </g>
              );
            })}
          </g>
        )}

        <line
          x1={m.left}
          y1={m.top + ih}
          x2={m.left + iw}
          y2={m.top + ih}
          stroke="#2B3A32"
          strokeWidth="1.5"
        />
        <line
          x1={m.left}
          y1={m.top}
          x2={m.left}
          y2={m.top + ih}
          stroke="#2B3A32"
          strokeWidth="1.5"
        />
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
