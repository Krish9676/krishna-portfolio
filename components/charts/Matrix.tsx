// components/charts/Matrix.tsx
// A numeric matrix — the form that shows *where* a classifier is wrong rather
// than only how often. A single accuracy figure hides the thing that decides
// whether a model is safe to deploy: a cereal called as another cereal is a
// recoverable error, and a nutrient disorder called as a disease sends someone
// to buy a spray they do not need.
//
// Deliberate choices:
//   · Rows are normalised to 100, so each row reads as "of everything that was
//     actually this, where did it go". Column-normalised matrices answer a
//     different question and get confused with this one constantly.
//   · The diagonal uses a different hue from the off-diagonal. Correct and
//     incorrect are categorically different, not two ends of one ramp.
//   · Cells below the print threshold stay blank rather than showing "0", so
//     the eye lands on the confusions that actually exist.
//   · The same component draws a transition matrix (from-class to to-class),
//     where the diagonal means "unchanged" rather than "correct".

import { ChartFrame, labelGutter, palette } from "./primitives";

export function NumericMatrix({
  rowLabels,
  colLabels,
  values,
  support,
  supportLabel = "n",
  rowAxis = "actual",
  colAxis = "predicted",
  diagonalMeaning = "correct",
  offDiagonalMeaning = "confused",
  unit = "%",
  printBelow = 1,
  cell = 44,
  title,
  subtitle,
  caption,
  note,
  representative,
  highlights,
}: {
  rowLabels: string[];
  colLabels: string[];
  /** values[row][col], each row summing to about 100 */
  values: number[][];
  /** Per-row count, printed in a trailing column */
  support?: (number | string)[];
  supportLabel?: string;
  rowAxis?: string;
  colAxis?: string;
  diagonalMeaning?: string;
  offDiagonalMeaning?: string;
  unit?: string;
  /** Cells at or below this value are left blank */
  printBelow?: number;
  cell?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  /** Off-diagonal cells worth ringing, as [row, col] pairs with a reason */
  highlights?: { at: [number, number]; why: string }[];
}) {
  // Both gutters size to their longest label: SVG text does not wrap, and a
  // fixed gutter clips the overflow at the viewBox edge, where it reads as a
  // missing label. The column head allows for the 40-degree label rotation.
  const rowW = labelGutter([{ labels: rowLabels, charW: 6.4 }], {
    min: 120,
    max: 320,
  });
  // Column labels are drawn at -40 degrees; only their rise has to clear the grid.
  const headH = labelGutter([{ labels: colLabels, charW: 5.4 * 0.65 }], {
    min: 56,
    max: 150,
    pad: 30,
  });
  const supW = support ? 56 : 0;
  // A -40 degree label runs up and to the right of its column, so the rightmost
  // columns need room past the grid or their labels are clipped at the edge.
  const colReach = Math.max(
    ...colLabels.map((c, i) => i * cell + cell / 2 + c.length * 5.4 * 0.766)
  );
  const W = Math.max(
    rowW + colLabels.length * cell + supW + 14,
    rowW + Math.ceil(colReach) + supW + 10
  );
  const H = headH + rowLabels.length * cell + 14;

  const hit = new Map<string, string>();
  highlights?.forEach((h) => hit.set(`${h.at[0]}-${h.at[1]}`, h.why));

  // Diagonal: green, opacity by magnitude. Off-diagonal: amber into red, so a
  // large confusion is visually louder than a small one without becoming a
  // second green.
  const fillFor = (v: number, onDiagonal: boolean) => {
    if (v <= 0) return "rgba(30,42,36,0.35)";
    const t = Math.min(1, v / 100);
    if (onDiagonal) return `rgba(74,222,128,${(0.14 + t * 0.76).toFixed(3)})`;
    const strong = Math.min(1, v / 30);
    return strong > 0.62
      ? `rgba(224,103,76,${(0.2 + strong * 0.6).toFixed(3)})`
      : `rgba(224,168,62,${(0.14 + strong * 0.62).toFixed(3)})`;
  };

  const textFor = (v: number, onDiagonal: boolean) =>
    onDiagonal && v > 55 ? "#08100B" : palette.ink;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={Math.max(460, W)}
      footer={
        highlights && highlights.length > 0 ? (
          <ul className="matrix-calls">
            {highlights.map((h) => (
              <li key={`${h.at[0]}-${h.at[1]}`}>
                <span className="matrix-call-cell">
                  {rowLabels[h.at[0]]} → {colLabels[h.at[1]]}
                </span>
                <span className="matrix-call-why">{h.why}</span>
              </li>
            ))}
          </ul>
        ) : undefined
      }
      legend={
        <>
          <span className="legend-item">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="rgba(74,222,128,0.8)" />
            </svg>
            <span>diagonal — {diagonalMeaning}</span>
          </span>
          <span className="legend-item">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="rgba(224,168,62,0.6)" />
            </svg>
            <span>off-diagonal — {offDiagonalMeaning}</span>
          </span>
          <span className="legend-item">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="rgba(224,103,76,0.7)" />
            </svg>
            <span>the confusion that matters</span>
          </span>
          <span className="legend-item">
            <span style={{ color: palette.faint }}>rows sum to 100{unit}</span>
          </span>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        role="img"
        aria-label={title ?? `${rowAxis} against ${colAxis} matrix`}
      >
        {/* axis captions */}
        <text
          x={rowW + (colLabels.length * cell) / 2}
          y={13}
          textAnchor="middle"
          fontSize="9.5"
          fill={palette.faint}
          fontFamily="var(--font-mono)"
          letterSpacing="0.14em"
        >
          {colAxis.toUpperCase()} →
        </text>
        <text
          x={12}
          y={headH + (rowLabels.length * cell) / 2}
          textAnchor="middle"
          fontSize="9.5"
          fill={palette.faint}
          fontFamily="var(--font-mono)"
          letterSpacing="0.14em"
          transform={`rotate(-90 12 ${headH + (rowLabels.length * cell) / 2})`}
        >
          {rowAxis.toUpperCase()} →
        </text>

        {/* column headers, angled so long labels fit */}
        {colLabels.map((c, ci) => {
          const x = rowW + ci * cell + cell / 2;
          return (
            <text
              key={c}
              x={x}
              y={headH - 9}
              fontSize="10"
              fill={palette.muted}
              fontFamily="var(--font-mono)"
              textAnchor="start"
              transform={`rotate(-40 ${x} ${headH - 9})`}
            >
              {c}
            </text>
          );
        })}
        {support && (
          <text
            x={rowW + colLabels.length * cell + supW / 2}
            y={headH - 9}
            fontSize="10"
            fill={palette.faint}
            fontFamily="var(--font-mono)"
            textAnchor="middle"
          >
            {supportLabel}
          </text>
        )}

        {rowLabels.map((r, ri) => (
          <g key={r}>
            <text
              x={rowW - 12}
              y={headH + ri * cell + cell / 2 + 4}
              fontSize="11.5"
              fill={palette.ink}
              fontFamily="var(--font-body)"
              textAnchor="end"
            >
              {r}
            </text>
            {colLabels.map((c, ci) => {
              const v = values[ri]?.[ci] ?? 0;
              const onDiagonal = rowLabels[ri] === colLabels[ci] || ri === ci;
              const why = hit.get(`${ri}-${ci}`);
              const x = rowW + ci * cell;
              const y = headH + ri * cell;
              return (
                <g key={ci}>
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width={cell - 4}
                    height={cell - 4}
                    rx="4"
                    fill={fillFor(v, onDiagonal)}
                    stroke={why ? palette.red : "transparent"}
                    strokeWidth={why ? 1.8 : 0}
                  >
                    <title>
                      {`${r} ${onDiagonal ? "stayed" : "went to"} ${c}: ${v}${unit}${
                        why ? ` — ${why}` : ""
                      }`}
                    </title>
                  </rect>
                  {v > printBelow && (
                    <text
                      x={x + cell / 2}
                      y={y + cell / 2 + 4}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={onDiagonal ? 600 : 400}
                      fill={textFor(v, onDiagonal)}
                      fontFamily="var(--font-mono)"
                    >
                      {v}
                    </text>
                  )}
                </g>
              );
            })}
            {support && (
              <text
                x={rowW + colLabels.length * cell + supW / 2}
                y={headH + ri * cell + cell / 2 + 4}
                textAnchor="middle"
                fontSize="10"
                fill={palette.faint}
                fontFamily="var(--font-mono)"
              >
                {support[ri]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </ChartFrame>
  );
}
