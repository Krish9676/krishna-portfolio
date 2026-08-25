// lib/content/agenticLayer.ts — Agentic AI & Tool-Native Intelligence Layer.
//
// A capability showcase for design work: what an agent layer over agronomic
// models has to be able to do, and the constraints that shape it.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

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
      heading: "A monitoring system nobody can ask a question of is not intelligence",
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
          title: "Two rules, enforced by the architecture rather than by prompting",
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
              { label: "Data-quality contract", from: 2, to: 10, color: palette.cyanDim },
              { label: "Agent behaviour & tools", from: 10, to: 16, color: palette.amber },
              { label: "Tool surface, first cut", from: 14, to: 20, color: palette.amber },
              { label: "Credit intelligence", from: 8, to: 28, color: palette.violet },
              { label: "Agents in the field", from: 18, to: 28, color: palette.amber },
              { label: "Spatial hotspots", from: 20, to: 30, color: palette.cyan },
              { label: "Ground-truth capture loop", from: 12, to: 34, color: palette.green },
              { label: "Tool surface, production", from: 33, to: 40, color: palette.amber },
              { label: "Documentation & service levels", from: 38, to: 48, color: palette.muted },
            ],
            caption:
              "The ground-truth capture loop starts early and runs long on purpose. It produces nothing usable for months, and it is the only track whose absence cannot be fixed later — labels not collected in season one do not become available in season two.",
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
              detail: "What · why · confidence · action · confounders, on every domain answer",
              tone: "cyan",
            },
            {
              metric: "Enforced",
              label: "Refusal behaviour",
              detail: "Quality floors below which high-stakes advice is declined, not hedged",
              tone: "amber",
            },
            {
              metric: "Vendor-neutral",
              label: "Reasoning layer",
              detail: "Swappable by design, so no language-model provider becomes a dependency",
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
              detail: "What needs engineering effort separated from what is blocked on data nobody has collected",
              tone: "neutral",
            },
          ],
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
