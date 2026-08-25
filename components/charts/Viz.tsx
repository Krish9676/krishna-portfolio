// components/charts/Viz.tsx — one dispatcher so project content stays data.
// A new visual on a project page is a data entry, not a new component.

import TimeSeries from "./TimeSeries";
import { MatrixHeatmap, PixelHeatmap } from "./Heatmap";
import { BarSet, Dumbbell, StackedBars } from "./Bars";
import { ScoreGauge, ScoreWaterfall } from "./Score";
import {
  CadenceStrip,
  LayerStack,
  Roadmap,
  StageChain,
  TerminalStates,
} from "./Diagrams";
import { BoundaryMap, ParcelMap, RegionGrid } from "./Maps";

type Props<T> = T extends (p: infer P) => unknown ? P : never;

export type VizSpec =
  | ({ kind: "timeseries" } & Props<typeof TimeSeries>)
  | ({ kind: "pixels" } & Props<typeof PixelHeatmap>)
  | ({ kind: "matrix" } & Props<typeof MatrixHeatmap>)
  | ({ kind: "bars" } & Props<typeof BarSet>)
  | ({ kind: "stacked" } & Props<typeof StackedBars>)
  | ({ kind: "dumbbell" } & Props<typeof Dumbbell>)
  | ({ kind: "gauge" } & Props<typeof ScoreGauge>)
  | ({ kind: "waterfall" } & Props<typeof ScoreWaterfall>)
  | ({ kind: "stages" } & Props<typeof StageChain>)
  | ({ kind: "layers" } & Props<typeof LayerStack>)
  | ({ kind: "roadmap" } & Props<typeof Roadmap>)
  | ({ kind: "cadence" } & Props<typeof CadenceStrip>)
  | ({ kind: "terminal" } & Props<typeof TerminalStates>)
  | ({ kind: "parcelMap" } & Props<typeof ParcelMap>)
  | ({ kind: "boundaryMap" } & Props<typeof BoundaryMap>)
  | ({ kind: "regionGrid" } & Props<typeof RegionGrid>);

export default function Viz({ spec }: { spec: VizSpec }) {
  switch (spec.kind) {
    case "timeseries":
      return <TimeSeries {...spec} />;
    case "pixels":
      return <PixelHeatmap {...spec} />;
    case "matrix":
      return <MatrixHeatmap {...spec} />;
    case "bars":
      return <BarSet {...spec} />;
    case "stacked":
      return <StackedBars {...spec} />;
    case "dumbbell":
      return <Dumbbell {...spec} />;
    case "gauge":
      return <ScoreGauge {...spec} />;
    case "waterfall":
      return <ScoreWaterfall {...spec} />;
    case "stages":
      return <StageChain {...spec} />;
    case "layers":
      return <LayerStack {...spec} />;
    case "roadmap":
      return <Roadmap {...spec} />;
    case "cadence":
      return <CadenceStrip {...spec} />;
    case "terminal":
      return <TerminalStates {...spec} />;
    case "parcelMap":
      return <ParcelMap {...spec} />;
    case "boundaryMap":
      return <BoundaryMap {...spec} />;
    case "regionGrid":
      return <RegionGrid {...spec} />;
    default:
      return null;
  }
}
