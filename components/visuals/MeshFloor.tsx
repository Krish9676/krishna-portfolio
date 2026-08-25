// components/visuals/MeshFloor.tsx
// The dotted terrain mesh along the bottom of the hero — a point cloud of
// elevation, receding in perspective. Deterministic; generated once at render.

const W = 1600;
const H = 220;
const COLS = 58;
const ROWS = 11;

export default function MeshFloor() {
  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    // rows compress toward the horizon
    const t = Math.pow(r / (ROWS - 1), 1.5);
    const y0 = 8 + t * (H - 30);
    const spread = 0.42 + t * 0.58;
    const opacity = 0.12 + t * 0.55;
    const radius = 0.9 + t * 1.3;
    for (let c = 0; c <= COLS; c++) {
      const u = c / COLS;
      const x = W / 2 + (u - 0.5) * W * spread;
      // two superposed waves give a rolling landform
      const wave =
        Math.sin(u * Math.PI * 3.1 + r * 0.18) * 15 * (0.35 + t) +
        Math.sin(u * Math.PI * 6.7 - r * 0.11) * 6 * (0.3 + t);
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={x.toFixed(1)}
          cy={(y0 + wave).toFixed(1)}
          r={radius.toFixed(2)}
          opacity={opacity.toFixed(2)}
        />
      );
    }
  }

  return (
    <div className="mesh-floor" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
        <g className="mesh-dots">{dots}</g>
      </svg>
    </div>
  );
}
