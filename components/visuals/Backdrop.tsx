// components/visuals/Backdrop.tsx
// The ground the whole site sits on: farmland seen from above, with the
// remote-sensing overlays an analyst would put on it — a parcel mosaic tinted
// along an NDVI ramp, a few plots pulled out at analysis saturation, a survey
// grid receding to the horizon, and a satellite laying a scan across it.
//
// Two rules shape everything here:
//
//   · It is atmosphere, not content. Every layer is masked away from the middle
//     of the frame and washed over, because the reading area has to win. The
//     mosaic is the reason the glass has something to refract; it is never the
//     reason to look at the page.
//   · It is drawn, not photographed. Deterministic geometry means server and
//     client render identical markup, there is no image to load at any
//     breakpoint, and the palette is the same one the charts use — so the
//     background cannot drift out of step with the data on top of it.

/** Stable hash in −0.5…0.5. No Math.random anywhere in this file. */
function j(a: number, b: number, s: number) {
  const n = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453;
  return n - Math.floor(n) - 0.5;
}

/**
 * Every coordinate this file emits goes through here.
 *
 * React hydration compares the server's markup against the client's attribute
 * by attribute, and `Math.pow` with a fractional exponent can differ in the
 * last bit between Node's libm and the browser's — which is enough to produce a
 * hydration mismatch on a purely decorative line. Rounding to two decimals is
 * far finer than a pixel at any viewport and removes the class of bug entirely.
 */
const round = (n: number) => Math.round(n * 100) / 100;

const W = 1440;
const H = 900;

// Bare soil → senescing → vigorous canopy. Shared with the hero scene, so the
// backdrop and the foreground illustration describe the same landscape.
const CANOPY = [
  "#4A3620",
  "#634824",
  "#5C4326",
  "#7A5A2C",
  "#8A7530",
  "#8FA845",
  "#6FA84C",
  "#4E9C4E",
  "#38874A",
  "#2A7342",
  "#245F3A",
];

// The false-colour ramp an index map is actually read in: water and bare ground
// through to dense canopy. Used only on the analysis patches, where the point is
// that they look like a processed product rather than like ground.
const INDEX_RAMP = [
  "#2B6CA8",
  "#2A93B3",
  "#38B6D9",
  "#4E9C4E",
  "#6FA84C",
  "#A8B93F",
  "#E0A83E",
  "#D9773A",
  "#C4482F",
];

// ── the parcel mosaic ───────────────────────────────────────────────────
// A jittered lattice rather than a grid of cells: adjacent parcels share exact
// edges, so the field boundaries read as boundaries. Drawn as a few dozen quads
// on purpose — a per-pixel grid at this size costs an order of magnitude more
// nodes and looks like noise rather than like farmland.
function ParcelMosaic({
  cols,
  rows,
  seed,
}: {
  cols: number;
  rows: number;
  seed: number;
}) {
  const cw = W / cols;
  const ch = H / rows;
  const nx = (c: number, r: number) =>
    c === 0 || c === cols ? c * cw : c * cw + j(c, r, seed) * cw * 0.4;
  const ny = (c: number, r: number) =>
    r === 0 || r === rows ? r * ch : r * ch + j(c, r, seed + 11) * ch * 0.36;

  const quads = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = j(c, r, seed + 5) + 0.5;
      const fill = CANOPY[Math.min(CANOPY.length - 1, Math.floor(t * CANOPY.length))];
      quads.push(
        <polygon
          key={`${r}-${c}`}
          className="bd-parcel-fill"
          fill={fill}
          points={[
            [nx(c, r), ny(c, r)],
            [nx(c + 1, r), ny(c + 1, r)],
            [nx(c + 1, r + 1), ny(c + 1, r + 1)],
            [nx(c, r + 1), ny(c, r + 1)],
          ]
            .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
            .join(" ")}
        />
      );
    }
  }
  return <g>{quads}</g>;
}

// ── analysis patches ────────────────────────────────────────────────────
// The thing that makes the surface read as remote sensing rather than as a
// texture: a handful of plots rendered in false colour at the resolution the
// index is actually computed at, sitting over ground that is not.
function IndexPatch({
  x,
  y,
  w,
  h,
  skew,
  cols,
  rows,
  seed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Horizontal shear, so the patch sits on the same oblique plane as the grid */
  skew: number;
  cols: number;
  rows: number;
  seed: number;
}) {
  const cw = w / cols;
  const ch = h / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Two superposed waves plus jitter: contiguous zones rather than confetti,
      // which is what a real index map looks like at parcel scale.
      const field =
        0.5 +
        0.3 * Math.sin((c / cols) * 3.1 + seed) +
        0.22 * Math.sin((r / rows) * 2.3 - seed * 1.7) +
        j(c, r, seed + 3) * 0.28;
      const t = Math.max(0, Math.min(0.999, field));
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={round(x + c * cw + r * skew)}
          y={round(y + r * ch)}
          width={round(cw + 0.6)}
          height={round(ch + 0.6)}
          fill={INDEX_RAMP[Math.floor(t * INDEX_RAMP.length)]}
        />
      );
    }
  }
  const outline = [
    [x, y],
    [x + w, y],
    [x + w + rows * skew, y + h],
    [x + rows * skew, y + h],
  ]
    .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");

  return (
    <g className="bd-patch">
      <g className="bd-patch-cells">{cells}</g>
      <polygon className="bd-patch-edge" points={outline} />
    </g>
  );
}

// ── survey grid in perspective ──────────────────────────────────────────
// Lines converging on a vanishing point above the horizon, with the cross lines
// compressed toward it. A flat grid over a landscape reads as a diagram; this
// reads as a plane lying on the ground.
function PerspectiveGrid({
  horizon,
  bottom,
  vpx,
  lines = 15,
  bands = 9,
}: {
  horizon: number;
  bottom: number;
  vpx: number;
  lines?: number;
  bands?: number;
}) {
  const spread = W * 1.55;
  const rays = Array.from({ length: lines }, (_, i) => {
    const u = i / (lines - 1);
    const x2 = W / 2 + (u - 0.5) * spread;
    return (
      <line
        key={`ray${i}`}
        x1={round(vpx)}
        y1={round(horizon)}
        x2={round(x2)}
        y2={round(bottom)}
      />
    );
  });
  const cross = Array.from({ length: bands }, (_, i) => {
    // Compressed toward the horizon, so the spacing itself carries the depth.
    const t = Math.pow((i + 1) / bands, 2.1);
    const y = horizon + (bottom - horizon) * t;
    const halfW = (spread / 2) * t;
    return (
      <line
        key={`cross${i}`}
        x1={round(W / 2 - halfW)}
        y1={round(y)}
        x2={round(W / 2 + halfW)}
        y2={round(y)}
      />
    );
  });
  return (
    <g className="bd-persp">
      {rays}
      {cross}
    </g>
  );
}

/** A closed, organically perturbed contour ring. */
function contourPath(
  cx: number,
  cy: number,
  r: number,
  seed: number,
  squash = 0.62,
  steps = 56
) {
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wob =
      1 +
      0.17 * Math.sin(a * 2 + seed * 1.3) +
      0.1 * Math.sin(a * 3 + seed * 2.1) +
      0.055 * Math.sin(a * 5 + seed * 0.7);
    const x = cx + Math.cos(a) * r * wob;
    const y = cy + Math.sin(a) * r * wob * squash;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Nested contours around one landform. Index lines every fourth ring. */
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
        className={n % 4 === 0 ? "bd-contour bd-contour-index" : "bd-contour"}
      />
    );
  }
  return <g>{rings}</g>;
}

/** Satellite laying a scan swath across the field, as in the hero scene. */
function SatelliteScan({ x, y, targetY }: { x: number; y: number; targetY: number }) {
  return (
    <g className="bd-sat-g">
      <g className="bd-beam">
        <polygon
          points={`${x},${y + 10} ${x - 210},${targetY} ${x + 130},${targetY}`}
        />
        <line x1={x} y1={y + 10} x2={x - 210} y2={targetY} />
        <line x1={x} y1={y + 10} x2={x + 130} y2={targetY} />
        <line x1={x} y1={y + 10} x2={x - 40} y2={targetY} />
      </g>
      <g transform={`translate(${x} ${y})`} className="bd-sat">
        <line x1="-30" y1="0" x2="-13" y2="0" className="bd-sat-strut" />
        <line x1="30" y1="0" x2="13" y2="0" className="bd-sat-strut" />
        <rect x="-52" y="-13" width="22" height="26" rx="2" className="bd-sat-array" />
        <rect x="30" y="-13" width="22" height="26" rx="2" className="bd-sat-array" />
        <rect x="-13" y="-18" width="26" height="36" rx="4" className="bd-sat-bus" />
        <circle cx="0" cy="21" r="4.5" className="bd-sat-eye" />
      </g>
    </g>
  );
}

export type BackdropVariant = "site" | "hero";

export default function Backdrop({
  variant = "site",
}: {
  variant?: BackdropVariant;
}) {
  const hero = variant === "hero";
  const v = variant;

  return (
    <div className={`backdrop backdrop-${variant}`} aria-hidden="true">
      <svg
        className="backdrop-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Keeps every layer away from the reading area */}
          <radialGradient id={`bd-fade-${v}`} cx="50%" cy="52%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="38%" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.92" />
          </radialGradient>
          <mask id={`bd-mask-${v}`}>
            <rect width={W} height={H} fill={`url(#bd-fade-${v})`} />
          </mask>

          {/* Sky above the horizon, ground below it */}
          <linearGradient id={`bd-sky-${v}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4C6B" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#2A93B3" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2A93B3" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`bd-horizon-${v}`} cx="50%" cy="100%" r="62%">
            <stop offset="0%" stopColor="#8FE3C0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8FE3C0" stopOpacity="0" />
          </radialGradient>

          {/* The mosaic fades out toward the horizon so the plane recedes */}
          <linearGradient id={`bd-depth-${v}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="22%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="62%" stopColor="#000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </linearGradient>
          <mask id={`bd-depthmask-${v}`}>
            <rect width={W} height={H} fill={`url(#bd-depth-${v})`} />
          </mask>
        </defs>

        <g mask={`url(#bd-mask-${v})`} opacity={hero ? 1 : 0.78}>
          {/* ── sky and horizon ── */}
          <g className="bd-sky">
            <rect width={W} height={340} fill={`url(#bd-sky-${v})`} />
            <ellipse cx={W / 2} cy={318} rx={W * 0.72} ry="120"
              fill={`url(#bd-horizon-${v})`} />
          </g>

          {/* ── the ground: filled parcels, receding ── */}
          <g mask={`url(#bd-depthmask-${v})`}>
            <ParcelMosaic cols={hero ? 11 : 9} rows={hero ? 8 : 7} seed={hero ? 5 : 3} />
          </g>

          {/* ── plots pulled out in false colour ── */}
          <IndexPatch x={92} y={548} w={286} h={150} skew={-26} cols={10} rows={6} seed={1.4} />
          <IndexPatch x={1004} y={496} w={252} h={126} skew={22} cols={9} rows={6} seed={3.1} />
          <IndexPatch x={604} y={676} w={210} h={104} skew={-14} cols={8} rows={5} seed={5.8} />

          {/* ── survey grid on the ground plane ── */}
          <PerspectiveGrid horizon={318} bottom={H + 60} vpx={W * 0.54} />

          {/* ── terrain ── */}
          <Landform cx={210} cy={250} from={54} to={300} step={26} seed={2} />
          <Landform cx={1250} cy={700} from={46} to={270} step={24} seed={7} squash={0.7} />

          {/* ── acquisition ── */}
          {!hero && <SatelliteScan x={1052} y={150} targetY={498} />}

          {/* ── map graticule ── */}
          <g className="bd-graticule">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`gv${i}`} x1={(i + 1) * (W / 12)} y1="0"
                x2={(i + 1) * (W / 12)} y2={H} />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`gh${i}`} x1="0" y1={(i + 1) * (H / 8)}
                x2={W} y2={(i + 1) * (H / 8)} />
            ))}
          </g>

          {/* ── ground tracks ── */}
          <path
            className="bd-track"
            d={`M -120,${H * 0.86} C ${W * 0.3},${H * 0.6} ${W * 0.6},${H * 0.48} ${W + 120},${H * 0.18}`}
          />
          <path
            className="bd-track bd-track-b"
            d={`M ${W + 120},${H * 0.72} C ${W * 0.72},${H * 0.9} ${W * 0.28},${H * 0.26} -120,${H * 0.4}`}
          />
        </g>
      </svg>

      <div className="backdrop-wash" />
      <div className="backdrop-grain" />
    </div>
  );
}
