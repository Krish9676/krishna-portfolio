// components/charts/Maps.tsx — spatial views.
//   · ParcelMap: a parcel over a synthetic Sentinel-style basemap, with the
//     dual-footprint case (declared boundary vs. measured footprint) drawn the
//     way the real product draws it — declared greyed and dashed, measured solid.
//   · BoundaryMap: extracted field boundaries over a field mosaic, for the
//     segmentation project.
//   · RegionGrid: a coarse choropleth for regional monitoring.

import { ChartFrame, palette } from "./primitives";

// A deterministic hash so the "imagery" texture is stable between renders
// and between server and client. No Math.random anywhere.
function h(x: number, y: number, seed = 1) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

// A field mosaic rather than a per-pixel grid: a satellite basemap reads as
// farmland because of parcel structure, not because of noise. Drawing it as a
// few dozen jittered quads instead of ~1,400 cells keeps these pages an order
// of magnitude lighter, and a fine-grain pattern supplies the texture on top.
function BasemapTexture({
  w,
  h: hh,
  cols = 7,
  rows = 6,
  seed = 1,
  id,
}: {
  w: number;
  h: number;
  cols?: number;
  rows?: number;
  seed?: number;
  id: string;
}) {
  const cw = w / cols;
  const chh = hh / rows;
  // Shared jittered lattice, so adjacent parcels share an edge exactly.
  const nodeX = (c: number, r: number) =>
    c === 0 || c === cols
      ? c * cw
      : c * cw + (h(c, r, seed) - 0.5) * cw * 0.42;
  const nodeY = (c: number, r: number) =>
    r === 0 || r === rows
      ? r * chh
      : r * chh + (h(c, r, seed + 11) - 0.5) * chh * 0.4;

  const parcels: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = h(c, r, seed + 5);
      // muted earth-to-vegetation ramp; the overlay must stay legible on top
      const g = 40 + v * 66;
      const rr = 26 + h(c, r, seed + 7) * 32;
      const b = 30 + v * 22;
      parcels.push(
        <polygon
          key={`${r}-${c}`}
          points={[
            [nodeX(c, r), nodeY(c, r)],
            [nodeX(c + 1, r), nodeY(c + 1, r)],
            [nodeX(c + 1, r + 1), nodeY(c + 1, r + 1)],
            [nodeX(c, r + 1), nodeY(c, r + 1)],
          ]
            .map((p) => p.join(","))
            .join(" ")}
          fill={`rgb(${Math.round(rr)},${Math.round(g)},${Math.round(b)})`}
          stroke="rgba(10,16,30,0.55)"
          strokeWidth="1.2"
        />
      );
    }
  }

  return (
    <>
      <defs>
        <pattern
          id={`${id}-grain`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="none" />
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
          <circle cx="6" cy="5" r="0.9" fill="rgba(0,0,0,0.10)" />
        </pattern>
      </defs>
      <g clipPath={`url(#${id})`}>
        {parcels}
        <rect width={w} height={hh} fill={`url(#${id}-grain)`} />
      </g>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// ParcelMap
// ────────────────────────────────────────────────────────────

export function ParcelMap({
  declared,
  measured,
  title,
  subtitle,
  caption,
  banner,
  labels,
  representative = true,
}: {
  /** Polygon in 0–100 space, as [x, y] pairs */
  declared?: [number, number][];
  measured: [number, number][];
  title?: string;
  subtitle?: string;
  caption?: string;
  /** The full-width warning the real product renders, not a footnote */
  banner?: string;
  labels?: { declared?: string; measured?: string };
  representative?: boolean;
}) {
  const W = 520;
  const H = 320;
  const px = (p: [number, number]) => `${(p[0] / 100) * W},${(p[1] / 100) * H}`;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative={representative}
      minWidth={W}
      legend={
        <>
          {declared && (
            <span className="legend-item">
              <svg width="22" height="12" aria-hidden="true">
                <line x1="1" y1="6" x2="21" y2="6" stroke={palette.muted} strokeWidth="2.4"
                  strokeDasharray="5 3" />
              </svg>
              <span>{labels?.declared ?? "declared boundary"}</span>
            </span>
          )}
          <span className="legend-item">
            <svg width="22" height="12" aria-hidden="true">
              <line x1="1" y1="6" x2="21" y2="6" stroke={palette.green} strokeWidth="2.6" />
            </svg>
            <span>{labels?.measured ?? "measured footprint"}</span>
          </span>
        </>
      }
    >
      {banner && <div className="map-banner">{banner}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
        aria-label={title ?? "Parcel map"}>
        <defs>
          <clipPath id="pm-clip">
            <rect width={W} height={H} rx="10" />
          </clipPath>
        </defs>
        <BasemapTexture w={W} h={H} id="pm-clip" seed={7} />
        <rect width={W} height={H} rx="10" fill="none" stroke="#2B3A32" strokeWidth="1.5" />

        {declared && (
          <polygon
            points={declared.map(px).join(" ")}
            fill="rgba(157,174,164,0.10)"
            stroke={palette.muted}
            strokeWidth="2.2"
            strokeDasharray="6 4"
          />
        )}
        <polygon
          points={measured.map(px).join(" ")}
          fill="rgba(74,222,128,0.16)"
          stroke={palette.green}
          strokeWidth="2.6"
        />
        {measured.map((p, i) => (
          <circle key={i} cx={(p[0] / 100) * W} cy={(p[1] / 100) * H} r="3.2"
            fill={palette.green} />
        ))}
        <text x={12} y={H - 12} fontSize="9.5" fill="rgba(236,242,237,0.55)"
          fontFamily="var(--font-mono)">
          Sentinel-2 style basemap · 10 m grid · illustrative
        </text>
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// BoundaryMap — segmentation output over a field mosaic
// ────────────────────────────────────────────────────────────

export function BoundaryMap({
  fields,
  missed,
  title,
  subtitle,
  caption,
}: {
  /** Each field a polygon in 0–100 space */
  fields: [number, number][][];
  /** Fields the model failed to close, drawn in amber */
  missed?: [number, number][][];
  title?: string;
  subtitle?: string;
  caption?: string;
}) {
  const W = 560;
  const H = 340;
  const px = (p: [number, number]) => `${(p[0] / 100) * W},${(p[1] / 100) * H}`;
  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative
      minWidth={W}
      legend={
        <>
          <span className="legend-item">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="rgba(74,222,128,0.5)" />
            </svg>
            <span>extracted boundary</span>
          </span>
          {missed && (
            <span className="legend-item">
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="2" fill="rgba(224,168,62,0.5)" />
              </svg>
              <span>incomplete / merged</span>
            </span>
          )}
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
        aria-label={title ?? "Boundary extraction map"}>
        <defs>
          <clipPath id="bm-clip">
            <rect width={W} height={H} rx="10" />
          </clipPath>
        </defs>
        <BasemapTexture w={W} h={H} id="bm-clip" seed={3} cols={9} rows={7} />
        <rect width={W} height={H} rx="10" fill="none" stroke="#2B3A32" strokeWidth="1.5" />
        {fields.map((f, i) => (
          <polygon
            key={`f${i}`}
            points={f.map(px).join(" ")}
            fill="rgba(74,222,128,0.14)"
            stroke={palette.green}
            strokeWidth="2"
          />
        ))}
        {missed?.map((f, i) => (
          <polygon
            key={`m${i}`}
            points={f.map(px).join(" ")}
            fill="rgba(224,168,62,0.12)"
            stroke={palette.amber}
            strokeWidth="2"
            strokeDasharray="5 3"
          />
        ))}
      </svg>
    </ChartFrame>
  );
}

// ────────────────────────────────────────────────────────────
// RegionGrid — coarse regional choropleth
// ────────────────────────────────────────────────────────────

export function RegionGrid({
  rows,
  cols,
  values,
  stops,
  title,
  subtitle,
  caption,
  unit = "",
}: {
  rows: number;
  cols: number;
  /** row-major; null = outside the region of interest */
  values: (number | null)[];
  stops: { at: number; color: string; label: string }[];
  title?: string;
  subtitle?: string;
  caption?: string;
  unit?: string;
}) {
  const cell = 26;
  const W = cols * cell + 20;
  const H = rows * cell + 20;
  const colorFor = (v: number) => {
    let c = stops[0].color;
    for (const s of stops) if (v >= s.at) c = s.color;
    return c;
  };
  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      representative
      minWidth={Math.max(340, W)}
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
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img"
        aria-label={title ?? "Regional grid"}>
        {values.map((v, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = 10 + c * cell;
          const y = 10 + r * cell;
          if (v === null) return null;
          return (
            <rect
              key={i}
              x={x + 1}
              y={y + 1}
              width={cell - 2}
              height={cell - 2}
              rx="3"
              fill={colorFor(v)}
              opacity="0.9"
            >
              <title>{`${v}${unit}`}</title>
            </rect>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
