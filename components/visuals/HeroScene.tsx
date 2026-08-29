// components/visuals/HeroScene.tsx
// The hero visual: farmland seen obliquely from orbit, one parcel under
// analysis, and the readouts that come back from it. The ground is a real
// perspective projection rather than a flat grid, which is what makes it read
// as a landscape instead of a diagram. Deterministic — no random values.

function j(a: number, b: number, s: number) {
  const n = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453;
  return n - Math.floor(n) - 0.5;
}

const W = 760;
const H = 620;

// ── ground plane projection ────────────────────────────────────────────
// u: 0..1 across, v: 0..1 from horizon (far) to viewer (near)
const Y_FAR = 176;
const Y_NEAR = 470;
const BASE_W = 900;
const SCALE_FAR = 0.30;

function ground(u: number, v: number): [number, number] {
  const t = Math.pow(v, 0.78); // compress toward the horizon
  const s = SCALE_FAR + (1 - SCALE_FAR) * t;
  const x = W / 2 + (u - 0.5) * BASE_W * s;
  const y = Y_FAR + (Y_NEAR - Y_FAR) * t;
  return [x, y];
}

const COLS = 11;
const ROWS = 8;

// Jittered lattice in ground space, so parcels share exact edges
function node(c: number, r: number): [number, number] {
  const u = c / COLS + (c === 0 || c === COLS ? 0 : j(c, r, 3) * 0.035);
  const v = r / ROWS + (r === 0 || r === ROWS ? 0 : j(c, r, 8) * 0.028);
  return ground(u, v);
}

// Bare soil → senescing → vigorous canopy
const RAMP = [
  "#5C4326",
  "#7A5A2C",
  "#947A33",
  "#A89A3C",
  "#8FA845",
  "#6FA84C",
  "#4E9C4E",
  "#38874A",
  "#2A7342",
];

const TARGET_C = 6;
const TARGET_R = 4;

function Fields() {
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = j(c, r, 21) + 0.5;
      const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
      const isTarget = c === TARGET_C && r === TARGET_R;
      // Nearer rows read brighter; far rows fall into haze
      const depth = 0.42 + (r / ROWS) * 0.58;
      cells.push(
        <polygon
          key={`${r}-${c}`}
          points={[node(c, r), node(c + 1, r), node(c + 1, r + 1), node(c, r + 1)]
            .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
            .join(" ")}
          fill={RAMP[idx]}
          fillOpacity={isTarget ? 0.95 : depth}
          className="hs-field"
        />
      );
    }
  }
  return <>{cells}</>;
}

/** Bracketed reticle around the parcel under analysis. */
function Target() {
  const pts = [
    node(TARGET_C, TARGET_R),
    node(TARGET_C + 1, TARGET_R),
    node(TARGET_C + 1, TARGET_R + 1),
    node(TARGET_C, TARGET_R + 1),
  ];
  const poly = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const cx = pts.reduce((a, p) => a + p[0], 0) / 4;
  const cy = pts.reduce((a, p) => a + p[1], 0) / 4;
  return (
    <g>
      <polygon points={poly} className="hs-target-glow" />
      <polygon points={poly} className="hs-target" />
      {pts.map((p, i) => (
        <g key={i} className="hs-corner">
          <line x1={p[0] - 7} y1={p[1]} x2={p[0] + 7} y2={p[1]} />
          <line x1={p[0]} y1={p[1] - 7} x2={p[0]} y2={p[1] + 7} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r="7" className="hs-reticle-ring" />
      <circle cx={cx} cy={cy} r="7" className="hs-reticle-ping" />
      <circle cx={cx} cy={cy} r="1.8" className="hs-reticle-dot" />
    </g>
  );
}

export default function HeroScene() {
  const [tx, ty] = ground(
    (TARGET_C + 0.5) / COLS,
    (TARGET_R + 0.5) / ROWS
  );
  const satX = 604;
  const satY = 74;

  // Season trace for the inset
  const trace = [0.14, 0.3, 0.55, 0.76, 0.82, 0.7, 0.5, 0.33, 0.24];
  const tw = 176;
  const th = 46;
  const tracePath = trace
    .map((v, i) => {
      const x = (i / (trace.length - 1)) * tw;
      const y = th - v * th * 0.9;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="hero-scene" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="hero-scene-svg">
        <defs>
          <clipPath id="hs-ground">
            <polygon
              points={[
                ground(0, 0),
                ground(1, 0),
                ground(1, 1),
                ground(0, 1),
              ]
                .map((p) => `${p[0]},${p[1]}`)
                .join(" ")}
            />
          </clipPath>

          {/* Sensor beam from the satellite to the analysed parcel */}
          <linearGradient id="hs-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7BF7A8" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#4ADE80" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.03" />
          </linearGradient>

          {/* Haze toward the horizon */}
          <linearGradient id="hs-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4F7F4" stopOpacity="0.92" />
            <stop offset="34%" stopColor="#F4F7F4" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#F4F7F4" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="hs-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="hs-ndvi" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="28%" stopColor="#D97706" />
            <stop offset="52%" stopColor="#CBBF3F" />
            <stop offset="76%" stopColor="#6FA84C" />
            <stop offset="100%" stopColor="#1F7A3D" />
          </linearGradient>

          <filter id="hs-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ── ground ── */}
        <g clipPath="url(#hs-ground)">
          <Fields />
          {/* field boundaries */}
          <g className="hs-bounds">
            {Array.from({ length: COLS + 1 }, (_, c) => (
              <polyline
                key={`c${c}`}
                points={Array.from({ length: ROWS + 1 }, (_, r) =>
                  node(c, r).map((n) => n.toFixed(1)).join(",")
                ).join(" ")}
              />
            ))}
            {Array.from({ length: ROWS + 1 }, (_, r) => (
              <polyline
                key={`r${r}`}
                points={Array.from({ length: COLS + 1 }, (_, c) =>
                  node(c, r).map((n) => n.toFixed(1)).join(",")
                ).join(" ")}
              />
            ))}
          </g>
          <Target />
          {/* atmospheric haze over the far rows */}
          <rect x="0" y={Y_FAR - 10} width={W} height={Y_NEAR - Y_FAR + 40} fill="url(#hs-haze)" />
        </g>

        {/* ── sensor beam ── */}
        <g className="hs-beam-g">
          <polygon
            points={`${satX},${satY + 16} ${tx - 46},${ty + 6} ${tx + 46},${ty + 6}`}
            fill="url(#hs-beam)"
          />
          <circle cx={tx} cy={ty} r="52" fill="url(#hs-bloom)" filter="url(#hs-soft)" />
        </g>

        {/* ── satellite ── */}
        <g className="hs-sat" transform={`translate(${satX} ${satY})`}>
          {/* solar arrays */}
          <g className="hs-array">
            <rect x="-108" y="-19" width="76" height="38" rx="2" />
            <rect x="32" y="-19" width="76" height="38" rx="2" />
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`l${i}`} x1={-108 + (i + 1) * 12.6} y1="-19" x2={-108 + (i + 1) * 12.6} y2="19" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`r${i}`} x1={32 + (i + 1) * 12.6} y1="-19" x2={32 + (i + 1) * 12.6} y2="19" />
            ))}
          </g>
          <line x1="-32" y1="0" x2="-15" y2="0" className="hs-strut" />
          <line x1="32" y1="0" x2="15" y2="0" className="hs-strut" />
          {/* bus */}
          <rect x="-15" y="-22" width="30" height="44" rx="4" className="hs-bus" />
          <rect x="-15" y="-22" width="30" height="11" rx="4" className="hs-bus-top" />
          {/* sensor aperture */}
          <circle cx="0" cy="24" r="5.5" className="hs-aperture" />
          <path d="M -7 20 L 7 20 L 5 30 L -5 30 Z" className="hs-aperture-hood" />
          <line x1="0" y1="-22" x2="0" y2="-34" className="hs-strut" />
          <circle cx="0" cy="-37" r="3" className="hs-antenna" />
        </g>

        {/* ── scene labels ── */}
        <g className="hs-labels">
          <text x="248" y="150" className="hs-title">
            FIELD 04 · KHARIF 2024
          </text>
          <text x="248" y="170" className="hs-coord">
            23°14′N, 77°34′E
          </text>
        </g>

        <g transform={`translate(${W - 132} 132)`}>
          <rect width="120" height="26" rx="13" className="hs-pill" />
          <circle cx="15" cy="13" r="3.5" className="hs-pill-dot" />
          <text x="27" y="17.5" className="hs-pill-text">
            6-DAY PASS
          </text>
        </g>

        {/* ── readout panels ── */}
        <g transform={`translate(18 ${H - 128})`}>
          <rect width="330" height="112" rx="14" className="hs-panel" />
          <text x="20" y="30" className="hs-panel-label">
            VEGETATION INDEX (NDVI)
          </text>
          <rect x="20" y="44" width="290" height="12" rx="3" fill="url(#hs-ndvi)" />
          <text x="20" y="74" className="hs-panel-tick">
            0.0
          </text>
          <text x="165" y="74" textAnchor="middle" className="hs-panel-tick">
            0.5
          </text>
          <text x="310" y="74" textAnchor="end" className="hs-panel-tick">
            1.0
          </text>
          <text x="20" y="94" className="hs-panel-tick">
            Low vegetation
          </text>
          <text x="310" y="94" textAnchor="end" className="hs-panel-tick">
            High vegetation
          </text>
        </g>

        <g transform={`translate(364 ${H - 128})`}>
          <rect width="378" height="112" rx="14" className="hs-panel" />
          <text x="20" y="30" className="hs-panel-label">
            SEASON TRACE
          </text>
          <g transform="translate(20 42)">
            <path d={tracePath} className="hs-trace" />
            {trace.map((v, i) =>
              i % 2 === 0 ? (
                <circle
                  key={i}
                  cx={(i / (trace.length - 1)) * tw}
                  cy={th - v * th * 0.9}
                  r={i === 4 ? 4.5 : 2.6}
                  className={i === 4 ? "hs-trace-dot hs-trace-peak" : "hs-trace-dot"}
                />
              ) : null
            )}
          </g>
          {["May", "Jul", "Sep", "Nov"].map((m, i) => (
            <text
              key={m}
              x={20 + (i / 3) * tw}
              y="102"
              textAnchor="middle"
              className="hs-panel-tick"
            >
              {m}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
