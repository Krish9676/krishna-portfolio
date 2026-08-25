// components/charts/Heatmap.tsx
// Two heatmap forms that carry most of the spatial story on this site:
//   · PixelHeatmap — a field rendered at its real pixel budget. A one-acre
//     field at 10 m carries roughly 40 valid pixels, so the grid is drawn
//     coarse on purpose. Pretending otherwise would be the lie.
//   · MatrixHeatmap — a categorical grid (crops × regions, index × consumer).

import { ChartFrame, palette } from "./primitives";

// ────────────────────────────────────────────────────────────
// PixelHeatmap
// ────────────────────────────────────────────────────────────

export interface PixelStop {
  at: number;
  color: string;
  label: string;
}

interface PixelProps {
  /** Row-major grid. null = outside the parcel boundary / masked. */
  grid: (number | null)[][];
  /** Discrete class stops, low → high. A value maps to the last stop it clears. */
  stops: PixelStop[];
  title?: string;
  subtitle?: string;
  caption?: string;
  representative?: boolean;
  /** Optional parcel outline traced around the non-null cells */
  outline?: boolean;
  /** Distribution summary rendered under the grid, e.g. % per class */
  distribution?: { label: string; pct: number; color: string }[];
  cell?: number;
}

function colorFor(v: number, stops: PixelStop[]) {
  let c = stops[0].color;
  for (const s of stops) if (v >= s.at) c = s.color;
  return c;
}

export function PixelHeatmap({
  grid,
  stops,
  title,
  subtitle,
  caption,
  representative = true,
  outline = true,
  distribution,
  cell = 17,
}: PixelProps) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const pad = 10;
  const W = cols * cell + pad * 2;
  const H = rows * cell + pad * 2;
  const live = grid.flat().filter((v): v is number => v !== null).length;

  const edge = (r: number, c: number, dr: number, dc: number) => {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) return true;
    return grid[nr][nc] === null;
  };

  // Trace the parcel edge once: every cell face that borders the outside.
  const outlinePath = outline
    ? grid
        .flatMap((row, r) =>
          row.flatMap((v, c) => {
            if (v === null) return [];
            const x = pad + c * cell;
            const y = pad + r * cell;
            const segs: string[] = [];
            if (edge(r, c, -1, 0)) segs.push(`M${x},${y}h${cell}`);
            if (edge(r, c, 1, 0)) segs.push(`M${x},${y + cell}h${cell}`);
            if (edge(r, c, 0, -1)) segs.push(`M${x},${y}v${cell}`);
            if (edge(r, c, 0, 1)) segs.push(`M${x + cell},${y}v${cell}`);
            return segs;
          })
        )
        .join("")
    : "";

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      minWidth={Math.max(320, W)}
      legend={
        <>
          {stops.map((s) => (
            <span className="legend-item" key={s.label}>
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="2" fill={s.color} />
              </svg>
              <span>{s.label}</span>
            </span>
          ))}
          <span className="legend-item">
            <span style={{ color: palette.faint }}>{live} valid pixels · 10 m grid</span>
          </span>
        </>
      }
    >
      <div className="pixelmap-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label={title ?? "Per-pixel field map"}
        >
          {grid.map((row, r) =>
            row.map((v, c) => {
              const x = pad + c * cell;
              const y = pad + r * cell;
              if (v === null)
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x}
                    y={y}
                    width={cell}
                    height={cell}
                    fill="rgba(30,42,36,0.28)"
                  />
                );
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x + 0.5}
                  y={y + 0.5}
                  width={cell - 1}
                  height={cell - 1}
                  rx="1.5"
                  fill={colorFor(v, stops)}
                  opacity="0.88"
                />
              );
            })
          )}
          {/* One path for the whole parcel outline rather than one per cell. */}
          {outline && outlinePath && (
            <path
              d={outlinePath}
              stroke={palette.ink}
              strokeWidth="1.6"
              fill="none"
              opacity="0.85"
            />
          )}
        </svg>
        {distribution && (
          <div className="pixel-dist">
            {distribution.map((d) => (
              <div key={d.label} className="pixel-dist-row">
                <span className="pixel-dist-label">{d.label}</span>
                <span className="pixel-dist-track">
                  <span
                    className="pixel-dist-fill"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </span>
                <span className="pixel-dist-val">{d.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// MatrixHeatmap
// ────────────────────────────────────────────────────────────

interface MatrixProps {
  rowLabels: string[];
  colLabels: string[];
  /** 0 = absent, 1 = present, 2 = present with a variant/override */
  values: number[][];
  levels?: { at: number; color: string; label: string }[];
  title?: string;
  subtitle?: string;
  caption?: string;
  representative?: boolean;
}

const defaultLevels = [
  { at: 0, color: "rgba(30,42,36,0.45)", label: "not configured" },
  { at: 1, color: "rgba(74,222,128,0.45)", label: "configured" },
  { at: 2, color: palette.green, label: "variant / regional override" },
];

export function MatrixHeatmap({
  rowLabels,
  colLabels,
  values,
  levels = defaultLevels,
  title,
  subtitle,
  caption,
  representative,
}: MatrixProps) {
  const cell = 30;
  const rowW = 132;
  const headH = 58;
  const W = rowW + colLabels.length * cell + 12;
  const H = headH + rowLabels.length * cell + 8;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      minWidth={Math.max(420, W)}
      legend={
        <>
          {levels.map((l) => (
            <span className="legend-item" key={l.label}>
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="2" fill={l.color} />
              </svg>
              <span>{l.label}</span>
            </span>
          ))}
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={title ?? "Coverage matrix"}
      >
        {colLabels.map((c, ci) => (
          <text
            key={c}
            x={rowW + ci * cell + cell / 2}
            y={headH - 10}
            fontSize="10"
            fill={palette.muted}
            fontFamily="var(--font-mono)"
            textAnchor="start"
            transform={`rotate(-42 ${rowW + ci * cell + cell / 2} ${headH - 10})`}
          >
            {c}
          </text>
        ))}
        {rowLabels.map((r, ri) => (
          <g key={r}>
            <text
              x={rowW - 10}
              y={headH + ri * cell + cell / 2 + 3.5}
              fontSize="11"
              fill={palette.muted}
              fontFamily="var(--font-body)"
              textAnchor="end"
            >
              {r}
            </text>
            {colLabels.map((_, ci) => {
              const v = values[ri]?.[ci] ?? 0;
              let color = levels[0].color;
              for (const l of levels) if (v >= l.at) color = l.color;
              return (
                <rect
                  key={ci}
                  x={rowW + ci * cell + 2}
                  y={headH + ri * cell + 2}
                  width={cell - 4}
                  height={cell - 4}
                  rx="3"
                  fill={color}
                >
                  <title>{`${r} · ${colLabels[ci]}`}</title>
                </rect>
              );
            })}
          </g>
        ))}
      </svg>
    </ChartFrame>
  );
}
