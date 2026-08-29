// components/charts/Funnel.tsx
// A funnel where the losses are the subject.
//
// The usual retention bar chart shows what survived each stage and leaves the
// reader to subtract. In every place this form is used on the site — dataset
// filtering, carbon deductions, question routing — the interesting quantity is
// what was thrown away and why, so the drop between two stages is drawn as its
// own hatched wedge. A stage that rejects most of its input is the point of
// that stage, not an embarrassment.
//
// The reasons are prose and prose does not wrap in SVG, so each wedge carries a
// letter and the reasons are listed underneath. That also keeps them legible on
// a phone, where 9px SVG text is not.

import { AxisLabel, ChartFrame, labelGutter, palette } from "./primitives";

export interface FunnelStage {
  label: string;
  /** Share, count, or amount surviving at this stage */
  value: number;
  color?: string;
  /** What this stage is */
  note?: string;
  /** Why the drop into this stage happened, if there was one */
  dropReason?: string;
}

const letters = "abcdefghijk".split("");

export function Funnel({
  stages,
  unit = "",
  total,
  title,
  subtitle,
  caption,
  note,
  representative,
  keepLabel = "still in",
  dropLabel = "removed",
}: {
  stages: FunnelStage[];
  unit?: string;
  /** Denominator for the width scale. Defaults to the first stage's value. */
  total?: number;
  title?: string;
  subtitle?: string;
  caption?: string;
  note?: string;
  representative?: boolean;
  keepLabel?: string;
  dropLabel?: string;
}) {
  const W = 660;
  const bandH = 34;
  const gapH = 34;
  const m = {
    top: 22,
    // 11.5px body labels above 9px mono notes
    left: labelGutter(
      [
        { labels: stages.map((x) => x.label), charW: 6.4 },
        { labels: stages.map((x) => x.note), charW: 5.6 },
      ],
      { min: 160, max: 300, pad: 22 }
    ),
    right: 104,
  };
  const iw = W - m.left - m.right;
  const H = m.top + stages.length * bandH + (stages.length - 1) * gapH + 30;

  const denom = total ?? stages[0]?.value ?? 1;
  const w = (v: number) => Math.max(2, (v / denom) * iw);
  const cx = m.left + iw / 2;
  const yOf = (i: number) => m.top + i * (bandH + gapH);

  // Only stages that actually lost something get a lettered marker.
  const drops = stages
    .map((s, i) => ({ s, i, lost: i > 0 ? stages[i - 1].value - s.value : 0 }))
    .filter((d) => d.lost > 0 && d.s.dropReason);
  const markerFor = new Map<number, string>();
  drops.forEach((d, k) => markerFor.set(d.i, letters[k] ?? "*"));

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      caption={caption}
      note={note}
      representative={representative}
      minWidth={480}
      footer={
        drops.length > 0 ? (
          <ul className="funnel-drops">
            {drops.map((d) => (
              <li key={d.i}>
                <span className="funnel-drop-key">
                  <em>{markerFor.get(d.i)}</em>
                  {`− ${Math.round(d.lost * 10) / 10}${unit}`}
                </span>
                <span className="funnel-drop-why">{d.s.dropReason}</span>
              </li>
            ))}
          </ul>
        ) : undefined
      }
      legend={
        <>
          <span className="legend-item">
            <svg width="14" height="14" aria-hidden="true">
              <rect width="14" height="14" rx="2" fill="rgba(74,222,128,0.75)" />
            </svg>
            <span>{keepLabel}</span>
          </span>
          <span className="legend-item">
            <svg width="22" height="12" aria-hidden="true">
              <rect x="1" y="1" width="20" height="10" fill="url(#funnel-hatch)" />
            </svg>
            <span>{dropLabel} — lettered, with the reason below</span>
          </span>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={title ?? "Funnel"}
      >
        <defs>
          <pattern
            id="funnel-hatch"
            width="6"
            height="6"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="6" fill="rgba(224,103,76,0.10)" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="rgba(224,103,76,0.42)"
              strokeWidth="1.3"
            />
          </pattern>
        </defs>

        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1] : null;
          const y = yOf(i);
          const half = w(s.value) / 2;
          const c = s.color ?? palette.green;
          const lost = prev ? prev.value - s.value : 0;
          const marker = markerFor.get(i);

          const py = i > 0 ? yOf(i - 1) + bandH : 0;
          const ph = prev ? w(prev.value) / 2 : 0;

          return (
            <g key={s.label}>
              {prev && (
                <>
                  <path
                    d={`M ${cx - ph},${py} L ${cx + ph},${py} L ${cx + half},${y} L ${cx - half},${y} Z`}
                    fill={c}
                    opacity="0.13"
                  />
                  {lost > 0 && (
                    <>
                      <path
                        d={`M ${cx - ph},${py} L ${cx - half},${y} L ${cx - ph},${y} Z`}
                        fill="url(#funnel-hatch)"
                      />
                      <path
                        d={`M ${cx + ph},${py} L ${cx + half},${y} L ${cx + ph},${y} Z`}
                        fill="url(#funnel-hatch)"
                      />
                      {marker && (
                        <>
                          <circle
                            cx={m.left + iw + 20}
                            cy={py + gapH / 2}
                            r="8"
                            fill="rgba(224,103,76,0.16)"
                            stroke={palette.red}
                            strokeWidth="1.2"
                          />
                          <text
                            x={m.left + iw + 20}
                            y={py + gapH / 2 + 3.5}
                            textAnchor="middle"
                            fontSize="9.5"
                            fill={palette.red}
                            fontFamily="var(--font-mono)"
                          >
                            {marker}
                          </text>
                        </>
                      )}
                      <AxisLabel
                        x={m.left + iw + 34}
                        y={py + gapH / 2 + 3.5}
                        anchor="start"
                        size={10}
                        color={palette.red}
                      >
                        {`− ${Math.round(lost * 10) / 10}${unit}`}
                      </AxisLabel>
                    </>
                  )}
                </>
              )}

              <rect
                x={cx - half}
                y={y}
                width={half * 2}
                height={bandH}
                rx="4"
                fill={c}
                opacity="0.88"
              >
                <title>{`${s.label}: ${s.value}${unit}`}</title>
              </rect>
              <text
                x={cx}
                y={y + bandH / 2 + 4.5}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="600"
                fill="#08100B"
                fontFamily="var(--font-mono)"
              >
                {`${s.value}${unit}`}
              </text>

              <text
                x={m.left - 16}
                y={y + bandH / 2 + (s.note ? -1 : 4)}
                textAnchor="end"
                fontSize="11.5"
                fill={palette.ink}
                fontFamily="var(--font-body)"
              >
                {s.label}
              </text>
              {s.note && (
                <text
                  x={m.left - 16}
                  y={y + bandH / 2 + 13}
                  textAnchor="end"
                  fontSize="9"
                  fill={palette.faint}
                  fontFamily="var(--font-mono)"
                >
                  {s.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
