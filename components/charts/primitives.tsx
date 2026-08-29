// components/charts/primitives.tsx — shared chart scaffolding.
// Charts are hand-built SVG on purpose: a general-purpose charting library
// bridges nulls by default, and a line drawn through an unobserved interval
// is a claim we never measured. Owning the path generation makes the honest
// behaviour the default rather than a flag someone can forget.

import type { ReactNode } from "react";

export const palette = {
  green: "#4ADE80",
  greenDim: "#2FB863",
  cyan: "#38B6D9",
  cyanDim: "#2A93B3",
  amber: "#E0A83E",
  amberDim: "#C08F2E",
  red: "#E0674C",
  redDim: "#D93A3A",
  violet: "#A28BD4",
  ink: "#ECF2ED",
  muted: "#9DAEA4",
  faint: "#75867C",
  grid: "rgba(30,42,36,0.9)",
  surface: "#0E1412",
};

/** Four severity / band steps used consistently across every chart on the site. */
export const severityScale = [
  { key: "healthy", label: "Healthy", color: palette.green },
  { key: "mild", label: "Mild", color: palette.cyan },
  { key: "moderate", label: "Moderate", color: palette.amber },
  { key: "severe", label: "Severe", color: palette.red },
];

export const bandScale = [
  { key: "excellent", label: "Excellent", color: palette.green },
  { key: "good", label: "Good", color: palette.cyan },
  { key: "fair", label: "Fair", color: palette.amber },
  { key: "poor", label: "Poor", color: palette.red },
];

export function scaleLinear(
  domain: [number, number],
  range: [number, number]
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (v: number) => r0 + ((v - d0) / span) * (r1 - r0);
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min;
  if (span <= 0) return [min];
  const rough = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) {
    out.push(Math.round(t * 1e6) / 1e6);
  }
  return out;
}

/**
 * Width to reserve for a chart's left-hand label column.
 *
 * SVG text does not wrap, and anything wider than the gutter is clipped at the
 * viewBox edge — where a half-drawn row label reads as missing data rather than
 * as a layout bug. So the gutter is measured from the longest string that has
 * to fit in it. Groups exist because a row usually carries a label and a note
 * set at different sizes.
 *
 * `charW` is the average advance width in px for the face the text is set in.
 * Multiply the font size by roughly 0.6 for the mono face and 0.53 for the body
 * face, then round up — under-estimating it clips the longest label, which is
 * the one most worth reading.
 */
export function labelGutter(
  groups: { labels: (string | undefined)[]; charW: number }[],
  { pad = 20, min = 120, max = 320 }: { pad?: number; min?: number; max?: number } = {}
): number {
  const widest = Math.max(
    0,
    ...groups.flatMap((g) =>
      g.labels
        .filter((l): l is string => typeof l === "string")
        .map((l) => l.length * g.charW)
    )
  );
  return Math.min(max, Math.max(min, Math.ceil(widest) + pad));
}

/** Wraps a chart with a title, an optional caption, and a scroll container. */
export function ChartFrame({
  title,
  subtitle,
  caption,
  note,
  footer,
  legend,
  representative,
  minWidth = 520,
  children,
}: {
  title?: string;
  subtitle?: string;
  caption?: string;
  /** Prose that belongs to the chart but must not sit inside the horizontal
   *  scroller — a keyed list of reasons, for instance. Anything passed as
   *  `children` inherits `minWidth`, which is right for a plot and wrong for a
   *  paragraph: on a narrow screen it would make the text itself scroll. */
  footer?: ReactNode;
  /** A short technical footnote, set in mono above the caption. Available on
   *  every chart: a reading instruction or a caveat about one series is a
   *  different register from the caption's argument, and mixing them buries
   *  both. */
  note?: string;
  legend?: ReactNode;
  /** Marks a chart whose shape is illustrative rather than a measured export. */
  representative?: boolean;
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <figure className="chart-frame">
      {(title || representative) && (
        <div className="chart-frame-head">
          <div>
            {title && <h4 className="chart-title">{title}</h4>}
            {subtitle && <p className="chart-subtitle">{subtitle}</p>}
          </div>
          {representative && (
            <span className="chart-flag" title="Shape is illustrative; the numbers behind it are described in the caption.">
              representative
            </span>
          )}
        </div>
      )}
      {legend && <div className="chart-legend">{legend}</div>}
      <div className="chart-scroll">
        <div style={{ minWidth }}>{children}</div>
      </div>
      {footer}
      {note && <p className="chart-note">{note}</p>}
      {caption && <figcaption className="chart-caption">{caption}</figcaption>}
    </figure>
  );
}

export function LegendSwatch({
  color,
  label,
  dash,
  shape = "line",
}: {
  color: string;
  label: string;
  dash?: string;
  shape?: "line" | "box" | "dot";
}) {
  return (
    <span className="legend-item">
      <svg width="22" height="12" aria-hidden="true">
        {shape === "box" ? (
          <rect x="1" y="2" width="20" height="8" rx="2" fill={color} />
        ) : shape === "dot" ? (
          <circle cx="11" cy="6" r="4" fill={color} />
        ) : (
          <line
            x1="1"
            y1="6"
            x2="21"
            y2="6"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={dash}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span>{label}</span>
    </span>
  );
}

/** Hatch pattern used to mark spans with no observation. Never draw a line across one. */
export function GapPattern({ id = "gap-hatch" }: { id?: string }) {
  return (
    <defs>
      <pattern
        id={id}
        width="7"
        height="7"
        patternTransform="rotate(45)"
        patternUnits="userSpaceOnUse"
      >
        <rect width="7" height="7" fill="rgba(74,96,128,0.10)" />
        <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(157,174,164,0.35)" strokeWidth="1.4" />
      </pattern>
    </defs>
  );
}

export function AxisLabel({
  x,
  y,
  children,
  anchor = "middle",
  size = 10,
  color = palette.faint,
  rotate,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
  color?: string;
  rotate?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill={color}
      fontFamily="var(--font-mono)"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    >
      {children}
    </text>
  );
}
