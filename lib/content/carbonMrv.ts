// lib/content/carbonMrv.ts — Satellite-Based Carbon MRV Platform.
//
// A capability showcase: what satellite observation can and cannot establish
// about carbon in a landscape, in standard carbon-accounting terms.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

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
            kind: "regionGrid",
            title: "Project area, stratified by carbon density",
            subtitle:
              "Each cell a mapping unit; strata accounted separately rather than averaged",
            rows: 9,
            cols: 12,
            values: [
              null, null, 3, 3, 3, 2, 2, null, null, null, null, null,
              null, 3, 3, 3, 3, 2, 2, 2, 1, null, null, null,
              3, 3, 3, 2, 2, 2, 2, 1, 1, 1, null, null,
              3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, null,
              2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0,
              2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, null,
              null, 1, 1, 1, 1, 0, 0, 0, 0, 0, null, null,
              null, null, 1, 1, 0, 0, 0, 0, 0, null, null, null,
              null, null, null, 0, 0, 0, 0, null, null, null, null, null,
            ],
            stops: [
              { at: 0, color: "rgba(157,174,164,0.45)", label: "cropland / low stock" },
              { at: 1, color: palette.cyan, label: "degraded scrub" },
              { at: 2, color: palette.greenDim, label: "open woodland" },
              { at: 3, color: palette.green, label: "closed canopy" },
            ],
            caption:
              "Representative of the output. The stratification is not cosmetic — a project reporting one blended figure across ground this varied would be describing an average that exists nowhere inside its own boundary, and a verifier would reject it.",
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
      ],
    },

    // ─────────────────────────────────────────────── uncertainty
    {
      id: "uncertainty",
      nav: "Uncertainty",
      heading: "Conservative uncertainty — the part that decides whether a report survives audit",
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
            kind: "bars",
            title: "From gross stock change to creditable removals",
            subtitle: "Deductions applied in the order the accounting requires",
            representative: true,
            max: 100,
            data: [
              {
                label: "Gross stock change",
                value: 100,
                valueLabel: "100%",
                color: palette.green,
                note: "measured across all five pools over the monitoring period",
              },
              {
                label: "− baseline",
                value: 76,
                valueLabel: "76%",
                color: palette.cyan,
                note: "what would have happened without the project — additionality against the counterfactual",
              },
              {
                label: "− leakage",
                value: 71,
                valueLabel: "71%",
                color: palette.cyanDim,
                note: "activity displaced outside the project boundary rather than prevented",
              },
              {
                label: "− uncertainty buffer",
                value: 62,
                valueLabel: "62%",
                color: palette.amber,
                note: "conservative deduction scaled to the measured confidence interval",
              },
              {
                label: "= creditable removals",
                value: 62,
                valueLabel: "62%",
                color: palette.green,
                note: "what the report is permitted to claim",
              },
            ],
            caption:
              "Nearly two-fifths of the measured stock change is deducted before anything is claimed. A platform that reported the gross figure would produce a larger and entirely unsellable number.",
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
      ],
    },

    // ─────────────────────────────────────────────── reporting
    {
      id: "reporting",
      nav: "Reporting",
      heading: "Audit-ready reporting against recognised methodologies",
      kicker: "Solution 05",
      blocks: [
        {
          kind: "prose",
          body: [
            "A carbon project's output is not a dashboard. It is a document that a third-party verifier reads, checks and signs — and that someone may revisit years later to defend. So the reporting is generated directly rather than exported from a screen: pagination, figure resolution, per-pool stock tables and the provenance of every number are controlled, and each report states the methodology version and the parameters it was produced under.",
            "Compliance is not a badge here; it is the structure of the arithmetic. Pool definitions, stock-change accounting and the treatment of uncertainty follow the established carbon accounting methodology. Agricultural land management and afforestation each have their own recognised methodology with different baseline rules, monitoring cadences and pool requirements, and the reports follow whichever applies. Biomass estimation uses the published allometric relationships for the vegetation type rather than a fitted curve of the platform's own.",
          ],
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
              detail: "Carbon accounting methodology plus two project-type methodologies",
              tone: "green",
            },
            {
              metric: "Whole-project",
              label: "Coverage, not sample plots",
              detail: "Every mapping unit measured each monitoring period, not extrapolated from a sample",
              tone: "cyan",
            },
            {
              metric: "Decade",
              label: "Of retrospective baseline",
              detail: "A counterfactual built from archive imagery for land never previously surveyed",
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
