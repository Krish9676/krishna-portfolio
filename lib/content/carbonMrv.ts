// lib/content/carbonMrv.ts — Satellite-Based Carbon MRV Platform.
//
// A capability showcase: what satellite observation can and cannot establish
// about carbon in a landscape, in standard carbon-accounting terms. The page
// argues one thing throughout — a carbon claim is only worth what its stated
// uncertainty is worth — so the charts that matter most are the calibration
// panel, the evidence matrix and the deduction sequence.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

// ── One project area, described twice on one mask ───────────────────────
// Written as ASCII so the mask is visible in the source and the disturbance
// map is guaranteed to describe the same ground as the stratification.
// Stratification: 0 = cropland / low stock · 3 = closed canopy.
const strata = [
  "..33322.....",
  ".33332221...",
  "3332222111..",
  "33222111110.",
  "222211110000",
  "22111100000.",
  ".111100000..",
  "..1100000...",
  "...0000.....",
];

// Disturbance over the same mask: 0 = none · 1 = harvest / thinning ·
// 2 = clearing · 3 = fire.
const disturbance = [
  "..00000.....",
  ".33000000...",
  "3330000000..",
  "33000002200.",
  "000000022000",
  "00000000000.",
  ".000000000..",
  "..0000000...",
  "...0000.....",
];

export const carbonMrv: ProjectDetail = {
  slug: "carbon-mrv-platform",
  pageTitle: "Satellite-Based Carbon MRV Platform",
  hideMeta: true,
  lede:
    "Measurement, reporting and verification for carbon projects, built from satellite observation — project area mapping, biomass and soil carbon estimation across all five pools, stock-change monitoring, conservative uncertainty, explainable attribution, and a document a verifier can audit.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading: "Proving carbon is what keeps small projects out of the market",
      blocks: [
        {
          kind: "prose",
          body: [
            "A carbon project earns credits by removing carbon from the atmosphere and storing it — in trees, in crop residues, in roots, in soil organic matter. The removal is the easy part to believe and the hard part to prove. Measurement, reporting and verification is the machinery that turns a plausible claim into a tradeable credit, and it is expensive enough that smaller developers are effectively priced out. So good projects either never happen, or they happen without accounting anyone trusts. Both outcomes damage the market: the first shrinks supply, the second erodes confidence in the supply that exists.",
            "Satellites change the economics because the two things carbon accounting needs most — coverage and repeat measurement — are exactly what orbital observation is good at. Above-ground biomass leaves a direct signature: canopy density, height structure and seasonal behaviour all relate to how much carbon is standing in a landscape. Bare-soil windows reveal soil colour and moisture properties that relate to organic carbon. Disturbance — fire, clearing, harvest — shows immediately. And because the archive stretches back over a decade, a baseline can be built for land the project never physically visited before it began.",
            "What satellites cannot do is weigh a tree. Every remotely sensed carbon estimate is a relationship calibrated against field measurement somewhere, and pretending otherwise is how carbon accounting loses credibility. So this platform is built around that honesty: it measures what can be measured from orbit, states the uncertainty in that measurement explicitly, and deducts conservatively so a poorly constrained estimate earns fewer credits than a well constrained one.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "From observation to a creditable claim",
            layers: [
              {
                name: "What the satellites see",
                role: "Repeat observation over the project area",
                color: palette.cyan,
                items: [
                  "canopy density & structure",
                  "seasonal vegetation behaviour",
                  "bare-soil reflectance",
                  "moisture & disturbance signals",
                ],
              },
              {
                name: "What that becomes",
                role: "Carbon stock, pool by pool",
                color: palette.violet,
                items: [
                  "above-ground biomass",
                  "below-ground biomass",
                  "soil organic carbon",
                  "deadwood",
                  "litter",
                ],
              },
              {
                name: "What makes it creditable",
                role: "The accounting that a verifier checks",
                color: palette.amber,
                items: [
                  "baseline & additionality",
                  "stock change over time",
                  "leakage",
                  "uncertainty deduction",
                  "attribution per estimate",
                ],
              },
              {
                name: "What the developer gets",
                role: "An auditable record",
                color: palette.green,
                items: [
                  "quarterly & annual reports",
                  "per-pool stock tables",
                  "explained estimates",
                  "provenance for every figure",
                ],
              },
            ],
            caption:
              "The third row is where most satellite carbon tooling stops short. Measuring biomass is the interesting technical problem; baseline construction, leakage and uncertainty deduction are what decide whether the resulting number can actually be sold.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "The monitoring cycle, and what each step exists to defend",
            stages: [
              {
                n: "01",
                name: "Map the area and stratify it",
                produces:
                  "A boundary verified against what is observably there — roads, settlements and water bodies excluded rather than credited — divided into strata that are internally similar in carbon density.",
                kind: "config",
              },
              {
                n: "02",
                name: "Build the baseline from the archive",
                produces:
                  "A counterfactual for land nobody surveyed before the project existed: a decade of observation over the same ground, measured the same way as the present. Without this the project is claiming credit for carbon that was already there.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Measure the current stock, pool by pool",
                produces:
                  "All five pools, each by its own method and each with its own confidence interval — because the intervals differ by a factor of two across the pools and a single blended figure hides that.",
                kind: "ingest",
              },
              {
                n: "04",
                name: "Detect disturbance",
                produces:
                  "Fire, clearing and harvest, found within a revisit cycle. A monitoring period containing an undetected disturbance overstates the stock at the exact moment the report is being signed.",
                kind: "repair",
              },
              {
                n: "05",
                name: "Apply the deductions, in order",
                produces:
                  "Baseline, then leakage, then a conservative buffer scaled to the measured interval. The order is fixed by the methodology, and it changes the answer — a percentage buffer applied before baseline subtraction is a different and larger number.",
                kind: "model",
              },
              {
                n: "06",
                name: "Generate the report a verifier reads",
                produces:
                  "Per-stratum, per-pool stock tables, the deduction sequence laid out so the creditable figure can be recomputed from the page, and provenance on every number so the run is reproducible years later.",
                kind: "publish",
              },
            ],
            note:
              "Step four is the one that separates a monitoring platform from a measurement exercise. Everything else establishes what is there; disturbance detection is the only step that can invalidate a claim already made.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── mapping
    {
      id: "mapping",
      nav: "Project area",
      heading: "Project area mapping and land-cover stratification",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Carbon is not distributed evenly across a project. A hectare of closed-canopy woodland, a hectare of degraded scrub and a hectare of cropland hold very different stocks and accumulate at very different rates, so averaging across a whole project boundary produces a number that describes nowhere in particular. Verification methodologies require the area to be divided into strata that are internally similar, and each stratum accounted separately.",
            "Satellite imagery does this stratification directly, and it does it for the whole project at once rather than from sample plots. Canopy density, seasonal behaviour and structural signals separate woodland from scrub from cropland from bare ground; multi-year archives distinguish land that has been stable from land that has recently changed. The project boundary itself is verified against what is observably there — a boundary that includes a road, a settlement or a water body needs those areas excluded rather than credited.",
            "The same mapping supplies the leakage assessment. If a project protects one area and the activity it displaced simply moved next door, the carbon benefit is smaller than the project boundary suggests. Observing the surrounding landscape over the same period is the only practical way to check that at scale.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "parcelMap",
            title: "Registered boundary against creditable area",
            subtitle:
              "The first thing a verifier checks, and the cheapest place to lose a verification",
            banner:
              "Registered project boundary 412 ha · creditable area 361 ha · 51 ha excluded as road, settlement and water body",
            labels: {
              declared: "boundary as registered",
              measured: "creditable area after exclusions",
            },
            declared: [
              [8, 9],
              [93, 7],
              [95, 89],
              [9, 92],
            ],
            measured: [
              [12, 14],
              [57, 12],
              [59, 43],
              [88, 45],
              [90, 86],
              [14, 88],
            ],
            caption:
              "Twelve per cent of the registered area holds no creditable carbon, and a project that credited it would not merely be over-claiming — it would be over-claiming in the single most checkable way available, because a road and a reservoir are visible to anyone who opens the same imagery. The exclusion has to be stated with its reason, because an unexplained difference between a registered boundary and an accounted area reads as an error rather than as diligence.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Project area, stratified by carbon density",
            subtitle:
              "Each cell a mapping unit; strata accounted separately rather than averaged",
            rows: 9,
            cols: 12,
            values: parseGrid(strata).flat(),
            stops: [
              {
                at: 0,
                color: "rgba(157,174,164,0.45)",
                label: "cropland / low stock",
              },
              { at: 1, color: palette.cyan, label: "degraded scrub" },
              { at: 2, color: palette.greenDim, label: "open woodland" },
              { at: 3, color: palette.green, label: "closed canopy" },
            ],
            caption:
              "Representative of the output. The stratification is not cosmetic — a project reporting one blended figure across ground this varied would be describing an average that exists nowhere inside its own boundary, and a verifier would reject it. The disturbance map further down this page is drawn on the same mask, so the two can be read together.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Why the blended figure describes nowhere",
            subtitle: "Carbon density by stratum, against the area-weighted mean",
            representative: true,
            max: 130,
            unit: " tC/ha",
            referenceLabel:
              "56 tC/ha — the single blended figure a non-stratified project would report",
            data: [
              {
                label: "Closed canopy",
                value: 118,
                valueLabel: "118 tC/ha",
                color: palette.green,
                note: "61 ha · 17% of the creditable area · the blended figure is 2.1x too low here",
                reference: 56,
              },
              {
                label: "Open woodland",
                value: 74,
                valueLabel: "74 tC/ha",
                color: palette.greenDim,
                note: "88 ha · 24%",
                reference: 56,
              },
              {
                label: "Degraded scrub",
                value: 41,
                valueLabel: "41 tC/ha",
                color: palette.cyan,
                note: "104 ha · 29%",
                reference: 56,
              },
              {
                label: "Cropland / low stock",
                value: 22,
                valueLabel: "22 tC/ha",
                color: palette.muted,
                note: "108 ha · 30% · the blended figure is 2.5x too high here",
                reference: 56,
              },
            ],
            caption:
              "The dashed marker is the area-weighted mean across all four strata, and it is wrong about every one of them — too low by a factor of two on the stratum that holds most of the carbon, too high by a factor of two and a half on the stratum that covers most of the ground. This is also why stratification changes the accumulation rate and not only the stock: the four strata accumulate at different rates, so a blended baseline mis-attributes growth as well as stock.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── pools
    {
      id: "pools",
      nav: "All five pools",
      heading: "Biomass, soil carbon, and the pools most tools skip",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "Carbon accounting recognises five distinct pools, and they are not optional extras. Above-ground biomass is the trunks, branches and leaves. Below-ground biomass is the root system, which for most vegetation types is a well-characterised fraction of what is above it. Soil organic carbon is the carbon held in the soil itself — usually the largest stock in an agricultural or agroforestry landscape, and the slowest to change. Deadwood and litter are the standing dead material and the layer of fallen organic matter on the surface.",
            "Most satellite carbon tooling reports above-ground biomass and stops there, because that is the pool a vegetation index sees most directly. That is a convenient omission rather than a conservative one: leaving out soil carbon makes a project look smaller than it is while making the remaining estimate easier to defend. It also makes the accounting non-compliant, because the methodologies require the pools to be addressed or explicitly justified as excluded.",
            "Estimation works differently for each. Above-ground biomass comes from canopy structure and density signals combined with allometric relationships — the published equations relating measurable tree dimensions to biomass for a given vegetation type. Below-ground follows from above-ground through root-to-shoot ratios. Soil organic carbon draws on bare-soil reflectance, terrain and climate context, and is the hardest of the five to constrain from orbit. Deadwood and litter are estimated as pool fractions appropriate to the vegetation type and its disturbance history.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "stacked",
            title: "All five pools, tracked across the monitoring period",
            subtitle: "Carbon stock by pool — the completeness is the point",
            representative: true,
            unit: " tC/ha",
            categories: ["Baseline", "Year 1", "Year 2", "Year 3"],
            keys: [
              { key: "agb", label: "Above-ground biomass", color: palette.green },
              { key: "bgb", label: "Below-ground biomass", color: palette.cyanDim },
              { key: "soc", label: "Soil organic carbon", color: palette.amber },
              { key: "dw", label: "Deadwood", color: palette.violet },
              { key: "li", label: "Litter", color: palette.muted },
            ],
            data: [
              [18, 4.5, 41, 1.2, 0.9],
              [23, 5.8, 43, 1.4, 1.1],
              [29, 7.3, 45.5, 1.6, 1.2],
              [36, 9.0, 48, 1.9, 1.4],
            ],
            caption:
              "Soil organic carbon is the largest stock here and the slowest to move — which is exactly why omitting it distorts a project's profile. Above-ground biomass doubles across three years while soil carbon rises by around 17%, and a report showing only the first would misrepresent both the scale and the permanence of what the project achieved.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Stock change is the credited quantity, not stock itself",
            subtitle: "Annual accumulation rate, by pool",
            representative: true,
            yLabel: "tC/ha added per year",
            xLabel: "monitoring year",
            height: 280,
            yDomain: [0, 8],
            xTicks: [
              { x: 0, label: "Y1" },
              { x: 1, label: "Y2" },
              { x: 2, label: "Y3" },
            ],
            series: [
              {
                name: "above-ground biomass",
                color: palette.green,
                points: seq([5.0, 6.0, 7.0]),
              },
              {
                name: "soil organic carbon",
                color: palette.amber,
                points: seq([2.0, 2.5, 2.5]),
              },
              {
                name: "below-ground biomass",
                color: palette.cyan,
                points: seq([1.3, 1.5, 1.7]),
              },
              {
                name: "deadwood & litter",
                color: palette.violet,
                points: seq([0.4, 0.3, 0.5]),
              },
            ],
            caption:
              "A project is credited for what it changed, not for what was already there — which is why baseline construction matters as much as measurement. Woody biomass accelerates as the canopy establishes; soil carbon accumulates slowly and steadily, and is the component most likely to persist.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The five pools are not equally knowable",
            subtitle:
              "Relative width of the confidence interval on each pool's estimate",
            representative: true,
            max: 50,
            unit: "%",
            data: [
              {
                label: "Above-ground biomass",
                value: 18,
                valueLabel: "±18%",
                color: palette.green,
                note: "canopy density and structure are directly observed, and the allometry is published — the best-constrained pool",
              },
              {
                label: "Below-ground biomass",
                value: 26,
                valueLabel: "±26%",
                color: palette.cyanDim,
                note: "follows above-ground through a root-to-shoot ratio, so it inherits that interval and adds the ratio's own",
              },
              {
                label: "Soil organic carbon",
                value: 34,
                valueLabel: "±34%",
                color: palette.amber,
                note: "the largest stock and the least constrained: inferred from bare-soil windows plus terrain and climate context, never observed directly",
              },
              {
                label: "Deadwood",
                value: 38,
                valueLabel: "±38%",
                color: palette.violet,
                note: "estimated as a pool fraction from vegetation type and disturbance history",
              },
              {
                label: "Litter",
                value: 42,
                valueLabel: "±42%",
                color: palette.muted,
                note: "the widest interval and the smallest consequence — a large relative error on a 1.4 tC/ha pool costs almost nothing",
              },
            ],
            caption:
              "Representative of the relative ordering rather than measured intervals. Read this chart against the stacked bars above, because the pairing is where the design decision sits: litter has the widest interval and barely matters, while soil carbon has neither the widest interval nor the narrowest and dominates the uncertainty deduction outright, because it is roughly half the total stock. Uncertainty in carbon accounting is always interval multiplied by stock, and reporting either one alone leads to the wrong priority.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── uncertainty
    {
      id: "uncertainty",
      nav: "Uncertainty",
      heading:
        "Conservative uncertainty — the part that decides whether a report survives audit",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "Every carbon estimate has an error bar, and carbon accounting handles that asymmetrically on purpose. A project cannot be credited for the optimistic end of its uncertainty range, because the market would then reward imprecision — the fuzzier the measurement, the larger the claimable number. Instead the methodologies require a conservative deduction that grows as the confidence interval widens.",
            "That single rule does more for the integrity of a carbon claim than any modelling improvement. It means a project with sparse ground calibration and a wide interval earns measurably fewer credits than an identical project with good calibration, which aligns the developer's incentive with better measurement rather than with better presentation. It also means an honest platform must compute and publish its uncertainty rather than quietly reporting a central estimate.",
            "Alongside uncertainty sit the two other deductions the accounting requires. Baseline subtraction removes what would have happened anyway — the counterfactual, without which a project is claiming credit for pre-existing carbon. Leakage subtraction removes benefit that was displaced rather than created, where the activity a project prevented simply moved outside the boundary.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "funnel",
            title: "From gross stock change to creditable removals",
            subtitle: "Deductions applied in the order the accounting requires",
            representative: true,
            unit: "%",
            keepLabel: "still claimable",
            dropLabel: "deducted",
            stages: [
              {
                label: "Gross stock change",
                value: 100,
                color: palette.green,
                note: "all five pools, over the period",
              },
              {
                label: "After baseline",
                value: 76,
                color: palette.cyan,
                note: "additionality established",
                dropReason:
                  "what would have happened anyway. Without a counterfactual the project is claiming credit for carbon that was already accumulating, which is the objection every serious buyer raises first.",
              },
              {
                label: "After leakage",
                value: 71,
                color: palette.cyanDim,
                note: "displacement accounted",
                dropReason:
                  "activity displaced outside the boundary rather than prevented — observed in the surrounding landscape over the same period, which is the only way to check it at scale.",
              },
              {
                label: "Creditable removals",
                value: 62,
                color: palette.green,
                note: "what the report may claim",
                dropReason:
                  "the conservative buffer, scaled to the measured confidence interval. This is the deduction that makes the remaining credits worth buying: a wider interval earns fewer of them, so the incentive points at better measurement rather than better presentation.",
              },
            ],
            note:
              "The order is not cosmetic. A buffer expressed as a percentage and applied to the gross figure rather than to the post-leakage figure produces a larger claim from identical measurements, which is why the methodology fixes the sequence rather than the arithmetic.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "scatter",
            title: "Satellite estimate against field measurement",
            subtitle:
              "Above-ground biomass on calibration plots — and the limit this panel exposes",
            representative: true,
            xLabel: "biomass measured in the plot (tC/ha)",
            yLabel: "biomass estimated from satellite (tC/ha)",
            domain: [0, 170],
            tolerance: 0.2,
            toleranceLabel: "within 20% of the plot measurement",
            height: 400,
            stats: [
              { label: "pool", value: "above-ground only" },
              { label: "tolerance drawn", value: "20%" },
            ],
            series: [
              {
                name: "cropland / low stock",
                color: palette.muted,
                points: [
                  { x: 14, y: 19 },
                  { x: 19, y: 16 },
                  { x: 24, y: 27 },
                  { x: 28, y: 24 },
                ],
              },
              {
                name: "degraded scrub",
                color: palette.cyan,
                points: [
                  { x: 32, y: 36 },
                  { x: 38, y: 34 },
                  { x: 44, y: 48 },
                  { x: 49, y: 45 },
                ],
              },
              {
                name: "open woodland",
                color: palette.greenDim,
                points: [
                  { x: 62, y: 66 },
                  { x: 71, y: 67 },
                  { x: 78, y: 82 },
                  { x: 85, y: 79 },
                ],
              },
              {
                name: "closed canopy",
                color: palette.green,
                points: [
                  { x: 105, y: 96 },
                  { x: 118, y: 101 },
                  { x: 132, y: 108 },
                  { x: 148, y: 112 },
                  { x: 158, y: 115 },
                ],
              },
            ],
            caption:
              "Read the closed-canopy points: they fall progressively further below the 1:1 line as the real stock rises, and by 150 tC/ha the estimate is outside the tolerance band. That is index saturation, and it is the single most important limitation of optical biomass estimation — a canopy that has already closed stops getting measurably denser, so the signal flattens while the carbon keeps accumulating. Crucially it is a bias rather than noise: it does not average out across plots, and fitting it away on this sample would produce a model that over-estimates the next project's dense strata. It is handled by widening the interval on high-biomass strata, which costs the project credits, which is the correct direction for the cost to run.",
            note:
              "This panel is also the answer to the question this platform gets asked most often. Every point on it exists because someone measured trees in a plot — which is why field calibration is reduced by satellite observation and never removed by it.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── attribution
    {
      id: "attribution",
      nav: "Attribution",
      heading: "Explainable attribution — why this estimate, and what moved it",
      kicker: "Solution 04",
      blocks: [
        {
          kind: "prose",
          body: [
            "A carbon estimate that cannot be interrogated is a liability. A verifier reviewing a project will ask why a particular stratum was credited at a particular level, and a developer watching a number change between monitoring periods needs to know whether the forest grew or whether a moisture signal shifted. Both questions require the estimate to carry its reasoning.",
            "So every estimate publishes the contribution of each input that produced it. That serves two purposes at once. For the verifier it is an audit trail: the estimate is not a black-box output but a decomposition into observable quantities with published relationships behind each. For the developer it is a diagnostic: an estimate driven mostly by canopy density is measuring the thing the project is actually doing, while one driven mostly by seasonal moisture is measuring the weather and should be treated with suspicion.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "What drove a biomass estimate",
            subtitle: "Contribution of each input to the predicted above-ground stock",
            representative: true,
            max: 40,
            data: [
              {
                label: "Canopy density integral",
                value: 34,
                valueLabel: "+34%",
                color: palette.green,
                note: "the intended signal — sustained canopy cover over the season",
              },
              {
                label: "Wet-season moisture",
                value: 21,
                valueLabel: "+21%",
                color: palette.cyan,
                note: "genuine growth driver, but also a confound worth watching between periods",
              },
              {
                label: "Disturbance / burn signal",
                value: 16,
                valueLabel: "−16%",
                color: palette.red,
                note: "reduces the estimate — recent disturbance detected in part of the stratum",
              },
              {
                label: "Soil-adjusted greenness",
                value: 14,
                valueLabel: "+14%",
                color: palette.cyanDim,
                note: "separates canopy signal from background where cover is incomplete",
              },
              {
                label: "Terrain & climate context",
                value: 9,
                valueLabel: "+9%",
                color: palette.violet,
                note: "site productivity priors",
              },
              {
                label: "Unexplained residual",
                value: 6,
                valueLabel: "6%",
                color: palette.muted,
                note: "published rather than absorbed into the estimate",
              },
            ],
            caption:
              "The residual is reported rather than hidden. An attribution that sums neatly to a hundred per cent is usually one where the leftover has been quietly redistributed into the named factors.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "matrix",
            title: "What each pool's estimate actually rests on",
            subtitle:
              "The evidence behind every figure in the report, pool by pool",
            representative: true,
            rowLabels: [
              "Above-ground biomass",
              "Below-ground biomass",
              "Soil organic carbon",
              "Deadwood",
              "Litter",
            ],
            colLabels: [
              "Canopy density",
              "Canopy structure",
              "Bare-soil reflectance",
              "Terrain & climate",
              "Disturbance history",
              "Published allometry",
              "Root-to-shoot ratio",
              "Field calibration",
            ],
            levels: [
              { at: 0, color: "rgba(30,42,36,0.45)", label: "not used" },
              { at: 1, color: "rgba(56,182,217,0.45)", label: "contributing" },
              { at: 2, color: palette.green, label: "primary evidence" },
            ],
            values: [
              [2, 2, 0, 1, 1, 2, 0, 2],
              [1, 1, 0, 1, 0, 1, 2, 1],
              [0, 0, 2, 2, 1, 0, 0, 2],
              [0, 1, 0, 0, 2, 0, 0, 1],
              [0, 1, 0, 1, 2, 0, 0, 1],
            ],
            caption:
              "Two columns are worth reading on their own. Field calibration is primary or contributing evidence for all five pools, which is the boundary statement at the bottom of this page rendered as a fact about the arithmetic rather than as a caveat. And the soil organic carbon row contains no direct observation of the pool at all — only surface properties that correlate with it — which is why its interval is what it is and why more frequent imagery does not narrow it.",
            note:
              "A verifier reads this matrix before the numbers. An estimate whose primary evidence is a proxy needs a different level of scrutiny from one whose primary evidence is a direct structural measurement, and collapsing both into a single confidence figure removes the reader's ability to tell them apart.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── disturbance
    {
      id: "disturbance",
      nav: "Disturbance & reversal",
      heading: "Detecting the thing that can invalidate a claim already made",
      kicker: "Solution 05",
      blocks: [
        {
          kind: "prose",
          body: [
            "Every other measurement on this page establishes what is present. Disturbance detection is the only one that can take something back, and it is the capability satellites are best at by a wide margin: fire, clearing and harvest all change reflectance dramatically and immediately, so they are detectable within a revisit cycle rather than at the next site visit.",
            "The accounting consequence is sharper than the measurement. Carbon already credited against a stock that has since burned is a reversal, and the credits are exposed. This is what a buffer pool exists for, and it is why detection latency is a commercial parameter rather than a technical detail — a disturbance found within a fortnight and reported is a managed reversal, while the same disturbance found at the next annual monitoring point has spent a year inside a number people traded on.",
            "The rule that follows is the one developers find least comfortable and buyers find most reassuring: recovery after a reversal restarts from the reduced stock. A project does not get to re-credit the same carbon on the way back up, because the credits issued the first time were not returned.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "A reversal, and what the accounting does about it",
            subtitle:
              "Above-ground stock through a fire in year four, against the baseline",
            representative: true,
            yLabel: "above-ground stock (tC/ha)",
            xLabel: "monitoring year",
            height: 300,
            yDomain: [0, 45],
            xTicks: [0, 1, 2, 3, 4, 5, 6, 7].map((x) => ({
              x,
              label: `Y${x + 1}`,
            })),
            events: [
              { x: 4, label: "fire detected", color: palette.red },
              { x: 5, label: "buffer drawn", color: palette.amber },
            ],
            series: [
              {
                name: "project stock",
                color: palette.green,
                points: seq([18, 23, 29, 36, 11, 15, 21, 28]),
              },
              {
                name: "baseline — what would have happened anyway",
                color: palette.muted,
                dash: "6 4",
                points: seq([18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5]),
              },
            ],
            caption:
              "Three things are visible here that a stock figure alone does not carry. The project was genuinely additional through year four — the gap against the dashed baseline is what it earned. The fire removes not only the current stock but the standing of the credits already issued against years one to three, which is the exposure a buffer pool covers. And the recovery from year five is credited against the reduced stock rather than against the pre-fire peak, so the carbon between 11 and 36 tC/ha is never credited twice. In year seven the project is back above its baseline and below where it was three years earlier, which is the honest description of its position.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Where the disturbance was, on the same project area",
            subtitle:
              "Detected within a revisit cycle, and localised to the mapping unit",
            rows: 9,
            cols: 12,
            values: parseGrid(disturbance).flat(),
            stops: [
              {
                at: 0,
                color: "rgba(74,222,128,0.2)",
                label: "no disturbance detected",
              },
              { at: 1, color: palette.cyan, label: "harvest / thinning" },
              { at: 2, color: palette.amber, label: "clearing" },
              { at: 3, color: palette.red, label: "fire" },
            ],
            caption:
              "Drawn on the same mask as the stratification map, which is what makes it accountable rather than merely alarming. The burn sits in the north-west corner — precisely the closed-canopy stratum carrying 118 tC/ha — so the stock loss is computed against that stratum's density rather than against the project average, and the clearing in the middle falls in a low-stock stratum where the same area costs a fraction as much carbon. A disturbance figure quoted in hectares without the stratum it landed in is close to meaningless.",
          },
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Detection latency is a commercial parameter",
          body:
            "The measurement question — can a fire be seen from orbit — has been settled for decades. The question that decides whether a project's credits are trusted is how long the gap is between the disturbance and the report, because everything traded in that window was priced on a stock that no longer existed. That makes revisit frequency and an all-weather signal that works under cloud into terms of the commercial offer rather than into specifications.",
        },
      ],
    },

    // ─────────────────────────────────────────────── reporting
    {
      id: "reporting",
      nav: "Reporting",
      heading: "Audit-ready reporting against recognised methodologies",
      kicker: "Solution 06",
      blocks: [
        {
          kind: "prose",
          body: [
            "A carbon project's output is not a dashboard. It is a document that a third-party verifier reads, checks and signs — and that someone may revisit years later to defend. So the reporting is generated directly rather than exported from a screen: pagination, figure resolution, per-pool stock tables and the provenance of every number are controlled, and each report states the methodology version and the parameters it was produced under.",
            "Compliance is not a badge here; it is the structure of the arithmetic. Pool definitions, stock-change accounting and the treatment of uncertainty follow the established carbon accounting methodology. Agricultural land management and afforestation each have their own recognised methodology with different baseline rules, monitoring cadences and pool requirements, and the reports follow whichever applies. Biomass estimation uses the published allometric relationships for the vegetation type rather than a fitted curve of the platform's own.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "cadence",
            title: "What a year of observation actually offers each pool",
            subtitle:
              "Usable acquisition windows over one annual monitoring period",
            days: 365,
            sources: [
              {
                label: "Optical, canopy",
                note: "the biomass signal",
                color: palette.green,
                hits: [5, 15, 25, 35, 45, 290, 300, 310, 320, 330, 340, 350, 360],
                blocked: [
                  60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
                  255, 270,
                ],
              },
              {
                label: "Bare-soil window",
                note: "the only look at soil",
                color: palette.amber,
                hits: [40, 50, 335, 345, 355],
              },
              {
                label: "All-weather",
                note: "structure through cloud",
                color: palette.violet,
                hits: Array.from({ length: 15 }, (_, i) => i * 24 + 6),
              },
              {
                label: "Disturbance check",
                note: "fire & clearing",
                color: palette.red,
                hits: Array.from({ length: 30 }, (_, i) => i * 12 + 4),
              },
            ],
            caption:
              "This strip is the physical reason the pool intervals differ, and it is worth reading against the confidence-interval chart above. Above-ground biomass gets an all-weather look roughly every three weeks all year, so it is well constrained. Soil organic carbon can only be observed when soil is actually exposed, which happens in two short windows and yields five usable looks in twelve months — and no improvement in modelling or resolution increases that number, because it is set by the cropping calendar rather than by the sensor. Disturbance is checked most often of all, because it is the only signal whose value collapses if it arrives late.",
          },
        },
        {
          kind: "table",
          title: "Recognised methodologies implemented",
          keyColumn: true,
          head: ["Standard", "What it governs", "Where it lands"],
          rows: [
            [
              "IPCC carbon accounting methodology",
              "Pool definitions, stock-change accounting, uncertainty treatment",
              "The multi-pool calculator and the deduction sequence",
            ],
            [
              "Verra VM0042",
              "Improved agricultural land management",
              "Baseline construction, soil carbon treatment, monitoring cadence",
            ],
            [
              "Verra VM0047",
              "Afforestation, reforestation and revegetation",
              "Biomass growth accounting, allometric application, deadwood and litter",
            ],
            [
              "Published allometric relationships",
              "Tree biomass from measurable structural predictors",
              "Above-ground biomass estimation for woody vegetation",
            ],
          ],
        },
        {
          kind: "cards",
          columns: 2,
          title: "What a monitoring report contains",
          items: [
            {
              title: "Per-stratum, per-pool stock tables",
              body:
                "Carbon stock and stock change for every pool in every mapping unit, at the baseline and at each monitoring point — the tables a verifier actually recalculates.",
              tone: "green",
            },
            {
              title: "The deduction sequence, shown",
              body:
                "Gross change, baseline, leakage and uncertainty buffer set out in order, so the creditable figure can be reproduced from the numbers on the page.",
              tone: "cyan",
            },
            {
              title: "Attribution per estimate",
              body:
                "Which inputs drove each biomass estimate, and what the unexplained residual was.",
              tone: "cyan",
            },
            {
              title: "Disturbance log with stratum",
              body:
                "Every detected event, its date, its area and the stratum it landed in — because a hectare burned in closed canopy and a hectare cleared in cropland are not the same loss.",
              tone: "amber",
            },
            {
              title: "Provenance for every figure",
              body:
                "Observation dates, methodology version, parameter set and the mapping units each number came from — so a report remains reproducible long after the run that produced it.",
              tone: "amber",
            },
            {
              title: "Plain-language interpretation",
              body:
                "A written summary of what the period's numbers mean, generated strictly from the computed accounting. No figure in the narrative originates from the text generation.",
              tone: "green",
            },
            {
              title: "Stated exclusions",
              body:
                "Any pool or area excluded, with the reason recorded. An unexplained omission is the fastest route to a rejected verification.",
              tone: "neutral",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── impact
    {
      id: "impact",
      nav: "Scope & impact",
      heading: "What it delivers — and where satellites stop",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "5 / 5",
              label: "Carbon pools accounted",
              detail: "Not only the one a vegetation index sees most easily",
              tone: "green",
            },
            {
              metric: "3",
              label: "Recognised methodologies",
              detail:
                "Carbon accounting methodology plus two project-type methodologies",
              tone: "green",
            },
            {
              metric: "Whole-project",
              label: "Coverage, not sample plots",
              detail:
                "Every mapping unit measured each monitoring period, not extrapolated from a sample",
              tone: "cyan",
            },
            {
              metric: "Decade",
              label: "Of retrospective baseline",
              detail:
                "A counterfactual built from archive imagery for land never previously surveyed",
              tone: "cyan",
            },
            {
              metric: "Conservative",
              label: "By construction",
              detail: "A wider confidence interval earns fewer credits, not more",
              tone: "amber",
            },
            {
              metric: "Reproducible",
              label: "Reports",
              detail: "Provenance and methodology version on every figure, years later",
              tone: "green",
            },
          ],
        },
        {
          kind: "status",
          title: "What is established here, and what the panels are arguing",
          intro:
            "This page quotes no accuracy figure, and that is deliberate: a carbon platform's claims are about the completeness and the order of its accounting, and about the honesty of its stated intervals. Every chart is representative, and each is making an argument about mechanism.",
          items: [
            {
              verdict: "shipped",
              claim: "All five pools accounted, not only above-ground biomass",
              evidence:
                "Reporting above-ground alone is often described as conservative. It is not — it is non-compliant, because the methodologies require each pool to be addressed or explicitly justified as excluded, and it distorts a project's permanence profile by omitting its largest and slowest-moving stock.",
            },
            {
              verdict: "shipped",
              claim:
                "Deductions applied in the sequence the methodology fixes",
              evidence:
                "Baseline, then leakage, then a buffer scaled to the measured interval. The sequence changes the answer: a percentage buffer applied to the gross figure rather than the post-leakage figure yields a larger claim from identical measurements.",
            },
            {
              verdict: "defensible",
              claim:
                "Optical biomass estimation saturates over dense canopy, and it is a bias",
              evidence:
                "Visible as the systematic bend below the 1:1 line in the calibration panel. Because it is a bias rather than noise it does not average out over plots, so it is handled by widening the interval on high-biomass strata — which costs the project credits — rather than by fitting it away on the available sample.",
            },
            {
              verdict: "defensible",
              claim: "Soil organic carbon is the pool that dominates uncertainty",
              evidence:
                "Not because its interval is the widest — deadwood and litter are wider — but because uncertainty is interval multiplied by stock and soil carbon is roughly half the total. The cadence strip shows the physical cause: five usable bare-soil looks in a year, set by the cropping calendar rather than by the sensor.",
            },
            {
              verdict: "not-built",
              claim: "A biomass estimate independent of field calibration",
              evidence:
                "Declined because it does not exist. The evidence matrix makes it explicit — field calibration is primary or contributing evidence for all five pools. This platform reduces how much field work a project needs and cannot remove the need for any.",
            },
            {
              verdict: "not-built",
              claim: "A verification decision",
              evidence:
                "The platform produces the evidence and the arithmetic a verifier checks. The judgement is an accredited third party's, and nothing here simulates or anticipates it.",
            },
            {
              verdict: "deferred",
              claim: "A permanence assessment",
              evidence:
                "Blocked on land tenure and management information rather than on measurement. Satellites detect reversal quickly and reliably, which is genuinely valuable and is a different claim from whether stored carbon persists for decades.",
            },
          ],
        },
        {
          kind: "boundary",
          title: "Where satellite observation stops",
          intro:
            "Stating this clearly is what makes the rest usable. A carbon credit is a claim someone must defend, and a platform that overstates what orbit can establish damages the projects it is meant to serve.",
          items: [
            {
              not: "A substitute for field calibration",
              why: "Every remotely sensed biomass estimate is a relationship calibrated against physical measurement somewhere. The platform reduces how much field work a project needs; it does not remove the need for any.",
            },
            {
              not: "A direct soil carbon measurement",
              why: "Soil organic carbon is inferred from surface properties observable during bare-soil windows, plus terrain and climate context. It is the least constrained of the five pools and carries the widest interval, which the deduction reflects.",
            },
            {
              not: "Reliable above dense canopy without widening the interval",
              why: "Optical biomass signals saturate once a canopy has closed, so the estimate flattens while the real stock keeps accumulating. It is a known, directional bias rather than random error, and the honest response is a wider interval on high-biomass strata rather than a correction fitted to one project's plots.",
            },
            {
              not: "A permanence guarantee",
              why: "Satellites detect disturbance quickly and reliably, which is genuinely valuable for monitoring reversal. Whether stored carbon persists for decades is a question about land tenure and management, not about measurement.",
            },
            {
              not: "A verification decision",
              why: "The platform produces the evidence and the arithmetic a verifier checks. The verification itself is an accredited third party's judgement, and nothing here simulates it.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "green",
          title: "The same discipline as the lending work, for the same reason",
          body:
            "A carbon credit and a credit file have this in common: both are claims that someone will later be asked to defend. In both cases a stated uncertainty is worth more than a confident point estimate, and a deduction that costs the project credits is what makes the remaining credits worth buying.",
        },
      ],
    },
  ],
};
