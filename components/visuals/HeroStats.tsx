// components/visuals/HeroStats.tsx
// The telemetry column beside the scene. These are readings from the sample
// field in the illustration — a product surface, not a claim about me.

import { Activity, Leaf, Satellite, TrendingUp } from "lucide-react";

type Tone = "green" | "amber";

function Spark({ points, tone }: { points: number[]; tone: Tone }) {
  const w = 150;
  const h = 34;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 5) - 2.5;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = points[points.length - 1];
  const lastY = h - ((last - min) / span) * (h - 5) - 2.5;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`hstat-spark hstat-${tone}`} aria-hidden="true">
      <path d={d} />
      <circle cx={w} cy={lastY} r="2.6" className="hstat-spark-end" />
    </svg>
  );
}

const CARDS = [
  {
    icon: Leaf,
    label: "Vegetation Health",
    value: "0.78",
    note: "High",
    tone: "green" as Tone,
    spark: [0.41, 0.46, 0.44, 0.52, 0.58, 0.55, 0.63, 0.69, 0.72, 0.7, 0.76, 0.78],
  },
  {
    icon: Activity,
    label: "Crop Stress",
    value: "18%",
    note: "Low Risk",
    tone: "amber" as Tone,
    spark: [0.3, 0.26, 0.34, 0.29, 0.38, 0.33, 0.28, 0.24, 0.31, 0.22, 0.19, 0.18],
  },
  {
    icon: TrendingUp,
    label: "Biomass Trend",
    value: "+24%",
    note: "vs last pass",
    tone: "green" as Tone,
    spark: [0.2, 0.24, 0.22, 0.31, 0.36, 0.33, 0.42, 0.48, 0.46, 0.55, 0.61, 0.66],
  },
];

export default function HeroStats() {
  return (
    <div className="hero-stats" aria-hidden="true">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`hstat hstat-t-${c.tone}`}>
            <div className="hstat-head">
              <Icon size={13} />
              <span>{c.label}</span>
            </div>
            <div className="hstat-body">
              <span className="hstat-value">{c.value}</span>
              <span className="hstat-note">{c.note}</span>
            </div>
            <Spark points={c.spark} tone={c.tone} />
          </div>
        );
      })}

      <div className="hstat hstat-t-green">
        <div className="hstat-head">
          <Satellite size={13} />
          <span>Last Satellite Pass</span>
        </div>
        <div className="hstat-body">
          <span className="hstat-value hstat-value-sm">2 days ago</span>
        </div>
        <div className="hstat-source">Optical + radar, fused</div>
      </div>
    </div>
  );
}
