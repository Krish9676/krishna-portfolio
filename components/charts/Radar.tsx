// components/charts/Radar.tsx
// A profile comparison across several named dimensions at once.
//
// Radar plots deserve their bad reputation when the axes are unrelated or the
// ordering is arbitrary, because then the enclosed area means nothing. They are
// the right form for the one case they are used for here: the *same* fixed set
// of dimensions measured on several subjects, where the question is which
// subject differs on which dimension. Every axis is on the same 0-100 scale so
// the rings are comparable, and the dimension order is fixed across every panel
// on the site so two radars can be read against each other.

import { ChartFrame, LegendSwatch, palette } from "./primitives";

export interface RadarSeries {
  name: string;
  color: string;
  /** One value 0-100 per axis, in axis order */
  values: number[];
  dash?: string;
}

export function RadarChart({
  axes,
  series,
  rings = [25, 50, 75, 100],
  size = 380,
  title,
  subtitle,
  caption,
  note,
  representative,
  scaleNote = "every axis 0–100, higher is stronger",
}: {
  axes: string[];
  series: RadarSeries[];
  rings?: number[];
  size?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  scaleNote?: string;
}) {
  const W = size;
  const H = size;
  const cx = W / 2;
  const cy = H / 2 + 4;
  const k = axes.length;

  // Start at twelve o'clock and go clockwise, which is how a reader expects it.
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / k;

  // The plot radius is derived from how much room the axis labels need, because
  // SVG text does not wrap and a label pushed outside the viewBox is silently
  // clipped. The constraint is evaluated per axis rather than from the longest
  // label overall: a long label on a vertical spoke costs almost no horizontal
  // room, so letting it set the radius for every axis wastes most of the box.
  const labelRingFactor = 1.26;
  const charW = 5.4; // 9.5px mono, measured
  const lineH = 12;

  const rFit = Math.min(
    ...axes.map((a, i) => {
      const c = Math.abs(Math.cos(angle(i)));
      const s = Math.abs(Math.sin(angle(i)));
      const w = a.length * charW;
      // Labels near the vertical are centred, so only half the text sticks out.
      const horizontalReach = c < 0.08 ? w / 2 : w;
      const hLimit =
        c < 0.02
          ? Infinity
          : (W / 2 - horizontalReach - 6) / (c * labelRingFactor);
      const vLimit =
        s < 0.02 ? Infinity : (H / 2 - lineH - 8) / (s * labelRingFactor);
      return Math.min(hLimit, vLimit);
    })
  );
  const r = Math.max(52, Math.min(size * 0.36, rFit));

  const pt = (i: number, v: number) => {
    const a = angle(i);
    const rad = (v / 100) * r;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={Math.max(300, W)}
      legend={
        <>
          {series.map((s) => (
            <LegendSwatch key={s.name} color={s.color} label={s.name} dash={s.dash} />
          ))}
          <span className="legend-item">
            <span style={{ color: palette.faint }}>{scaleNote}</span>
          </span>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={title ?? "Profile comparison"}
      >
        {/* rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={axes
              .map((_, i) => pt(i, ring).join(","))
              .join(" ")}
            fill="none"
            stroke={palette.grid}
            strokeWidth="1"
          />
        ))}
        {/* spokes */}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 100);
          return (
            <line
              key={a}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(43,58,50,0.9)"
              strokeWidth="1"
            />
          );
        })}

        {/* series polygons — outline always drawn, so overlaps stay readable */}
        {series.map((s) => {
          const pts = axes
            .map((_, i) => pt(i, s.values[i] ?? 0).join(","))
            .join(" ");
          return (
            <g key={s.name}>
              <polygon points={pts} fill={s.color} opacity="0.13" />
              <polygon
                points={pts}
                fill="none"
                stroke={s.color}
                strokeWidth="2.1"
                strokeDasharray={s.dash}
                strokeLinejoin="round"
              />
              {axes.map((_, i) => {
                const [x, y] = pt(i, s.values[i] ?? 0);
                return (
                  <circle key={i} cx={x} cy={y} r="2.8" fill={s.color}>
                    <title>{`${s.name} · ${axes[i]}: ${s.values[i]}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}

        {/* axis labels, pushed outside the outer ring */}
        {axes.map((a, i) => {
          const [x, y] = pt(i, labelRingFactor * 100);
          const anchor =
            Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
          return (
            <text
              key={a}
              x={x}
              y={y + 3.5}
              textAnchor={anchor}
              fontSize="9.5"
              fill={palette.muted}
              fontFamily="var(--font-mono)"
            >
              {a}
            </text>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
