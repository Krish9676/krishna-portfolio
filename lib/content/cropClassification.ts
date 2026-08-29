// lib/content/cropClassification.ts — Multi-Crop Classification & Yield
// Prediction.
//
// A capability showcase: crop identity as a temporal signature, the error
// structure that a headline accuracy figure hides, and a yield forecast
// published as a narrowing range rather than a point.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";
import { departureCurve } from "./curves";

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

const weekTicks = [0, 3, 6, 9, 12, 15, 18].map((x) => ({
  x,
  label: `${x * 8}`,
}));

// ── The district's own multi-season normal, and departures from it ──────
// Each field panel is written as a deterministic transformation of this one
// curve, so the twelve small multiples stay internally consistent instead of
// being drawn freehand — and so the shared y scale means what it says.
const normal = [
  0.14, 0.2, 0.29, 0.4, 0.51, 0.6, 0.66, 0.69, 0.68, 0.63, 0.55, 0.46, 0.38,
  0.31, 0.26, 0.22, 0.19, 0.17, 0.15,
];

const field = (opts: Parameters<typeof departureCurve>[1]) =>
  departureCurve(normal, opts);

export const cropClassification: ProjectDetail = {
  slug: "crop-classification-yield",
  pageTitle: "Multi-Crop Classification & Yield Prediction",
  hideMeta: true,
  lede:
    "Identifying what is planted from the shape of the season, then projecting what it will yield three to four months before harvest — turning a historical record into a procurement, pricing and lending input.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading: "Crop identity lives in the season, not in the image",
      blocks: [
        {
          kind: "prose",
          body: [
            "Two questions drive most commercial decisions in an agricultural supply chain: what is planted, and what will it yield. Both are traditionally answered by field visits — expensive, thinly sampled, and arriving after the decisions they should inform have already been made.",
            "Satellites answer both, but not from a single image, and this is the part most people get wrong about crop mapping. On any given date in December, wheat and mustard look broadly similar. By February they look nothing alike: mustard has flowered, peaked lower and begun senescing while wheat is still filling. The information distinguishing them is not in either date's reflectance — it is in the trajectory between them. Crop identity is a temporal signature, so the model has to be temporal too.",
            "That reframing is what makes the accuracy achievable. Instead of asking a classifier to separate crops from spectral values, it is given the shape of the whole season: when the canopy emerged, how fast it closed, how high and how sharp the peak was, when senescence began, how long the cycle ran. Those features are close to what an agronomist would use, and they are far more separable than any single observation.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Three winter crops that no single date can separate",
            subtitle:
              "Same field, same season — the divergence is in the trajectory",
            representative: true,
            yLabel: "canopy vigour",
            xLabel: "days after sowing",
            yDomain: [0, 0.9],
            height: 300,
            xTicks: weekTicks,
            phases: [{ from: 4, to: 8, label: "divergence window" }],
            series: [
              {
                name: "wheat",
                color: palette.green,
                points: seq([
                  0.14, 0.22, 0.34, 0.5, 0.66, 0.78, 0.84, 0.83, 0.76, 0.65,
                  0.52, 0.4, 0.3, 0.24, 0.2, 0.18, 0.16, 0.15, 0.14,
                ]),
              },
              {
                name: "mustard",
                color: palette.amber,
                points: seq([
                  0.13, 0.2, 0.31, 0.46, 0.58, 0.62, 0.58, 0.52, 0.46, 0.38,
                  0.3, 0.24, 0.2, 0.17, 0.15, 0.14, 0.13, 0.13, 0.12,
                ]),
              },
              {
                name: "gram",
                color: palette.cyan,
                points: seq([
                  0.12, 0.18, 0.27, 0.38, 0.5, 0.6, 0.68, 0.71, 0.69, 0.62,
                  0.52, 0.42, 0.33, 0.26, 0.21, 0.18, 0.16, 0.14, 0.13,
                ]),
              },
            ],
            caption:
              "Mustard peaks earliest and lowest and senesces fastest; wheat peaks highest and holds; gram sits between with a broader plateau. Pick any single date and two of the three overlap. Across the season none of them do — and the shaded window is where the separation is largest, which is also the earliest point a confident call can be made.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── identification
    {
      id: "identification",
      nav: "Crop identification",
      heading: "Crop type identification from phenology",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Some crops are far easier to identify than others, and being explicit about which is which matters more than a headline accuracy figure. Crops with distinctive cycle lengths and canopy behaviour separate cleanly. Crops that share a growing window, a similar canopy architecture and a similar duration are genuinely difficult, and a classifier that reports high confidence on those is overstating what the signal supports.",
            "The features that carry the most weight are the agronomic ones: cycle duration, the timing and sharpness of peak canopy, the rate of senescence, and the number of cycles in the year. Weather context helps materially, because accumulated heat explains why the same crop runs on a different calendar in a different season — without it, a cool-season crop looks like a different crop rather than the same crop running slow.",
            "Compressing a season into that handful of numbers is the whole trick, and it is also what makes the model inspectable. An agronomist cannot argue with a learned embedding, but they can argue with a claim that this field's canopy peaked late and faded early — and if they disagree, the disagreement is about something checkable.",
          ],
        },
        {
          kind: "viz",
          intro:
            "The same three crops, twice over: first as the features the classifier actually separates on, then as the error structure that follows from them.",
          spec: {
            kind: "radar",
            title: "What the classifier sees",
            subtitle: "The season, compressed to six phenological features",
            representative: true,
            size: 420,
            scaleNote: "each feature normalised 0–100 across the crop set",
            axes: [
              "cycle duration",
              "peak canopy level",
              "peak sharpness",
              "early senescence",
              "emergence speed",
              "plateau length",
            ],
            series: [
              {
                name: "wheat",
                color: palette.green,
                values: [78, 92, 55, 40, 60, 66],
              },
              {
                name: "mustard",
                color: palette.amber,
                values: [56, 66, 85, 88, 80, 32],
              },
              {
                name: "gram",
                color: palette.cyan,
                values: [68, 78, 45, 55, 50, 84],
              },
            ],
            caption:
              "Six numbers per field-season, derived from the curve above. Every axis is a quantity an agronomist already reasons with, which is why a disagreement with the model can be settled by walking into the field rather than by retraining. Mustard is distinctive on four of the six axes and is the easiest of the three; wheat and gram overlap on three and separate almost entirely on plateau length and senescence timing, which is exactly the pair the confusion matrix below shows leaking into each other.",
            note:
              "Peak canopy level is the height of the peak, peak sharpness how abruptly it is reached, early senescence how soon the decline begins, and plateau length how long the peak is held. All six are read against accumulated heat rather than the calendar, so a cool season does not read as a different crop.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "confusion",
            title: "Where the errors actually go",
            subtitle: "Rows are what the field was; columns are what it was called",
            representative: true,
            rowAxis: "actually",
            colAxis: "called as",
            diagonalMeaning: "called correctly",
            offDiagonalMeaning: "called as something else",
            cell: 44,
            rowLabels: ["Wheat", "Barley", "Mustard", "Gram", "Cotton", "Sugarcane"],
            colLabels: ["Wheat", "Barley", "Mustard", "Gram", "Cotton", "Sugarcane"],
            values: [
              [86, 9, 2, 3, 0, 0],
              [17, 74, 2, 6, 1, 0],
              [3, 2, 91, 4, 0, 0],
              [6, 4, 5, 83, 2, 0],
              [0, 0, 1, 2, 95, 2],
              [0, 0, 0, 0, 2, 98],
            ],
            highlights: [
              {
                at: [1, 0],
                why: "Two cereals with nearly the same duration and canopy architecture. This single cell is what a headline accuracy figure hides, and it is the reason varieties are reported as a group rather than named.",
              },
              {
                at: [3, 0],
                why: "A pulse called as a cereal. Overlapping growing window, separated only on peak sharpness and fill duration — recoverable with weather context, not with a larger model.",
              },
            ],
            caption:
              "Representative of the error structure the separability chart below describes, not a measured benchmark. Read the asymmetry: barley goes to wheat roughly twice as often as wheat goes to barley, because wheat is the more common class and an ambiguous season shape gets pulled toward the prior. That is a property of the class distribution rather than of the two crops, it will not improve with more barley training data alone, and it is completely invisible in any single accuracy number.",
            note:
              "Sugarcane and cotton are near-perfect for the same reason mustard is easy: cycle length and canopy architecture unlike anything they share a calendar with. Every difficult cell in this matrix involves two crops that overlap in both.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Separability varies by crop, and saying so matters",
            subtitle: "How distinguishable each group is from its season shape",
            representative: true,
            max: 100,
            data: [
              {
                label: "Long-duration crops",
                value: 96,
                valueLabel: "very high",
                color: palette.green,
                note: "cycle length alone separates them — nothing else on the calendar runs that long",
              },
              {
                label: "Distinct-canopy crops",
                value: 91,
                valueLabel: "very high",
                color: palette.green,
                note: "canopy architecture and peak behaviour are unlike anything they share a season with",
              },
              {
                label: "Cereals vs oilseeds",
                value: 88,
                valueLabel: "high",
                color: palette.green,
                note: "clearly different peak height and senescence rate",
              },
              {
                label: "Cereals vs pulses",
                value: 79,
                valueLabel: "good",
                color: palette.cyan,
                note: "overlapping windows; separated mainly on peak sharpness and fill duration",
              },
              {
                label: "Within-group varieties",
                value: 58,
                valueLabel: "limited",
                color: palette.amber,
                note: "same architecture and duration — reported with low confidence rather than forced to a label",
              },
            ],
            caption:
              "The bottom row is where honesty pays. A classifier that assigns a confident variety label from reflectance is producing a number that will be used and cannot be defended, so the correct output there is a group label plus a stated limitation.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "decision",
            title: "How specific the answer is allowed to be",
            subtitle:
              "Four outputs, chosen by how separable this field's season shape actually was",
            gate: {
              inputLabel: "on each field, each observation",
              label: "How far is this season shape from its nearest alternative?",
              detail:
                "Measured in the six-feature space above, against what the crop should look like at this accumulated heat rather than at this calendar date.",
            },
            branches: [
              {
                condition:
                  "the shape is distinctive and the divergence window has closed",
                outcome: "Named crop",
                emits:
                  "the crop, the features that decided it, and the confidence — so the call is checkable against the field",
                color: palette.green,
              },
              {
                condition:
                  "two candidates share a window but differ on peak sharpness or fill duration",
                outcome: "Named crop, with the alternative stated",
                emits:
                  "the call, the runner-up, and which feature separated them. A grower or agronomist who knows the runner-up can settle it by looking.",
                color: palette.cyan,
              },
              {
                condition:
                  "candidates share duration, architecture and senescence timing",
                outcome: "Group label only",
                emits:
                  "'a winter cereal' rather than a variety name. The model can produce a variety label here; it cannot defend one, and it will be used as though it could.",
                color: palette.amber,
                refuses: true,
              },
              {
                condition:
                  "too few usable observations through the divergence window",
                outcome: "No call yet",
                emits:
                  "the date at which a call becomes possible — not a provisional label that downstream systems will treat as final",
                color: palette.red,
                refuses: true,
              },
            ],
            note:
              "Two of the four outputs are deliberately less specific than the model is capable of producing. That restraint is what makes the other two usable in a procurement contract or a credit file.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── yield
    {
      id: "yield",
      nav: "Early yield",
      heading: "Yield forecasting, months before harvest",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "A yield figure delivered at harvest is a record. The same figure delivered at flowering is a procurement plan, a pricing position, a storage booking and a credit decision — and the entire commercial value of satellite yield forecasting is in that difference.",
            "The physical basis is that yield is built from intercepted light. A canopy that closes early, reaches a high peak and holds it through the reproductive phase has intercepted more radiation and accumulated more biomass than one that peaked late or faded early, and harvestable yield is a well-characterised fraction of accumulated biomass for each crop. Integrating canopy vigour across the season captures that directly. Weather then explains the departures: heat during flowering, a dry spell during fill, or an unfavourable rainfall distribution all reduce how much of the potential survives to harvest.",
            "Two behaviours make a forecast usable rather than merely available. It is deferred until the canopy has closed, because a yield number derived from a crop that has not established yet is guesswork dressed as a projection. And it is published as a range that narrows as the season progresses, rather than as a point estimate that implies precision the data cannot support this early.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Where the lead time comes from",
            subtitle: "How early in the season each answer becomes available",
            representative: true,
            max: 130,
            data: [
              {
                label: "Sowing detected",
                value: 10,
                valueLabel: "day 10",
                color: palette.faint,
                note: "crop present, identity still ambiguous",
              },
              {
                label: "Crop type resolved",
                value: 45,
                valueLabel: "day 45",
                color: palette.cyan,
                note: "enough season shape accumulated to classify confidently",
              },
              {
                label: "First yield projection",
                value: 60,
                valueLabel: "day 60",
                color: palette.amber,
                note: "canopy closed — the commercially useful point, roughly two months before harvest",
              },
              {
                label: "Projection stabilises",
                value: 95,
                valueLabel: "day 95",
                color: palette.green,
                note: "range narrows as retention penalties settle",
              },
              {
                label: "Harvest",
                value: 125,
                valueLabel: "day 125",
                color: palette.ink,
                note: "the answer everyone without this waits for",
              },
            ],
            caption:
              "Sixty-five days of lead time is the product. Nothing about the accuracy at harvest is remarkable — the value is entirely in having a usable number while there is still time to act on it.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Multi-season comparison on the same field",
            subtitle: "The same crop, three seasons — why one year is not a baseline",
            representative: true,
            yLabel: "canopy vigour",
            xLabel: "days after sowing",
            yDomain: [0, 0.9],
            height: 280,
            xTicks: weekTicks,
            series: [
              {
                name: "season 1 — favourable",
                color: palette.green,
                points: seq([
                  0.15, 0.24, 0.37, 0.53, 0.68, 0.79, 0.84, 0.83, 0.77, 0.66,
                  0.53, 0.41, 0.31, 0.25, 0.21, 0.18, 0.16, 0.15, 0.14,
                ]),
              },
              {
                name: "season 2 — dry spell at fill",
                color: palette.amber,
                points: seq([
                  0.14, 0.23, 0.35, 0.5, 0.65, 0.75, 0.79, 0.72, 0.6, 0.47,
                  0.36, 0.28, 0.23, 0.19, 0.17, 0.15, 0.14, 0.13, 0.13,
                ]),
              },
              {
                name: "season 3 — late sowing",
                color: palette.cyan,
                points: seq([
                  0.13, 0.18, 0.26, 0.38, 0.52, 0.64, 0.73, 0.78, 0.76, 0.68,
                  0.56, 0.44, 0.34, 0.27, 0.22, 0.19, 0.17, 0.15, 0.14,
                ]),
              },
            ],
            caption:
              "Three seasons, three different stories, one field. Season two peaked normally then collapsed through fill; season three started late and compressed its whole cycle. A model comparing any of them against a fixed regional expectation would mis-read all three — comparing a field against its own history is what makes the departure meaningful.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── the range
    {
      id: "range",
      nav: "Forecast as a range",
      heading: "Publishing an interval, and refusing to publish before it means anything",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "A yield model can emit a number on day fifteen. It should not. Before the canopy has closed there is almost no accumulated-radiation signal to integrate, so an early figure is a restatement of the regional prior wearing a field's name — and a downstream system cannot tell the difference between that and a measurement. So the first projection is deferred until canopy closure, and the record simply has nothing in it before then.",
            "After that the honest output is an interval rather than a point. Two distinct things widen it: how much of the season is still unobserved, and how much of the accumulated potential can still be lost to weather between now and harvest. Both shrink as the season runs, which is why the band narrows rather than the estimate improving — the central figure often barely moves while the claim it supports gets substantially stronger.",
            "Presenting it this way changes how it is used. A procurement team given a point estimate treats it as a commitment; the same team given a range books against the lower bound and revises as it tightens. The interval is not a hedge, it is the part of the output that makes the number safe to act on.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "The band is the product, not the line",
            subtitle:
              "Projected yield and its published interval, from canopy closure to harvest",
            representative: true,
            yLabel: "projected yield (t/ha)",
            xLabel: "days after sowing",
            height: 310,
            yDomain: [0, 6],
            xTicks: [0, 3, 6, 9, 12].map((x) => ({ x, label: `${x * 10}` })),
            events: [
              { x: 6, label: "canopy closure", color: palette.green },
              { x: 12, label: "harvest", color: palette.muted },
            ],
            showProvenanceLegend: false,
            series: [
              {
                name: "projection, with published interval",
                color: palette.cyan,
                band: true,
                points: [
                  { x: 0, y: null },
                  { x: 1, y: null },
                  { x: 2, y: null },
                  { x: 3, y: null },
                  { x: 4, y: null },
                  { x: 5, y: null },
                  { x: 6, y: 4.1, lo: 3.1, hi: 5.1, tip: "day 60 — first projection" },
                  { x: 7, y: 4.15, lo: 3.3, hi: 5.0 },
                  { x: 8, y: 4.2, lo: 3.5, hi: 4.9 },
                  { x: 9, y: 4.05, lo: 3.5, hi: 4.6 },
                  { x: 10, y: 3.95, lo: 3.55, hi: 4.35 },
                  { x: 11, y: 3.9, lo: 3.62, hi: 4.18 },
                  { x: 12, y: 3.88, lo: 3.72, hi: 4.04 },
                ],
              },
              {
                name: "recorded at harvest",
                color: palette.green,
                points: [
                  { x: 11, y: null },
                  { x: 12, y: 3.82, tip: "harvest record: 3.82 t/ha" },
                ],
              },
            ],
            caption:
              "The hatched span on the left is the most important part of this chart: for the first fifty days the system publishes nothing at all, because there is nothing in the observation record that a yield figure would be made of. From day sixty the central estimate moves by about five per cent while the interval narrows by more than four fifths — the forecast did not get much more accurate, it got much more defensible, and those are different things that a point estimate conflates.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "scatter",
            title: "Day-60 projection against the harvest record",
            subtitle:
              "Onion — the one crop in the set with a real harvest-record reference",
            representative: true,
            xLabel: "yield recorded at harvest (t/ha)",
            yLabel: "yield projected at day 60 (t/ha)",
            domain: [10, 45],
            tolerance: 0.15,
            toleranceLabel: "within 15% of the record",
            height: 380,
            stats: [
              { label: "reference", value: "harvest records" },
              { label: "projected at", value: "day 60" },
              { label: "lead time", value: "~65 days" },
            ],
            series: [
              {
                name: "projection, with its published interval",
                color: palette.cyan,
                points: [
                  { x: 18, y: 19.5, lo: 15, hi: 24 },
                  { x: 21, y: 20.2, lo: 16, hi: 24.4 },
                  { x: 24, y: 25.5, lo: 21, hi: 30 },
                  { x: 26, y: 24.1, lo: 20, hi: 28.2 },
                  { x: 28, y: 29.5, lo: 25, hi: 34 },
                  { x: 30, y: 28.6, lo: 24.5, hi: 32.7 },
                  { x: 32, y: 33.0, lo: 28, hi: 38 },
                  { x: 33, y: 31.2, lo: 27, hi: 35.4 },
                  { x: 35, y: 34.0, lo: 30, hi: 38 },
                  { x: 37, y: 35.2, lo: 31, hi: 39.4 },
                  { x: 39, y: 37.5, lo: 33.5, hi: 41.5 },
                  { x: 41, y: 38.4, lo: 34.5, hi: 42.3 },
                ],
              },
              {
                name: "missed for a reason worth naming",
                color: palette.amber,
                points: [
                  {
                    x: 29,
                    y: 22.0,
                    lo: 18,
                    hi: 26,
                    tip: "projection low: field was re-sown after a failed establishment, so the model integrated a shorter cycle",
                  },
                  {
                    x: 24,
                    y: 31.5,
                    lo: 27,
                    hi: 36,
                    tip: "projection high: hail during bulking — a loss event that is not in any of the model's inputs",
                  },
                ],
              },
            ],
            caption:
              "Representative of the validation set's shape rather than a reproduction of it; the measured figure is stated in the outcomes below. The vertical bars are the published interval, not an error estimate — a point inside its own bar is a forecast that did what it promised, and that is the property worth checking. The two amber points are the two honest ways this misses: a season the model measured correctly but which was not the season that was harvested, and a discrete loss event that no reflectance-and-weather model contains.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "sparkgrid",
            title: "Twelve fields of the same crop, each against its own normal",
            subtitle:
              "One shared y scale, one baseline per panel — the comparison is the chart",
            representative: true,
            columns: 4,
            yDomain: [0, 0.9],
            baseline: normal,
            seriesLabel: "this season",
            baselineLabel: "the field's own three-season normal",
            cells: [
              { label: "F-102", values: field({ gain: 1.02 }), flag: "on trajectory" },
              { label: "F-104", values: field({ gain: 1.12 }), flag: "+11%" },
              {
                label: "F-108",
                values: field({ fadeFrom: 7, fadeRate: 0.16 }),
                flag: "collapse at fill",
                emphasis: true,
              },
              {
                label: "F-111",
                values: field({ gain: 0.98, lateBy: 2 }),
                flag: "~16 d late",
              },
              { label: "F-115", values: field({}), flag: "on trajectory" },
              {
                label: "F-117",
                values: field({ gain: 1.04, gaps: [7, 8, 9] }),
                flag: "3 gaps",
              },
              {
                label: "F-120",
                values: field({ gain: 0.82 }),
                flag: "−18%",
                emphasis: true,
              },
              { label: "F-124", values: field({ gain: 1.08 }), flag: "+8%" },
              { label: "F-129", values: field({ gain: 0.99 }), flag: "on trajectory" },
              {
                label: "F-133",
                values: field({ fadeFrom: 6, fadeRate: 0.13 }),
                flag: "early senescence",
                emphasis: true,
              },
              { label: "F-137", values: field({ gain: 1.01 }), flag: "on trajectory" },
              { label: "F-140", values: field({ gain: 0.94 }), flag: "−6%" },
            ],
            caption:
              "This is the form the question actually takes at scale: not what is this field's yield, but which of these twelve needs a person this week. Three panels are ringed, and each is a different failure — F-108 tracked its normal and then lost the fill period, F-120 has been below all season and is a management or input problem rather than an event, F-133 senesced early with no dip beforehand. A single chart with twelve lines on it would show none of that, and per-panel autoscaling would make all twelve look identical.",
            note:
              "F-117 is the honest case: three consecutive observations were unusable, so the line breaks rather than being drawn through them. Its projection carries a lower confidence tier for exactly that reason.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── impact
    {
      id: "impact",
      nav: "Impact",
      heading: "What it delivers",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "90%",
              label: "Crop classification accuracy",
              detail: "Across 15+ crop types and multiple geographies",
              tone: "green",
            },
            {
              metric: "87%",
              label: "Yield accuracy, onion reference",
              detail:
                "Validated against harvest records — the one crop with a real reference",
              tone: "cyan",
            },
            {
              metric: "3–4 mo",
              label: "Ahead of harvest",
              detail: "The lead time that turns a record into a planning input",
              tone: "green",
            },
            {
              metric: "Per field",
              label: "Own-history baseline",
              detail:
                "Departures measured against the field's own seasons, not a regional average",
              tone: "cyan",
            },
          ],
        },
        {
          kind: "status",
          title: "What is measured here, and what the charts are showing",
          intro:
            "Two of the figures on this page are measured performance. Everything else is either mechanism or a representative output shape, and the two should never be read as the same kind of claim.",
          items: [
            {
              verdict: "verified",
              claim:
                "90% classification accuracy across 15+ crop types and multiple geographies",
              evidence:
                "A measured figure. What it deliberately does not say is where the errors sit — which is what the confusion matrix is for, and why the within-group row of the separability chart matters more than the headline.",
            },
            {
              verdict: "verified",
              claim: "87% yield accuracy against harvest records, on onion",
              evidence:
                "One crop, one real reference, stated as one crop. Generalising it would be the easy and indefensible move, because yield ground truth arrives once per plot per season.",
            },
            {
              verdict: "defensible",
              claim: "Crop identity is a temporal signature, not a spectral one",
              evidence:
                "Standard phenology-based crop mapping. The overview chart is the argument: pick any single date and two of the three crops overlap, so a single-date classifier is separating noise.",
            },
            {
              verdict: "shipped",
              claim:
                "The first projection is withheld until the canopy has closed",
              evidence:
                "Visible as an actual absence in the interval chart — the record contains nothing before day sixty rather than containing a low-confidence figure.",
            },
            {
              verdict: "not-built",
              claim: "A confident variety-level label from reflectance",
              evidence:
                "Declined by design. Varieties sharing duration and canopy architecture are not separable in this feature space, so the output is a group label and a stated limitation rather than a number that will be used and cannot be defended.",
            },
            {
              verdict: "deferred",
              claim: "A per-crop yield accuracy distribution",
              evidence:
                "Blocked on data collection, not on modelling. One yield label per plot per season makes this a multi-year exercise, and the published interval is the honest interim answer.",
            },
          ],
          note:
            "Charts marked representative describe the shape of an output on a set like this one. The confusion matrix in particular illustrates the error structure the separability chart describes; it is not a benchmark table.",
        },
        {
          kind: "boundary",
          title: "What this does not claim to be",
          items: [
            {
              not: "A substitute for the harvest record",
              why: "It is a forecast whose value is its lead time. At harvest the record is better than the projection and always will be — the point is having a defensible figure sixty-five days earlier, not eventually being right.",
            },
            {
              not: "Reliable before the divergence window closes",
              why: "Crop identity accumulates. Before roughly day forty-five, several candidate crops fit the observed shape equally well, and the correct output there is no call rather than an early one that downstream systems will treat as settled.",
            },
            {
              not: "Independent of the boundary underneath it",
              why: "Everything here is computed inside a polygon and inherits its errors. A merged boundary produces a confident classification of two fields at once, and an unverified area turns a per-hectare projection into a wrong tonnage.",
            },
            {
              not: "Able to see a discrete loss event",
              why: "Hail, flood, fire and theft between the last observation and harvest are not in reflectance or weather in any usable way. They show up as forecast misses after the fact, and the interval is not wide enough to absorb them.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Where the yield figure is strong and where it is thinner",
          body:
            "The 87% reference is a single crop checked against harvest records. Other crops carry thinner validation for a structural reason: yield ground truth arrives once per plot per season, so building a per-crop accuracy distribution is a multi-year data-collection exercise rather than a modelling one. That is exactly why the production monitoring system publishes yield as a range rather than a point — the uncertainty band is the honest expression of what one label per season can support.",
        },
      ],
    },
  ],
};
