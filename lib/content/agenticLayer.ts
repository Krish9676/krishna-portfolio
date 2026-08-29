// lib/content/agenticLayer.ts — Agentic AI & Tool-Native Intelligence Layer.
//
// A capability showcase for design work: what an agent layer over agronomic
// models has to be able to do, and the constraints that shape it. This is the
// one page in the portfolio describing something specified rather than shipped,
// so the status block does most of the honest work and every chart is an
// argument about architecture rather than a measurement.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

const seq = (vals: number[]) =>
  vals.map((y, x) => ({ x, y, source: "optical" as const }));

const flat = (v: number, n: number) => seq(Array.from({ length: n }, () => v));

export const agenticLayer: ProjectDetail = {
  slug: "agentic-intelligence-layer",
  pageTitle: "Agentic AI & Tool-Native Intelligence Layer",
  hideMeta: true,
  lede:
    "An architecture for asking a field a question — five purpose-built advisory agents over grounded agronomic models, each answer carrying its own evidence and data-quality contract, and each agent able to refuse when observation cannot support the claim.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading:
        "A monitoring system nobody can ask a question of is not intelligence",
      blocks: [
        {
          kind: "prose",
          body: [
            "Crop monitoring produces a great deal of correct information: canopy trajectories, stress typing, nutrient status, yield projections, risk rankings. All of it is available to whoever runs the analysis and reads the output. None of it is available to a farmer at eight in the evening wondering whether to irrigate tomorrow, to a loan officer working through twenty files, or to a sourcing team deciding where to buy next month.",
            "The gap is not model quality. It is that the intelligence has no conversational surface and no way for another system to call it. A farmer should be able to ask what is wrong with a field and get an answer grounded in that field's actual measurements. A lender's own software should be able to request a risk view the same way it requests a credit bureau record. Neither requires a better model — both require an agent layer with tools, memory and a contract about what it is allowed to say.",
            "That is what this architecture specifies. It is design work rather than a shipped system, and it is presented as such: a specified agent suite, the evidence and quality contracts that make generated answers safe, and the sequencing that gets from a monitoring engine to a platform other systems build on.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "layers",
            title: "Four layers, and a rule between each of them",
            layers: [
              {
                name: "Model layer",
                role: "Carries the agronomic truth",
                color: palette.green,
                items: [
                  "crop health",
                  "stress & typing",
                  "pest & disease risk",
                  "nutrient status",
                  "yield trajectory",
                  "credit risk",
                  "spatial hotspots",
                ],
              },
              {
                name: "Evidence layer",
                role: "What · why · confidence · action · confounders",
                color: palette.cyan,
                items: [
                  "causal evidence graphs",
                  "data-quality contract",
                  "which measurements were used",
                  "confounder flags",
                  "counterfactuals",
                ],
              },
              {
                name: "Agent layer",
                role: "Answers and acts, using the models as tools",
                color: palette.amber,
                items: [
                  "farmer advisory",
                  "agronomy",
                  "credit & risk",
                  "sourcing",
                  "portfolio",
                  "orchestration",
                  "field-level memory",
                ],
              },
              {
                name: "Interface layer",
                role: "Any system can call it natively",
                color: palette.violet,
                items: [
                  "tool-native access",
                  "request & status",
                  "event notifications",
                  "portfolio batch",
                ],
              },
            ],
            caption:
              "The evidence layer is the one that does not exist in most designs, and the one that makes the rest safe. An agent that reads model outputs directly will eventually narrate a number the model never produced; an agent that can only read evidence graphs cannot.",
          },
        },
        {
          kind: "callout",
          tone: "green",
          title:
            "Two rules, enforced by the architecture rather than by prompting",
          body:
            "First: every model output and every agent answer carries a data-quality contract — how much of the observation window was usable, how much was reconstructed, how old the all-weather signal is. Under heavy cloud the agent must refuse a high-stakes claim rather than soften it. Second: generative models never produce a biophysical number. They consume results from the model layer and narrate what the evidence graph contains. A prompt asking politely for this is not a control; a layer that gives the model nothing else to work from is.",
        },
      ],
    },

    // ─────────────────────────────────────────────── agents
    {
      id: "agents",
      nav: "The agent suite",
      heading: "Five agents, because five audiences ask different questions",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "One general-purpose assistant over agricultural data sounds simpler and is worse. A farmer wants to know what to do about one field this week. An agronomist is triaging a hundred fields and needs to know which to visit first. A lender wants portfolio exposure and the reason behind a single borrower's score. A sourcing team wants supply signals for a district. These are not the same question asked differently — they need different tools, different depth, different framing, and different thresholds for when to speak at all.",
            "So the suite is specified as five agents sharing one model and evidence layer. Each has a defined mission, a tool set, and an audience. What they share is behaviour: review the field's own record rather than a regional average, compare against previous seasons, recommend action before risk becomes damage, always attach confidence, and refuse when data quality cannot support the answer.",
          ],
        },
        {
          kind: "cards",
          columns: 2,
          items: [
            {
              title: "Farmer advisory agent",
              meta: "farmers · field agents",
              body:
                "A personal agronomist for one holding: what the field's state is, why it is that way, and what to do before the next observation. Draws on health, stress, nutrient, pest risk and yield outlook, and delivers in the grower's own language. The agent that must be most cautious, because it is the one whose advice costs money to follow.",
              tone: "green",
            },
            {
              title: "Agronomy agent",
              meta: "agronomists · seed and input operations",
              body:
                "Depth across many fields at once: which need attention first, how each compares to its own previous seasons and to comparable fields, and where an intervention would pay. Triage rather than diagnosis.",
              tone: "cyan",
            },
            {
              title: "Credit & risk agent",
              meta: "lenders · insurers",
              body:
                "Field and portfolio risk with trends, factor explanations and scenario views. The agent where the quality contract matters most — a credit claim made on an unobserved window is worse than no claim, and this is the one place where refusing to answer is unambiguously the right behaviour.",
              tone: "amber",
            },
            {
              title: "Sourcing agent",
              meta: "buyers · input retailers",
              body:
                "Supply and demand signals for the current cycle rather than for last season: where crop is developing well, where input need is emerging, which districts are heading for a short harvest.",
              tone: "cyan",
            },
            {
              title: "Portfolio agent",
              meta: "operations teams",
              body:
                "Rollups across a region or a book of fields, watch lists, and notifications on threshold events — the surface an operations team lives in rather than visits.",
              tone: "green",
            },
            {
              title: "Shared behaviour",
              meta: "all five",
              body:
                "Read the field's own record. Compare seasons. Recommend before damage. Attach confidence to everything. Refuse when quality is unusable. Agents may propose actions — raise a scouting task, flag a watch list, request a soil test — but carrying them out stays with the systems and people who own those actions.",
              tone: "neutral",
            },
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "matrix",
            title: "Which tools each agent is granted",
            subtitle:
              "One shared model layer, five scoped tool sets — the zeros are the design",
            rowLabels: [
              "Run or refresh a field",
              "Field summary",
              "Observation timeline",
              "Data-quality status",
              "Pest & disease risk",
              "Nutrient status",
              "Stress & typing",
              "Yield outlook",
              "Compare seasons",
              "Evidence graph",
              "Counterfactuals",
              "Score a field",
              "Score a portfolio",
              "Record an observation",
              "Confirm or dismiss an alert",
            ],
            colLabels: [
              "Farmer advisory",
              "Agronomy",
              "Credit & risk",
              "Sourcing",
              "Portfolio",
            ],
            levels: [
              { at: 0, color: "rgba(30,42,36,0.45)", label: "not granted" },
              { at: 1, color: "rgba(74,222,128,0.45)", label: "available" },
              { at: 2, color: palette.green, label: "core to the mission" },
            ],
            values: [
              [1, 2, 1, 0, 2],
              [2, 2, 1, 0, 2],
              [1, 2, 1, 0, 1],
              [1, 1, 2, 1, 1],
              [2, 2, 0, 1, 1],
              [2, 2, 0, 1, 0],
              [2, 2, 1, 1, 1],
              [1, 2, 2, 2, 1],
              [1, 2, 2, 1, 1],
              [1, 2, 2, 1, 0],
              [0, 2, 2, 0, 0],
              [0, 0, 2, 0, 1],
              [0, 0, 2, 1, 2],
              [1, 2, 0, 0, 1],
              [1, 2, 0, 0, 2],
            ],
            caption:
              "The empty cells carry more of the design than the full ones. The farmer advisory agent is not granted the credit tools — not because reaching them would be hard but because an agent that can read a borrower's score will eventually mention it to the borrower, and no amount of prompt discipline reliably prevents that. Equally, the credit agent has no access to pest or nutrient tools: a lender does not need agronomy, and handing an agent capabilities outside its mission is how a specific system turns into a general one that is worse at everything.",
            note:
              "The data-quality row is the only one available to all five agents. Refusal behaviour cannot be optional for any of them, so the tool that reports observation quality cannot be scoped away.",
            representative: true,
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Each agent's quality floor is different, on purpose",
            subtitle:
              "Minimum directly-observed share of a window before the agent's highest-stakes claim is permitted",
            representative: true,
            max: 100,
            unit: "%",
            data: [
              {
                label: "Credit & risk",
                value: 75,
                valueLabel: "75%",
                color: palette.red,
                note: "the highest floor: a score computed on an unobserved window is relied on financially by someone with no way to check it",
              },
              {
                label: "Farmer advisory",
                value: 65,
                valueLabel: "65%",
                color: palette.amber,
                note: "its advice costs money to follow — a spray or a fertiliser recommendation is an expense, not an opinion",
              },
              {
                label: "Agronomy",
                value: 45,
                valueLabel: "45%",
                color: palette.cyan,
                note: "triage tolerates more uncertainty, because the output is where to look rather than what to buy",
              },
              {
                label: "Sourcing",
                value: 40,
                valueLabel: "40%",
                color: palette.cyan,
                note: "district-scale aggregation averages out what a single cloudy window costs",
              },
              {
                label: "Portfolio",
                value: 30,
                valueLabel: "30%",
                color: palette.green,
                note: "rollups and watch lists degrade gracefully, and a field with no assessment is reported as having none",
              },
            ],
            caption:
              "The ordering is by what an error costs, not by how good the data is. Same model layer, same evidence graphs, five different floors — and the credit agent sits highest because it is the only one whose output someone acts on financially without the ability to walk into the field and check. This is also why a global confidence threshold is the wrong design: set it at the credit agent's floor and the portfolio agent goes silent for months; set it at the portfolio agent's and the credit agent starts scoring monsoon weeks.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── evidence
    {
      id: "evidence",
      nav: "Evidence graphs",
      heading: "Evidence graphs — making an answer safe to generate",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "A multi-stage agronomic model produces a conclusion through a chain of reasoning, and by the time it reaches an output the chain has been discarded. Stress severity is high — because a canopy water signal fell, during a stage where that matters, while the weather record showed evaporative demand rising, and the all-weather signal agreed the surface was drying. All of that context is what makes the conclusion useful, and all of it is normally thrown away.",
            "An evidence graph keeps it. Every domain answers a fixed set of questions: what was found, why, with what confidence, what to do about it, and what could confound the reading. That structure serves two purposes. It gives a human the reasoning they need to agree or disagree with the system. And it gives a language model something safe to narrate — because an agent that can only speak from an evidence graph is structurally unable to invent a figure, whereas an agent handed raw model output eventually will.",
            "The confounder field is the one that earns its place. Heat and drought produce symptoms that mimic disease. A nutrient reading taken over incomplete canopy cover is partly measuring soil. An unusual variety departs from every expected trajectory without anything being wrong. Recording the plausible alternative explanation alongside the conclusion is what stops an advisory system from confidently recommending a spray for a weather problem.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "What every domain answer has to contain",
            stages: [
              {
                n: "01",
                name: "What",
                produces:
                  "The conclusion, stated plainly and bounded — stressed area, nutrient status, ranked risk, projected yield with its interval.",
                kind: "config",
              },
              {
                n: "02",
                name: "Why",
                produces:
                  "The chain that produced it: which measurements moved, in which direction, at which growth stage, and which independent signals corroborated.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Confidence",
                produces:
                  "How much of the window was directly observed, how much reconstructed, how old the all-weather signal is — and the resulting tier the agent must respect.",
                kind: "repair",
              },
              {
                n: "04",
                name: "Action",
                produces:
                  "The preventive or mitigating measure, scoped to the affected zone, with the window in which it is still worth doing.",
                kind: "model",
              },
              {
                n: "05",
                name: "Confounders",
                produces:
                  "The plausible alternative explanations, named. Heat mimicking disease, incomplete canopy cover distorting a nutrient reading, an atypical variety departing from expectation.",
                kind: "publish",
              },
            ],
            note:
              "An agent is permitted to narrate from this structure and from nothing else. That constraint is what makes generated advice about a real field defensible.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "decision",
            title: "What a generative model is allowed to read",
            subtitle:
              "The boundary between the model layer and the agent layer, as a gate",
            gate: {
              inputLabel: "between the model layer and any agent",
              label: "Is there an evidence graph, and does its tier clear the floor?",
              detail:
                "The gate is on the input side rather than the output side. Checking a generated answer for invented figures is a losing game; not giving the generator anything to invent from is not.",
            },
            branches: [
              {
                condition: "a complete evidence graph, tier above the agent's floor",
                outcome: "Narrate from the graph",
                emits:
                  "an answer assembled only from what, why, confidence, action and confounders. The model has no arithmetic and no path to raw outputs, so there is nothing available to fabricate from.",
                color: palette.green,
              },
              {
                condition:
                  "a complete graph, but a named confounder could explain the conclusion",
                outcome: "Narrate both, with the confounder named",
                emits:
                  "the conclusion and the plausible alternative together — heat mimicking disease, incomplete cover distorting a nutrient reading — so the human decides between them rather than the agent quietly picking one",
                color: palette.cyan,
              },
              {
                condition: "a graph exists but its tier is below the agent's floor",
                outcome: "Narrate the refusal, not the finding",
                emits:
                  "that the field could not be assessed for this domain, why, and the next observation date. The finding is not softened and not mentioned — a hedged version of a claim below its floor is still that claim.",
                color: palette.amber,
                refuses: true,
              },
              {
                condition: "raw model output, with no evidence graph",
                outcome: "Not readable by any agent",
                emits:
                  "nothing at all. This branch is the architecture: an agent handed raw model output will eventually narrate a figure the model never produced, and the only reliable prevention is that the path does not exist.",
                color: palette.red,
                refuses: true,
              },
            ],
            note:
              "Three of these four branches constrain what may be said, and the fourth removes an option entirely. That ratio is roughly right for any generative layer sitting over measurements someone will act on.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── quality
    {
      id: "quality",
      nav: "Quality contracts",
      heading: "Data-quality contracts — knowing when to refuse",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "The hardest design constraint in satellite agriculture is that observation quality varies enormously and unpredictably. A clear week gives a full multi-index reading with high confidence. A monsoon fortnight gives cloud, an all-weather signal that sees structure but not colour, and a reconstructed estimate. Both arrive through the same interface, and an agent that treats them identically will eventually give confident fertiliser or spray advice built on a window it could not see.",
            "So quality is a contract rather than a footnote. Every answer carries how much of its window was directly observed, how much was reconstructed, how stale the all-weather signal is, and the resulting tier. Agents are bound by that tier: high-stakes recommendations require a quality floor, and below it the correct behaviour is to say the field could not be assessed rather than to hedge the wording of an answer it should not be giving.",
            "This is also why spatial products freeze rather than interpolate. A hotspot map generated from reconstructed pixels would show texture that was never measured, in the most visually persuasive format available. Carrying an as-of date and holding the last observed map is the honest alternative.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "cadence",
            title: "Why quality has to be a first-class field",
            subtitle: "One season of what is actually available to observe with",
            days: 120,
            sources: [
              {
                label: "Optical",
                note: "colour & chlorophyll",
                color: palette.green,
                hits: [0, 5, 10, 30, 35, 90, 95, 100, 105, 110, 115, 120],
                blocked: [15, 20, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
              },
              {
                label: "All-weather",
                note: "structure, through cloud",
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
              "Open circles are observations that exist but are unusable. Through the middle of this season there are thirteen consecutive blocked optical passes and three all-weather looks — a period where an agent can honestly discuss canopy structure and must decline to discuss leaf chlorophyll.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "timeseries",
            title: "The same field, answerable for one audience and not another",
            subtitle:
              "Directly observed share of each window across a year, against two agents' floors",
            representative: true,
            yLabel: "window directly observed (%)",
            xLabel: "observation window (fortnightly)",
            yDomain: [0, 100],
            height: 320,
            xTicks: [0, 4, 8, 12, 16, 20, 23].map((x) => ({
              x,
              label: `${x + 1}`,
            })),
            events: [
              { x: 3, label: "credit floor breached", color: palette.red },
              { x: 14, label: "both floors recovered", color: palette.green },
            ],
            series: [
              {
                name: "directly observed share",
                color: palette.green,
                points: seq([
                  88, 85, 80, 72, 58, 40, 25, 14, 10, 8, 12, 22, 38, 55, 70, 80,
                  86, 90, 92, 90, 88, 85, 82, 80,
                ]),
              },
              {
                name: "credit & risk floor — 75%",
                color: palette.red,
                dash: "6 4",
                points: flat(75, 24),
              },
              {
                name: "farmer advisory floor — 65%",
                color: palette.amber,
                dash: "3 3",
                points: flat(65, 24),
              },
            ],
            caption:
              "For roughly ten of these twenty-four windows the credit agent cannot produce a score at all, and for eight of them the advisory agent cannot recommend an input purchase. That is not a system failure — it is the observation record, and the alternative is a credit score computed from reconstructed pixels during a monsoon. The narrow band between the two dashed lines is the interesting part: in those windows the same field is simultaneously answerable for one audience and not for another, which is precisely why the floors are per agent rather than global.",
            note:
              "The portfolio agent's floor of 30% is off the bottom of the useful reading here: it stays answerable through almost the whole season, and reports the fields it could not assess as unassessed rather than going quiet.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "funnel",
            title: "What happens to a hundred tool calls",
            subtitle:
              "Each gate is a different reason an answer is a refusal instead",
            representative: true,
            unit: "%",
            keepLabel: "answerable at full confidence",
            dropLabel: "routed to a refusal, with the reason",
            stages: [
              {
                label: "Requests received",
                value: 100,
                color: palette.faint,
                note: "from partner systems",
              },
              {
                label: "Field resolved and in scope",
                value: 96,
                color: palette.cyan,
                note: "known field, entitled caller",
                dropReason:
                  "unknown field, or a field outside what the caller is entitled to. Returned as an explicit scope error rather than as an empty result, which a consumer would otherwise render as 'no problems found'.",
              },
              {
                label: "An observation window exists",
                value: 91,
                color: palette.cyanDim,
                note: "an acquisition in the period",
                dropReason:
                  "no acquisition at all in the requested period. Reported as no new assessment — never as the previous period's figure repeated, which is how a stale number acquires a fresh date.",
              },
              {
                label: "Evidence graph produced",
                value: 84,
                color: palette.violet,
                note: "for the domain asked about",
                dropReason:
                  "the domain's own model declined — a nutrient reading over incomplete canopy cover, for instance, would be substantially measuring soil. The refusal originates in the model layer, not in the agent.",
              },
              {
                label: "Quality floor met",
                value: 68,
                color: palette.green,
                note: "for the asking agent",
                dropReason:
                  "the tier is below this agent's floor. Narrated as a refusal with the next observation date — and the same window may clear a different agent's floor, so this is a per-caller outcome rather than a property of the data.",
              },
            ],
            note:
              "All five outcomes are successful responses; only the last contains a figure. A tool surface where a refusal looks like an error teaches every consumer to retry until something comes back, which converts a careful architecture into a slower one with the same failure mode.",
          },
        },
        {
          kind: "table",
          title: "What each agent must do under each data condition",
          keyColumn: true,
          head: ["Observation condition", "Required agent behaviour"],
          rows: [
            [
              "Clear window",
              "Full multi-index analysis; answer at full confidence across every domain",
            ],
            [
              "Cloudy or partially usable",
              "Answer from all-weather signal, last valid observation and weather; lower the stated confidence and soften input and credit escalation",
            ],
            [
              "All-weather signal stale",
              "Mark it stale and prefer optical plus weather; do not present structure conclusions as current",
            ],
            [
              "Extended cloud period",
              "Flag the window as heavily reconstructed and refuse high-stakes claims outright — a spray or fertiliser recommendation is not a hedged answer",
            ],
            [
              "No usable observation",
              "Report that there is no new assessment. Do not produce a score.",
            ],
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── tool access
    {
      id: "tools",
      nav: "Native tool access",
      heading: "Native tool access — intelligence another system can call",
      kicker: "Solution 04",
      blocks: [
        {
          kind: "prose",
          body: [
            "The structural bet in this architecture is that agricultural intelligence should be callable the way any other capability is callable. A lender's underwriting software, a cooperative's field app, an assistant a farmer already uses — none of them should need a bespoke integration, and none of them should have to be rebuilt by the intelligence provider. Exposing a defined tool surface means each of those systems asks its own questions in its own interface.",
            "That decision has a consequence worth naming: this architecture deliberately builds no user interface at all. Partner applications own their screens. Building them would mean competing with the customers, and it would divert effort from the only part that is genuinely hard to replicate — the grounded models and the evidence layer underneath them.",
            "Field-level memory is what makes the tool surface more than a query API. Holding the current season's observations alongside previous seasons' summaries, confirmations from the ground and eventual outcomes lets an agent answer comparative questions — is this field doing better than last year, did the intervention we recommended work — without needing a global historical archive on day one.",
          ],
        },
        {
          kind: "stack",
          title: "The capability surface",
          groups: [
            {
              label: "Assess & read",
              items: [
                "run or refresh a field",
                "field summary",
                "observation timeline",
                "data-quality status",
              ],
            },
            {
              label: "Domain questions",
              items: [
                "pest & disease risk",
                "nutrient status",
                "stress & typing",
                "yield outlook",
                "compare seasons",
              ],
            },
            {
              label: "Explain",
              items: ["evidence graph for any domain answer", "counterfactuals"],
            },
            {
              label: "Credit",
              items: ["score a field", "score a portfolio"],
            },
            {
              label: "Write back",
              items: ["record a field observation", "confirm or dismiss an alert"],
            },
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "The lifecycle of one tool call",
            subtitle:
              "Where the quality contract sits in the sequence, and why it is third",
            stages: [
              {
                n: "01",
                name: "A partner system asks",
                produces:
                  "A defined tool call from a lender's underwriting software, a cooperative's field app or an assistant a farmer already uses. No bespoke integration, and no screen owned on this side of the boundary.",
                kind: "config",
              },
              {
                n: "02",
                name: "Resolve the subject and the entitlement",
                produces:
                  "Which field, which observation period, and whether this caller is entitled to it — settled before any analysis runs, so an unauthorised request never becomes a computed answer.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Return the quality contract first",
                produces:
                  "Observed share, reconstructed share, all-weather signal age and the resulting tier — sent whether or not the caller asked for it. A consumer that cannot see the tier will use the value as though it were measured, every time.",
                kind: "repair",
              },
              {
                n: "04",
                name: "Answer, or decline",
                produces:
                  "The domain answer with its evidence graph, or an explicit refusal carrying the next observation date. Both are successful responses, and a tool surface that returns errors for refusals trains its consumers to retry until something arrives.",
                kind: "model",
              },
              {
                n: "05",
                name: "Record what came back from the ground",
                produces:
                  "The write path: what a field officer actually found when they followed an alert, and whether the recommended action worked. Every advisory becomes a potential training label.",
                kind: "publish",
              },
            ],
            note:
              "Step three before step four is the whole ordering argument. A quality tier delivered alongside a value gets read; a quality tier a caller has to request separately does not exist as far as most integrations are concerned.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "Write-back is the quiet long-term play",
          body:
            "Recording what a field officer actually found when they followed an alert turns every advisory into a potential training label. That is the cheapest available route out of the sparse-ground-truth problem that constrains every capability in this portfolio — and it only works if the write path exists from the beginning rather than being added once someone notices the labels would have been useful.",
        },
      ],
    },

    // ─────────────────────────────────────────────── roadmap
    {
      id: "roadmap",
      nav: "Sequencing",
      heading: "Sequencing — what has to exist before what",
      kicker: "Solution 05",
      blocks: [
        {
          kind: "prose",
          body: [
            "The dependency order is the useful part of a plan like this. Evidence graphs and quality contracts have to exist before any agent can safely answer, because they are the only thing standing between a language model and a confidently invented number. Agents have to be answering before a pilot is meaningful. And a pilot has to have run before the tool surface can be offered to anyone as a product rather than as a prototype.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "roadmap",
            title: "Dependency-ordered programme",
            subtitle: "Build the constraints first, then the agents, then the surface",
            weeks: 48,
            tranches: [
              { label: "Build", from: 0, to: 16 },
              { label: "Pilot", from: 16, to: 32 },
              { label: "Scale", from: 32, to: 48 },
            ],
            tracks: [
              { label: "Model layer depth", from: 1, to: 14, color: palette.green },
              { label: "Evidence graphs", from: 4, to: 18, color: palette.cyan },
              {
                label: "Data-quality contract",
                from: 2,
                to: 10,
                color: palette.cyanDim,
              },
              {
                label: "Agent behaviour & tools",
                from: 10,
                to: 16,
                color: palette.amber,
              },
              {
                label: "Tool surface, first cut",
                from: 14,
                to: 20,
                color: palette.amber,
              },
              {
                label: "Credit intelligence",
                from: 8,
                to: 28,
                color: palette.violet,
              },
              { label: "Agents in the field", from: 18, to: 28, color: palette.amber },
              { label: "Spatial hotspots", from: 20, to: 30, color: palette.cyan },
              {
                label: "Ground-truth capture loop",
                from: 12,
                to: 34,
                color: palette.green,
              },
              {
                label: "Tool surface, production",
                from: 33,
                to: 40,
                color: palette.amber,
              },
              {
                label: "Documentation & service levels",
                from: 38,
                to: 48,
                color: palette.muted,
              },
            ],
            caption:
              "The ground-truth capture loop starts early and runs long on purpose. It produces nothing usable for months, and it is the only track whose absence cannot be fixed later — labels not collected in season one do not become available in season two.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "The distinction that makes this plan resourceable",
            subtitle:
              "Elapsed time to a usable result, and what the time is actually spent on",
            representative: true,
            max: 66,
            unit: " wks",
            data: [
              {
                label: "Data-quality contract",
                value: 4,
                valueLabel: "4 wks",
                color: palette.green,
                note: "engineering — the plumbing is small; the discipline of honouring it everywhere is the hard part",
              },
              {
                label: "Evidence graph schema",
                value: 6,
                valueLabel: "6 wks",
                color: palette.green,
                note: "engineering — a fortnight of design, four of implementation across the domains",
              },
              {
                label: "Agent behaviour & tool surface",
                value: 8,
                valueLabel: "8 wks",
                color: palette.green,
                note: "engineering — five missions, five tool scopes, five quality floors",
              },
              {
                label: "Spatial hotspot layers",
                value: 10,
                valueLabel: "10 wks",
                color: palette.green,
                note: "engineering, including the deliberate refusal to interpolate over reconstructed pixels",
              },
              {
                label: "Credit intelligence",
                value: 20,
                valueLabel: "20 wks",
                color: palette.amber,
                note: "split: the score is buildable now, its validation against repayment outcomes is not",
              },
              {
                label: "Ground-truth capture loop",
                value: 34,
                valueLabel: "34 wks",
                color: palette.cyan,
                note: "engineering that yields nothing for months — and the one track that cannot be started later",
              },
              {
                label: "Pest & disease risk validation",
                value: 52,
                valueLabel: "52 wks",
                color: palette.red,
                note: "blocked on data — needs confirmed scouting outcomes, which needs the write-back loop running for a full season first",
              },
              {
                label: "Per-crop yield validation",
                value: 60,
                valueLabel: "60 wks",
                color: palette.red,
                note: "blocked on data — one harvest label per plot per season makes this seasons rather than sprints, and no team size changes it",
              },
            ],
            caption:
              "This is the chart that turns the roadmap above into something a budget can be attached to. Two items on a plan can look identical and be entirely different propositions: the evidence graph schema is six weeks of engineering and can be compressed by adding people, while per-crop yield validation is two growing seasons of ground truth and cannot be compressed by anything. The red rows are not slower engineering — they are not engineering. A plan that does not separate them will be wrong about its own timeline from the first week, and it will be wrong in the direction of promising the unpromisable.",
            note:
              "The cyan row is the awkward middle case and the one most often cut: engineering effort, no visible output for months, and a cost of delay that is invisible until the season it was supposed to be collecting has passed.",
          },
        },
        {
          kind: "highlights",
          title: "Deliberate refusals in the plan",
          items: [
            {
              title: "No claim to a large historical label archive",
              body:
                "The plan does not pretend to years of global labelled ground truth. It specifies how to grow a verified regional archive deliberately, starting from the write-back path and the ground-truth loop, and it sizes every model ambition against what that will actually yield.",
            },
            {
              title: "No user interface",
              body:
                "Consumer interface contracts are specified — what a farmer app, a retailer system and a lender's software should be able to ask for — but the screens belong to the partner.",
            },
            {
              title: "Machine learning only where labels can support it",
              body:
                "Learned models are specified for the places where labels exist or can be collected. Physically grounded models and rules stay primary everywhere else, rather than being replaced with something fashionable that cannot be validated.",
            },
            {
              title: "Spatial products freeze rather than interpolate",
              body:
                "Hotspot and management-zone layers carry an as-of date on cloudy intervals instead of generating spatial texture from reconstructed pixels.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── impact
    {
      id: "impact",
      nav: "What it is",
      heading: "What this work demonstrates",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "5",
              label: "Agents specified",
              detail: "Mission, tool set, audience and refusal behaviour for each",
              tone: "green",
            },
            {
              metric: "5-part",
              label: "Evidence contract",
              detail:
                "What · why · confidence · action · confounders, on every domain answer",
              tone: "cyan",
            },
            {
              metric: "Enforced",
              label: "Refusal behaviour",
              detail:
                "Quality floors below which high-stakes advice is declined, not hedged",
              tone: "amber",
            },
            {
              metric: "Vendor-neutral",
              label: "Reasoning layer",
              detail:
                "Swappable by design, so no language-model provider becomes a dependency",
              tone: "cyan",
            },
            {
              metric: "Dependency",
              label: "Ordered plan",
              detail: "Constraints before agents, agents before pilot, pilot before product",
              tone: "green",
            },
            {
              metric: "Named",
              label: "Every gap",
              detail:
                "What needs engineering effort separated from what is blocked on data nobody has collected",
              tone: "neutral",
            },
          ],
        },
        {
          kind: "status",
          title: "The honest status of everything on this page",
          intro:
            "This is the one project in the portfolio that is a specification rather than a running system, and the temptation on a page like this is to let the diagrams imply otherwise. So it is stated plainly, item by item.",
          items: [
            {
              verdict: "not-built",
              claim: "The system this page describes",
              evidence:
                "Design and product-strategy work. No agent, tool surface or evidence-graph implementation described here is running, and the deliverable is the specification and the sequencing rather than a description of something in production. Every chart on the page is an argument about architecture.",
            },
            {
              verdict: "defensible",
              claim:
                "An evidence layer is what makes a generated answer about a real field safe",
              evidence:
                "The argument is structural rather than empirical: a model handed raw outputs has the material to fabricate a figure, and one that can only read a fixed five-field graph does not. This is the same rule the conversational assistant established in production, generalised.",
            },
            {
              verdict: "defensible",
              claim: "Quality floors belong per agent, not globally",
              evidence:
                "Shown in the observation-share chart: a single global threshold either silences the portfolio agent for months or lets the credit agent score monsoon weeks. The floors are ordered by what an error costs, and no single number can express that.",
            },
            {
              verdict: "defensible",
              claim:
                "Scoping tool access per agent is a safety control, not tidiness",
              evidence:
                "The empty cells in the access matrix are the point. An agent able to reach a credit score will eventually mention it to the borrower, and prompt discipline does not reliably prevent that where a capability exists.",
            },
            {
              verdict: "not-built",
              claim: "Any user interface",
              evidence:
                "Deliberately absent and specified as absent. Consumer contracts define what a partner app should be able to ask for; building the screens would mean competing with the customers and would divert effort from the models and the evidence layer, which is the part that is hard to replicate.",
            },
            {
              verdict: "not-built",
              claim: "A large historical labelled archive",
              evidence:
                "Not claimed anywhere. The plan specifies how to grow a verified regional archive from the write-back path, and every model ambition in it is sized against what that will actually yield rather than against what would be convenient.",
            },
            {
              verdict: "deferred",
              claim: "Per-crop yield and pest-risk validation",
              evidence:
                "Blocked on data collection rather than on effort — one harvest label per plot per season, and confirmed scouting outcomes that require the write-back loop to have run for a season first. The effort chart separates these from the engineering tracks precisely so a plan built on this page does not promise them.",
            },
          ],
          note:
            "The percentages in the tool-call funnel and the observation-share series are representative of the shape of the problem, chosen to be consistent with the acquisition record shown in the cadence strip. They are not measurements of a running system, because there is not one.",
        },
        {
          kind: "prose",
          body: [
            "This is the architecture and product-strategy half of the portfolio: looking at a working system, seeing what it would take to make it something other people build on, and writing that down honestly enough that it can be resourced rather than merely admired.",
            "The most useful line in the whole document is the separation between what needs effort and what needs data. Two items on a roadmap can look identical and be completely different propositions — one is a fortnight of engineering, the other is two seasons of ground truth nobody has started collecting. A plan that does not distinguish them is a plan that will be wrong about its own timeline from the first week.",
          ],
        },
      ],
    },
  ],
};
