// lib/content/farmBoundary.ts — Farm Boundary Delineation System.
//
// A capability showcase, explained in standard remote-sensing terms: what makes
// a field edge findable, why resolution rather than model capacity sets the
// ceiling, and what the system does when a boundary cannot be trusted.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

// ── Mixed-pixel geometry, written at true 10 m scale ───────────────────
// 0 = interior pixel, wholly inside the field. 1 = edge pixel, whose
// reflectance is a mixture of this field and whatever is next door.
// A 10 m pixel is 0.01 ha, so these grids are the field's real pixel budget.
const largeParcel = [
  "1111111111111",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1000000000001",
  "1111111111111",
];

const smallParcel = [
  "11111",
  "10001",
  "10001",
  "11111",
];

const pixelStops = [
  { at: 0, color: palette.green, label: "interior — reflectance is this field only" },
  { at: 1, color: palette.amber, label: "edge — mixed with the neighbour" },
];

const weekTicks = [0, 3, 6, 9, 12, 15, 18].map((x) => ({ x, label: `${x}` }));

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

export const farmBoundary: ProjectDetail = {
  slug: "farm-boundary-delineation",
  pageTitle: "Farm Boundary Delineation System",
  hideMeta: true,
  lede:
    "Automated field boundary extraction from satellite imagery — the footprint every field-level measurement inherits, with the area verified against what was declared and the parcels too small or too uncertain to measure flagged rather than reported.",
  sections: [
    // ─────────────────────────────────────────────── overview
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
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "What sits on top of the polygon",
            subtitle:
              "Every product below inherits the geometry above it, including its errors",
            layers: [
              {
                name: "Geometry",
                role: "The polygon, and its verification state",
                color: palette.cyan,
                items: [
                  "extracted boundary",
                  "geodesic area",
                  "interior-pixel count",
                  "agreement with the land record",
                  "confidence tier",
                ],
              },
              {
                name: "Pixel selection",
                role: "Which observations are counted as this field",
                color: palette.violet,
                items: [
                  "interior pixels",
                  "edge pixels excluded or down-weighted",
                  "cloud and shadow masked",
                  "valid-pixel budget per observation",
                ],
              },
              {
                name: "Field-level analytics",
                role: "Everything computed inside the polygon",
                color: palette.green,
                items: [
                  "crop classification",
                  "stressed-area percentage",
                  "nutrient status",
                  "biomass & yield",
                  "carbon stock per stratum",
                ],
              },
              {
                name: "Decisions taken on those numbers",
                role: "Where a boundary error finally shows up",
                color: palette.amber,
                items: [
                  "irrigation & input advice",
                  "procurement volumes",
                  "credit limits",
                  "credit issuance",
                ],
              },
            ],
            caption:
              "This is the reason boundary work belongs at the front of the portfolio rather than in an appendix. A ten per cent area error does not stay a ten per cent area error — it propagates into a stressed-area percentage, a projected tonnage and eventually a lending limit, and by the time it arrives there it is indistinguishable from an agronomic finding.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── extraction
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
            kind: "stages",
            title: "The pipeline, and what each step is protecting against",
            stages: [
              {
                n: "01",
                name: "Geometric correction",
                produces:
                  "Imagery in which a pixel sits where the ground actually is. Without it a boundary is systematically offset, and every field inherits the same wrong footprint — the hardest kind of error to notice.",
                kind: "config",
              },
              {
                n: "02",
                name: "Radiometric & atmospheric correction",
                produces:
                  "Reflectance that is comparable between dates and scenes, so a haze difference between two acquisitions does not read as a field edge.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Cloud & shadow masking",
                produces:
                  "A scene with weather removed. A cloud edge is the strongest edge in any image, so a segmenter given unmasked imagery traces the sky.",
                kind: "ingest",
              },
              {
                n: "04",
                name: "Acquisition selection",
                produces:
                  "The dates where neighbouring fields are least alike. This step is worth more than any model change: mid-season imagery makes edges findable that bare-soil imagery does not contain at all.",
                kind: "repair",
              },
              {
                n: "05",
                name: "Segmentation",
                produces:
                  "Candidate contours at the reflectance discontinuities, across the whole scene rather than one field at a time.",
                kind: "model",
              },
              {
                n: "06",
                name: "Closing & simplification",
                produces:
                  "Contours resolved into closed polygons with sliver geometry and self-intersections removed. An open contour is not a field.",
                kind: "model",
              },
              {
                n: "07",
                name: "Multi-season confirmation",
                produces:
                  "A check that the parcel behaved as one management unit across several seasons, rather than being two fields that happened to match this year.",
                kind: "model",
              },
              {
                n: "08",
                name: "Verification & publication",
                produces:
                  "Area checked against the record, interior-pixel budget checked against the size floor, and a confidence tier attached — or a refusal.",
                kind: "publish",
              },
            ],
            note:
              "Steps one to four are preprocessing and they carry more of the outcome than step five does. A team that treats boundary extraction as a modelling problem spends its effort on the one step where effort buys the least.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "When in the season an edge exists to be found",
            subtitle:
              "Reflectance contrast across a shared field boundary, week by week",
            representative: true,
            yLabel: "edge contrast (relative)",
            xLabel: "weeks after sowing",
            height: 300,
            yDomain: [0, 1],
            xTicks: weekTicks,
            phases: [
              { from: 0, to: 3, label: "bare soil" },
              { from: 3, to: 8, label: "canopy divergence" },
              { from: 8, to: 12, label: "peak separability" },
              { from: 12, to: 16, label: "senescence" },
              { from: 16, to: 18, label: "stubble" },
            ],
            events: [
              { x: 10, label: "best acquisition window", color: palette.green },
            ],
            series: [
              {
                name: "neighbours under different crops",
                color: palette.green,
                points: seq([
                  0.12, 0.15, 0.22, 0.34, 0.48, 0.62, 0.74, 0.82, 0.86, 0.87,
                  0.84, 0.78, 0.68, 0.55, 0.4, 0.27, 0.18, 0.14, 0.12,
                ]),
              },
              {
                name: "neighbours under the same crop, same stage",
                color: palette.red,
                points: seq([
                  0.1, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.22, 0.23, 0.23,
                  0.22, 0.21, 0.2, 0.18, 0.16, 0.14, 0.12, 0.11, 0.1,
                ]),
              },
              {
                name: "contrast a segmenter needs",
                color: palette.muted,
                dash: "6 4",
                points: seq([
                  0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35,
                  0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35,
                ]),
              },
            ],
            caption:
              "Two boundaries in the same landscape, over one season. The green edge is above the line for roughly nine weeks and invisible outside them, which is why acquisition selection carries more of the result than the model does. The red edge never crosses the line in the whole season — that boundary is not a hard case, it is absent from the imagery, and choosing a better date or a bigger model does nothing for it.",
          },
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

    // ─────────────────────────────────────────────── mixed pixels
    {
      id: "resolution",
      nav: "Resolution floor",
      heading: "Why small fields are refused: the arithmetic of a mixed pixel",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "A ten-metre pixel is a hundred square metres of ground averaged into one number. A pixel that straddles a field edge averages this field with the neighbour, the bund, the track or the drainage channel — so its value is partly about land the polygon does not cover. That is not noise to be filtered out; it is a different measurement wearing the same units.",
            "Which makes the useful question not the field's area but its interior-pixel count. A parcel's edge grows with its perimeter while its interior grows with its area, so the proportion of contaminated pixels rises sharply as fields get smaller. Past a certain point the majority of a field's pixels are mixed, and every statistic computed inside the polygon — mean vigour, stressed area, nutrient status — is substantially a statement about the neighbours.",
            "So the size floor is derived rather than chosen. It is the point below which the interior-pixel budget cannot support a claim about the field, and the correct output there is an explicit refusal. A number that looks exactly like every other number, but is mostly about somebody else's land, is worse than no number at all, because nothing downstream can tell the difference.",
          ],
        },
        {
          kind: "viz",
          columns: 2,
          intro:
            "The same 10 m grid over two parcels, with each pixel classified by whether its reflectance is this field alone or a mixture. Both grids are drawn at the field's real pixel budget — the coarseness is the measurement, not a simplification of it.",
          specs: [
            {
              kind: "pixels",
              title: "1.3 ha field — measurable",
              subtitle: "130 pixels, of which 88 are interior",
              grid: parseGrid(largeParcel),
              stops: pixelStops,
              cell: 16,
              distribution: [
                { label: "interior", pct: 68, color: palette.green },
                { label: "edge", pct: 32, color: palette.amber },
              ],
              caption:
                "Two-thirds of the pixels are wholly inside the field. A mean computed over the interior is a statement about this crop, and the edge ring can be excluded outright without losing the sample.",
            },
            {
              kind: "pixels",
              title: "0.2 ha field — refused",
              subtitle: "20 pixels, of which 6 are interior",
              grid: parseGrid(smallParcel),
              stops: pixelStops,
              cell: 16,
              distribution: [
                { label: "interior", pct: 30, color: palette.green },
                { label: "edge", pct: 70, color: palette.amber },
              ],
              caption:
                "Seven pixels in ten are mixed, and excluding them leaves six observations to describe a whole field. This parcel is not a harder version of the one beside it — at this resolution it is a different problem, and the honest output is that it cannot be measured rather than a number with a wide error bar.",
            },
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Interior-pixel share against field size",
            subtitle:
              "A square field at 10 m resolution — the geometry, not an estimate",
            max: 100,
            referenceLabel: "the share below which the field is refused",
            data: [
              {
                label: "5.0 ha",
                value: 83,
                valueLabel: "83%",
                color: palette.green,
                note: "22 x 22 pixels — 400 interior of 484; edge contamination is a rounding error",
                reference: 45,
              },
              {
                label: "2.0 ha",
                value: 74,
                valueLabel: "74%",
                color: palette.green,
                note: "14 x 14 pixels — 144 interior of 196",
                reference: 45,
              },
              {
                label: "1.0 ha",
                value: 64,
                valueLabel: "64%",
                color: palette.green,
                note: "10 x 10 pixels — 64 interior of 100; still a usable sample",
                reference: 45,
              },
              {
                label: "0.5 ha",
                value: 51,
                valueLabel: "51%",
                color: palette.amber,
                note: "7 x 7 pixels — 25 interior of 49; usable, with the confidence lowered",
                reference: 45,
              },
              {
                label: "0.2 ha",
                value: 25,
                valueLabel: "25%",
                color: palette.red,
                note: "4 x 4 pixels — 4 interior of 16; three pixels in four are mixed",
                reference: 45,
              },
              {
                label: "0.1 ha",
                value: 11,
                valueLabel: "11%",
                color: palette.red,
                note: "3 x 3 pixels — 1 interior of 9; a single pixel cannot describe a field",
                reference: 45,
              },
            ],
            caption:
              "These are not modelled figures — they follow directly from a square field's perimeter-to-area ratio at 10 m, and any team can rederive them in a minute. That is exactly why they make a good size floor: the refusal threshold is a property of the sensor and the field, and it is not open to optimistic reinterpretation later.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "The same arithmetic sets the ceiling on smallholder analytics",
          body:
            "Across much of the world the median holding is well under a hectare, and the pixel geometry above is the honest reason field-level satellite analytics get thinner there rather than a shortcoming of any particular model. It also points at the two things that genuinely help, neither of which is a better network: finer resolution imagery, which raises the interior share at every size, and aggregating a grower's several small parcels into one management unit where they are actually farmed as one.",
        },
      ],
    },

    // ─────────────────────────────────────────────── verification
    {
      id: "verification",
      nav: "Area verification",
      heading: "Verifying the boundary before anything is computed inside it",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "An extracted boundary is a hypothesis, and it is worth checking before every downstream number is built on it. The cheapest and most revealing check is area: compare the polygon's geodesic area against the area on the land record. Agreement is reassuring; a large disagreement means the polygon and the record are describing different pieces of ground, and it is usually the record that is wrong in a way nobody has noticed.",
            "The important design decision is what to do about a disagreement. Guessing which figure is right moves the error rather than removing it, because there is no information available at this point to decide. So the disagreement is recorded, the confidence in every downstream statistic is reduced, and the discrepancy is surfaced rather than resolved silently. A field officer with a phone can settle in a minute what a pipeline cannot settle at all.",
            "Read as a scatter against the record, the failures separate into recognisable kinds rather than a single error rate — and the kinds have different fixes. A polygon roughly double the record is a merge with a neighbour. A polygon roughly half is a record that covers two parcels. A cloud of points scattered symmetrically around the line at small areas is the mixed-pixel floor. Only the last of those is about measurement precision.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "scatter",
            title: "Measured polygon area against the land record",
            subtitle:
              "A sample of one extracted parcel set, with the tolerance band drawn",
            representative: true,
            xLabel: "area on the land record (ha)",
            yLabel: "measured geodesic area (ha)",
            domain: [0, 5],
            tolerance: 0.1,
            toleranceLabel: "within 10% — treated as agreement",
            height: 360,
            flaggedLabel: "refused — below the interior-pixel floor",
            stats: [
              { label: "parcels in set", value: "106" },
              { label: "within tolerance", value: "68%" },
              { label: "refused as too small", value: "6%" },
            ],
            series: [
              {
                name: "verified — area agrees",
                color: palette.green,
                points: [
                  { x: 0.45, y: 0.47 },
                  { x: 0.62, y: 0.6 },
                  { x: 0.8, y: 0.83 },
                  { x: 1.0, y: 0.96 },
                  { x: 1.15, y: 1.2 },
                  { x: 1.4, y: 1.37 },
                  { x: 1.6, y: 1.55 },
                  { x: 1.85, y: 1.93 },
                  { x: 2.0, y: 2.08 },
                  { x: 2.3, y: 2.22 },
                  { x: 2.6, y: 2.66 },
                  { x: 3.0, y: 3.12 },
                  { x: 3.3, y: 3.2 },
                  { x: 3.6, y: 3.72 },
                  { x: 4.1, y: 4.0 },
                  { x: 4.5, y: 4.62 },
                ],
              },
              {
                name: "merged with a neighbour",
                color: palette.red,
                points: [
                  {
                    x: 0.9,
                    y: 1.85,
                    tip: "polygon is roughly double the record — two same-crop fields traced as one",
                  },
                  {
                    x: 1.6,
                    y: 3.05,
                    tip: "polygon is roughly double the record — two same-crop fields traced as one",
                  },
                  {
                    x: 2.2,
                    y: 4.15,
                    tip: "polygon is roughly double the record — two same-crop fields traced as one",
                  },
                ],
              },
              {
                name: "record covers more than the parcel",
                color: palette.amber,
                points: [
                  {
                    x: 2.4,
                    y: 1.25,
                    tip: "record describes two holdings; the polygon is one of them",
                  },
                  {
                    x: 3.2,
                    y: 1.75,
                    tip: "record includes a track and a homestead the polygon correctly excludes",
                  },
                  {
                    x: 1.9,
                    y: 1.35,
                    tip: "discrepancy recorded, confidence reduced, surfaced for confirmation",
                  },
                  {
                    x: 2.8,
                    y: 2.15,
                    tip: "discrepancy recorded, confidence reduced, surfaced for confirmation",
                  },
                ],
              },
              {
                name: "below the measurable floor",
                color: palette.muted,
                points: [
                  { x: 0.12, y: 0.19, flagged: true, tip: "9 pixels — refused" },
                  { x: 0.18, y: 0.13, flagged: true, tip: "13 pixels — refused" },
                  { x: 0.22, y: 0.31, flagged: true, tip: "22 pixels — refused" },
                  { x: 0.3, y: 0.21, flagged: true, tip: "21 pixels — refused" },
                ],
              },
            ],
            caption:
              "The structure in the errors is the finding, and it is the reason this check runs at all. The red points sit on a second line at roughly twice the record, which is a merge signature rather than an area error; the amber points are cases where the record and the polygon are describing different ground, and the polygon is often the more accurate of the two. The hollow points near the origin are refusals, plotted deliberately: a system that quietly dropped them would look more accurate than it is.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "funnel",
            title: "The gates a polygon passes before it becomes a footprint",
            subtitle: "Share of extracted polygons surviving each check",
            representative: true,
            unit: "%",
            dropLabel: "removed or downgraded",
            keepLabel: "still a candidate footprint",
            stages: [
              {
                label: "Extracted polygons",
                value: 100,
                color: palette.faint,
                note: "closed contours from segmentation",
              },
              {
                label: "Above the size floor",
                value: 94,
                color: palette.cyan,
                note: "interior-pixel budget checked",
                dropReason:
                  "too few interior pixels — every statistic inside would be about the neighbours",
              },
              {
                label: "Separated from neighbours",
                value: 85,
                color: palette.cyanDim,
                note: "multi-season confirmation",
                dropReason:
                  "merged with a same-crop neighbour — held for manual separation, never reported as one field",
              },
              {
                label: "Area agrees with the record",
                value: 68,
                color: palette.green,
                note: "published at full confidence",
                dropReason:
                  "discrepancy recorded, confidence reduced, and the case surfaced for human confirmation",
              },
            ],
            note:
              "The seventeen per cent that fall out of the last gate are still published — with a lower confidence tier and a flag — because a disagreement with a land record is not evidence that the polygon is wrong. The nine and six per cent above it are withheld, because in those two cases the geometry itself is known to be unusable.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "decision",
            title: "What happens when the polygon and the record disagree",
            subtitle:
              "The branch that is usually missing, and the one that matters most",
            gate: {
              inputLabel: "on every extracted parcel",
              label: "Geodesic polygon area vs. the land-record area",
              detail:
                "The cheapest check available, and the only one that runs before anything at all is computed inside the boundary.",
            },
            branches: [
              {
                condition: "the two agree within tolerance",
                share: "68%",
                outcome: "Verified footprint",
                emits:
                  "the polygon, at full confidence, for every downstream product to compute inside",
                color: palette.green,
              },
              {
                condition: "they disagree by more than tolerance",
                share: "17%",
                outcome: "Usable, with the discrepancy on the record",
                emits:
                  "the polygon, a reduced confidence tier, and a flag for human confirmation. The pipeline does not pick a winner — it has no information with which to.",
                color: palette.amber,
              },
              {
                condition:
                  "one polygon spans what the record calls two or more fields",
                share: "9%",
                outcome: "Held for manual separation",
                emits:
                  "no field footprint at all. A merge reported as one large field would silently double an area and look entirely reasonable doing it.",
                color: palette.amber,
                refuses: true,
              },
              {
                condition: "the parcel is below the interior-pixel floor",
                share: "6%",
                outcome: "Refused",
                emits:
                  "an explicit refusal, rather than a set of statistics that are mostly about the adjacent land",
                color: palette.red,
                refuses: true,
              },
            ],
            note:
              "There is deliberately no branch that resolves a disagreement by choosing the more plausible figure. Doing so would convert a visible, flagged uncertainty into an invisible, confident error — and every product downstream would inherit it with no way of knowing.",
          },
          intro:
            "The design decision worth defending here is negative. Three of these four branches decline to produce a clean number, and two of them produce nothing at all.",
        },
      ],
    },

    // ─────────────────────────────────────────────── impact
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
              detail:
                "Area checked against the record; disagreements surfaced rather than absorbed",
              tone: "cyan",
            },
            {
              metric: "Foundation",
              label: "For every downstream product",
              detail:
                "Classification, stress, nutrients, yield and credit all inherit this footprint",
              tone: "cyan",
            },
          ],
        },
        {
          kind: "status",
          title: "What on this page is measured, and what is mechanism",
          intro:
            "The charts above are a mixture of one measured figure, several pieces of geometry anyone can rederive, and a number of representative output shapes. Keeping them separate is the point.",
          items: [
            {
              verdict: "verified",
              claim: "80% boundary precision across varied agricultural landscapes",
              evidence:
                "The one measured performance figure on this page. Every other quantity here is either geometry or an illustration of output shape, and is labelled as such on the chart itself.",
            },
            {
              verdict: "verified",
              claim:
                "Interior-pixel share follows from field size and resolution alone",
              evidence:
                "The size-floor chart is arithmetic on a square field's perimeter-to-area ratio at 10 m — 64% interior at 1.0 ha, 25% at 0.2 ha, 11% at 0.1 ha. Rederivable in a minute, and not open to reinterpretation.",
            },
            {
              verdict: "defensible",
              claim:
                "Same-crop, same-stage neighbours cannot be separated from reflectance",
              evidence:
                "A limit of what the imagery contains rather than of the segmentation model: with no discontinuity across the line there is nothing for any model to find. More training data does not change it, and the seasonal contrast chart shows why.",
            },
            {
              verdict: "shipped",
              claim:
                "Verification runs before anything is computed inside the polygon",
              evidence:
                "Area against the record and interior-pixel budget against the size floor, both as gates rather than as reported diagnostics, with a confidence tier attached to what passes.",
            },
            {
              verdict: "not-built",
              claim:
                "Automatic resolution of a polygon-versus-record disagreement",
              evidence:
                "By design, and it is the most important omission here. At that point in the pipeline there is no information with which to decide which figure is right, so the disagreement is surfaced and carried rather than silently moved.",
            },
            {
              verdict: "deferred",
              claim: "Reliable footprints for sub-0.2 ha holdings",
              evidence:
                "Blocked on resolution rather than on effort. It becomes tractable with finer imagery, or by aggregating parcels a grower actually farms as one unit — not by improving the segmenter.",
            },
          ],
          note:
            "Distributions labelled representative describe the shape of the output on a set like this one, not a measured benchmark. Where a figure is measured it is stated as measured, and where it is geometry the derivation is on the page.",
        },
        {
          kind: "boundary",
          title: "What an extracted boundary is not",
          intro:
            "Each of these has been mistaken for something the system provides, and each mistake has a cost attached.",
          items: [
            {
              not: "A cadastral or legal boundary",
              why: "It is a measured management unit — the ground that is farmed as one field. Ownership, tenancy and legal extent are records, not reflectance, and where the two disagree the polygon is often describing the land more accurately while still being the wrong answer to a legal question.",
            },
            {
              not: "Independent of the imagery date",
              why: "Edge contrast exists for part of the season and is largely absent at sowing and immediately after harvest. A boundary set extracted from bare-soil imagery is not a worse version of a mid-season one; it is substantially missing the internal structure of the landscape.",
            },
            {
              not: "A substitute for a field visit where the imagery is ambiguous",
              why: "Merges and record disagreements are surfaced precisely because a person with a phone settles them in a minute and a pipeline cannot settle them at all. The system's job is to reduce those cases to the few that genuinely need someone, not to eliminate them.",
            },
            {
              not: "Meaningful below the interior-pixel floor",
              why: "Below roughly 0.3 ha at 10 m the majority of a parcel's pixels are mixtures of it and its neighbours, so every statistic computed inside is substantially about other people's land. The output there is a refusal, and no error bar makes it otherwise.",
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
