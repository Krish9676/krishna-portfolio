// components/charts/Diagrams.tsx — pipeline chains, layer stacks, roadmaps,
// cadence strips and the terminal-state fan. Structural rather than quantitative:
// these show what the system does and in what order.

import { ChartFrame, palette } from "./primitives";

// ────────────────────────────────────────────────────────────
// StageChain — a numbered pipeline
// ────────────────────────────────────────────────────────────

export interface Stage {
  n: string;
  name: string;
  produces: string;
  /** Grouping tint: ingest | model | publish */
  kind?: "config" | "ingest" | "repair" | "model" | "publish";
}

const kindColor: Record<string, string> = {
  config: palette.faint,
  ingest: palette.cyan,
  repair: palette.violet,
  model: palette.green,
  publish: palette.amber,
};

export function StageChain({
  stages,
  title,
  subtitle,
  caption,
  note,
}: {
  stages: Stage[];
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} caption={caption} minWidth={320}>
      <div className="stagechain">
        {stages.map((s, i) => {
          const c = kindColor[s.kind ?? "model"];
          return (
            <div className="stagechain-item" key={s.n}>
              <div className="stagechain-rail">
                <span className="stagechain-dot" style={{ background: c, boxShadow: `0 0 10px ${c}55` }}>
                  {s.n}
                </span>
                {i < stages.length - 1 && <span className="stagechain-line" />}
              </div>
              <div className="stagechain-body" style={{ borderLeftColor: `${c}55` }}>
                <div className="stagechain-name">{s.name}</div>
                <div className="stagechain-produces">{s.produces}</div>
              </div>
            </div>
          );
        })}
      </div>
      {note && <p className="chart-note">{note}</p>}
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// LayerStack — architecture as tiers
// ────────────────────────────────────────────────────────────

export function LayerStack({
  layers,
  title,
  subtitle,
  caption,
}: {
  layers: { name: string; role: string; items: string[]; color: string }[];
  title?: string;
  subtitle?: string;
  caption?: string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} caption={caption} minWidth={320}>
      <div className="layerstack">
        {layers.map((l, i) => (
          <div key={l.name} className="layerstack-row">
            <div
              className="layerstack-card"
              style={{
                borderColor: `${l.color}44`,
                background: `linear-gradient(135deg, ${l.color}12, transparent 70%)`,
              }}
            >
              <div className="layerstack-head">
                <span className="layerstack-name" style={{ color: l.color }}>
                  {l.name}
                </span>
                <span className="layerstack-role">{l.role}</span>
              </div>
              <div className="layerstack-items">
                {l.items.map((it) => (
                  <span key={it} className="skill-tag">
                    {it}
                  </span>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && <div className="layerstack-arrow">▼</div>}
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// Roadmap — tranche gantt
// ────────────────────────────────────────────────────────────

export function Roadmap({
  weeks,
  tracks,
  tranches,
  title,
  subtitle,
  caption,
}: {
  weeks: number;
  tracks: { label: string; from: number; to: number; color: string; note?: string }[];
  tranches?: { label: string; from: number; to: number }[];
  title?: string;
  subtitle?: string;
  caption?: string;
}) {
  const W = 740;
  const rowH = 40;
  const m = { top: 42, left: 190, right: 24, bottom: 30 };
  const H = m.top + tracks.length * rowH + m.bottom;
  const iw = W - m.left - m.right;
  const sx = (w: number) => m.left + (w / weeks) * iw;

  return (
    <ChartFrame title={title} subtitle={subtitle} caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title}>
        {tranches?.map((t, i) => (
          <g key={t.label}>
            <rect
              x={sx(t.from)}
              y={m.top - 22}
              width={sx(t.to) - sx(t.from)}
              height={tracks.length * rowH + 22}
              fill={i % 2 === 0 ? "rgba(56,182,217,0.05)" : "rgba(74,222,128,0.05)"}
            />
            <text
              x={(sx(t.from) + sx(t.to)) / 2}
              y={m.top - 28}
              textAnchor="middle"
              fontSize="10"
              fill={palette.muted}
              fontFamily="var(--font-mono)"
              letterSpacing="0.08em"
            >
              {t.label.toUpperCase()}
            </text>
          </g>
        ))}
        {[0, 8, 16, 24, 32, 40, 48].filter((w) => w <= weeks).map((w) => (
          <g key={w}>
            <line x1={sx(w)} y1={m.top - 22} x2={sx(w)} y2={m.top + tracks.length * rowH}
              stroke={palette.grid} />
            <text x={sx(w)} y={m.top + tracks.length * rowH + 16} textAnchor="middle"
              fontSize="9" fill={palette.faint} fontFamily="var(--font-mono)">
              w{w}
            </text>
          </g>
        ))}
        {tracks.map((t, i) => {
          const y = m.top + i * rowH + 8;
          return (
            <g key={t.label}>
              <text x={m.left - 12} y={y + 13} textAnchor="end" fontSize="11.5"
                fill={palette.ink} fontFamily="var(--font-body)">
                {t.label}
              </text>
              <rect
                x={sx(t.from)}
                y={y}
                width={Math.max(8, sx(t.to) - sx(t.from))}
                height={20}
                rx="5"
                fill={t.color}
                opacity="0.82"
              />
              <text
                x={sx(t.from) + 8}
                y={y + 14}
                fontSize="9.5"
                fill="#080B0A"
                fontFamily="var(--font-mono)"
                fontWeight="600"
              >
                {`w${t.from}–${t.to}`}
              </text>
              {t.note && (
                <text x={sx(t.to) + 8} y={y + 14} fontSize="9.5" fill={palette.faint}
                  fontFamily="var(--font-mono)">
                  {t.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// CadenceStrip — revisit intervals side by side
// ────────────────────────────────────────────────────────────

export function CadenceStrip({
  days,
  sources,
  title,
  subtitle,
  caption,
}: {
  days: number;
  sources: {
    label: string;
    color: string;
    /** day offsets where an observation lands */
    hits: number[];
    /** day offsets where the observation exists but is unusable */
    blocked?: number[];
    note?: string;
  }[];
  title?: string;
  subtitle?: string;
  caption?: string;
}) {
  const W = 740;
  const rowH = 46;
  const m = { top: 20, left: 156, right: 20, bottom: 32 };
  const H = m.top + sources.length * rowH + m.bottom;
  const iw = W - m.left - m.right;
  const sx = (d: number) => m.left + (d / days) * iw;

  return (
    <ChartFrame title={title} subtitle={subtitle} caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={title}>
        {Array.from({ length: Math.floor(days / 30) + 1 }, (_, i) => i * 30).map((d) => (
          <g key={d}>
            <line x1={sx(d)} y1={m.top - 8} x2={sx(d)} y2={m.top + sources.length * rowH}
              stroke={palette.grid} />
            <text x={sx(d)} y={m.top + sources.length * rowH + 16} textAnchor="middle"
              fontSize="9" fill={palette.faint} fontFamily="var(--font-mono)">
              d{d}
            </text>
          </g>
        ))}
        {sources.map((s, i) => {
          const y = m.top + i * rowH + rowH / 2;
          return (
            <g key={s.label}>
              <text x={m.left - 12} y={y - 1} textAnchor="end" fontSize="11.5"
                fill={palette.ink} fontFamily="var(--font-body)">
                {s.label}
              </text>
              {s.note && (
                <text x={m.left - 12} y={y + 13} textAnchor="end" fontSize="9"
                  fill={palette.faint} fontFamily="var(--font-mono)">
                  {s.note}
                </text>
              )}
              <line x1={m.left} y1={y} x2={W - m.right} y2={y}
                stroke="rgba(43,58,50,0.6)" strokeWidth="1" />
              {s.blocked?.map((d) => (
                <g key={`b${d}`}>
                  <line x1={sx(d)} y1={y - 8} x2={sx(d)} y2={y + 8}
                    stroke={palette.faint} strokeWidth="2" opacity="0.5" />
                  <circle cx={sx(d)} cy={y} r="3" fill="none" stroke={palette.faint}
                    strokeWidth="1.4" strokeDasharray="2 2" />
                </g>
              ))}
              {s.hits.map((d) => (
                <circle key={d} cx={sx(d)} cy={y} r="4.5" fill={s.color} />
              ))}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// TerminalStates — the fan of distinct answers
// ────────────────────────────────────────────────────────────

export function TerminalStates({
  states,
  title,
  subtitle,
  caption,
}: {
  states: { code: string; meaning: string; next: string; color: string }[];
  title?: string;
  subtitle?: string;
  caption?: string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} caption={caption} minWidth={320}>
      <div className="termstates">
        {states.map((s) => (
          <div key={s.code} className="termstate" style={{ borderTopColor: s.color }}>
            <div className="termstate-code" style={{ color: s.color }}>
              {s.code}
            </div>
            <div className="termstate-meaning">{s.meaning}</div>
            <div className="termstate-next">
              <span>next</span>
              {s.next}
            </div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}
