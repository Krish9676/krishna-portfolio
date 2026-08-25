// lib/content/supporting.ts — the remaining six projects.
//
// Same treatment as the flagships: capability showcases explained in standard
// remote-sensing, agronomy and machine-learning terms, with visuals per
// capability. No implementation detail, no operational or organisational data.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

// ── Grad-CAM style saliency over a diagnosed leaf ──────────────────────
const saliency = [
  "0000111000",
  "0011222100",
  "0112333210",
  "1123444321",
  "1234444321",
  "1233444210",
  "0122333100",
  "0011221000",
];

const saliencyStops = [
  { at: 0, color: "rgba(56,182,217,0.22)", label: "no influence" },
  { at: 1, color: "rgba(56,182,217,0.55)", label: "low" },
  { at: 2, color: palette.cyan, label: "moderate" },
  { at: 3, color: palette.amber, label: "high" },
  { at: 4, color: palette.red, label: "decisive" },
];

// ── District grids, sharing one mask so the two maps describe one region ──
const stressArt = [
  "..2211......",
  ".22211100...",
  "2221110011..",
  "221110001110",
  "211000011220",
  "110000112222",
  ".10001122233",
  "..0011223333",
  "...0112333..",
  "....12333...",
];

const sowingArt = [
  "..3322......",
  ".33322211...",
  "3332221110..",
  "332221110001",
  "322111000112",
  "221110001122",
  ".21100011223",
  "..1100112233",
  "...0112233..",
  "....12233...",
];

// ════════════════════════════════════════════════════════════════════════
// Farm boundary delineation
// ════════════════════════════════════════════════════════════════════════

export const farmBoundary: ProjectDetail = {
  slug: "farm-boundary-delineation",
  pageTitle: "Farm Boundary Delineation System",
  hideMeta: true,
  lede:
    "Automated field boundary extraction from satellite imagery — the footprint every field-level measurement inherits, with the area verified against what was declared and the parcels too small or too uncertain to measure flagged rather than reported.",
  sections: [
    {
      id: "overview",
      nav: "Overview",
      heading: "Every field-level number inherits a boundary",
      blocks: [
        {
          kind: "prose",
          body: [
            "Crop classification, stress percentages, nutrient maps, yield projections, credit scores — every one of them is computed inside a polygon. The polygon decides which pixels are counted, which means it decides what the number is about. Get it wrong and the analysis is flawless arithmetic over the wrong piece of ground.",
            "Drawing boundaries by hand caps a system at however many polygons a person can trace, which is the difference between monitoring a few hundred fields and monitoring a region. So boundary extraction is not preparatory work before the interesting analysis — it is the constraint that decides whether the interesting analysis means anything.",
            "Remote sensing can do it because a field edge is usually a real discontinuity in reflectance. Two fields under different crops, at different growth stages, or with different soil exposure look different across that line, and the edge is often reinforced by a bund, a track or a drainage channel. Image segmentation finds those discontinuities and closes them into parcels. Where fields genuinely look the same on both sides of the line, they genuinely cannot be separated from reflectance — and saying so is more useful than guessing at a boundary.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "boundaryMap",
            title: "Extracted parcels over a mixed agricultural landscape",
            subtitle:
              "Closed boundaries in green; parcels the model could not separate in amber",
            fields: [
              [
                [8, 12],
                [30, 9],
                [33, 30],
                [10, 34],
              ],
              [
                [36, 8],
                [58, 11],
                [56, 31],
                [35, 29],
              ],
              [
                [62, 12],
                [88, 14],
                [90, 36],
                [64, 33],
              ],
              [
                [10, 40],
                [32, 38],
                [34, 62],
                [12, 64],
              ],
              [
                [38, 36],
                [57, 37],
                [59, 58],
                [37, 57],
              ],
              [
                [14, 70],
                [40, 68],
                [42, 90],
                [16, 92],
              ],
              [
                [66, 62],
                [90, 60],
                [92, 84],
                [68, 86],
              ],
            ],
            missed: [
              [
                [62, 40],
                [92, 42],
                [90, 55],
                [61, 54],
              ],
              [
                [46, 64],
                [62, 63],
                [63, 90],
                [47, 91],
              ],
            ],
            caption:
              "Representative of the output shape. The amber parcels are the honest failure mode: adjacent fields under the same crop at the same growth stage have almost no spectral edge between them, so they merge into one polygon. Reporting them as a single field would silently double an area; flagging them sends a human to the one place a human is needed.",
          },
        },
      ],
    },
    {
      id: "extraction",
      nav: "Extraction",
      heading: "What makes an edge findable — and what does not",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Boundary extraction is a segmentation problem, but most of the difficulty sits before the segmentation. Reflectance has to be comparable across the scene before an edge can mean anything: geometric correction so a boundary lands where the ground actually is, radiometric and atmospheric correction so scene-to-scene variation does not read as structure, and cloud masking because a cloud edge is the strongest edge in any image and a segmenter will happily trace weather instead of farmland.",
            "Resolution then sets the ceiling. At ten metres a field edge is one or two pixels wide, and satellite geolocation error is itself around ten metres — so the boundary is intrinsically fuzzy no matter how good the model is. Combining a higher-detail sensor for edge definition with a longer-archive sensor for context gets more out of the same landscape than either alone: one supplies the edge, the other supplies several years of seasonal behaviour to confirm the parcel is a single management unit rather than two fields that happened to match this year.",
            "The timing of the imagery matters as much as the model. Mid-season, when neighbouring fields are at different growth stages, edges are at their most distinct. At sowing, when everything is bare soil, and immediately post-harvest, when everything is stubble, most of the internal structure of an agricultural landscape simply is not there to find.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Where extraction is reliable, and where it is not",
            subtitle: "Boundary quality by landscape situation",
            representative: true,
            max: 100,
            data: [
              {
                label: "Contrasting neighbours",
                value: 94,
                valueLabel: "reliable",
                color: palette.green,
                note: "different crops or growth stages either side — the edge is a real reflectance discontinuity",
              },
              {
                label: "Bare-soil neighbour",
                value: 88,
                valueLabel: "reliable",
                color: palette.green,
                note: "strong contrast between canopy and exposed soil",
              },
              {
                label: "Physical field margin",
                value: 85,
                valueLabel: "reliable",
                color: palette.green,
                note: "bund, track or channel reinforcing the spectral edge",
              },
              {
                label: "Irregular smallholding",
                value: 64,
                valueLabel: "harder",
                color: palette.amber,
                note: "terraced or irregular plots where the edge is shorter than the resolution can resolve cleanly",
              },
              {
                label: "Same crop, same stage",
                value: 48,
                valueLabel: "often merges",
                color: palette.red,
                note: "no spectral edge exists — this is a limit of the physics, not of the model",
              },
              {
                label: "Cloud shadow",
                value: 38,
                valueLabel: "unusable",
                color: palette.red,
                note: "shadow edges outcompete field edges; masked out rather than segmented",
              },
            ],
            caption:
              "Two of these six are limits of what reflectance contains rather than limits of the model, and no amount of training improves them. Knowing which is which is what stops a team from spending a quarter trying to fix physics.",
          },
        },
      ],
    },
    {
      id: "verification",
      nav: "Area verification",
      heading: "Verifying the boundary before anything is computed inside it",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "An extracted boundary is a hypothesis, and it is worth checking before every downstream number is built on it. The cheapest and most revealing check is area: compare the polygon's geodesic area against the area on the land record. Agreement is reassuring; a large disagreement means the polygon and the record are describing different pieces of ground, and it is usually the record that is wrong in a way nobody has noticed.",
            "The important design decision is what to do about a disagreement. Guessing which figure is right moves the error rather than removing it, because there is no information available at this point to decide. So the disagreement is recorded, the confidence in every downstream statistic is reduced, and the discrepancy is surfaced rather than resolved silently. A field officer with a phone can settle in a minute what a pipeline cannot settle at all.",
            "The other check is whether the parcel is large enough to measure. At ten-metre resolution a field's boundary pixels contain a mixture of the field and whatever is next door, and for small parcels that mixture dominates the statistics. Below a certain size the honest output is a refusal rather than a number, because every value would be substantially about the neighbours.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Verification outcomes on an extracted parcel set",
            subtitle: "What happens to a boundary after it is extracted",
            representative: true,
            max: 100,
            data: [
              {
                label: "Verified — area agrees",
                value: 68,
                valueLabel: "68%",
                color: palette.green,
                note: "polygon area within tolerance of the record; full confidence downstream",
              },
              {
                label: "Usable — area disagrees",
                value: 17,
                valueLabel: "17%",
                color: palette.amber,
                note: "discrepancy recorded, confidence reduced, surfaced for human confirmation",
              },
              {
                label: "Merged with a neighbour",
                value: 9,
                valueLabel: "9%",
                color: palette.amber,
                note: "flagged for manual separation rather than reported as one field",
              },
              {
                label: "Too small to measure",
                value: 6,
                valueLabel: "6%",
                color: palette.red,
                note: "refused — boundary pixels would dominate every statistic computed inside",
              },
            ],
            caption:
              "Representative of the distribution's shape. The last two categories are the value of the verification step: a system without it would have produced fifteen per cent of its numbers about the wrong ground, and every one of them would have looked entirely reasonable.",
          },
        },
      ],
    },
    {
      id: "impact",
      nav: "Impact",
      heading: "What it enables",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "80%",
              label: "Boundary precision",
              detail: "Across varied agricultural landscapes",
              tone: "green",
            },
            {
              metric: "Zero",
              label: "Field visits to map",
              detail: "Regional-scale mapping without ground survey",
              tone: "green",
            },
            {
              metric: "Verified",
              label: "Not just extracted",
              detail: "Area checked against the record; disagreements surfaced rather than absorbed",
              tone: "cyan",
            },
            {
              metric: "Foundation",
              label: "For every downstream product",
              detail: "Classification, stress, nutrients, yield and credit all inherit this footprint",
              tone: "cyan",
            },
          ],
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The lesson this project taught everything downstream",
          body:
            "Boundary quality, not model quality, is what limits field-level analytics — and a pipeline that cannot tell a good boundary from a bad one will produce a hundred entirely reasonable-looking numbers about the wrong parcels. Every later system in this portfolio treats geometry as a first-class input with its own verification step and its own refusal state, because of what this one established.",
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Crop classification & yield
// ════════════════════════════════════════════════════════════════════════

export const cropClassification: ProjectDetail = {
  slug: "crop-classification-yield",
  pageTitle: "Multi-Crop Classification & Yield Prediction",
  hideMeta: true,
  lede:
    "Identifying what is planted from the shape of the season, then projecting what it will yield three to four months before harvest — turning a historical record into a procurement, pricing and lending input.",
  sections: [
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
            xTicks: [0, 3, 6, 9, 12, 15, 18].map((x) => ({
              x,
              label: `${x * 8}`,
            })),
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
          ],
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
      ],
    },
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
            xTicks: [0, 3, 6, 9, 12, 15, 18].map((x) => ({
              x,
              label: `${x * 8}`,
            })),
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
              detail: "Validated against harvest records — the one crop with a real reference",
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
              detail: "Departures measured against the field's own seasons, not a regional average",
              tone: "cyan",
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

// ════════════════════════════════════════════════════════════════════════
// Pest & disease identification
// ════════════════════════════════════════════════════════════════════════

export const pestDisease: ProjectDetail = {
  slug: "pest-disease-identification",
  pageTitle: "Pest & Disease Identification System",
  hideMeta: true,
  lede:
    "Identifying a crop pest or disease from a single photograph across 300+ classes — while showing which part of the image drove the answer, reporting its own confidence, and explaining the next step in language a grower can act on.",
  sections: [
    {
      id: "overview",
      nav: "Overview",
      heading: "A diagnosis nobody can check is a diagnosis nobody should act on",
      blocks: [
        {
          kind: "prose",
          body: [
            "Identifying crop disease from a photograph is a classification problem with an adoption problem attached. A model that returns a Latin binomial and a confidence score is close to useless to the person standing in the field — and actively harmful when it is confidently wrong, because there is no way to tell that it is. The cost of acting on a wrong diagnosis is a spray that does nothing, money spent, and a real problem left untreated for another week.",
            "So the system had to do three things rather than one: classify accurately across a very wide and very uneven label space, show what part of the image the answer came from, and say what to do about it in language that does not require a plant pathology background.",
            "The wide label space is the part that shapes everything else. Three hundred classes across fungal, bacterial and viral disease, insect pests, and abiotic disorders is an extremely long-tailed problem — a handful of classes are common enough to have thousands of examples, and most have very few. That imbalance, not the network, is the binding constraint, which is why a dataset assembly tool was built alongside the classifier rather than after it.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The label space, by category",
            subtitle: "Representative distribution across 300+ classes",
            representative: true,
            max: 130,
            data: [
              {
                label: "Fungal diseases",
                value: 118,
                valueLabel: "~118",
                color: palette.green,
                note: "the largest group, and the most visually distinctive — lesions with characteristic form and margin",
              },
              {
                label: "Insect pests",
                value: 92,
                valueLabel: "~92",
                color: palette.cyan,
                note: "identified from the insect where visible, otherwise from feeding damage pattern",
              },
              {
                label: "Bacterial diseases",
                value: 41,
                valueLabel: "~41",
                color: palette.amber,
                note: "harder — water-soaked lesions look similar across pathogens and hosts",
              },
              {
                label: "Viral diseases",
                value: 28,
                valueLabel: "~28",
                color: palette.violet,
                note: "mosaic and distortion patterns; frequently confused with nutrient disorders",
              },
              {
                label: "Abiotic disorders",
                value: 24,
                valueLabel: "~24",
                color: palette.muted,
                note: "deficiency, scorch, herbicide damage — included deliberately so a weather or nutrient problem is not diagnosed as disease",
              },
            ],
            caption:
              "The last group is included on purpose and is the one most systems omit. Heat scorch and nutrient deficiency produce symptoms that read as disease, and a grower who sprays a nutrient problem has spent money and gained nothing.",
          },
        },
      ],
    },
    {
      id: "explanation",
      nav: "Visual explanation",
      heading: "Showing what the model actually looked at",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "A saliency map answers the question a confidence score cannot: not how sure the model is, but what it based the answer on. For every diagnosis the system produces a heat overlay showing which regions of the image carried the classification, and that overlay ships to the user rather than staying in a debugging notebook.",
            "Its value in agriculture is mostly negative evidence, which is more useful than it sounds. When the heat sits squarely on the lesion, the diagnosis is credible and can be acted on. When it sits on the background, the pot rim, a shadow or the photographer's hand, the model has learned the photograph rather than the disease — and an agronomist sees that instantly, with no machine learning knowledge required.",
            "That single property is what makes the tool safe to deploy to non-experts. It converts an opaque prediction into something a human can agree or disagree with, which means a wrong answer gets caught by the person best placed to catch it instead of being followed.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "pixels",
            title: "Saliency over a diagnosed leaf",
            subtitle: "Which regions of the image drove the classification",
            grid: parseGrid(saliency),
            stops: saliencyStops,
            cell: 22,
            outline: false,
            caption:
              "Representative of the explainability output. Heat concentrated on the lesion and its margin is the signature of a diagnosis worth trusting; heat spread across the background is the signature of a model that has learned something about the photographs rather than about the disease.",
          },
        },
      ],
    },
    {
      id: "confidence",
      nav: "Knowing when unsure",
      heading: "Reporting confidence, and knowing when not to answer",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "In a long-tailed classification problem, most real failures are not wrong answers on well-represented classes — they are confident answers on things the model has barely seen, or on images that contain no diagnosable subject at all. A photograph of soil, a blurred close-up, or a disease outside the label set will all produce a prediction, and the prediction will have a number next to it.",
            "So the system distinguishes between a diagnosis and a shortlist. Where the evidence is strong and the class is well represented, it names one agent. Where two candidates are close, it says so and gives both, because a grower who knows there are two possibilities scouts for the distinguishing feature rather than treating for the wrong one. Where the image quality is inadequate or nothing in the label set fits well, the correct output is to ask for a better photograph rather than to name something.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "What the system returns, and how often",
            subtitle: "Representative distribution of response types",
            representative: true,
            max: 100,
            data: [
              {
                label: "Single confident diagnosis",
                value: 61,
                valueLabel: "61%",
                color: palette.green,
                note: "well-represented class, saliency on the symptom — name it and advise",
              },
              {
                label: "Two close candidates",
                value: 21,
                valueLabel: "21%",
                color: palette.cyan,
                note: "both returned with the distinguishing feature to check in the field",
              },
              {
                label: "Group-level answer only",
                value: 11,
                valueLabel: "11%",
                color: palette.amber,
                note: "fungal leaf spot rather than a species — honest for a sparse class",
              },
              {
                label: "Better image requested",
                value: 7,
                valueLabel: "7%",
                color: palette.red,
                note: "blur, framing or no diagnosable subject — asking again costs a grower seconds",
              },
            ],
            caption:
              "Roughly two in five responses are deliberately less specific than the model could technically produce. That restraint is what keeps the other three in five worth acting on.",
          },
        },
      ],
    },
    {
      id: "guidance",
      nav: "Guidance",
      heading: "Turning a class label into an action",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "A pathogen name is not advice. What a grower needs is what this is, how serious it is at the crop's current stage, what to do now, and what to do to avoid it next season. A conversational layer produces that from the classification, the confidence and the saliency evidence — consuming the model's output rather than reasoning about the image itself.",
            "The rule governing that layer is the same one every system in this portfolio enforces: the language model explains, it does not diagnose and it does not compute. It never introduces a pathogen the classifier did not return, never states a confidence the classifier did not produce, and never invents a dose or a threshold. Everything it says traces back to something upstream of it.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "How a photograph becomes an action",
            layers: [
              {
                name: "Image",
                role: "What the grower sends",
                color: palette.cyan,
                items: ["single photograph", "crop context", "growth stage"],
              },
              {
                name: "Classification",
                role: "What the model returns",
                color: palette.violet,
                items: [
                  "candidate agents",
                  "confidence per candidate",
                  "saliency map",
                ],
              },
              {
                name: "Explanation",
                role: "Made checkable",
                color: palette.amber,
                items: [
                  "what drove the answer",
                  "the distinguishing feature to verify",
                  "look-alikes ruled in or out",
                ],
              },
              {
                name: "Action",
                role: "What the grower does",
                color: palette.green,
                items: [
                  "severity at this stage",
                  "immediate measure",
                  "preventive measure next season",
                  "when to escalate",
                ],
              },
            ],
            caption:
              "Facts flow upward and framing flows downward; nothing flows the other way. No agent name, confidence value or threshold appears in the advice unless a layer beneath it produced that value.",
          },
        },
      ],
    },
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
              metric: ">85%",
              label: "Classification accuracy",
              detail: "Across 300+ classes spanning fungal, bacterial, viral, insect and abiotic",
              tone: "green",
            },
            {
              metric: "300+",
              label: "Classes covered",
              detail: "Including abiotic look-alikes, so weather damage is not diagnosed as disease",
              tone: "green",
            },
            {
              metric: "Checkable",
              label: "Every diagnosis",
              detail: "Saliency overlay ships to the user, so a wrong answer can be caught",
              tone: "cyan",
            },
            {
              metric: "R&D funded",
              label: "Outcome of the work",
              detail: "This system is what validated the AI capability to stakeholders",
              tone: "amber",
            },
          ],
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "How this differs from satellite pest risk",
          body:
            "This is close-range diagnosis from a photograph: it identifies what is on the leaf. The satellite pest and disease capability in the monitoring system is a different thing entirely — it ranks the agents that current weather, canopy state and growth stage are favouring, and it never claims to see the pathogen. The two complement each other exactly: the risk engine tells a scout where and when to look, and this tells them what they found.",
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Conversational crop-intelligence assistant
// ════════════════════════════════════════════════════════════════════════

export const agriChatbot: ProjectDetail = {
  slug: "elai-agri-chatbot",
  pageTitle: "Conversational Crop-Intelligence Assistant",
  hideMeta: true,
  lede:
    "A conversational layer over satellite analytics — answering a plain question about a field with a plain answer, framed for whoever is asking, and never putting a number in a sentence that the analytics did not compute.",
  sections: [
    {
      id: "overview",
      nav: "Overview",
      heading: "The outputs were correct and nobody could read them",
      blocks: [
        {
          kind: "prose",
          body: [
            "A remote sensing platform produces index time-series, severity distributions, stage classifications and confidence tiers. All of it is correct and almost none of it is legible to the people whose decisions it exists to inform — a farmer deciding whether to irrigate tomorrow, a field officer choosing which twelve of eighty fields to visit this week, a loan officer working through an application.",
            "That gap is not a labelling problem to be fixed with friendlier column headers. It is an adoption ceiling: analytics nobody can act on produce no value regardless of how accurate they are. A system that is right and unused is indistinguishable, commercially, from one that is wrong.",
            "So the assistant is a translation layer, and translation is the precise word. It does not compute anything, does not diagnose anything and does not decide anything. It takes what the analytics established and renders it as an answer to the question someone actually asked, at the level of detail that person needs.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "How an answer is assembled",
            layers: [
              {
                name: "Analytics layer",
                role: "Computes the facts",
                color: palette.green,
                items: [
                  "index time-series",
                  "crop health & stress severity",
                  "growth stage",
                  "nutrient status",
                  "yield outlook",
                  "confidence tier",
                ],
              },
              {
                name: "Retrieval layer",
                role: "Selects only what the question needs",
                color: palette.cyan,
                items: [
                  "which field",
                  "which observation window",
                  "which measurements are relevant",
                  "prior season history",
                ],
              },
              {
                name: "Narration layer",
                role: "Explains — never calculates",
                color: palette.amber,
                items: [
                  "plain-language framing",
                  "audience register",
                  "recommended action",
                  "stated uncertainty",
                ],
              },
              {
                name: "Delivery",
                role: "Same facts, different framing",
                color: palette.violet,
                items: [
                  "farmer",
                  "agronomist",
                  "field officer",
                  "loan officer",
                  "regional language",
                ],
              },
            ],
            caption:
              "The arrow direction is the whole design. Facts flow up and framing flows down, and nothing flows the other way. Any number in an answer was computed by the analytics layer, not produced by the model writing the sentence.",
          },
        },
      ],
    },
    {
      id: "framing",
      nav: "Audience framing",
      heading: "The same field, four different answers",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "The most common failure in explaining analytics is pitching every answer at one audience. A farmer asked to interpret a spatial variability coefficient will stop asking. An agronomist given a farmer-level summary loses the detail they needed and will go back to the raw output. Both problems have the same cause — one register for four audiences.",
            "So framing is a first-class parameter. The underlying facts do not change between audiences, and that is important: nobody is being told a simplified version that contradicts what someone else was told. What changes is which facts are surfaced first, how much quantification is included, and what the answer ends on.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "What happens to one question",
            stages: [
              {
                n: "01",
                name: "Resolve the subject",
                produces:
                  "Which field, and which observation window the question is about — 'my field' means something different in March and in October.",
                kind: "config",
              },
              {
                n: "02",
                name: "Select the relevant measurements",
                produces:
                  "Only the analytics the question needs. Handing a narration layer everything invites it to mention everything.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Check the confidence tier",
                produces:
                  "How much of the window was directly observed. This decides whether the question can be answered at all, before any wording is chosen.",
                kind: "repair",
              },
              {
                n: "04",
                name: "Frame for the asker",
                produces:
                  "Which fact leads, how much quantification to include, and what register to use.",
                kind: "model",
              },
              {
                n: "05",
                name: "End on an action",
                produces:
                  "What to do and by when — or, where the data cannot support one, an explicit statement that the field could not be assessed.",
                kind: "publish",
              },
            ],
            note:
              "Step three is the one that is usually missing. A system that chooses wording before checking whether it should answer will always produce a fluent answer, including when it should have produced none.",
          },
        },
        {
          kind: "cards",
          columns: 2,
          title: "One measurement, four framings",
          items: [
            {
              title: "Farmer",
              meta: "asks: is my field okay?",
              body:
                "\"The eastern part of your field is short of water — about a third of the area. If you can irrigate in the next week it should recover. The rest of the field is growing normally.\" One problem, one location, one action, one deadline.",
              tone: "green",
            },
            {
              title: "Field officer",
              meta: "asks: where do I go today?",
              body:
                "\"Three of your fields need a visit this week. This one is the priority — water stress spreading in the eastern zone, worse than the last two observations. The other two are watch-only.\" Triage, in priority order.",
              tone: "cyan",
            },
            {
              title: "Agronomist",
              meta: "asks: what exactly is happening?",
              body:
                "Stressed area, severity split, stress type with the corroborating signals, the growth stage it began at, the weather context, and how it compares to the same field's previous seasons. Enough to disagree with the system.",
              tone: "cyan",
            },
            {
              title: "Loan officer",
              meta: "asks: does this change the risk?",
              body:
                "\"Yield outlook revised down, cause attributed to a dry spell during fill, revised figure and range, and how this season compares with the previous two on the same land.\" Framed as a change to a position, not as agronomy.",
              tone: "amber",
            },
          ],
        },
      ],
    },
    {
      id: "grounding",
      nav: "Grounded answers",
      heading: "The rule this project established",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "callout",
          tone: "green",
          title: "The language model never invents a number",
          body:
            "It consumes results from the analytics layer and narrates them. Every later system in this portfolio enforces that structurally rather than by asking politely: per-factor captions in the credit engine are deterministic templates rather than generated text, precisely because a model asked to write them produces fluent sentences containing invented figures. The agentic architecture makes it an architectural constraint. It started here.",
        },
        {
          kind: "prose",
          body: [
            "The failure mode this guards against is specific and easy to underestimate. Asked to explain why a field's health score is what it is, a language model will produce a paragraph that reads exactly like the correct answer and contains a percentage nobody computed, a threshold that does not exist, and a growth stage it inferred from context. It is fluent, plausible and wrong in the one dimension that matters — and the reader has no way to tell, because it sounds precisely like the true version.",
            "The structural fix is to give the model nothing it could use to invent. It receives the computed facts, the confidence tier and the retrieval context, and it is not given the ability to compute. Where the analytics returned no value, there is nothing for the sentence to state, and the answer says the field could not be assessed instead.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "terminal",
            title: "Four things the assistant is allowed to say",
            states: [
              {
                code: "GROUNDED ANSWER",
                meaning:
                  "The analytics established this, at this confidence. Here it is, framed for you, with the action and its window.",
                next: "Act on it.",
                color: palette.green,
              },
              {
                code: "ANSWER WITH STATED LIMIT",
                meaning:
                  "The window was partly cloudy, so this is an estimate rather than a measurement — said in those words rather than as a decimal.",
                next: "Act, but verify in the field first.",
                color: palette.cyan,
              },
              {
                code: "CANNOT ASSESS",
                meaning:
                  "Too little of this window was observed to say anything about the field. Not a low score, and not a hedge.",
                next: "Wait for the next observation.",
                color: palette.amber,
              },
              {
                code: "NEEDS CLARIFICATION",
                meaning:
                  "The question does not resolve to a field and a window — which field, which season, which part of it.",
                next: "Ask one question back.",
                color: palette.violet,
              },
            ],
            caption:
              "Notice what is absent: there is no option to produce a plausible-sounding answer when the underlying analytics returned nothing. That is the single most important design decision in a conversational layer over measurements, and it has to be a structural constraint rather than an instruction.",
          },
        },
        {
          kind: "highlights",
          title: "What a grounded answer always carries",
          items: [
            {
              title: "The measurement, not a paraphrase of it",
              body:
                "If the analytics said a third of the field is affected, the answer says a third. It does not round to most or soften to some.",
            },
            {
              title: "The confidence, in words a person uses",
              body:
                "\"This week was cloudy, so this is an estimate rather than a measurement\" — rather than a decimal nobody can interpret.",
            },
            {
              title: "An action with a window",
              body:
                "Advice without a deadline gets deferred indefinitely. The answer states how long the intervention remains worth doing.",
            },
            {
              title: "A refusal when appropriate",
              body:
                "Where the observation window was too cloud-broken, the answer says the field could not be assessed. A hedged answer to a question the data cannot support is worse than no answer.",
            },
          ],
        },
      ],
    },
    {
      id: "impact",
      nav: "Impact",
      heading: "What changed",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "4",
              label: "Audiences served",
              detail: "Farmer, field officer, agronomist and loan officer, from one set of facts",
              tone: "green",
            },
            {
              metric: "Faster",
              label: "Decisions",
              detail: "Less interpretation time between an analytical output and an action",
              tone: "cyan",
            },
            {
              metric: "Narrower",
              label: "Expertise gap",
              detail: "Satellite analytics usable without a GIS or agronomy background",
              tone: "cyan",
            },
            {
              metric: "Zero",
              label: "Invented figures",
              detail: "Structurally prevented, not prompted against",
              tone: "green",
            },
          ],
        },
        {
          kind: "prose",
          body: [
            "The lasting contribution of this project was not the assistant. It was the discovery that the hard part of explainable agriculture analytics is restraint — deciding what a generated answer is not allowed to say, and then building the layer that makes it structurally unable to say it. That rule became the design constraint for the agentic architecture, the credit engine's explanation layer and the monitoring system's advisory output.",
          ],
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// AI data collection agent
// ════════════════════════════════════════════════════════════════════════

export const dataAgent: ProjectDetail = {
  slug: "ai-data-collection-agent",
  pageTitle: "Semi-Automated AI Data Collection Agent",
  hideMeta: true,
  lede:
    "The unglamorous tool that made a 300-class vision system possible — reaching the long tail of rare classes automatically, then filtering hard enough that the dataset gets smaller and the model gets better.",
  sections: [
    {
      id: "overview",
      nav: "Overview",
      heading: "The model was never the bottleneck",
      blocks: [
        {
          kind: "prose",
          body: [
            "Training a classifier across three hundred pest and disease classes needs three hundred balanced, correctly labelled image sets. Assembling those by hand is weeks of work per iteration, and it is the step that silently caps how fast any computer vision project can move — because it does not look like the bottleneck. Model architecture is the visible, discussable part; dataset assembly is the part everyone assumes is nearly done.",
            "It caps quality too, in a way that is hard to see. An under-populated class does not fail loudly. It just performs badly, the confusion matrix shows weakness, and the natural response is to reach for a better architecture — spending a month on modelling to solve a data problem. Recognising which one you actually have is most of the work.",
            "So the tool exists to remove that constraint: generate the search strategies, retrieve at volume across sources, then filter aggressively enough that what survives is worth training on.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Where an iteration cycle actually went",
            subtitle: "Share of elapsed time per model iteration, before the tool",
            representative: true,
            max: 100,
            data: [
              {
                label: "Dataset assembly",
                value: 62,
                valueLabel: "62%",
                color: palette.red,
                note: "searching, downloading, deduplicating, checking labels, filling sparse classes — by hand",
              },
              {
                label: "Training",
                value: 16,
                valueLabel: "16%",
                color: palette.cyan,
                note: "the part everyone plans around",
              },
              {
                label: "Evaluation & error analysis",
                value: 14,
                valueLabel: "14%",
                color: palette.green,
                note: "where the data problems were repeatedly mistaken for model problems",
              },
              {
                label: "Architecture & tuning",
                value: 8,
                valueLabel: "8%",
                color: palette.violet,
                note: "the part that gets discussed",
              },
            ],
            caption:
              "Representative of the split this project was built to fix. Nearly two-thirds of every cycle went into the step nobody counted, and the visible symptom was a weak confusion matrix — which pointed attention at the eight per cent rather than the sixty-two.",
          },
        },
      ],
    },
    {
      id: "long-tail",
      nav: "The long tail",
      heading: "Reaching classes that barely exist online",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "The head of a three-hundred-class agricultural problem is easy. Common diseases on major crops are extensively photographed, indexed and labelled. The tail is where the work is: an uncommon pathogen on a regionally important crop may have a few dozen usable images scattered across the internet under half a dozen different names.",
            "Finding those requires the search itself to be generated rather than typed. Each class needs multiple strategies — the scientific name, the common name, regional common names, the host-crop pairing, and a description of the symptom rather than the agent, because a great many images are captioned by what the photographer saw rather than by what caused it. Producing that set of strategies for three hundred classes is what makes the tail reachable at all.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "dumbbell",
            title: "Class balance, before and after",
            subtitle: "Usable images per class, by position in the distribution",
            domain: [0, 1000],
            unit: " imgs",
            fromLabel: "manual assembly",
            toLabel: "after automated collection",
            rows: [
              {
                label: "Head classes",
                from: 850,
                to: 900,
                note: "already well covered",
                color: palette.cyan,
              },
              {
                label: "Mid-distribution",
                from: 240,
                to: 620,
                note: "moderately documented",
                color: palette.green,
              },
              {
                label: "Long tail",
                from: 35,
                to: 410,
                note: "sparse, multi-named",
                color: palette.green,
              },
              {
                label: "Rarest classes",
                from: 8,
                to: 280,
                note: "near-absent by hand",
                color: palette.green,
              },
            ],
            caption:
              "Representative of the shape of the change. The head barely moves and that is correct — it did not need help. The value is entirely at the bottom, where classes went from unusable to trainable, because a 300-class model is only as good as its worst-represented classes.",
          },
        },
      ],
    },
    {
      id: "filtering",
      nav: "Filtering",
      heading: "Where the quality actually comes from",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "An automated collector without aggressive filtering produces a larger dataset and a worse model. That is the counter-intuitive core of the whole tool, and it is worth being precise about why.",
            "Scraped agricultural images arrive with systematic contamination. Many carry watermarks, captions or diagnostic text overlays — and a convolutional network will happily learn that a particular watermark predicts a particular disease, because in the training data it does. Many are near-duplicates of each other across sources, which inflates apparent volume while adding no information and quietly corrupting any validation split they straddle. Many are simply mislabelled, since the caption reflected what the uploader believed. Each of those is a specific failure mode, and each needs its own filter rather than a general quality score.",
            "Resolution thresholds, near-duplicate detection across sources, text-overlay removal and label sanity checks together reject well over half of what is retrieved. That rejection rate is the point, not a cost.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The collection funnel",
            subtitle: "Retention through each filtering stage",
            representative: true,
            max: 100,
            data: [
              {
                label: "Retrieved",
                value: 100,
                valueLabel: "100%",
                color: palette.faint,
                note: "multi-source retrieval on generated search strategies",
              },
              {
                label: "Resolution threshold",
                value: 71,
                valueLabel: "71%",
                color: palette.cyan,
                note: "too small to show a lesion margin is too small to train on",
              },
              {
                label: "Duplicate detection",
                value: 58,
                valueLabel: "58%",
                color: palette.cyanDim,
                note: "near-duplicates across sources — inflate volume, corrupt validation splits",
              },
              {
                label: "Text-overlay removal",
                value: 49,
                valueLabel: "49%",
                color: palette.amber,
                note: "watermarks and captions are learnable shortcuts, and the model will take them",
              },
              {
                label: "Label sanity check",
                value: 41,
                valueLabel: "41%",
                color: palette.violet,
                note: "obvious mislabels rejected before they teach the wrong thing",
              },
              {
                label: "Kept for training",
                value: 41,
                valueLabel: "41%",
                color: palette.green,
                note: "then augmented, targeted at the classes that need it rather than uniformly",
              },
            ],
            caption:
              "Nearly six in ten retrieved images never reach the dataset. Skipping the text-overlay filter alone would produce a model that scores well in validation and fails in a field, because the shortcut it learned does not exist on a farmer's photograph.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "Augmentation is targeted, not uniform",
          body:
            "Applying the same augmentation everywhere multiplies the whole dataset and leaves the imbalance exactly where it was — the head grows as fast as the tail. Concentrating augmentation on under-populated classes is what actually shifts the distribution, and the distribution is the thing that was broken.",
        },
      ],
    },
    {
      id: "impact",
      nav: "Impact",
      heading: "What it unlocked",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "70%",
              label: "Reduction in preparation time",
              detail: "Per dataset iteration",
              tone: "green",
            },
            {
              metric: "Trainable",
              label: "Rarest classes",
              detail: "Classes that were effectively unreachable by hand",
              tone: "green",
            },
            {
              metric: "Faster",
              label: "Iteration cycles",
              detail: "Limited by training time rather than by collection",
              tone: "cyan",
            },
            {
              metric: "Enabler",
              label: "For the 300-class system",
              detail: "The classifier is not feasible without this",
              tone: "amber",
            },
          ],
        },
        {
          kind: "callout",
          tone: "neutral",
          title: "Why a tool like this belongs in a portfolio",
          body:
            "It is the least visible project here and one of the most consequential. Recognising that the binding constraint was dataset assembly rather than model architecture — and then building the unglamorous thing that removed it — is the same judgement that later identified boundary quality, rather than scoring sophistication, as the limit on field-level analytics.",
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Regional agricultural intelligence
// ════════════════════════════════════════════════════════════════════════

export const regionalIntelligence: ProjectDetail = {
  slug: "regional-agri-intelligence",
  pageTitle: "Regional Agricultural Intelligence Platform",
  hideMeta: true,
  lede:
    "Crop intelligence at the resolution policy decisions are actually made — crop health, drought concentration, sowing progress and land-use change across whole districts, always compared against prior seasons rather than against an absolute threshold.",
  sections: [
    {
      id: "overview",
      nav: "Overview",
      heading: "A policy team is not asking about one field",
      blocks: [
        {
          kind: "prose",
          body: [
            "An agriculture department or a sourcing team asks a different kind of question from a farmer. Is sowing ahead or behind last year across this district? Where is drought stress concentrating? Is cultivated area expanding or contracting? Those questions need coverage and consistency far more than they need per-pixel precision, and answering them well is a different engineering problem from field-level monitoring.",
            "The failure mode is using one where the other belongs. Field-level analytics aggregated naively to a district inherit every small-field boundary problem and produce a number with impressive-looking precision and no reliability. Regional analytics applied to one farm produce a figure about a landscape the farmer does not own. Being clear about which question is being asked is most of the design.",
            "At regional scale the useful signal is almost always a comparison rather than an absolute. A district at moderate stress means little on its own; a district at moderate stress when it was healthy at the same point in each of the last three years is a drought advisory. So every product here is built as a departure from the region's own history.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Crop stress concentration across a district",
            subtitle: "Aggregated from multi-temporal analysis, compared to season normal",
            rows: 10,
            cols: 12,
            values: parseGrid(stressArt).flat(),
            stops: [
              { at: 0, color: palette.green, label: "at or above normal" },
              { at: 1, color: palette.cyan, label: "mild departure" },
              { at: 2, color: palette.amber, label: "moderate departure" },
              { at: 3, color: palette.red, label: "severe departure" },
            ],
            caption:
              "Representative of the output. At this scale the pattern carries the information, not any single cell — a contiguous band of moderate-to-severe departure running through one part of the district is an advisory with a location, whereas the same count of cells scattered at random is almost always a data-quality artefact.",
          },
        },
      ],
    },
    {
      id: "monitoring",
      nav: "Crop health & drought",
      heading: "Crop health tracking and drought monitoring",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Regional crop health is built by aggregating canopy condition over consistent mapping units and comparing each unit against its own history for the same point in the season. That comparison is what converts a reflectance value into a finding: this area is performing below where it normally is by now.",
            "Drought monitoring adds the water dimension. Canopy condition alone cannot distinguish a crop that is water-stressed from one that was sown late, so the vegetation signal is read alongside rainfall departure, accumulated water balance and the length of the current dry spell. A region showing a canopy shortfall with a matching rainfall deficit is a drought signal; the same shortfall with normal rainfall points at something else entirely — pest pressure, input shortage or delayed sowing.",
            "The value for a decision-maker is that the two can be told apart early. A drought advisory issued while there is still time to release water, adjust an input subsidy or plan relief is worth a great deal more than a post-season assessment of what was lost.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "District canopy condition against its own history",
            subtitle: "Current season compared with the three preceding seasons",
            representative: true,
            yLabel: "district mean canopy condition",
            xLabel: "weeks into the season",
            yDomain: [0, 0.8],
            height: 290,
            xTicks: [0, 3, 6, 9, 12, 15, 18].map((x) => ({
              x,
              label: `${x + 1}`,
            })),
            events: [{ x: 11, label: "advisory issued", color: palette.amber }],
            series: [
              {
                name: "three-season normal",
                color: palette.muted,
                dash: "6 4",
                points: seq([
                  0.14, 0.2, 0.29, 0.4, 0.51, 0.6, 0.66, 0.69, 0.68, 0.63, 0.55,
                  0.46, 0.38, 0.31, 0.26, 0.22, 0.19, 0.17, 0.15,
                ]),
              },
              {
                name: "current season",
                color: palette.amber,
                points: seq([
                  0.13, 0.19, 0.27, 0.37, 0.47, 0.55, 0.59, 0.58, 0.53, 0.46,
                  0.39, 0.33, 0.28, 0.24, 0.21, 0.18, 0.16, 0.15, 0.14,
                ]),
              },
            ],
            caption:
              "The two curves separate from around week seven and the gap widens through the reproductive phase. The advisory fires while the divergence is still developing — the same finding delivered at week eighteen would be a post-mortem rather than a decision input.",
          },
        },
      ],
    },
    {
      id: "sowing",
      nav: "Sowing progress",
      heading: "Sowing progress and season timing",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "Sowing progress is often the first question of a season and the hardest to answer on the ground, because it changes daily across a large area. It is straightforward from orbit: a field transitions from bare soil to emerging canopy, and that transition is detectable within a couple of weeks of it happening. Counting the transitioned area across a district, week by week, produces a sowing progress curve.",
            "Compared against prior years, that curve answers what a department actually needs to know. A district running two weeks behind normal has implications for input demand timing, for harvest labour scheduling, and for how much of the crop will be exposed to end-of-season weather. A district where sowing has stalled partway through usually means rainfall did not arrive as expected, and the stall is visible well before anyone reports it.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Sowing progress across the same district",
            subtitle: "Share of cultivable area transitioned to an emerging crop",
            rows: 10,
            cols: 12,
            values: parseGrid(sowingArt).flat(),
            stops: [
              { at: 0, color: "rgba(157,174,164,0.4)", label: "not yet sown" },
              { at: 1, color: palette.amber, label: "partial" },
              { at: 2, color: palette.cyan, label: "mostly sown" },
              { at: 3, color: palette.green, label: "complete" },
            ],
            caption:
              "The same district as the stress map above, so the two can be read together. Sowing has completed in the north-west and has barely started in the south-east — a spread of several weeks across a single administrative unit, which is precisely the detail a district-level average destroys.",
          },
        },
      ],
    },
    {
      id: "land-use",
      nav: "Land-use change",
      heading: "Land-use change across multi-year archives",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "Land-use change is the question satellites answer better than any alternative, because it requires something no survey has: a consistent, comparable record of the same ground from years ago. Whether cultivated area is expanding, whether cropping intensity is rising, whether land is falling out of agriculture — all of it needs a past that was measured the same way as the present.",
            "This is where a longer archive earns its place alongside higher-resolution imagery. Coarser but decades-deep observation supplies the baseline; finer recent imagery supplies the detail. Change detection over that combination distinguishes genuine conversion from ordinary rotation — a field fallow for one season looks much like land leaving agriculture, and only multi-year context separates them.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Where the change is, over a multi-year window",
            subtitle: "Share of district cultivable area by change category",
            representative: true,
            max: 100,
            data: [
              {
                label: "Stable cultivation",
                value: 71,
                valueLabel: "71%",
                color: palette.green,
                note: "cropped consistently across the window",
              },
              {
                label: "Intensified",
                value: 11,
                valueLabel: "11%",
                color: palette.cyan,
                note: "additional cycle per year — usually new irrigation access",
              },
              {
                label: "Newly cultivated",
                value: 6,
                valueLabel: "6%",
                color: palette.cyan,
                note: "previously uncropped land brought into agriculture",
              },
              {
                label: "Reduced intensity",
                value: 7,
                valueLabel: "7%",
                color: palette.amber,
                note: "fewer cycles than earlier in the window — worth investigating rather than assuming",
              },
              {
                label: "Left agriculture",
                value: 5,
                valueLabel: "5%",
                color: palette.red,
                note: "sustained conversion, distinguished from rotation by multi-year context",
              },
            ],
            caption:
              "The two amber and red categories are the ones that need multi-year evidence. A single season cannot tell a rotational fallow from land leaving cultivation, and confusing them would produce alarming numbers about entirely normal farming.",
          },
        },
      ],
    },
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
              metric: "District",
              label: "Level resolution",
              detail: "Coverage-first, matched to how policy and sourcing decisions are made",
              tone: "green",
            },
            {
              metric: "4",
              label: "Monitoring products",
              detail: "Crop health, drought concentration, sowing progress, land-use change",
              tone: "cyan",
            },
            {
              metric: "Own history",
              label: "As the baseline",
              detail: "Every product a departure from the region's own prior seasons",
              tone: "cyan",
            },
            {
              metric: "In-season",
              label: "Not post-season",
              detail: "Advisories issued while intervention is still possible",
              tone: "green",
            },
          ],
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "The deliberate difference from field-level monitoring",
          body:
            "This platform and the field-level monitoring system answer different questions and should never be conflated. Field-level work is per field, per observation, with a pixel budget in the tens and a confidence tier per output. This is per district, pattern-first, and its value is consistent coverage across a large area over a long record. Using one where the other belongs is the most common reason satellite agriculture products disappoint the people who buy them.",
        },
      ],
    },
  ],
};
