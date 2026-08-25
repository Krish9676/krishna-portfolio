// components/charts/Bars.tsx — bar, stacked-bar and dumbbell forms.

import {
  AxisLabel,
  ChartFrame,
  LegendSwatch,
  niceTicks,
  palette,
  scaleLinear,
} from "./primitives";

// ────────────────────────────────────────────────────────────
// BarSet — horizontal bars, optionally with a reference marker
// ────────────────────────────────────────────────────────────

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
  /** Displayed instead of the raw number, e.g. "7 / 106" */
  valueLabel?: string;
  /** Secondary line under the label */
  note?: string;
  /** A comparison marker on the same track */
  reference?: number;
}

export function BarSet({
  data,
  unit = "",
  max,
  title,
  subtitle,
  caption,
  representative,
  referenceLabel,
}: {
  data: BarDatum[];
  unit?: string;
  max?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  representative?: boolean;
  referenceLabel?: string;
}) {
  const hi = max ?? Math.max(...data.map((d) => Math.max(d.value, d.reference ?? 0))) * 1.1;
  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      minWidth={420}
      legend={
        referenceLabel ? (
          <LegendSwatch color={palette.faint} label={referenceLabel} dash="3 3" />
        ) : undefined
      }
    >
      <div className="barset">
        {data.map((d) => (
          <div key={d.label} className="barset-row">
            <div className="barset-label">
              <span>{d.label}</span>
              {d.note && <em>{d.note}</em>}
            </div>
            <div className="barset-track">
              <div
                className="barset-fill"
                style={{
                  // A zero draws nothing. A 1px sliver for "none" would read as
                  // a small amount of something.
                  width:
                    d.value === 0
                      ? "0%"
                      : `${Math.max(1, (Math.abs(d.value) / hi) * 100)}%`,
                  background: d.color ?? palette.green,
                }}
              />
              {typeof d.reference === "number" && (
                <span
                  className="barset-ref"
                  style={{ left: `${(d.reference / hi) * 100}%` }}
                />
              )}
            </div>
            <div className="barset-value" style={{ color: d.color ?? palette.green }}>
              {d.valueLabel ?? `${d.value}${unit}`}
            </div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// StackedBars — composition across categories
// ────────────────────────────────────────────────────────────

export function StackedBars({
  categories,
  keys,
  data,
  unit = "",
  title,
  subtitle,
  caption,
  representative,
  height = 250,
}: {
  categories: string[];
  keys: { key: string; label: string; color: string }[];
  /** data[categoryIndex][keyIndex] */
  data: number[][];
  unit?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  representative?: boolean;
  height?: number;
}) {
  const W = 720;
  const H = height;
  const m = { top: 14, right: 16, bottom: 40, left: 56 };
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;
  const totals = data.map((row) => row.reduce((a, b) => a + b, 0));
  const yMax = Math.max(...totals) * 1.1;
  const sy = scaleLinear([0, yMax], [m.top + ih, m.top]);
  const bandW = iw / categories.length;
  const barW = Math.min(64, bandW * 0.56);
  const ticks = niceTicks(0, yMax, 5);

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      legend={
        <>
          {keys.map((k) => (
            <LegendSwatch key={k.key} color={k.color} label={k.label} shape="box" />
          ))}
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title}>
        {ticks.map((t) => (
          <g key={t}>
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
        {categories.map((cat, ci) => {
          const cx = m.left + bandW * ci + bandW / 2;
          let acc = 0;
          return (
            <g key={cat}>
              {keys.map((k, ki) => {
                const v = data[ci]?.[ki] ?? 0;
                const y0 = sy(acc);
                acc += v;
                const y1 = sy(acc);
                return (
                  <rect
                    key={k.key}
                    x={cx - barW / 2}
                    y={y1}
                    width={barW}
                    height={Math.max(0, y0 - y1)}
                    fill={k.color}
                    opacity="0.9"
                  >
                    <title>{`${cat} · ${k.label}: ${v}${unit}`}</title>
                  </rect>
                );
              })}
              <AxisLabel x={cx} y={sy(totals[ci]) - 7} size={10} color={palette.ink}>
                {`${Math.round(totals[ci])}${unit}`}
              </AxisLabel>
              <AxisLabel x={cx} y={m.top + ih + 16} size={10} color={palette.muted}>
                {cat}
              </AxisLabel>
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
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// Dumbbell — before → after, for measured drift
// ────────────────────────────────────────────────────────────

export function Dumbbell({
  rows,
  domain,
  unit = "",
  title,
  subtitle,
  caption,
  fromLabel = "before",
  toLabel = "after",
}: {
  rows: { label: string; from: number; to: number; note?: string; color?: string }[];
  domain: [number, number];
  unit?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  fromLabel?: string;
  toLabel?: string;
}) {
  const W = 720;
  const rowH = 52;
  const m = { top: 22, right: 30, bottom: 34, left: 168 };
  const H = m.top + rows.length * rowH + m.bottom;
  const sx = scaleLinear(domain, [m.left, W - m.right]);
  const ticks = niceTicks(domain[0], domain[1], 6);

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      legend={
        <>
          <LegendSwatch color={palette.faint} label={fromLabel} shape="dot" />
          <LegendSwatch color={palette.green} label={toLabel} shape="dot" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title}>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={sx(t)}
              y1={m.top - 6}
              x2={sx(t)}
              y2={m.top + rows.length * rowH}
              stroke={palette.grid}
            />
            <AxisLabel x={sx(t)} y={m.top + rows.length * rowH + 16}>
              {t}
              {unit}
            </AxisLabel>
          </g>
        ))}
        {rows.map((r, i) => {
          const y = m.top + i * rowH + rowH / 2 - 4;
          const c = r.color ?? palette.green;
          const dir = r.to >= r.from;
          return (
            <g key={r.label}>
              <text
                x={m.left - 14}
                y={y - 2}
                fontSize="12"
                fill={palette.ink}
                textAnchor="end"
                fontFamily="var(--font-body)"
              >
                {r.label}
              </text>
              {r.note && (
                <text
                  x={m.left - 14}
                  y={y + 13}
                  fontSize="10"
                  fill={palette.faint}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {r.note}
                </text>
              )}
              <line
                x1={sx(r.from)}
                y1={y}
                x2={sx(r.to)}
                y2={y}
                stroke={c}
                strokeWidth="2.5"
                opacity="0.45"
              />
              <circle cx={sx(r.from)} cy={y} r="5.5" fill={palette.surface} stroke={palette.faint} strokeWidth="2" />
              <circle cx={sx(r.to)} cy={y} r="5.5" fill={c} />
              <text
                x={sx(r.to) + (dir ? 12 : -12)}
                y={y + 4}
                fontSize="11"
                fill={c}
                textAnchor={dir ? "start" : "end"}
                fontFamily="var(--font-mono)"
              >
                {r.to > r.from ? "+" : ""}
                {Math.round((r.to - r.from) * 10) / 10}
                {unit}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
