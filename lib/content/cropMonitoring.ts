// lib/content/cropMonitoring.ts — Enhanced Satellite Crop Monitoring &
// Decision-Support System.
//
// This page is a capability showcase. It explains how remote sensing and AI
// answer each agronomic question, in standard remote-sensing and agriculture
// terms — not how any particular implementation is built.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette, severityScale } from "@/components/charts/primitives";

// ── A representative field, written at true 10 m pixel scale ────────────
// Stress classes: 0 healthy · 1 mild · 2 moderate · 3 severe
const stressField = [
  "...0000....",
  "..0000100..",
  ".000010012.",
  "00001112230",
  "00011223330",
  ".001123333.",
  "..0012233..",
  "...00122...",
  "....001....",
];

// Nitrogen status on the same field: 0 adequate · 1 marginal · 2 deficient
const nField = [
  "...0000....",
  "..0000000..",
  ".000000011.",
  "00000011220",
  "00001122220",
  ".001122222.",
  "..0011222..",
  "...00112...",
  "....001....",
];

const pField = [
  "...0011....",
  "..0011110..",
  ".001111110.",
  "00111112110",
  "00111211110",
  ".011121111.",
  "..0111211..",
  "...01111...",
  "....011....",
];

const kField = [
  "...0000....",
  "..0000010..",
  ".000001100.",
  "00000110010",
  "00001100000",
  ".000110000.",
  "..0001100..",
  "...00010...",
  "....000....",
];

// Biomass is the inverse of stress on the same ground — the two maps have to
// agree, so one is derived from the other rather than invented separately.
const biomassGrid = parseGrid(stressField).map((row) =>
  row.map((v) => (v === null ? null : 3 - v))
);

const das = (i: number) => i * 6;
const seq = (vals: number[], source: "optical" | "radar" | "fused" | "reconstructed" = "optical") =>
  vals.map((y, x) => ({ x, y, source }));

// ── Canopy vigour across a cloud-heavy season ──────────────────────────
const canopy: {
  x: number;
  y: number;
  source: "optical" | "fused" | "radar" | "reconstructed";
}[] = [
  { x: 0, y: 0.16, source: "optical" },
  { x: 1, y: 0.19, source: "optical" },
  { x: 2, y: 0.24, source: "optical" },
  { x: 3, y: 0.31, source: "optical" },
  { x: 4, y: 0.4, source: "optical" },
  { x: 5, y: 0.49, source: "reconstructed" },
  { x: 6, y: 0.58, source: "reconstructed" },
  { x: 7, y: 0.66, source: "reconstructed" },
  { x: 8, y: 0.72, source: "fused" },
  { x: 9, y: 0.77, source: "optical" },
  { x: 10, y: 0.8, source: "optical" },
  { x: 11, y: 0.82, source: "optical" },
  { x: 12, y: 0.81, source: "optical" },
  { x: 13, y: 0.78, source: "reconstructed" },
  { x: 14, y: 0.74, source: "reconstructed" },
  { x: 15, y: 0.7, source: "optical" },
  { x: 16, y: 0.64, source: "optical" },
  { x: 17, y: 0.57, source: "optical" },
  { x: 18, y: 0.49, source: "optical" },
  { x: 19, y: 0.42, source: "optical" },
  { x: 20, y: 0.36, source: "optical" },
  { x: 21, y: 0.31, source: "optical" },
];

const radarVigour = seq(
  [
    0.14, 0.17, 0.21, 0.27, 0.34, 0.42, 0.5, 0.57, 0.62, 0.66, 0.69, 0.71, 0.71,
    0.69, 0.67, 0.64, 0.6, 0.55, 0.5, 0.45, 0.41, 0.37,
  ],
  "radar"
);

const stageBands = [
  { from: 0, to: 3, label: "establishment" },
  { from: 3, to: 9, label: "vegetative" },
  { from: 9, to: 14, label: "reproductive" },
  { from: 14, to: 19, label: "grain fill" },
  { from: 19, to: 21, label: "maturity" },
];

const dasTicks = [0, 3, 6, 9, 12, 15, 18, 21].map((x) => ({
  x,
  label: `${das(x)}`,
}));

export const cropMonitoring: ProjectDetail = {
  slug: "crop-monitoring-pipeline",
  pageTitle: "Enhanced Satellite Crop Monitoring & Decision-Support System",
  hideMeta: true,
  lede:
    "Farm-level crop intelligence from continuous satellite monitoring — weather intelligence, crop stress and stress typing, pest and disease risk, nutrient status, yield trajectory, crop cycle and harvest timing, and biomass accumulation, delivered as dated alerts a grower can act on.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading: "Reading a crop from orbit, every few days, all season long",
      blocks: [
        {
          kind: "prose",
          body: [
            "A healthy crop and a struggling crop reflect sunlight differently, and they do so long before the difference is visible to someone standing at the edge of the field. Green leaves absorb red light for photosynthesis and reflect near-infrared light strongly; as a canopy thins, loses chlorophyll, runs short of water or begins to senesce, that balance shifts in ways a satellite sensor measures directly. Combining those measurements into ratios — vegetation indices — turns raw reflectance into quantities an agronomist recognises: canopy vigour, leaf area, canopy water content, chlorophyll status, senescence.",
            "This system takes a farm boundary and builds that reading continuously. A fresh optical observation arrives roughly every six days. Radar arrives independently and, because microwaves pass through cloud, keeps the record intact through monsoon weeks when optical imagery is useless. Weather data supplies the context that decides what any given reflectance change actually means — a canopy that stops growing during a heatwave is telling a different story from one that stops growing under a clear sky.",
            "On top of that continuous record sit the agronomic questions a grower actually asks. How is the weather treating this field? What growth stage is the crop at, and when will it be ready to harvest? Is it putting on biomass at the rate it should? Is any part of it under stress, and what kind? Is the canopy showing a nutrient shortfall? Which pests and diseases are the conditions currently favouring? And what yield is this field heading towards? Each of those is answered per field, per observation, and turned into a dated alert with a recommended action.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "From reflectance to a decision",
            layers: [
              {
                name: "What the sensors measure",
                role: "Physical observation of the field",
                color: palette.cyan,
                items: [
                  "optical reflectance",
                  "radar backscatter",
                  "thermal / land-surface temperature",
                  "weather variables",
                ],
              },
              {
                name: "What that becomes",
                role: "Standard agronomic quantities",
                color: palette.violet,
                items: [
                  "canopy vigour",
                  "leaf area index",
                  "chlorophyll status",
                  "canopy water content",
                  "senescence",
                  "soil moisture proxy",
                  "heat accumulation",
                ],
              },
              {
                name: "What it answers",
                role: "The agronomic questions",
                color: palette.green,
                items: [
                  "weather intelligence",
                  "crop cycle & harvest timing",
                  "biomass accumulation",
                  "crop stress & stress type",
                  "nutrient status",
                  "pest & disease risk",
                  "yield trajectory",
                ],
              },
              {
                name: "What the grower gets",
                role: "Dated, field-specific action",
                color: palette.amber,
                items: [
                  "alerts",
                  "affected zone maps",
                  "preventive measures",
                  "mitigation measures",
                  "harvest window",
                ],
              },
            ],
            caption:
              "Nothing in the second row is invented for this system — canopy vigour, leaf area index and heat accumulation are standard quantities in agronomy and remote sensing. The work is in fusing them into one continuous, cloud-resilient timeline and reading agronomic meaning off it reliably enough to put an alert in front of a farmer.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "cadence",
            title: "Why continuous monitoring needs more than one sensor",
            subtitle:
              "A single season, showing what is actually available to observe with",
            days: 120,
            sources: [
              {
                label: "Optical",
                note: "sees colour & chlorophyll",
                color: palette.green,
                hits: [0, 5, 10, 30, 35, 90, 95, 100, 105, 110, 115, 120],
                blocked: [15, 20, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
              },
              {
                label: "Radar",
                note: "sees through cloud",
                color: palette.violet,
                hits: [0, 18, 40, 62, 80, 100, 118],
              },
              {
                label: "Weather",
                note: "daily context",
                color: palette.cyan,
                hits: Array.from({ length: 25 }, (_, i) => i * 5),
              },
            ],
            caption:
              "Open circles are optical passes that exist but are unusable because of cloud — routinely around half of a monsoon-season kharif crop. Radar does not measure colour, so it cannot replace optical for nutrient or senescence work, but it does track canopy structure and surface moisture through any weather. Fusing the two is what keeps a season-long record continuous instead of full of holes.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── weather
    {
      id: "weather",
      nav: "Weather intelligence",
      heading: "Weather intelligence — the context that makes everything else readable",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "Weather is not a side panel in crop monitoring; it is the interpreter. The same drop in canopy vigour means water stress in a dry spell, heat damage in a heatwave, waterlogging after heavy rain, or simply normal senescence if the crop has accumulated enough heat to be finishing its cycle. Without weather, a monitoring system can see that something changed but not why — and an alert without a cause is not actionable.",
            "The system pulls a weather record for each field's location from MeteoBlue, aligned to the satellite observation dates so every reflectance reading has matching conditions attached. From that it derives the agrometeorological quantities agronomists work in: growing degree days, which accumulate heat and drive the crop's development clock; vapour pressure deficit, which measures how hard the atmosphere is pulling water out of the leaves; reference evapotranspiration and rainfall, which together give the water balance; and dry-spell length. Satellite thermal imagery adds land-surface temperature — the temperature of the canopy itself, which on a hot afternoon can sit well above the air temperature a weather station reports.",
            "Monsoon onset detection matters especially in rainfed systems, where the sowing date is decided by the rains rather than the calendar. Getting that date right shifts the entire phenological clock, and every stage-dependent judgement downstream depends on it.",
          ],
        },
        {
          kind: "viz",
          columns: 2,
          specs: [
            {
              kind: "timeseries",
              title: "Heat accumulation drives the crop's clock",
              subtitle: "Growing degree days, accumulated from sowing",
              representative: true,
              yLabel: "accumulated GDD (°C·day)",
              xLabel: "days after sowing",
              height: 280,
              yDomain: [0, 2000],
              xTicks: dasTicks,
              phases: stageBands,
              series: [
                {
                  name: "accumulated heat",
                  color: palette.amber,
                  points: seq([
                    0, 88, 180, 275, 372, 470, 568, 665, 760, 852, 944, 1035,
                    1124, 1212, 1298, 1382, 1464, 1544, 1622, 1698, 1772, 1844,
                  ]),
                },
              ],
              caption:
                "Crops develop on accumulated heat, not on elapsed days. A cool season stretches the calendar and a hot one compresses it, which is why stage boundaries are read off this curve rather than off a fixed number of days.",
            },
            {
              kind: "bars",
              title: "Weather pressure, by driver",
              subtitle: "Share of season observations flagged for each condition",
              representative: true,
              max: 100,
              data: [
                {
                  label: "Atmospheric dryness",
                  value: 27,
                  valueLabel: "27%",
                  color: palette.amber,
                  note: "high vapour pressure deficit — leaves losing water faster than roots supply it",
                },
                {
                  label: "Heat stress",
                  value: 23,
                  valueLabel: "23%",
                  color: palette.red,
                  note: "canopy temperature above the crop's tolerance for its stage",
                },
                {
                  label: "Water deficit",
                  value: 18,
                  valueLabel: "18%",
                  color: palette.cyan,
                  note: "rainfall and evapotranspiration balance negative; dry spell running",
                },
                {
                  label: "Excess moisture",
                  value: 9,
                  valueLabel: "9%",
                  color: palette.violet,
                  note: "heavy rainfall events, waterlogging risk",
                },
                {
                  label: "Cold stress",
                  value: 0,
                  valueLabel: "none",
                  color: palette.muted,
                  note: "no chilling events this season",
                },
              ],
              caption:
                "Reported as pressure rather than as a single weather score, because the mitigation differs completely: atmospheric dryness calls for irrigation timing, heat stress at flowering may call for nothing at all beyond adjusting the yield expectation.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "What weather intelligence changes downstream",
          body:
            "Heat accumulation sets the growth stage, which sets what a healthy index value looks like at that moment. Vapour pressure deficit and canopy temperature separate water stress from nutrient stress. Rainfall distribution and heat during flowering feed the yield projection's retention penalties. Humidity and temperature together drive the pest and disease risk engine. Every other section on this page depends on this one.",
        },
      ],
    },

    // ─────────────────────────────────────────────── crop cycle
    {
      id: "crop-cycle",
      nav: "Crop cycle & harvest",
      heading: "Crop cycle analysis, harvest prediction and ready-to-harvest alerts",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "Everything else on this page needs to know where the crop is in its life. A vigour value that is excellent at flowering is alarming at establishment, and a decline that is a problem in grain fill is exactly what should happen at maturity. So the first thing the system establishes is the crop cycle: when the field was sown, when the canopy emerged, when it reached peak greenness, and when it is heading for harvest.",
            "Remote sensing detects this from the shape of the season rather than from any single date. A sown field shows bare-soil reflectance, then a steady climb as the canopy closes, a plateau through the reproductive phase, and a decline as leaves senesce and the crop dries down. Radar contributes independently here — the structural change at emergence and again at harvest produces a distinct step in backscatter, which is why cycle detection holds up even when the critical weeks were cloudy. Fusing the observed curve with accumulated heat gives a growth stage that is anchored in both what the field looks like and how much development it has actually banked.",
            "Harvest prediction falls out of the same reading. Once the crop passes peak greenness and senescence begins, the rate of decline plus remaining heat requirement gives a harvest window rather than a single date — and as maturity approaches, that window narrows and a ready-to-harvest alert fires. For a grower this is the difference between guessing at labour and machinery bookings and planning them; for multi-pick crops such as cotton, the same logic drives a picking calendar rather than one date.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "The season's shape is what identifies the stage",
            subtitle:
              "Canopy vigour with detected cycle events; radar carries the record through cloud",
            representative: true,
            showProvenanceLegend: true,
            yLabel: "index value",
            xLabel: "days after sowing",
            yDomain: [0, 0.9],
            height: 310,
            xTicks: dasTicks,
            phases: stageBands,
            events: [
              { x: 0, label: "sowing" },
              { x: 11, label: "peak", color: palette.green },
              { x: 19, label: "ready to harvest", color: palette.amber },
            ],
            series: [
              { name: "canopy vigour", color: palette.green, points: canopy },
              {
                name: "radar canopy structure",
                color: palette.violet,
                points: radarVigour,
                dash: "9 3 2 3",
              },
            ],
            caption:
              "Five consecutive observations in the monsoon window were reconstructed rather than measured — drawn with their own texture, and never given a marker, because a marker asserts a direct observation. Detection still holds because the radar track, which cloud does not affect, follows the same structural rise.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "What the system establishes at each point in the cycle",
            stages: [
              {
                n: "01",
                name: "Sowing & emergence",
                produces:
                  "Sowing date confirmed or corrected against the declared date; emergence detected from the first sustained canopy signal. In rainfed systems the monsoon onset shifts this anchor.",
                kind: "config",
              },
              {
                n: "02",
                name: "Establishment",
                produces:
                  "Crop stand assessed while the canopy is still sparse — the hardest window to read optically, and where soil background dominates the signal.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Vegetative growth",
                produces:
                  "Canopy expansion rate against the expected trajectory for the crop and its accumulated heat. Growth lag is reported separately from stress, because an unusual variety or spacing is not a problem.",
                kind: "model",
              },
              {
                n: "04",
                name: "Reproductive phase",
                produces:
                  "Peak greenness identified — the point the yield projection keys off. The most stress-sensitive window in the season, so alert thresholds tighten here.",
                kind: "model",
              },
              {
                n: "05",
                name: "Grain / fruit fill",
                produces:
                  "Retention tracked: how much of the potential set at flowering is actually being filled, and what weather and stress are taking off it.",
                kind: "model",
              },
              {
                n: "06",
                name: "Maturity & harvest",
                produces:
                  "Senescence rate plus remaining heat requirement gives a harvest window; ready-to-harvest alert fires as it narrows. Harvest itself is confirmed by the structural drop in radar backscatter.",
                kind: "publish",
              },
            ],
            note:
              "Stage boundaries are crop-specific and read from accumulated heat as well as from the observed curve, so a cool season stretches them and a hot season compresses them rather than both being forced onto the same calendar.",
          },
        },
        {
          kind: "cards",
          columns: 3,
          title: "What this enables for the grower",
          items: [
            {
              title: "Harvest window, not a guess",
              body:
                "A dated window that narrows as maturity approaches, so labour, machinery and transport can be booked against something rather than against last year's calendar.",
              tone: "green",
            },
            {
              title: "Ready-to-harvest alert",
              body:
                "Fires when senescence and heat accumulation agree the crop is finishing. Harvesting early costs yield; harvesting late costs quality and risks weather damage on a standing crop.",
              tone: "amber",
            },
            {
              title: "Stage-aware everything else",
              body:
                "Every stress threshold, nutrient expectation and yield judgement on this page is read against the stage the crop is actually at, which is only possible because the cycle is established first.",
              tone: "cyan",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── biomass
    {
      id: "biomass",
      nav: "Biomass",
      heading: "Biomass accumulation and analysis",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "Yield is built from biomass. A crop grows by intercepting sunlight with its canopy and converting it into dry matter, and the efficiency of that conversion is well characterised for every major crop. So if the system can estimate how much light the canopy is intercepting and how favourable conditions have been, it can track dry matter accumulating through the season rather than waiting for the harvest to find out.",
            "Remote sensing supplies the light interception directly. Canopy vigour translates into the fraction of photosynthetically active radiation the crop absorbs, and from that into leaf area index — how many layers of leaf are stacked above each square metre of ground. Multiply intercepted light by the crop's conversion efficiency, discount for the stress and weather conditions actually observed, and accumulate over the season: that is a biomass curve. Red-edge reflectance adds a nitrogen nutrition index, because a canopy short of nitrogen converts light less efficiently even when it looks green.",
            "The useful output is not the absolute number but the comparison. Each crop has an expected accumulation curve for its stage and heat. Plotting observed against expected gives a biomass stress ratio — a single figure for whether this field is on track — and because biomass is computed per pixel, it also shows which part of the field is falling behind. That map is what turns a whole-field number into a decision about where to walk.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Observed accumulation against the crop's expected curve",
            subtitle:
              "The gap between the two lines is the biomass stress ratio, tracked all season",
            representative: true,
            yLabel: "above-ground dry biomass (kg/ha)",
            xLabel: "days after sowing",
            height: 300,
            yDomain: [0, 10000],
            xTicks: dasTicks,
            phases: stageBands,
            events: [{ x: 12, label: "divergence detected", color: palette.amber }],
            series: [
              {
                name: "expected for stage & heat",
                color: palette.muted,
                dash: "6 4",
                points: seq([
                  0, 60, 160, 340, 640, 1100, 1750, 2600, 3600, 4700, 5750,
                  6700, 7500, 8100, 8600, 8950, 9180, 9330, 9420, 9470, 9500,
                  9500,
                ]),
              },
              {
                name: "observed accumulation",
                color: palette.green,
                points: seq([
                  0, 55, 150, 320, 600, 1030, 1640, 2440, 3380, 4420, 5400,
                  6280, 6980, 7420, 7760, 8010, 8190, 8310, 8380, 8420, 8440,
                  8440,
                ]),
              },
            ],
            caption:
              "The two curves track together through vegetative growth and separate from the reproductive phase onward, ending about 11% short. That divergence is visible weeks before the canopy itself starts to look wrong, which is the entire value of monitoring accumulation rather than appearance.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "pixels",
            title: "Where the biomass actually is",
            subtitle: "Per-pixel dry matter, drawn at true 10 m scale",
            grid: biomassGrid,
            stops: [
              { at: 0, color: palette.red, label: "well below" },
              { at: 1, color: palette.amber, label: "below" },
              { at: 2, color: palette.cyan, label: "near expected" },
              { at: 3, color: palette.green, label: "at expected" },
            ],
            distribution: [
              { label: "at expected", pct: 50, color: palette.green },
              { label: "near", pct: 20, color: palette.cyan },
              { label: "below", pct: 15, color: palette.amber },
              { label: "well below", pct: 15, color: palette.red },
            ],
            caption:
              "One 10 m pixel covers a hundredth of a hectare, so a field this size carries 66 of them. Drawn coarse on purpose — smoothing it into a pretty raster would imply spatial detail the sensor never resolved. The pattern is what matters: the shortfall is concentrated along one edge, which points at a cause worth walking to.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── stress
    {
      id: "stress",
      nav: "Crop stress",
      heading: "Crop stress analysis and stress type analysis",
      kicker: "Solution 04",
      blocks: [
        {
          kind: "prose",
          body: [
            "Knowing a field is stressed is only half an answer. Water stress, nitrogen shortfall and pest damage all reduce canopy vigour, and they call for completely different responses — so the useful output is not a stress score but a stress type, with the share of the field affected and how severely.",
            "Different stresses leave different spectral signatures, and that is what makes typing possible. Nitrogen shortfall shows first in the red edge, the narrow band where chlorophyll absorption falls away sharply, because leaf chlorophyll declines before the canopy thins. Water stress shows in the shortwave infrared, which responds to liquid water in the leaf, and it usually appears alongside a rising vapour pressure deficit and a falling soil moisture signal from radar. Tissue damage — from pests, disease, hail or scorch — shows as a change in the ratio of protective pigments to chlorophyll and as an increase in exposed background. Reading several index families together, against what each should look like for this crop at this stage, separates them.",
            "The stressed-area percentage is measured differently from everything else on this page, and it is the strongest number the system produces. Rather than comparing a field against a regional model, each pixel is compared against the healthy population of the same field — the field's own best half becomes the reference. That makes it a direct measurement rather than a modelled estimate, and it removes almost every source of between-field error at once.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Stress detected weeks before the canopy looks wrong",
            subtitle: "Share of the field flagged, observation by observation",
            representative: true,
            yLabel: "stressed area (%)",
            xLabel: "days after sowing",
            height: 280,
            yDomain: [0, 60],
            xTicks: dasTicks,
            phases: stageBands,
            events: [{ x: 13, label: "alert issued", color: palette.amber }],
            series: [
              {
                name: "stressed area",
                color: palette.amber,
                points: seq([
                  0, 0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 18, 26, 34, 42, 48,
                  50, 50, 49, 47, 45,
                ]),
              },
            ],
            caption:
              "The alert fires at the inflection, not at the peak. By the time whole-field vigour has visibly dropped, the intervention window for an in-season correction has largely closed — so the value of this curve is entirely in how early it turns.",
          },
        },
        {
          kind: "viz",
          columns: 2,
          specs: [
            {
              kind: "pixels",
              title: "Severity, mapped",
              subtitle: "0.66 ha field · 66 valid pixels",
              grid: parseGrid(stressField),
              cell: 15,
              stops: severityScale.map((s, i) => ({
                at: i,
                color: s.color,
                label: s.label,
              })),
              distribution: [
                { label: "healthy", pct: 50, color: severityScale[0].color },
                { label: "mild", pct: 20, color: severityScale[1].color },
                { label: "moderate", pct: 15, color: severityScale[2].color },
                { label: "severe", pct: 15, color: severityScale[3].color },
              ],
              caption:
                "Half the field is healthy and the affected half is graded, so the response can be targeted rather than applied wall to wall.",
            },
            {
              kind: "bars",
              title: "What kind of stress it is",
              subtitle: "Dominant type across the stressed portion of the field",
              representative: true,
              max: 100,
              data: [
                {
                  label: "Water deficit",
                  value: 46,
                  valueLabel: "46%",
                  color: palette.cyan,
                  note: "leaf water signal down; dry spell and high evaporative demand agree",
                },
                {
                  label: "Nutrient deficit",
                  value: 27,
                  valueLabel: "27%",
                  color: palette.amber,
                  note: "red-edge chlorophyll response down ahead of canopy thinning",
                },
                {
                  label: "Tissue damage",
                  value: 18,
                  valueLabel: "18%",
                  color: palette.red,
                  note: "pigment ratio shifted, exposed background rising — scout candidate",
                },
                {
                  label: "Sub-optimal growth",
                  value: 9,
                  valueLabel: "9%",
                  color: palette.violet,
                  note: "behind trajectory with no specific stress signature",
                },
              ],
              caption:
                "Typing changes the action. Water deficit is an irrigation decision, nutrient deficit a fertiliser decision, tissue damage a scouting decision — and the maps show which zones need which.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "green",
          title: "Cross-checked rather than taken on trust",
          body:
            "A stress call is corroborated before it becomes an alert. Radar backscatter and its soil moisture proxy provide an independent read on water status; the biomass curve provides an independent read on whether growth genuinely faltered; canopy temperature and vapour pressure deficit provide the heat context. Where those disagree with the optical reading, the alert is downgraded rather than published — and where the observation window itself was cloudy, the uncertainty is widened rather than hidden.",
        },
      ],
    },

    // ─────────────────────────────────────────────── nutrients
    {
      id: "nutrients",
      nav: "Crop nutrients",
      heading: "Crop nutrient analysis",
      kicker: "Solution 05",
      blocks: [
        {
          kind: "prose",
          body: [
            "A nutrient shortfall is one of the few crop problems a grower can still fix mid-season, which makes early detection unusually valuable — and unusually hard, because by the time a deficiency is visible from the field edge, much of the yield penalty is already locked in.",
            "Remote sensing gets ahead of that through the red edge. Between red and near-infrared there is a narrow band where chlorophyll absorption collapses, and the exact position and steepness of that transition is extremely sensitive to leaf chlorophyll concentration. Nitrogen is the building block of chlorophyll, so a nitrogen-short canopy shifts its red edge measurably while still looking green. Nitrogen also follows a well-documented dilution curve as biomass accumulates — a crop needs a lower nitrogen concentration per unit of dry matter as it grows — so comparing observed canopy nitrogen against the curve for the crop's current biomass gives a nutrition index rather than a raw reading.",
            "Potassium and phosphorus are harder and are reported honestly as such. Potassium affects water relations and leaf margins and has reasonably documented index relationships. Phosphorus has no direct spectral signature at all; it is inferred from secondary pigment effects and stunted growth patterns, and is published as directional. Alongside the three macronutrients the system reports soil property proxies — salinity, organic carbon and pH — each of which needs some exposed soil or an established crop response to say anything at all.",
          ],
        },
        {
          kind: "viz",
          columns: 3,
          intro:
            "Nutrient status is mapped per pixel and per nutrient. The three maps below cover the same ground on the same day — and they disagree with each other, which is the point. Nutrient typing draws on index families that the vigour signal does not use, so it is independent evidence rather than the same measurement relabelled.",
          specs: [
            {
              kind: "pixels",
              title: "Nitrogen",
              cell: 13,
              grid: parseGrid(nField),
              stops: [
                { at: 0, color: palette.green, label: "adequate" },
                { at: 1, color: palette.amber, label: "marginal" },
                { at: 2, color: palette.red, label: "deficient" },
              ],
            },
            {
              kind: "pixels",
              title: "Phosphorus",
              cell: 13,
              grid: parseGrid(pField),
              stops: [
                { at: 0, color: palette.green, label: "adequate" },
                { at: 1, color: palette.amber, label: "marginal" },
                { at: 2, color: palette.red, label: "deficient" },
              ],
            },
            {
              kind: "pixels",
              title: "Potassium",
              cell: 13,
              grid: parseGrid(kField),
              stops: [
                { at: 0, color: palette.green, label: "adequate" },
                { at: 1, color: palette.amber, label: "marginal" },
                { at: 2, color: palette.red, label: "deficient" },
              ],
            },
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Nutrition status against sufficiency for the current stage",
            subtitle: "Dashed marker is the sufficiency threshold for this crop and stage",
            representative: true,
            referenceLabel: "sufficiency threshold",
            max: 100,
            data: [
              {
                label: "Nitrogen",
                value: 62,
                valueLabel: "62 / 100",
                color: palette.amber,
                reference: 75,
                note: "below sufficiency — correctable this season, and the strongest signal of the three",
              },
              {
                label: "Potassium",
                value: 71,
                valueLabel: "71 / 100",
                color: palette.green,
                reference: 70,
                note: "at sufficiency",
              },
              {
                label: "Phosphorus",
                value: 48,
                valueLabel: "48 / 100",
                color: palette.red,
                reference: 70,
                note: "directional only — no direct spectral signature, read as an indication to test",
              },
              {
                label: "Organic carbon",
                value: 55,
                valueLabel: "55 / 100",
                color: palette.violet,
                reference: 60,
                note: "soil property proxy; needs exposed soil to read reliably",
              },
            ],
            caption:
              "Sufficiency is stage-dependent, not a fixed number — a crop's nitrogen requirement per unit of biomass falls as it grows, so the same reading can be adequate at grain fill and deficient at flowering.",
          },
        },
        {
          kind: "callout",
          tone: "amber",
          title: "Canopy status, not a soil test",
          body:
            "These outputs describe the nutritional state of the crop canopy, which is what a satellite can actually see. They are built for monitoring between soil tests — catching a developing shortfall early enough to correct — and they do not replace laboratory analysis. Phosphorus and pH in particular should be read as directional indications that a test is worth doing.",
        },
      ],
    },

    // ─────────────────────────────────────────────── pest & disease
    {
      id: "pest-disease",
      nav: "Pest & disease",
      heading: "Pest and disease identification and prediction",
      kicker: "Solution 06",
      blocks: [
        {
          kind: "prose",
          body: [
            "Most crop losses to pests and diseases are avoidable, and almost all of the avoidable part depends on timing. Scouting a field that has no problem wastes a visit; scouting a week late means spraying into an established infestation instead of preventing one. So the question worth answering is not what is in the field right now — a satellite cannot see an insect — but which pests and diseases the current conditions are favouring, and where in the field to look first.",
            "That is a prediction problem with good physical grounding. Every significant pest and pathogen has documented environmental requirements: a temperature range in which it develops, a humidity or leaf-wetness threshold it needs to establish, a host growth stage at which the crop is susceptible, and a characteristic build-up period. The system scores those conditions continuously from weather, canopy state and crop stage, and ranks the agents that are currently plausible with a probability and the evidence behind each. Where damage has already begun, the tissue-damage stress signature narrows the search — a change in pigment ratios and rising exposed background points at the affected zones, so scouting starts in the right corner of the field.",
            "The output is deliberately framed as risk, not diagnosis. Ranked candidates with their triggers, aimed at directing a field visit — the identification itself happens on the ground, or from a close-range photograph through a separate image classifier.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Risk builds behind its weather driver",
            subtitle:
              "Humidity pressure and the resulting pest risk score, both on a 0–100 scale",
            representative: true,
            yLabel: "0–100 scale",
            xLabel: "days after sowing",
            height: 290,
            yDomain: [0, 100],
            xTicks: dasTicks,
            phases: stageBands,
            events: [{ x: 12, label: "scout alert", color: palette.amber }],
            series: [
              {
                name: "humidity & leaf-wetness pressure",
                color: palette.cyan,
                dash: "6 4",
                points: seq([
                  20, 24, 30, 38, 45, 58, 66, 72, 78, 82, 85, 88, 86, 84, 80,
                  72, 64, 55, 46, 40, 35, 30,
                ]),
              },
              {
                name: "pest & disease risk score",
                color: palette.red,
                points: seq([
                  8, 10, 12, 15, 18, 22, 26, 30, 33, 38, 44, 52, 58, 64, 71, 69,
                  62, 55, 48, 40, 33, 28,
                ]),
              },
            ],
            caption:
              "Risk lags its driver by roughly two observations, because a pathogen needs a build-up period after conditions turn favourable. That lag is the actionable window — the scout alert fires inside it, while a preventive measure is still cheaper than a curative one.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Ranked candidates for a field visit",
            subtitle: "Top agents by current environmental plausibility, with their triggers",
            representative: true,
            max: 100,
            data: [
              {
                label: "Leaf-feeding caterpillar",
                value: 71,
                valueLabel: "71%",
                color: palette.red,
                note: "temperature band favourable for 4 observations · susceptible growth stage · tissue-damage signature in the north-east zone",
              },
              {
                label: "Bacterial leaf blight",
                value: 58,
                valueLabel: "58%",
                color: palette.amber,
                note: "sustained high humidity · leaf wetness after heavy rainfall · dense canopy restricting airflow",
              },
              {
                label: "Sap-sucking insect build-up",
                value: 44,
                valueLabel: "44%",
                color: palette.amber,
                note: "warm dry spell · new flush of growth · no rainfall to knock populations back",
              },
              {
                label: "Rust",
                value: 31,
                valueLabel: "31%",
                color: palette.cyan,
                note: "night temperature and dew point in range, but the duration threshold is not met yet",
              },
              {
                label: "Abiotic look-alike",
                value: 22,
                valueLabel: "22%",
                color: palette.violet,
                note: "heat and dryness can mimic disease symptoms — flagged so a spray decision is not made on a weather problem",
              },
            ],
            caption:
              "The last candidate matters as much as the first. Sun scorch and heat stress produce symptoms that look like disease, and a grower who sprays a weather problem has spent money and gained nothing — so abiotic look-alikes are ranked alongside the biological agents rather than left out.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "Risk, not identification",
          body:
            "The engine ranks agents the conditions favour; it does not see the pathogen. Every output is a scouting candidate with its evidence attached, so a field officer can confirm or dismiss it on the ground. Stating that boundary clearly is what makes the alerts trustworthy enough to act on.",
        },
      ],
    },

    // ─────────────────────────────────────────────── yield
    {
      id: "yield",
      nav: "Yield trajectory",
      heading: "Yield trajectory prediction",
      kicker: "Solution 07",
      blocks: [
        {
          kind: "prose",
          body: [
            "A yield figure delivered at harvest is a record. The same figure delivered three months earlier is a procurement plan, a credit decision, a storage booking and a chance to protect the crop while there is still something to protect. So the target is a trajectory that updates every observation, not a single end-of-season number.",
            "The reasoning follows the crop's own logic. Peak canopy sets the potential — the maximum the field could deliver given how much leaf area it built and how much light it intercepted. From flowering onward, the question becomes retention: how much of that potential actually survives to harvest. Each observation that shows stress, heat during a sensitive window, an unfavourable rainfall distribution or a widening spread between the field's best and worst zones applies a retention penalty. The biomass curve corroborates independently, since harvestable yield is a well-characterised fraction of accumulated dry matter for each crop.",
            "Two behaviours make the trajectory usable rather than merely available. Projections are deferred until the crop reaches late vegetative growth, because a yield number derived from a canopy that has not closed yet is guesswork dressed as a forecast — no artificial early ramp-up. And every projection is published as a band, not a point, with the band widening when the observation window was cloudy and locking as the crop reaches maturity.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "Projection and uncertainty, updated every observation",
            subtitle:
              "Deferred until late vegetative growth, then narrowing to a maturity lock",
            representative: true,
            yLabel: "tonnes / ha",
            xLabel: "days after sowing",
            height: 290,
            yDomain: [0, 7.5],
            xTicks: [8, 11, 14, 17, 20].map((x) => ({ x, label: `${das(x)}` })),
            series: [
              {
                name: "projected yield",
                color: palette.amber,
                band: true,
                points: [
                  { x: 8, y: 4.2, lo: 2.9, hi: 5.5, source: "fused" },
                  { x: 9, y: 4.6, lo: 3.4, hi: 5.8, source: "optical" },
                  { x: 10, y: 5.0, lo: 3.9, hi: 6.1, source: "optical" },
                  { x: 11, y: 5.3, lo: 4.3, hi: 6.3, source: "optical" },
                  { x: 12, y: 5.4, lo: 4.5, hi: 6.3, source: "optical" },
                  { x: 13, y: 5.2, lo: 4.0, hi: 6.4, source: "reconstructed" },
                  { x: 14, y: 5.1, lo: 3.9, hi: 6.3, source: "reconstructed" },
                  { x: 15, y: 5.3, lo: 4.6, hi: 6.0, source: "optical" },
                  { x: 16, y: 5.4, lo: 4.8, hi: 6.0, source: "optical" },
                  { x: 17, y: 5.4, lo: 4.9, hi: 5.9, source: "optical" },
                  { x: 18, y: 5.5, lo: 5.1, hi: 5.9, source: "optical" },
                  { x: 19, y: 5.5, lo: 5.2, hi: 5.8, source: "optical" },
                  { x: 20, y: 5.5, lo: 5.3, hi: 5.7, source: "optical" },
                  { x: 21, y: 5.5, lo: 5.3, hi: 5.7, source: "optical" },
                ],
              },
            ],
            caption:
              "The band widens across the two reconstructed observations rather than staying flatteringly narrow, then tightens and locks at maturity. A forecast whose uncertainty does not respond to the quality of what it was built from is not a forecast anyone should plan against.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The yield gap, attributed",
            subtitle: "Where the difference between potential and projection went",
            representative: true,
            max: 7,
            data: [
              {
                label: "Attainable potential",
                value: 6.8,
                valueLabel: "6.8 t/ha",
                color: palette.green,
                note: "set by peak canopy and intercepted light",
              },
              {
                label: "− water deficit",
                value: 0.7,
                valueLabel: "−0.7 t/ha",
                color: palette.cyan,
                note: "dry spell through early grain fill",
              },
              {
                label: "− heat at flowering",
                value: 0.4,
                valueLabel: "−0.4 t/ha",
                color: palette.red,
                note: "canopy temperature above tolerance in the critical window",
              },
              {
                label: "− nutrient shortfall",
                value: 0.2,
                valueLabel: "−0.2 t/ha",
                color: palette.amber,
                note: "nitrogen below sufficiency from mid-season",
              },
              {
                label: "= projected yield",
                value: 5.5,
                valueLabel: "5.5 t/ha",
                color: palette.green,
                note: "81% of attainable potential retained",
              },
            ],
            caption:
              "Attribution is what makes a yield number useful next season as well as this one. A grower who knows they lost 0.7 t/ha to a dry spell in early grain fill has a specific irrigation decision to make next year; a grower handed only a final number has nothing to act on.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── alerts & impact
    {
      id: "alerts",
      nav: "Alerts & impact",
      heading: "The output that matters: dated alerts with a measure attached",
      kicker: "Impact",
      blocks: [
        {
          kind: "prose",
          body: [
            "Every capability on this page exists to produce one thing — a short, dated, field-specific list of what is wrong, where in the field it is wrong, and what to do about it. An index chart is not a product. An alert that says water stress is developing in the eastern third of this field, irrigation is the correct response, and the window closes in about ten days is a product.",
            "Alerts are graded so attention goes where it pays. Preventive measures fire while a problem is still forming and while the cheap intervention still works. Mitigation measures fire once damage has begun, aimed at limiting the loss rather than reversing it. And where the satellite record was too cloud-broken to be confident, the system says so instead of issuing a confident alert — a grower who is sent to scout an imaginary problem stops reading alerts.",
          ],
        },
        {
          kind: "cards",
          columns: 2,
          title: "The alert catalogue",
          items: [
            {
              title: "Water stress developing",
              meta: "preventive · irrigation",
              body:
                "Leaf water signal falling with a negative water balance and rising evaporative demand, before whole-field vigour drops. Measure: irrigate the affected zones now; the same alert at severe stage becomes a mitigation call to protect what is left.",
              tone: "cyan",
            },
            {
              title: "Nutrient shortfall",
              meta: "preventive · fertiliser",
              body:
                "Canopy nutrition below sufficiency for the current stage, detected while the canopy still looks green. Measure: corrective top-dressing on the mapped zones — one of the few problems still fully fixable mid-season.",
              tone: "amber",
            },
            {
              title: "Pest or disease risk rising",
              meta: "preventive · scouting",
              body:
                "Conditions favouring specific agents for long enough to matter, with the susceptible growth stage confirmed. Measure: scout the named zones for the ranked candidates before deciding on any spray.",
              tone: "red",
            },
            {
              title: "Heat stress in a critical window",
              meta: "mitigation · expectation",
              body:
                "Canopy temperature above tolerance during flowering or fill. Often nothing can be done in-field, so the measure is to adjust the yield expectation and plan procurement and credit against the revised figure early.",
              tone: "red",
            },
            {
              title: "Growth behind trajectory",
              meta: "preventive · investigate",
              body:
                "Biomass accumulating below the expected curve with no single dominant stress signature. Measure: investigate stand, spacing and management before the reproductive window closes the correction opportunity.",
              tone: "neutral",
            },
            {
              title: "Waterlogging risk",
              meta: "mitigation · drainage",
              body:
                "Heavy rainfall with a surface moisture signal that is not clearing between observations. Measure: check drainage on the affected zones; standing water at the wrong stage costs both yield and root health.",
              tone: "cyan",
            },
            {
              title: "Ready to harvest",
              meta: "planning · timing",
              body:
                "Senescence and accumulated heat agreeing the crop is finishing, with a narrowing window. Measure: book labour, machinery and transport against a date rather than a guess.",
              tone: "green",
            },
            {
              title: "Yield outlook revised",
              meta: "planning · commercial",
              body:
                "Projection moved beyond its band since the last observation, with the cause attributed. Measure: update procurement, storage and credit positions on the new figure while there is still time to act on it.",
              tone: "green",
            },
          ],
        },
        {
          kind: "outcomes",
          title: "What the system delivers",
          items: [
            {
              metric: "Weeks",
              label: "Earlier detection",
              detail:
                "Stress and biomass divergence surface before the canopy visibly declines — while an in-season correction is still possible",
              tone: "green",
            },
            {
              metric: "Zone-level",
              label: "Targeted action",
              detail:
                "Affected areas mapped within a single field, so inputs go where they are needed instead of wall to wall",
              tone: "cyan",
            },
            {
              metric: "Typed",
              label: "Not just flagged",
              detail:
                "Water, nutrient, tissue damage or heat — because each one calls for a different response",
              tone: "cyan",
            },
            {
              metric: "All-weather",
              label: "Continuous through monsoon",
              detail:
                "Radar keeps the record intact when roughly half the season's optical observations are lost to cloud",
              tone: "green",
            },
            {
              metric: "Dated",
              label: "Harvest window",
              detail:
                "Ready-to-harvest alerts that let labour, machinery and transport be planned rather than guessed",
              tone: "amber",
            },
            {
              metric: "Attributed",
              label: "Yield outlook",
              detail:
                "A trajectory with an uncertainty band and the causes of every loss named",
              tone: "amber",
            },
            {
              metric: "No GIS",
              label: "Required of the user",
              detail:
                "A grower or field officer reads an alert; nobody opens a geospatial tool",
              tone: "green",
            },
            {
              metric: "Honest gaps",
              label: "When it cannot see",
              detail:
                "Cloud-broken windows are reported as unobserved rather than filled with a confident guess",
              tone: "neutral",
            },
          ],
        },
        {
          kind: "status",
          title: "What each capability on this page can actually be held to",
          intro:
            "Seven capabilities, and they are not equally well founded. Two rest on direct measurement, three on well-documented spectral relationships, and two are inferences reported as directional. Reading them as one product with one confidence is the most common way a monitoring system's weakest output ends up carrying its strongest claim.",
          items: [
            {
              verdict: "verified",
              claim:
                "Stressed-area percentage is a direct measurement, not a modelled estimate",
              evidence:
                "Each pixel is compared against the healthy population of the same field rather than against a regional model, so the field's own best half is the reference. That removes almost every source of between-field error at once, and it is the strongest number this system produces.",
            },
            {
              verdict: "verified",
              claim:
                "Crop cycle and harvest timing are read from the observed canopy trajectory",
              evidence:
                "Emergence, canopy closure, peak and senescence are events in the record rather than predictions from it. Heat accumulation explains why the same crop runs on a different calendar in a different season, which is what makes the harvest window a date rather than an average duration.",
            },
            {
              verdict: "defensible",
              claim:
                "Canopy nitrogen status from the red edge, against a dilution curve",
              evidence:
                "Well-documented spectral physiology: nitrogen is the building block of chlorophyll, and the red-edge position responds to leaf chlorophyll before the canopy visibly thins. Reported as a nutrition index against the curve for the crop's current biomass rather than as a concentration.",
            },
            {
              verdict: "defensible",
              claim: "Stress typing from reading several index families together",
              evidence:
                "Water, nutrient and tissue-damage stress leave different signatures — shortwave infrared, red edge, and pigment ratio respectively — and each call is corroborated against radar, the biomass curve and the weather context before it becomes an alert. Where those disagree the alert is downgraded rather than published.",
            },
            {
              verdict: "cold",
              claim: "Potassium status",
              evidence:
                "Potassium affects water relations and leaf margins and has reasonably documented index relationships, but they are weaker than the nitrogen case and more crop-specific. Published, and published as less certain than nitrogen.",
            },
            {
              verdict: "not-built",
              claim: "Soil chemistry, and a phosphorus concentration",
              evidence:
                "Phosphorus has no direct spectral signature at all. It is inferred from secondary pigment effects and stunted growth patterns and is published as directional only. Salinity, organic carbon and pH are soil property proxies that need exposed soil or an established crop response to say anything, and none of the four is a laboratory result.",
            },
            {
              verdict: "not-built",
              claim: "Identification of a pest or pathogen from orbit",
              evidence:
                "Declined by design and worth being explicit about, because it is the capability most often assumed. The satellite output ranks the agents that current weather, canopy state and growth stage are favouring — it never claims to see the organism. Identification is the photograph-based classifier's job, and the two are complementary rather than overlapping.",
            },
            {
              verdict: "deferred",
              claim: "A per-crop yield accuracy figure",
              evidence:
                "Blocked on ground truth rather than on modelling: harvest labels arrive once per plot per season. Which is precisely why yield is published as a band that narrows through the season rather than as a point estimate, and why the band is the deliverable rather than a hedge around one.",
            },
          ],
          note:
            "Charts on this page marked representative show the shape of an output on a field like the one described, at its real pixel budget and its real observation cadence. They are illustrations of mechanism, not measured exports.",
        },
        {
          kind: "callout",
          tone: "green",
          title: "Why the boundaries are stated as clearly as the capabilities",
          body:
            "Nutrient outputs are canopy status rather than soil chemistry. Pest and disease outputs are risk rather than identification. Yield is a band rather than a point. Cloud-broken windows are reported as unobserved. Every one of those limits is published alongside the result — because an advisory system a grower stops trusting has no value at all, and the fastest way to lose that trust is one confident alert about a problem that was never there.",
        },
      ],
    },
  ],
};
