// components/charts/Score.tsx
// The gauge and the waterfall — the two panels that carry the most weight.
// The waterfall's bars encode *contribution*, not score: each track is sized to
// its weight so the four together span the full 100 points a raw index can
// reach, and each is filled to its contribution. A sub-index of 42 matters
// differently at weight 30 than at weight 20, and four equal-length bars could
// never show that. The unfilled part of a track is the recoverable loss.

import { ChartFrame, palette } from "./primitives";

// ────────────────────────────────────────────────────────────
// ScoreGauge — arc gauge with named bands
// ────────────────────────────────────────────────────────────

export interface GaugeBand {
  from: number;
  to: number;
  label: string;
  color: string;
  risk?: string;
}

export function ScoreGauge({
  value,
  domain,
  bands,
  unitLabel,
  title,
  caption,
  note,
  representative,
  gateNote,
}: {
  value: number;
  domain: [number, number];
  bands: GaugeBand[];
  unitLabel?: string;
  title?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  gateNote?: string;
}) {
  const W = 460;
  const H = 268;
  const cx = W / 2;
  const cy = 200;
  const r = 138;
  const rIn = 108;
  const A0 = -180;
  const A1 = 0;

  const toAngle = (v: number) =>
    A0 + ((v - domain[0]) / (domain[1] - domain[0])) * (A1 - A0);
  const pt = (ang: number, rad: number) => {
    const a = (ang * Math.PI) / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };

  const arc = (from: number, to: number, ro: number, ri: number) => {
    const a0 = toAngle(from);
    const a1 = toAngle(to);
    const [x0, y0] = pt(a0, ro);
    const [x1, y1] = pt(a1, ro);
    const [x2, y2] = pt(a1, ri);
    const [x3, y3] = pt(a0, ri);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M ${x0},${y0} A ${ro},${ro} 0 ${large} 1 ${x1},${y1} L ${x2},${y2} A ${ri},${ri} 0 ${large} 0 ${x3},${y3} Z`;
  };

  const active = bands.find((b) => value >= b.from && value <= b.to) ?? bands[0];
  const needle = toAngle(value);
  const [nx, ny] = pt(needle, r - 8);

  return (
    <ChartFrame
      title={title}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={300}
      legend={
        <>
          {bands.map((b) => (
            <span className="legend-item" key={b.label}>
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="2" fill={b.color} />
              </svg>
              <span>
                {b.label} · {b.from}–{b.to}
                {b.risk ? ` · ${b.risk}` : ""}
              </span>
            </span>
          ))}
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
        aria-label={`Score ${value} of ${domain[1]}, band ${active.label}`}>
        {bands.map((b) => (
          <path key={b.label} d={arc(b.from, b.to, r, rIn)} fill={b.color} opacity="0.28" />
        ))}
        <path d={arc(active.from, active.to, r, rIn)} fill={active.color} opacity="0.9" />

        {/* band boundary ticks — colour is never the only channel */}
        {bands.map((b) => {
          const [tx0, ty0] = pt(toAngle(b.from), rIn - 4);
          const [tx1, ty1] = pt(toAngle(b.from), r + 4);
          return (
            <line
              key={`t-${b.from}`}
              x1={tx0}
              y1={ty0}
              x2={tx1}
              y2={ty1}
              stroke={palette.surface}
              strokeWidth="2"
            />
          );
        })}

        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={palette.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="7" fill={palette.ink} />

        <text
          x={cx}
          y={cy - 44}
          textAnchor="middle"
          fontSize="46"
          fontWeight="700"
          fill={active.color}
          fontFamily="var(--font-heading)"
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy - 22}
          textAnchor="middle"
          fontSize="12"
          fill={palette.muted}
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
        >
          {active.label.toUpperCase()}
          {active.risk ? ` · ${active.risk}` : ""}
        </text>

        <text x={pt(A0, rIn - 18)[0]} y={cy + 16} textAnchor="middle" fontSize="10"
          fill={palette.faint} fontFamily="var(--font-mono)">
          {domain[0]}
        </text>
        <text x={pt(A1, rIn - 18)[0]} y={cy + 16} textAnchor="middle" fontSize="10"
          fill={palette.faint} fontFamily="var(--font-mono)">
          {domain[1]}
        </text>
        {unitLabel && (
          <text x={cx} y={cy + 36} textAnchor="middle" fontSize="10" fill={palette.faint}
            fontFamily="var(--font-mono)">
            {unitLabel}
          </text>
        )}
        {gateNote && (
          <text x={cx} y={cy + 54} textAnchor="middle" fontSize="10" fill={palette.amber}
            fontFamily="var(--font-mono)">
            {gateNote}
          </text>
        )}
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// ScoreWaterfall — contribution tracks sized to weight
// ────────────────────────────────────────────────────────────

export interface WaterfallRow {
  label: string;
  /** Weight in points of the 100-point raw index */
  weight: number;
  /** Sub-index score 0–100 */
  score: number;
  color: string;
  driver?: string;
}

export function ScoreWaterfall({
  rows,
  bonus,
  gate,
  finalLabel,
  scaleFrom,
  scaleSpan,
  title,
  subtitle,
  caption,
  note,
  representative,
  gateReasons,
}: {
  rows: WaterfallRow[];
  /** Positive-only benefits bonus, in index points */
  bonus?: { label: string; points: number };
  /** Multiplicative confidence gate, 0–1 */
  gate?: { value: number; label: string };
  finalLabel?: string;
  /** For mapping index → product scale, e.g. 300 + 600 × index/100 */
  scaleFrom?: number;
  scaleSpan?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  gateReasons?: string[];
}) {
  const additive = rows.reduce((a, r) => a + (r.score * r.weight) / 100, 0);
  const raw = Math.min(100, additive + (bonus?.points ?? 0));
  const gated = gate ? raw * gate.value : raw;
  const finalScore =
    scaleFrom !== undefined && scaleSpan !== undefined
      ? Math.round(scaleFrom + (scaleSpan * gated) / 100)
      : Math.round(gated * 10) / 10;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={520}
    >
      <div className="waterfall">
        <div className="waterfall-scaleline">
          <span>0</span>
          <span>index points, of 100 reachable</span>
          <span>100</span>
        </div>

        {rows.map((r) => {
          const contribution = (r.score * r.weight) / 100;
          return (
            <div className="waterfall-row" key={r.label}>
              <div className="waterfall-label">
                <span className="waterfall-name">{r.label}</span>
                <span className="waterfall-meta">
                  score {r.score} · weight {r.weight}
                </span>
                {r.driver && <span className="waterfall-driver">{r.driver}</span>}
              </div>
              {/* track width == weight, so all four span the full 100 */}
              <div className="waterfall-track" style={{ width: `${r.weight}%` }}>
                <div
                  className="waterfall-fill"
                  style={{
                    width: `${r.score}%`,
                    background: r.color,
                  }}
                />
                <span className="waterfall-loss">
                  {Math.round((r.weight - contribution) * 10) / 10} recoverable
                </span>
              </div>
              <div className="waterfall-contrib" style={{ color: r.color }}>
                +{Math.round(contribution * 10) / 10}
              </div>
            </div>
          );
        })}

        <div className="waterfall-sum">
          <span>additive subtotal</span>
          <span className="waterfall-sum-val">{Math.round(additive * 10) / 10}</span>
        </div>

        {bonus && (
          <div className="waterfall-step">
            <span>{bonus.label}</span>
            <span className="waterfall-step-val" style={{ color: palette.green }}>
              +{bonus.points}
            </span>
          </div>
        )}

        {gate && (
          <div className="waterfall-step waterfall-gate">
            <span>
              {gate.label}
              {gateReasons && gateReasons.length > 0 && (
                <em>
                  {" — "}
                  {gateReasons.join(" · ")}
                </em>
              )}
            </span>
            <span className="waterfall-step-val" style={{ color: palette.amber }}>
              −{Math.round((raw - gated) * 10) / 10} pts (×{gate.value})
            </span>
          </div>
        )}

        <div className="waterfall-final">
          <span>{finalLabel ?? "final"}</span>
          <span className="waterfall-final-val">{finalScore}</span>
        </div>
      </div>
    </ChartFrame>
  );
}
