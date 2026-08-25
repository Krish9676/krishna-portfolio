// components/visuals/Backdrop.tsx
// Cartographic atmosphere: terrain contours, field boundary vectors and a map
// graticule — the look of an analysis surface rather than an illustration.
// Line work only, no filled colour blocks. Everything is deterministic, so the
// server and client render identical markup.

/** A closed, organically perturbed contour ring. */
function contourPath(
  cx: number,
  cy: number,
  r: number,
  seed: number,
  squash = 0.62,
  steps = 72
) {
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wob =
      1 +
      0.17 * Math.sin(a * 2 + seed * 1.3) +
      0.1 * Math.sin(a * 3 + seed * 2.1) +
      0.055 * Math.sin(a * 5 + seed * 0.7) +
      0.03 * Math.sin(a * 8 + seed * 3.3);
    const x = cx + Math.cos(a) * r * wob;
    const y = cy + Math.sin(a) * r * wob * squash;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Nested contours around one landform. Index lines every fifth ring. */
function Landform({
  cx,
  cy,
  from,
  to,
  step,
  seed,
  squash,
}: {
  cx: number;
  cy: number;
  from: number;
  to: number;
  step: number;
  seed: number;
  squash?: number;
}) {
  const rings = [];
  let n = 0;
  for (let r = from; r <= to; r += step, n++) {
    rings.push(
      <path
        key={r}
        d={contourPath(cx, cy, r, seed + n * 0.24, squash)}
        className={n % 5 === 0 ? "bd-contour bd-contour-index" : "bd-contour"}
      />
    );
  }
  return <g>{rings}</g>;
}

/** Field boundaries as vectors — outlines, never fills. */
function FieldVectors({
  cols,
  rows,
  w,
  hgt,
  seed,
}: {
  cols: number;
  rows: number;
  w: number;
  hgt: number;
  seed: number;
}) {
  const cw = w / cols;
  const ch = hgt / rows;
  const j = (a: number, b: number, s: number) => {
    const n = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453;
    return n - Math.floor(n) - 0.5;
  };
  const nx = (c: number, r: number) =>
    c === 0 || c === cols ? c * cw : c * cw + j(c, r, seed) * cw * 0.42;
  const ny = (c: number, r: number) =>
    r === 0 || r === rows ? r * ch : r * ch + j(c, r, seed + 11) * ch * 0.38;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Leave gaps, so it reads as a real landscape rather than a grid
      if (j(c, r, seed + 31) < -0.16) continue;
      cells.push(
        <polygon
          key={`${r}-${c}`}
          points={[
            [nx(c, r), ny(c, r)],
            [nx(c + 1, r), ny(c + 1, r)],
            [nx(c + 1, r + 1), ny(c + 1, r + 1)],
            [nx(c, r + 1), ny(c, r + 1)],
          ]
            .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
            .join(" ")}
          className="bd-parcel"
        />
      );
    }
  }
  return <g>{cells}</g>;
}

export type BackdropVariant = "site" | "hero";

export default function Backdrop({
  variant = "site",
}: {
  variant?: BackdropVariant;
}) {
  const hero = variant === "hero";
  const W = 1440;
  const H = 900;

  return (
    <div className={`backdrop backdrop-${variant}`} aria-hidden="true">
      <svg
        className="backdrop-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Keeps the line work away from the reading area */}
          <radialGradient id={`bd-fade-${variant}`} cx="50%" cy="52%" r="78%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="42%" stopColor="#fff" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
          </radialGradient>
          <mask id={`bd-mask-${variant}`}>
            <rect width={W} height={H} fill={`url(#bd-fade-${variant})`} />
          </mask>
        </defs>

        <g mask={`url(#bd-mask-${variant})`} opacity={hero ? 1 : 0.72}>
          {/* Terrain */}
          <Landform cx={250} cy={210} from={40} to={310} step={19} seed={2} />
          <Landform cx={1210} cy={690} from={34} to={280} step={17} seed={7} squash={0.7} />
          <Landform cx={900} cy={150} from={26} to={150} step={16} seed={4} squash={0.55} />

          {/* Cultivated parcels */}
          <FieldVectors cols={hero ? 14 : 12} rows={hero ? 9 : 8} w={W} hgt={H} seed={hero ? 5 : 3} />

          {/* Map graticule with tick marks along the top edge */}
          <g className="bd-graticule">
            {Array.from({ length: 15 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={(i + 1) * (W / 16)}
                y1="0"
                x2={(i + 1) * (W / 16)}
                y2={H}
              />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={`hz${i}`}
                x1="0"
                y1={(i + 1) * (H / 10)}
                x2={W}
                y2={(i + 1) * (H / 10)}
              />
            ))}
          </g>

          {/* Two ground tracks, drawn as survey lines */}
          <path
            className="bd-track"
            d={`M -120,${H * 0.84} C ${W * 0.3},${H * 0.56} ${W * 0.6},${H * 0.44} ${W + 120},${H * 0.14}`}
          />
          <path
            className="bd-track bd-track-b"
            d={`M ${W + 120},${H * 0.7} C ${W * 0.72},${H * 0.88} ${W * 0.28},${H * 0.22} -120,${H * 0.36}`}
          />
        </g>
      </svg>

      <div className="backdrop-wash" />
      <div className="backdrop-grain" />
    </div>
  );
}
