// lib/content/krishiBhoomi.ts — Krishi Bhoomi Score.
//
// A capability showcase: what satellite observation can tell a lender about a
// piece of farmland, explained in standard remote-sensing and agronomy terms.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

const bands = [
  { from: 750, to: 900, label: "Excellent", color: palette.green, risk: "LOW" },
  { from: 600, to: 750, label: "Good", color: palette.cyan, risk: "MEDIUM" },
  { from: 450, to: 600, label: "Fair", color: palette.amber, risk: "HIGH" },
  { from: 300, to: 450, label: "Poor", color: palette.red, risk: "VERY_HIGH" },
];

type Src = "optical" | "fused" | "radar" | "reconstructed";

// Three years of observed canopy history, monthly aggregate for legibility.
const history: { x: number; y: number | null; source?: Src }[] = [
  { x: 0, y: 0.28, source: "optical" },
  { x: 1, y: 0.62, source: "optical" },
  { x: 2, y: 0.45, source: "optical" },
  { x: 3, y: 0.22, source: "optical" },
  { x: 4, y: 0.18, source: "optical" },
  { x: 5, y: 0.24, source: "optical" },
  { x: 6, y: 0.44, source: "radar" },
  { x: 7, y: 0.58, source: "fused" },
  { x: 8, y: 0.71, source: "optical" },
  { x: 9, y: 0.63, source: "optical" },
  { x: 10, y: 0.34, source: "optical" },
  { x: 11, y: 0.3, source: "optical" },
  { x: 12, y: 0.66, source: "optical" },
  { x: 13, y: 0.68, source: "optical" },
  { x: 14, y: 0.48, source: "optical" },
  { x: 15, y: 0.24, source: "optical" },
  { x: 16, y: 0.19, source: "optical" },
  { x: 17, y: 0.26, source: "optical" },
  { x: 18, y: null },
  { x: 19, y: 0.52, source: "radar" },
  { x: 20, y: 0.66, source: "optical" },
  { x: 21, y: 0.69, source: "optical" },
  { x: 22, y: 0.4, source: "optical" },
  { x: 23, y: 0.28, source: "optical" },
  { x: 24, y: 0.64, source: "optical" },
  { x: 25, y: 0.7, source: "optical" },
  { x: 26, y: 0.5, source: "optical" },
  { x: 27, y: 0.23, source: "optical" },
  { x: 28, y: 0.2, source: "optical" },
  { x: 29, y: 0.28, source: "optical" },
  { x: 30, y: null },
  { x: 31, y: 0.55, source: "fused" },
  { x: 32, y: 0.7, source: "optical" },
  { x: 33, y: 0.65, source: "optical" },
  { x: 34, y: 0.38, source: "optical" },
  { x: 35, y: 0.31, source: "optical" },
];

const yearTicks = [
  { x: 0, label: "Y1 Jan" },
  { x: 6, label: "Jul" },
  { x: 12, label: "Y2 Jan" },
  { x: 18, label: "Jul" },
  { x: 24, label: "Y3 Jan" },
  { x: 30, label: "Jul" },
  { x: 35, label: "Dec" },
];

const seasonBands = [
  { from: 0, to: 2, label: "rabi" },
  { from: 5, to: 10, label: "kharif" },
  { from: 11, to: 14, label: "rabi" },
  { from: 17, to: 22, label: "kharif" },
  { from: 23, to: 26, label: "rabi" },
  { from: 29, to: 34, label: "kharif" },
];

export const krishiBhoomi: ProjectDetail = {
  slug: "krishi-bhoomi-score",
  pageTitle: "Krishi Bhoomi Score — A Satellite Agronomic Risk Index for Farm Lending",
  hideMeta: true,
  lede:
    "Three years of a field's observed history turned into an explainable risk index a credit officer can defend — land-cover verification, cropping activity, vigour and yield potential, stress history, weather resilience, and an explicit refusal when the land cannot be seen well enough to judge.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading: "The farmer is invisible to a credit file. The land is not.",
      blocks: [
        {
          kind: "prose",
          body: [
            "A smallholder applying for a crop loan is usually invisible to conventional credit assessment. There is often no bureau history, no bank statement that reflects farm income, no audited accounts, and no reliable third-party record of what was grown or how it performed. The lender is left with a land record, a declared crop, and a field visit that may or may not happen.",
            "The land itself, though, has been continuously observed from orbit for over a decade, and the archive is free. If a field was cropped twice a year for three years, that is visible. If it went fallow, that is visible. If a drought hit at flowering and the canopy never recovered, that is visible too. None of it depends on the borrower's paperwork, and none of it can be presented differently for the benefit of an application.",
            "So the gap is not data availability. The gap is that raw satellite imagery is not a credit input. Turning it into one means verifying that the parcel is farmland at all, making the vegetation signal physically meaningful and comparable between farms, accounting honestly for the weeks that cloud hid, and producing a number a credit officer and a regulator can follow line by line. That is what this system does.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "From orbit to a credit decision",
            layers: [
              {
                name: "What the satellites see",
                role: "Three years of continuous observation",
                color: palette.cyan,
                items: [
                  "optical reflectance",
                  "radar backscatter",
                  "surface water & built-up signals",
                  "weather record",
                ],
              },
              {
                name: "What that becomes",
                role: "Observable facts about the land",
                color: palette.violet,
                items: [
                  "is it farmland",
                  "how often it was cropped",
                  "how vigorous the crop got",
                  "how stable it was year to year",
                  "what weather it survived",
                ],
              },
              {
                name: "What the lender gets",
                role: "A defensible assessment",
                color: palette.green,
                items: [
                  "risk index & band",
                  "the weakest driver",
                  "reason codes",
                  "the evidence behind each",
                  "a refusal where evidence is thin",
                ],
              },
            ],
            caption:
              "The middle row is the whole product. Everything in it is an observable fact about a piece of ground rather than an inference about a person — which is exactly why it works for a borrower with no financial history.",
          },
        },
        {
          kind: "callout",
          tone: "green",
          title: "The rule that governs everything here: no invented numbers",
          body:
            "Every value traces to a named source — a satellite measurement, a published agronomic threshold, or a farmer-declared field explicitly marked as declared. Where the system cannot know something, it says so rather than filling the gap with a plausible default. In lending, a number gets used: it enters a credit file, it justifies a decision, and someone is later asked to defend it. A confident wrong number is worse than a stated absence, because an absence invites a question and a wrong number does not.",
        },
      ],
    },

    // ─────────────────────────────────────────────── land cover
    {
      id: "land-cover",
      nav: "Land verification",
      heading: "Land-cover verification — is this farmland at all?",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Before anything can be said about how a field performed, the system has to establish that the parcel is a field. Land records go wrong in ordinary ways: a survey number pointing at a pond, a plot that has since been built on, barren ground recorded as cultivable. Scoring those as poor farmland would be doubly wrong — it implies something about the borrower when the correct finding is about the land record.",
            "Remote sensing settles this unusually cleanly, because water, buildings, bare ground and vegetation have fundamentally different spectral behaviour. Open water absorbs near-infrared almost completely, so vegetation indices go negative and water indices go strongly positive — there is no ambiguity to argue about. Built-up surfaces reflect shortwave infrared more than near-infrared, the inverse of any living canopy. Bare soil sits between the two with no seasonal cycle at all. Farmland, by contrast, has a signature nothing else shares: it greens up and browns down on a repeating annual rhythm.",
            "Perennials are the case that catches naive systems out. An orchard or plantation never shows a bare-soil phase and never produces the sharp sowing-to-harvest curve of an annual crop, so a detector looking only for cycles concludes nothing is growing — and scores productive land as abandoned. Handling that as its own branch rather than as an exception is what makes the verification trustworthy.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Why land-cover verification is the most reliable output",
            subtitle:
              "Separation between classes, on independent spectral evidence",
            representative: true,
            max: 100,
            data: [
              {
                label: "Open water",
                value: 96,
                valueLabel: "unambiguous",
                color: palette.green,
                note: "vegetation index negative throughout; water index positive in nearly every observation — physically impossible for a crop",
              },
              {
                label: "Built-up land",
                value: 94,
                valueLabel: "unambiguous",
                color: palette.green,
                note: "built-up index positive in almost every observation; canopy vigour never rises above bare-ground levels",
              },
              {
                label: "Barren ground",
                value: 82,
                valueLabel: "strong",
                color: palette.cyan,
                note: "no seasonal cycle across three years — the absence of rhythm is itself the evidence",
              },
              {
                label: "Perennial / orchard",
                value: 74,
                valueLabel: "strong",
                color: palette.cyan,
                note: "sustained canopy with no bare-soil phase; handled as its own branch so it is not read as abandoned land",
              },
              {
                label: "Fallow farmland",
                value: 61,
                valueLabel: "careful",
                color: palette.amber,
                note: "genuinely resembles barren ground in a single season — separated by cropping history in the surrounding years",
              },
            ],
            caption:
              "The last row is where the care goes. A field resting for one season looks much like land that has never been farmed, and rejecting it would penalise a perfectly normal rotation. Three years of history is what tells them apart.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "parcelMap",
            title: "Verifying the field outline before trusting any number in it",
            subtitle:
              "Where the declared boundary and the measurable footprint disagree, both are drawn",
            banner: "The score describes the measured area, not the declared one.",
            declared: [
              [30, 34],
              [52, 30],
              [56, 52],
              [34, 58],
            ],
            measured: [
              [18, 20],
              [76, 16],
              [84, 66],
              [58, 82],
              [22, 74],
            ],
            labels: {
              declared: "declared boundary",
              measured: "measured footprint",
            },
            caption:
              "A land record that says half a hectare while the usable footprint covers several is not a rare event, and the consequence is severe: every statistic would describe neighbouring fields rather than the borrower's. So the disagreement is surfaced as a full-width banner rather than a footnote, the confidence in the result is reduced, and both outlines are drawn together so nobody reads a number about the wrong ground.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "How small is too small to measure",
            subtitle:
              "Share of a field contaminated by boundary pixels, at 10 m resolution",
            max: 100,
            data: [
              {
                label: "0.15 ha",
                value: 73,
                valueLabel: "73%",
                color: palette.red,
                note: "below this, almost everything measured is the neighbour's field — refuse rather than report",
              },
              {
                label: "0.50 ha",
                value: 48,
                valueLabel: "48%",
                color: palette.amber,
                note: "measurable, but the result carries reduced confidence",
              },
              {
                label: "1.50 ha",
                value: 30,
                valueLabel: "30%",
                color: palette.green,
                note: "boundary effects no longer dominate the field statistics",
              },
            ],
            caption:
              "This is geometry, not a modelling choice. For a roughly square field of N pixels the boundary ring is about 4√N − 4 pixels, and satellite geolocation error is itself around ten metres, so edge pixels genuinely contain whatever is next door. There is no field size at which this disappears for smallholdings — the threshold is simply where it stops dominating.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── cropping history
    {
      id: "activity",
      nav: "Cropping history",
      heading: "Cropping history and land-use activity",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "The single most informative thing satellites can tell a lender is how hard the land actually works. A field cropped twice a year for three consecutive years is a different proposition from one cropped once, and both differ from one that has sat idle for two of the last six seasons — and none of that appears in a land record.",
            "Detection comes from the shape of the season rather than any single image. A crop cycle has an unmistakable form: bare soil at sowing, a steady climb as the canopy closes, a plateau through flowering and fill, then a decline through senescence to harvest. Counting complete cycles across three years gives cropping intensity. Radar contributes independently because the structural change at emergence and again at harvest produces a distinct step in backscatter — which is what keeps cycle counting reliable through monsoon weeks when optical imagery is unusable.",
            "Fallow frequency and trend matter as much as the count. Land being worked harder each year and land quietly falling out of cultivation both show up here, and they point in opposite directions for a lender. The system also assigns each detected cycle to its season, because a rabi crop and a kharif crop on the same field carry different risk from entirely different weather.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Three years of observed cropping, cycle by cycle",
            subtitle:
              "Six complete cycles detected; radar carries the record through monsoon cloud",
            representative: true,
            showProvenanceLegend: true,
            yLabel: "canopy vigour",
            xLabel: "three-year observation window",
            yDomain: [0, 0.85],
            height: 310,
            xTicks: yearTicks,
            phases: seasonBands,
            series: [{ name: "canopy vigour", color: palette.green, points: history }],
            caption:
              "Two windows are genuinely blind, and they are drawn as gaps rather than bridged with a line — a line through an unobserved fortnight asserts a measurement nobody took. The y-axis is floored at zero rather than at the series minimum, which would exaggerate ordinary variation into a dramatic curve.",
          },
        },
        {
          kind: "viz",
          columns: 2,
          specs: [
            {
              kind: "bars",
              title: "Cropping intensity, year by year",
              subtitle: "Complete cycles detected per year",
              representative: true,
              max: 3,
              data: [
                { label: "Year 1", value: 2, valueLabel: "2 cycles", color: palette.green, note: "rabi + kharif, both completed" },
                { label: "Year 2", value: 2, valueLabel: "2 cycles", color: palette.green, note: "both completed; monsoon window partly blind" },
                { label: "Year 3", value: 2, valueLabel: "2 cycles", color: palette.green, note: "both completed" },
              ],
              caption:
                "Consistent double-cropping is the strongest positive signal available from orbit — it is direct evidence of both capacity and continuity of operation.",
            },
            {
              kind: "bars",
              title: "Land utilisation across the window",
              subtitle: "Share of the three-year window under an active crop",
              representative: true,
              max: 100,
              data: [
                { label: "Under active crop", value: 68, valueLabel: "68%", color: palette.green, note: "canopy present and developing" },
                { label: "Between-season fallow", value: 24, valueLabel: "24%", color: palette.cyan, note: "normal rotation gap, not idle land" },
                { label: "Unobserved", value: 8, valueLabel: "8%", color: palette.muted, note: "cloud-blind windows, reported rather than assumed either way" },
              ],
              caption:
                "Unobserved time is reported as its own category. Folding it into either of the others would quietly turn a gap in the record into a finding about the land.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── vigour
    {
      id: "vigour",
      nav: "Vigour & potential",
      heading: "Vigour and yield potential",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "Cropping the land is not the same as cropping it well. Two neighbouring fields can both run two cycles a year and differ substantially in how much crop they actually produce, and that difference is visible from orbit as canopy performance.",
            "The measurement rests on a well-established relationship: the amount of light a canopy intercepts over a season is closely tied to the biomass it accumulates, and biomass is what yield is built from. Integrating canopy vigour across the whole growing period — rather than reading its peak on one date — captures both how dense the canopy became and how long it held. A field that peaks high but collapses early has a smaller integral, and a smaller harvest, than one that peaks moderately and holds through fill.",
            "Peak quality is assessed alongside it. A sharp, well-timed peak arriving at the expected growth stage indicates a crop that established and developed on schedule; a late, flat or double peak points to replanting, patchy establishment or a stress event during the critical window. Both are read against the crop and season rather than against a single global threshold, because a healthy peak for one crop is a poor one for another.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Season canopy performance, cycle by cycle",
            subtitle:
              "Integrated canopy vigour as a share of what the crop and season allow",
            representative: true,
            referenceLabel: "expected for crop and season",
            max: 100,
            data: [
              { label: "Y1 rabi", value: 74, valueLabel: "74%", color: palette.green, reference: 70, note: "strong, well-timed peak held through fill" },
              { label: "Y1 kharif", value: 68, valueLabel: "68%", color: palette.green, reference: 70, note: "close to expectation" },
              { label: "Y2 rabi", value: 71, valueLabel: "71%", color: palette.green, reference: 70, note: "consistent with the prior year" },
              { label: "Y2 kharif", value: 52, valueLabel: "52%", color: palette.amber, reference: 70, note: "peak reached late and faded early — the weakest cycle in the window" },
              { label: "Y3 rabi", value: 69, valueLabel: "69%", color: palette.green, reference: 70, note: "recovered to normal" },
              { label: "Y3 kharif", value: 64, valueLabel: "64%", color: palette.cyan, reference: 70, note: "slightly below expectation" },
            ],
            caption:
              "One weak cycle in six is ordinary farming. A consistent decline across the window would be a very different finding — which is why the score reads the pattern rather than the latest season.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── stability
    {
      id: "stability",
      nav: "Stress & stability",
      heading: "Stress history and year-to-year stability",
      kicker: "Solution 04",
      blocks: [
        {
          kind: "prose",
          body: [
            "For a lender, consistency is worth as much as level. A field that yields well every year is a better risk than one that alternates between excellent and failed, even where the averages match — because a loan is repaid from one specific season, not from an average.",
            "Satellite history gives both halves of that. Within a season, stress events show as departures from the expected canopy trajectory, and the departures are weighted by when they happened: the same dip matters far more at flowering, when yield potential is being set, than during late senescence when the crop is finishing anyway. Across seasons, the spread between the best and worst years measures how exposed this particular field is to whatever conditions arrive.",
            "The distinction the system is careful about is between a stress event and an unusual field. An atypical variety, a wider spacing or a deliberately different management regime all produce real departures from the expected trajectory without indicating anything wrong. Growth lag is therefore reported separately from stress rather than being folded into the same number.",
          ],
        },
        {
          kind: "viz",
          columns: 2,
          specs: [
            {
              kind: "bars",
              title: "Stress load, weighted by growth stage",
              subtitle: "Anomaly severity per cycle, weighted by when it occurred",
              representative: true,
              max: 100,
              data: [
                { label: "Y1 rabi", value: 12, valueLabel: "low", color: palette.green, note: "minor late-season dip, after yield was set" },
                { label: "Y1 kharif", value: 22, valueLabel: "low", color: palette.green, note: "brief vegetative-stage stress, recovered" },
                { label: "Y2 rabi", value: 18, valueLabel: "low", color: palette.green },
                { label: "Y2 kharif", value: 64, valueLabel: "high", color: palette.red, note: "stress during flowering — the costliest possible window" },
                { label: "Y3 rabi", value: 20, valueLabel: "low", color: palette.green },
                { label: "Y3 kharif", value: 31, valueLabel: "moderate", color: palette.amber, note: "mid-fill dry spell" },
              ],
              caption:
                "Timing is weighted, not just magnitude. A dip at flowering costs yield permanently; the same dip at maturity costs almost nothing.",
            },
            {
              kind: "bars",
              title: "Year-to-year stability",
              subtitle: "Spread between the strongest and weakest comparable seasons",
              representative: true,
              max: 100,
              data: [
                { label: "Rabi variability", value: 7, valueLabel: "±7%", color: palette.green, note: "irrigated winter crop — very consistent" },
                { label: "Kharif variability", value: 24, valueLabel: "±24%", color: palette.amber, note: "monsoon-dependent — the real source of exposure on this field" },
                { label: "Overall spread", value: 19, valueLabel: "±19%", color: palette.cyan, note: "combined across the window" },
              ],
              caption:
                "Splitting variability by season locates the risk. This field is stable in winter and exposed in monsoon, which is a specific and useful thing for a lender to know about a specific loan.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── weather
    {
      id: "weather",
      nav: "Weather resilience",
      heading: "Weather resilience and forward exposure",
      kicker: "Solution 05",
      blocks: [
        {
          kind: "prose",
          body: [
            "Weather does two distinct jobs in a credit assessment, and collapsing them loses both. Looking backwards, it explains what the field has already survived: a season that came through a serious dry spell with the canopy intact is evidence of resilience, whether from irrigation access, soil water-holding capacity or simply good management. Looking forwards, it describes what the field is walking into over the loan period.",
            "The backward half is the more defensible, because it is a record rather than a forecast. Aligning the weather history to the detected crop cycles shows exactly which stress events landed in which growth stage, and how the canopy responded. A field that held its trajectory through a fortnight without rain during grain fill has demonstrated something a questionnaire cannot capture.",
            "Forward exposure is treated more carefully and weighted less, because it is a probabilistic statement about a season that has not happened. It draws on rainfall anomaly indices, the current state of the season against its normal progression, and the structural exposure the backward record has already revealed.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "What this field has already come through",
            subtitle: "Backward resilience, event by event",
            representative: true,
            max: 100,
            data: [
              {
                label: "Extended dry spell",
                value: 78,
                valueLabel: "held",
                color: palette.green,
                note: "18 rainless days during grain fill; canopy trajectory largely maintained — indicates water access",
              },
              {
                label: "Heat during flowering",
                value: 41,
                valueLabel: "affected",
                color: palette.amber,
                note: "the Y2 kharif stress event; yield potential visibly reduced and did not recover",
              },
              {
                label: "Heavy rainfall event",
                value: 72,
                valueLabel: "held",
                color: palette.green,
                note: "surface moisture cleared between observations — drainage adequate",
              },
              {
                label: "Late-season dry spell",
                value: 85,
                valueLabel: "held",
                color: palette.green,
                note: "occurred after the crop was effectively finished; minimal consequence",
              },
            ],
            caption:
              "Reported as events rather than as a weather score, because how a field responded to each is the informative part. Three held and one did not — and the one that did not is the same cycle every other capability flagged independently.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── the score
    {
      id: "score",
      nav: "The score",
      heading: "Explainable scoring — one number, and the arithmetic behind it",
      kicker: "Solution 06",
      blocks: [
        {
          kind: "prose",
          body: [
            "The five preceding capabilities become one index on a 300–900 scale, with four agronomic bands. The verdict sits above the fold: a gauge, a band, and the single weakest driver. A credit officer who trusts the system stops there; a credit committee reads everything underneath it.",
            "What makes it defensible is that the arithmetic is shown rather than asserted. Each contributing factor is drawn as a track sized to its weight, so the four together span the full range a raw index can reach — a factor scoring 42 matters differently at a weight of 30 than at a weight of 20, and four equal-length bars could never show that. The unfilled part of each track is the recoverable loss, which is the number an officer actually acts on. And where observation quality was poor, the reduction appears as a step in points rather than as a bare multiplier nobody can interpret.",
          ],
        },
        {
          kind: "viz",
          columns: 2,
          specs: [
            {
              kind: "gauge",
              title: "The verdict",
              value: 652,
              domain: [300, 900],
              bands,
              unitLabel: "agronomic risk index · not a credit limit",
              gateNote: "score reduced 15% — limited observation",
              representative: true,
            },
            {
              kind: "waterfall",
              title: "Why this number",
              subtitle:
                "Bars encode contribution, not score — each track is sized to its weight",
              representative: true,
              scaleFrom: 300,
              scaleSpan: 600,
              finalLabel: "Krishi Bhoomi Score",
              rows: [
                {
                  label: "Cropping activity",
                  weight: 30,
                  score: 72,
                  color: palette.green,
                  driver: "two cycles a year, utilisation trend flat",
                },
                {
                  label: "Vigour & potential",
                  weight: 25,
                  score: 61,
                  color: palette.cyan,
                  driver: "one weak cycle in six pulls the average down",
                },
                {
                  label: "Stress & stability",
                  weight: 20,
                  score: 58,
                  color: palette.amber,
                  driver: "flowering-stage stress in the second kharif",
                },
                {
                  label: "Weather resilience",
                  weight: 25,
                  score: 66,
                  color: palette.violet,
                  driver: "resilient record, moderate forward exposure",
                },
              ],
              bonus: { label: "government scheme enrolment", points: 4 },
              gate: { value: 0.85, label: "observation-quality reduction" },
              gateReasons: ["cloud-gapped windows", "field below the reliable size threshold"],
            },
          ],
        },
        {
          kind: "table",
          title: "Bands — four equal steps",
          head: ["Krishi Bhoomi Score", "Band", "Risk category"],
          rows: [
            ["750 – 900", "Excellent", "LOW"],
            ["600 – 750", "Good", "MEDIUM"],
            ["450 – 600", "Fair", "HIGH"],
            ["300 – 450", "Poor", "VERY_HIGH"],
          ],
          note:
            "Four agronomic bands, not five credit-policy bands — five would imply a lending policy engine, and that decision belongs to the lender rather than to the measurement.",
        },
        {
          kind: "prose",
          body: [
            "Two smaller design choices matter more than they look. Each contributing factor is built from a different family of signals, so no single measurement can be counted twice under different names — an earlier design let canopy peak drive three separate pillars, which meant one signal quietly carried three quarters of the score. And government scheme enrolment is treated as three states rather than two: unknown scores neutrally and is never treated as a confirmed absence, because penalising a borrower for a missing record would be quietly unfair in a way nobody would ever notice.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── refusal
    {
      id: "refusal",
      nav: "Refusal & explanation",
      heading: "Refusal states and explanation — knowing when not to answer",
      kicker: "Solution 07",
      blocks: [
        {
          kind: "prose",
          body: [
            "Most systems collapse everything that is not a score into one failure state. That throws away precisely the information a credit officer needs, because the cases have completely different next actions. A parcel that turns out not to be farmland is a question about the land record. A parcel too cloud-obscured to assess is a question about timing. Neither is a low score, and presenting either as one would be a false statement about the borrower.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "terminal",
            title: "Four distinct answers, kept apart end to end",
            states: [
              {
                code: "SCORED",
                meaning: "We looked. Here is the index and the evidence behind it.",
                next: "Assess the file.",
                color: palette.green,
              },
              {
                code: "NOT FARMLAND",
                meaning:
                  "We looked. This is water, built-up, barren or forest — with the spectral evidence attached.",
                next: "Question the land record. Nothing about the borrower is implied.",
                color: palette.cyan,
              },
              {
                code: "INSUFFICIENT DATA",
                meaning:
                  "We could not see it well enough to say — the field is below the measurable size, the boundary cannot be trusted, or the window was too cloud-broken. This is not a low score.",
                next: "Re-draw the boundary, or wait for a later observation.",
                color: palette.amber,
              },
              {
                code: "FAILED",
                meaning: "The system broke.",
                next: "Re-run. An engineering issue, not a finding.",
                color: palette.red,
              },
            ],
            caption:
              "Each renders as its own screen carrying its own evidence — never as a greyed-out gauge beside a refusal, because an empty dial eventually gets read as a zero.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "You cannot conclude \"nothing grew here\" from a period you did not observe",
          body:
            "One field had two stretches of roughly 240 days with no usable optical observation at all — a large fraction of the window entirely blind. Finding no crop cycles in that record and reporting high risk would be a confident statement about ground nobody had seen: 240 days is longer than any annual crop cycle, so an entire season could have been sown, grown and harvested inside the gap. The rule that resolves it is physical rather than statistical, which is why it needs no ground truth to justify — no cycles detected plus a blind window longer than the shortest recognisable cycle produces a refusal, not a score.",
        },
        {
          kind: "highlights",
          title: "How an assessment explains itself",
          items: [
            {
              title: "Reason codes",
              body:
                "Deterministic and structured, each conditional on the specific input that justifies it. This is the layer an adverse-action notice would be built from, so it never claims a comparison that did not actually run.",
            },
            {
              title: "Driver captions",
              body:
                "One grounded sentence per contributing factor, built from that factor's own inputs by template. Deliberately not generated — a language model asked to write these produces fluent sentences containing invented figures.",
            },
            {
              title: "Counterfactuals",
              body:
                "What would have to change for the index to move, computed against the actual scoring arithmetic so the answer is dimensionally correct rather than plausible-sounding.",
            },
            {
              title: "An observation-quality statement",
              body:
                "\"Score reduced 15%, limited observation\" rather than an uninterpretable confidence decimal — and the reasons named alongside it.",
            },
            {
              title: "Narrative, in the borrower's language",
              body:
                "An optional plain-language summary, translatable into major regional languages, generated strictly from the computed assessment. Where translation is unavailable the fact is flagged rather than hidden.",
            },
            {
              title: "Nothing fabricated to fill a slot",
              body:
                "A first assessment shows no trend rather than a change of zero, and any panel the assessment cannot honestly fill renders its own reason instead of leaving a blank space for someone to fill in later.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── boundary + impact
    {
      id: "impact",
      nav: "Scope & impact",
      heading: "What it delivers — and what it deliberately will not",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "3 years",
              label: "Of verified land history",
              detail: "Cropping intensity, vigour, stress and weather record, per field",
              tone: "green",
            },
            {
              metric: "Zero",
              label: "Field visits required",
              detail: "Assessed entirely from orbit and public weather records",
              tone: "green",
            },
            {
              metric: "Line by line",
              label: "Explainable",
              detail: "Every contribution traceable to the measurement that produced it",
              tone: "cyan",
            },
            {
              metric: "Refuses",
              label: "Rather than guesses",
              detail: "Non-farmland and unobservable fields get their own answer, not a bad score",
              tone: "amber",
            },
            {
              metric: "Regional",
              label: "Language output",
              detail: "The assessment narrative delivered in the borrower's own language",
              tone: "cyan",
            },
            {
              metric: "Invisible",
              label: "Borrowers made assessable",
              detail: "No bureau file, no bank statement, no audited accounts needed",
              tone: "green",
            },
          ],
        },
        {
          kind: "boundary",
          title: "Deliberately out of scope",
          intro:
            "This boundary matters more than any capability on the page, because everything a lender would most like to be handed is exactly what cannot honestly be produced from satellite observation alone.",
          items: [
            {
              not: "A loan amount or credit limit",
              why: "Converting an index into a currency figure needs a coefficient that can only come from observed repayment outcomes. Without those, any number would be invented — and it would be the number that gets used.",
            },
            {
              not: "A probability of default",
              why: "Same reason. The index describes the land's agronomic behaviour, which is one input into credit risk rather than a measure of it.",
            },
            {
              not: "An approve or reject decision",
              why: "Lending policy belongs to the lender. The index sits underneath their policy; it does not simulate it.",
            },
            {
              not: "A crop identification service",
              why: "Crop names come from the registry, are checked against the observed season shape, and are always labelled as declared rather than as identified.",
            },
            {
              not: "A yield forecast in tonnes",
              why: "Relative yield potential from canopy observation is well-established science. Converting it to tonnes per hectare for a specific crop and district needs local harvest records.",
            },
            {
              not: "A lending recommendation in the report",
              why: "A design reference proposed a panel suggesting a deferral period and a committee threshold. Fabricating a lending recommendation is the single most damaging thing this kind of interface could do, so the document is materially thinner than the mockup — and that is the correct outcome.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "green",
          title: "The honest positioning",
          body:
            "We tell a lender what the land has actually been doing for three years, with the evidence attached — and we tell them plainly when we cannot see it well enough to say. Everything downstream of that, from limit to pricing to approval, stays with the lender.",
        },
      ],
    },
  ],
};
