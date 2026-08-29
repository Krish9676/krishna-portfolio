// lib/content/regionalIntelligence.ts — Regional Agricultural Intelligence
// Platform.
//
// A capability showcase at district scale, where the design problem is almost
// entirely about what a number is compared against and at what granularity it
// is allowed to be read. Every product here is a departure from the region's
// own history, and the interpretation unit is the pattern rather than the cell.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";
import { departureCurve } from "./curves";

// ── One district, described twice on one mask ───────────────────────────
// Both grids are generated from the same north-west to south-east gradient over
// the same cultivable-area mask, so the two maps can genuinely be read against
// each other: the south-east is both the late-sown corner and the one departing
// from its own normal, which is a coherent agronomic story rather than two
// unrelated pictures.
//
// Canopy departure: 0 = at or above normal · 3 = severe departure.
const canopyDeparture = [
  "..000001....",
  ".00000111...",
  "0000011112..",
  "00011111222.",
  "001111122222",
  "011111222223",
  ".11112222333",
  "..1222223333",
  "...22223333.",
  "....223333..",
];

// Sowing progress on the same mask: 3 = complete · 0 = not yet sown.
const sowingProgress = [
  "..333332....",
  ".33333222...",
  "3333322221..",
  "33322222111.",
  "332222211111",
  "322222111110",
  ".22221111000",
  "..2111110000",
  "...11110000.",
  "....110000..",
];

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

// The district's own multi-season normal for canopy condition, and the
// per-mapping-unit departures from it.
const districtNormal = [
  0.14, 0.2, 0.29, 0.4, 0.51, 0.6, 0.66, 0.69, 0.68, 0.63, 0.55, 0.46, 0.38,
  0.31, 0.26, 0.22, 0.19, 0.17, 0.15,
];

const unit = (opts: Parameters<typeof departureCurve>[1]) =>
  departureCurve(districtNormal, opts);

const weekTicks = [0, 3, 6, 9, 12, 15, 18].map((x) => ({
  x,
  label: `${x + 1}`,
}));

export const regionalIntelligence: ProjectDetail = {
  slug: "regional-agri-intelligence",
  pageTitle: "Regional Agricultural Intelligence Platform",
  hideMeta: true,
  lede:
    "Crop intelligence at the resolution policy decisions are actually made — crop health, drought concentration, sowing progress and land-use change across whole districts, always compared against prior seasons rather than against an absolute threshold.",
  sections: [
    // ─────────────────────────────────────────────── overview
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
            kind: "layers",
            title: "Four decisions that define the platform",
            subtitle:
              "Each row is a choice that could have gone the other way, and the third is the one that matters most",
            layers: [
              {
                name: "What is observed",
                role: "Coverage and consistency ahead of resolution",
                color: palette.cyan,
                items: [
                  "optical & all-weather imagery",
                  "multi-year archive",
                  "rainfall & temperature",
                  "accumulated water balance",
                ],
              },
              {
                name: "Over what unit",
                role: "Consistent mapping units, not field polygons",
                color: palette.violet,
                items: [
                  "same units every season",
                  "cultivable-area mask",
                  "no dependence on boundary extraction",
                  "no per-field refusals to absorb",
                ],
              },
              {
                name: "Compared against what",
                role: "The unit's own prior seasons, at the same point in the season",
                color: palette.green,
                items: [
                  "three-season normal",
                  "rainfall departure",
                  "sowing-date departure",
                  "never an absolute threshold",
                ],
              },
              {
                name: "Read at what granularity",
                role: "Pattern first — a single cell is not a place",
                color: palette.amber,
                items: [
                  "contiguous departure bands",
                  "advisories with a location",
                  "in-season, not post-season",
                  "scattered cells treated as artefact",
                ],
              },
            ],
            caption:
              "The second row is what keeps this platform independent of the field-level stack: using consistent mapping units rather than extracted field polygons means it does not inherit boundary errors, mixed-pixel refusals or the small-holding resolution floor. It also means it can say nothing about any individual farm, which is the trade being made rather than a shortcoming.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Crop stress concentration across a district",
            subtitle:
              "Aggregated from multi-temporal analysis, compared to the same point in prior seasons",
            rows: 10,
            cols: 12,
            values: parseGrid(canopyDeparture).flat(),
            stops: [
              { at: 0, color: palette.green, label: "at or above normal" },
              { at: 1, color: palette.cyan, label: "mild departure" },
              { at: 2, color: palette.amber, label: "moderate departure" },
              { at: 3, color: palette.red, label: "severe departure" },
            ],
            caption:
              "Representative of the output. At this scale the pattern carries the information, not any single cell — a contiguous band of moderate-to-severe departure running through one part of the district is an advisory with a location, whereas the same count of cells scattered at random is almost always a data-quality artefact. Here the departure deepens consistently toward the south-east, which is a finding; the sowing map further down is drawn on the same mask so the two can be read together.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── monitoring
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
            xTicks: weekTicks,
            events: [{ x: 11, label: "advisory issued", color: palette.amber }],
            series: [
              {
                name: "three-season normal",
                color: palette.muted,
                dash: "6 4",
                points: seq(districtNormal),
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
        {
          kind: "viz",
          spec: {
            kind: "sparkgrid",
            title: "The same season, by mapping unit",
            subtitle:
              "Twelve units on one shared scale, each against its own three-season normal",
            representative: true,
            columns: 4,
            yDomain: [0, 0.8],
            baseline: districtNormal,
            seriesLabel: "current season",
            baselineLabel: "that unit's own three-season normal",
            cells: [
              { label: "NW-01", values: unit({ gain: 1.03 }), flag: "at normal" },
              { label: "NW-02", values: unit({ gain: 1.0 }), flag: "at normal" },
              { label: "N-01", values: unit({ gain: 0.98 }), flag: "−2%" },
              { label: "NE-01", values: unit({ gain: 0.94 }), flag: "−6%" },
              { label: "W-01", values: unit({ gain: 0.96 }), flag: "−4%" },
              {
                label: "C-01",
                values: unit({ gain: 0.9, gaps: [8, 9] }),
                flag: "2 gaps",
              },
              { label: "C-02", values: unit({ gain: 0.87 }), flag: "−13%" },
              { label: "E-01", values: unit({ gain: 0.82 }), flag: "−18%" },
              {
                label: "SW-01",
                values: unit({ gain: 0.84 }),
                flag: "−16%",
              },
              {
                label: "S-01",
                values: unit({ gain: 0.79, lateBy: 2 }),
                flag: "late + low",
                emphasis: true,
              },
              {
                label: "SE-01",
                values: unit({ gain: 0.72, lateBy: 3 }),
                flag: "late + low",
                emphasis: true,
              },
              {
                label: "SE-02",
                values: unit({ gain: 0.68, lateBy: 3 }),
                flag: "worst in district",
                emphasis: true,
              },
            ],
            caption:
              "This is what the district average above is hiding. The single amber curve is one number per week; these twelve panels show that the shortfall is not spread evenly across the district but concentrated in three contiguous units in the south, and that in those units the season also started late. That distinction changes the advisory completely — a uniform shortfall points at weather across the whole district, a concentrated one with a late start points at rainfall arriving late in one part of it.",
            note:
              "C-01 has two unusable observation windows, so its line breaks rather than being interpolated. Its departure is real but is carried at a lower confidence than its neighbours.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "decision",
            title: "A unit is below its own normal. What kind of finding is that?",
            subtitle:
              "The attribution step, which is where a regional platform earns or loses its credibility",
            gate: {
              inputLabel: "on every mapping unit, every fortnight",
              label: "Canopy condition is below this unit's own seasonal normal",
              detail:
                "Read alongside rainfall departure, accumulated water balance, dry-spell length and the detected sowing date — not on its own.",
            },
            branches: [
              {
                condition:
                  "a matching rainfall deficit and a falling water balance",
                outcome: "Drought signal",
                emits:
                  "a drought advisory with a location and a severity, issued while water release, input subsidy or relief planning can still act on it",
                color: palette.amber,
              },
              {
                condition: "rainfall normal, but sowing detected late",
                outcome: "Season timing, not drought",
                emits:
                  "a sowing-delay finding with its implications for input demand and end-of-season weather exposure. A drought advisory here would be both wrong and expensive.",
                color: palette.cyan,
              },
              {
                condition: "rainfall normal and sowing on time",
                outcome: "Unexplained shortfall — cause not established",
                emits:
                  "the departure, the signals that were checked and came back normal, and an explicit statement that the cause is not established. Pest pressure, input shortage and a management change all look identical from orbit at this scale.",
                color: palette.violet,
                refuses: true,
              },
              {
                condition:
                  "the units below normal are scattered rather than contiguous",
                outcome: "Treated as a data-quality artefact",
                emits:
                  "no advisory. At district scale a random scatter of departures is almost always cloud, mask or acquisition variation, and publishing it as a finding is how a platform loses the trust it needs to be believed when the pattern is real.",
                color: palette.red,
                refuses: true,
              },
            ],
            note:
              "The third branch is the one that keeps the first one worth reading. A platform that attributes every shortfall to something will eventually attribute one to drought during a normal rainfall year, and after that nobody acts on its advisories.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── sowing
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
            kind: "timeseries",
            title: "Cumulative sowing progress against the three-year normal",
            subtitle: "Share of the district's cultivable area transitioned",
            representative: true,
            yLabel: "cultivable area sown (%)",
            xLabel: "weeks into the sowing window",
            yDomain: [0, 100],
            height: 290,
            xTicks: [0, 2, 4, 6, 8, 10].map((x) => ({ x, label: `${x + 1}` })),
            events: [
              { x: 4, label: "stall detected", color: palette.amber },
              { x: 6, label: "rain arrives", color: palette.cyan },
            ],
            series: [
              {
                name: "three-year normal",
                color: palette.muted,
                dash: "6 4",
                points: seq([2, 9, 24, 45, 66, 81, 90, 95, 97, 98, 99, 99]),
              },
              {
                name: "current season",
                color: palette.amber,
                points: seq([1, 4, 11, 22, 31, 36, 42, 58, 74, 85, 91, 94]),
              },
            ],
            caption:
              "The flat stretch between weeks five and seven is the finding — weekly gains of five and six points where the normal season was adding fifteen to twenty — and it is visible weeks before it reaches any reported figure, because sowing halted when the rain did not arrive on schedule. The catch-up after week seven is real but incomplete: the district reaches each level three to four weeks later than normal and closes five points short, which is an input-demand timing problem now and an end-of-season weather exposure problem in four months.",
            note:
              "A cumulative curve is the right form here precisely because it cannot go down. The quantity of interest is the slope — a flat segment is a stall, and it is far easier to see against a reference curve than in a table of weekly increments.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "regionGrid",
            title: "Sowing progress across the same district",
            subtitle: "Share of cultivable area transitioned to an emerging crop",
            rows: 10,
            cols: 12,
            values: parseGrid(sowingProgress).flat(),
            stops: [
              { at: 0, color: "rgba(157,174,164,0.4)", label: "not yet sown" },
              { at: 1, color: palette.amber, label: "partial" },
              { at: 2, color: palette.cyan, label: "mostly sown" },
              { at: 3, color: palette.green, label: "complete" },
            ],
            caption:
              "Drawn on the same mask as the stress map at the top of this page, so the two are directly comparable — and read together they say something neither says alone. Sowing is complete in the north-west and has barely started in the south-east; the canopy departure is mildest in the north-west and severe in the south-east. The same corner is both the late one and the struggling one, which points at rainfall arriving late in the south of the district rather than at a district-wide drought. A single blended figure for either product would have destroyed that.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── land use
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
            "The right form for the result is a transition matrix rather than a set of net figures, because the net figures conceal the flows. A district where six per cent of land enters cultivation and five per cent leaves it looks almost static in a summary and is anything but, and the two flows usually have completely different causes and completely different policy implications.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "confusion",
            title: "Where the land actually went, over a multi-year window",
            subtitle:
              "A transition matrix — rows are what the land was, columns are what it became",
            representative: true,
            rowAxis: "at the start",
            colAxis: "at the end",
            diagonalMeaning: "unchanged across the window",
            offDiagonalMeaning: "converted",
            cell: 44,
            rowLabels: [
              "Single-cycle cropland",
              "Double-cycle cropland",
              "Fallow / rotational",
              "Scrub / uncultivated",
              "Built-up / other",
            ],
            colLabels: [
              "Single-cycle",
              "Double-cycle",
              "Fallow",
              "Scrub",
              "Built-up",
            ],
            values: [
              [78, 12, 6, 3, 1],
              [7, 88, 3, 1, 1],
              [22, 4, 63, 10, 1],
              [9, 2, 6, 82, 1],
              [0, 0, 0, 1, 99],
            ],
            highlights: [
              {
                at: [2, 0],
                why: "The cell a single-season comparison gets wrong in both directions at once: rotational fallow returning to cultivation reads as new land entering agriculture, and the same land in its fallow year reads as land leaving it.",
              },
              {
                at: [0, 1],
                why: "Intensification — an additional cycle per year, and almost always the signature of new irrigation access. The most policy-relevant change in the matrix and the easiest to miss, because total cultivated area does not move at all.",
              },
              {
                at: [0, 3],
                why: "Cropland to scrub. The one figure here that should never be published from a single season's evidence, because a fallow year and a conversion out of agriculture look identical until several years of context separate them.",
              },
            ],
            caption:
              "Representative of the flow structure rather than a measured audit. The diagonal here means unchanged rather than correct, which is worth saying because the form is borrowed from classification. Read the fallow row: nearly a quarter of it returned to cultivation within the window, which is what ordinary rotation looks like and what makes a single-season change figure close to meaningless. Read the built-up row: conversion to built-up land is effectively irreversible, and its near-perfect diagonal is a useful sanity check on the whole matrix.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The same window, as the net figures a department receives",
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
              "The same window reported as the summary a department actually receives, which is why it sits next to the matrix rather than instead of it. Six per cent newly cultivated against five per cent leaving agriculture reads as a district in near-equilibrium; the matrix shows two substantial independent flows running in opposite directions with entirely different causes and entirely different policy implications. The bars are the deliverable; the matrix is what has to exist behind them for the bars to mean anything.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── scale discipline
    {
      id: "scale",
      nav: "Reading it correctly",
      heading: "The four ways a regional figure goes wrong",
      kicker: "Solution 04",
      blocks: [
        {
          kind: "prose",
          body: [
            "Most disappointment with regional satellite products comes from reading them at the wrong granularity or against the wrong reference, rather than from the measurements being poor. Both mistakes produce numbers that look entirely respectable — a district figure quoted to one decimal place, a cell-level value that can be pointed at on a map — and neither carries any warning that it should not be used the way it is about to be used.",
            "So the platform is explicit about how each of its outputs is meant to be read, and that guidance is part of the product rather than a caveat at the end of a report. Two of the four rules are about the reference: compare against the unit's own history, and never against an absolute threshold. Two are about granularity: read the pattern, and do not read the cell.",
            "The one that costs the most when ignored is aggregating field-level analytics up to a district. It is the obvious thing to do, it produces a figure with impressive apparent precision, and it silently inherits every boundary error, every mixed-pixel refusal and every small-holding exclusion in the field-level stack — with all of them averaged into invisibility.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "How much a district figure can be trusted, by how it was made",
            subtitle:
              "The same underlying observations, read four different ways",
            representative: true,
            max: 100,
            referenceLabel: "the level at which a figure is safe to act on",
            data: [
              {
                label: "Own history, pattern-level",
                value: 91,
                valueLabel: "reliable",
                color: palette.green,
                note: "each unit against its own prior seasons, read as contiguous bands — how this platform is designed to be used",
                reference: 70,
              },
              {
                label: "Consistent mapping units",
                value: 88,
                valueLabel: "reliable",
                color: palette.green,
                note: "the same units every season, so a departure is a departure rather than a change of denominator",
                reference: 70,
              },
              {
                label: "Absolute threshold",
                value: 52,
                valueLabel: "weak",
                color: palette.amber,
                note: "'moderate stress' means almost nothing without knowing what this district normally looks like by now",
                reference: 70,
              },
              {
                label: "Aggregated from field polygons",
                value: 41,
                valueLabel: "unreliable",
                color: palette.red,
                note: "inherits every boundary error, mixed-pixel refusal and small-holding exclusion, then averages them into invisibility",
                reference: 70,
              },
              {
                label: "Read cell by cell",
                value: 34,
                valueLabel: "misleading",
                color: palette.red,
                note: "at this scale a cell is not a place — it is one draw from a noisy process, and it will be pointed at on a map",
                reference: 70,
              },
            ],
            caption:
              "Representative of the relative reliability rather than a measured scoring. The bottom two rows are the two ways this platform is most often misused, and both produce outputs that look more precise than the correct readings above them — which is exactly why the guidance has to ship with the product rather than sit in an appendix.",
          },
        },
        {
          kind: "boundary",
          title: "What this platform is not for",
          intro:
            "This is a coverage-first product, and each of these is a direct consequence of that choice rather than a gap to be closed later.",
          items: [
            {
              not: "A field-level product",
              why: "It reports over consistent mapping units, not farm boundaries. A figure for a cell containing someone's holding is about the landscape around it, and handing it to that farmer as their field's status is the most common way a regional platform destroys its own credibility.",
            },
            {
              not: "Meaningful cell by cell",
              why: "One cell is a single draw from a noisy aggregation. The interpretable unit is a contiguous group of cells departing together, which is also why a scattered set of departures is treated as an artefact rather than as a set of small findings.",
            },
            {
              not: "Able to attribute a cause on its own",
              why: "It separates drought from late sowing because rainfall and sowing date are both observable. Pest pressure, input shortage and management change are not distinguishable from orbit at this scale, so a shortfall with normal rainfall and normal timing is reported as unexplained rather than assigned to the most likely story.",
            },
            {
              not: "A substitute for a crop-cutting survey",
              why: "Production statistics ultimately rest on physical sampling. What this replaces is the wait: an in-season departure against the district's own history is available while intervention is still possible, and the survey remains the authority on what was finally harvested.",
            },
          ],
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
              metric: "District",
              label: "Level resolution",
              detail:
                "Coverage-first, matched to how policy and sourcing decisions are made",
              tone: "green",
            },
            {
              metric: "4",
              label: "Monitoring products",
              detail:
                "Crop health, drought concentration, sowing progress, land-use change",
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
          kind: "status",
          title: "What is a design property here, and what is not established",
          intro:
            "Every chart on this page is representative — this platform's claims are about how a figure is constructed and read rather than about a benchmark, and it would be a strange page on which to quote an accuracy.",
          items: [
            {
              verdict: "shipped",
              claim:
                "Every product is a departure from the region's own prior seasons",
              evidence:
                "Not a presentation choice. An absolute stress reading at district scale carries almost no information, and the reliability chart puts a number on how much less it is worth.",
            },
            {
              verdict: "shipped",
              claim:
                "Four products over consistent mapping units, independent of field boundaries",
              evidence:
                "Which is why nothing here inherits the boundary errors, mixed-pixel refusals or small-holding exclusions that constrain the field-level stack — and equally why it can say nothing about an individual farm.",
            },
            {
              verdict: "defensible",
              claim: "The interpretation unit is the pattern, not the cell",
              evidence:
                "A contiguous band of departure is a finding with a location; the same count of cells scattered at random is aggregation noise. Both look identical in a table and completely different on the map.",
            },
            {
              verdict: "defensible",
              claim: "Drought is separated from late sowing before any advisory",
              evidence:
                "Rainfall departure, water balance and detected sowing date are all independently observable, so the two are genuinely separable — and the sowing map and stress map on this page are drawn on one mask precisely so the reader can do the same check.",
            },
            {
              verdict: "not-built",
              claim: "Any field-level statement from this platform",
              evidence:
                "Declined by design. A cell containing someone's holding describes the landscape around it, and passing that off as their field's status is the fastest available way to lose a policy customer's trust.",
            },
            {
              verdict: "deferred",
              claim: "Attribution of an unexplained shortfall",
              evidence:
                "Blocked on ground reporting rather than on modelling. Pest pressure, input shortage and management change are indistinguishable from orbit at district scale, so the platform reports the departure and explicitly declines the cause.",
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
