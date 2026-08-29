// lib/content/agriChatbot.ts — Conversational Crop-Intelligence Assistant.
//
// A capability showcase for the translation layer over satellite analytics: one
// set of facts framed four ways, confidence expressed in words rather than
// decimals, and a structural inability to state a number nothing computed.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";

export const agriChatbot: ProjectDetail = {
  slug: "elai-agri-chatbot",
  pageTitle: "Conversational Crop-Intelligence Assistant",
  hideMeta: true,
  lede:
    "A conversational layer over satellite analytics — answering a plain question about a field with a plain answer, framed for whoever is asking, and never putting a number in a sentence that the analytics did not compute.",
  sections: [
    // ─────────────────────────────────────────────── overview
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
        {
          kind: "viz",
          spec: {
            kind: "dumbbell",
            title: "Where the interpretation cost sits",
            subtitle:
              "Time between an analytical output existing and a decision being taken on it",
            representative: true,
            domain: [0, 60],
            unit: " min",
            fromLabel: "reading the raw analytical output",
            toLabel: "asking the question in words",
            rows: [
              {
                label: "Farmer",
                from: 45,
                to: 2,
                note: "index charts to an irrigation decision",
                color: palette.green,
              },
              {
                label: "Field officer",
                from: 35,
                to: 3,
                note: "eighty fields down to twelve visits",
                color: palette.cyan,
              },
              {
                label: "Agronomist",
                from: 25,
                to: 9,
                note: "still needs the depth — just not the export step",
                color: palette.cyan,
              },
              {
                label: "Loan officer",
                from: 50,
                to: 5,
                note: "an agronomic output to a change in a position",
                color: palette.amber,
              },
            ],
            caption:
              "Representative of the shape of the change rather than a measured study; the honest status of this figure is set out in the impact section. The agronomist row is the one worth reading carefully: it improves least and should. An expert given a simplified summary loses the detail they needed and goes back to the raw output, so for that audience the gain is removing the export-and-interpret step rather than removing the detail.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── framing
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
          kind: "viz",
          spec: {
            kind: "matrix",
            title: "Which facts reach which audience",
            subtitle:
              "One stress finding on one field, and what each answer is built from",
            rowLabels: [
              "Affected area, as a share",
              "Where in the field",
              "Stress type, and what corroborates it",
              "Growth stage it began at",
              "Severity split across the field",
              "Weather context",
              "Against this field's prior seasons",
              "Against comparable fields",
              "Yield outlook, with its range",
              "How much of the window was observed",
              "Recommended action",
              "How long the action stays worth doing",
              "Change since the last observation",
              "Priority against the rest of the book",
            ],
            colLabels: ["Farmer", "Field officer", "Agronomist", "Loan officer"],
            levels: [
              { at: 0, color: "rgba(30,42,36,0.45)", label: "not surfaced" },
              { at: 1, color: "rgba(74,222,128,0.45)", label: "included" },
              { at: 2, color: palette.green, label: "leads the answer" },
            ],
            values: [
              [1, 1, 1, 1],
              [2, 1, 1, 0],
              [1, 1, 2, 0],
              [0, 0, 1, 1],
              [0, 1, 1, 0],
              [0, 0, 1, 1],
              [0, 0, 1, 1],
              [0, 1, 1, 0],
              [0, 0, 1, 2],
              [1, 1, 1, 1],
              [2, 1, 1, 0],
              [1, 2, 1, 0],
              [0, 1, 1, 1],
              [0, 2, 0, 1],
            ],
            caption:
              "Read this by column and the four audiences are visibly different products; read it by row and the important property appears — no row is ever contradicted between columns. Nobody is told a simplified version that disagrees with what somebody else was told, which is what makes it safe for a farmer and their loan officer to be looking at the same field on the same day. The farmer column is deliberately the sparsest and the confidence row is the only one that is never omitted from any of them.",
            representative: true,
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

    // ─────────────────────────────────────────────── confidence in words
    {
      id: "confidence",
      nav: "Confidence in words",
      heading: "Saying how sure it is, in language somebody can use",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "Every answer this layer gives is about a window of satellite observation, and the quality of those windows varies enormously and unpredictably. A clear fortnight gives a full multi-index reading. A monsoon fortnight gives cloud, a radar signal that sees canopy structure but not leaf colour, and a reconstructed estimate in between. The facts arriving at the narration layer look identical in both cases apart from one field, and that field decides whether there is an answer at all.",
            "The mistake almost every system makes here is reporting that field as a number. A decimal confidence is not an answer to a person: nobody knows what to do differently at 0.62 than at 0.71, so it gets ignored, and once it is ignored a reconstructed estimate is being acted on as though it were a measurement. Converting the tier into a sentence — this week was cloudy, so this is an estimate rather than a measurement — is what makes it change behaviour.",
            "Second, the tier governs what the answer may end on. A measurement can end on an action and a deadline. An estimate can end on an action with an instruction to verify in the field first. A window with nothing usable in it does not end on an action at all; it ends on the date of the next observation. That mapping is fixed, and it is applied before any wording is chosen rather than being left to the phrasing.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "stacked",
            title: "What a season of observation windows actually contains",
            subtitle:
              "Share of each month's observation opportunities, by what they yielded",
            representative: true,
            unit: "%",
            height: 280,
            categories: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            keys: [
              {
                key: "direct",
                label: "directly observed — full index reading",
                color: palette.green,
              },
              {
                key: "aw",
                label: "all-weather only — structure, not colour",
                color: palette.violet,
              },
              { key: "recon", label: "reconstructed", color: palette.cyanDim },
              { key: "none", label: "no usable observation", color: palette.faint },
            ],
            data: [
              [62, 18, 14, 6],
              [24, 34, 26, 16],
              [11, 38, 27, 24],
              [38, 27, 22, 13],
              [71, 14, 11, 4],
              [79, 11, 8, 2],
            ],
            caption:
              "Representative of a monsoon-season acquisition record. In August roughly one opportunity in nine yields a direct optical reading, and a quarter yield nothing at all — which is exactly when a grower most wants to know what is happening. This chart is the input to the wording: the assistant is not choosing to be vague in August, it is reporting a record that genuinely contains less.",
          },
        },
        {
          kind: "table",
          title: "How each tier is said, and what the answer may end on",
          keyColumn: true,
          intro:
            "The middle column is the actual deliverable of this project. The mapping is fixed and applied before wording is chosen, so the phrasing cannot drift toward confidence the record does not support.",
          head: [
            "Directly observed share of the window",
            "Tier",
            "How the answer says it",
            "What the answer may end on",
          ],
          rows: [
            [
              "Most of the window",
              "Measured",
              "\"About a third of your field is short of water.\"",
              "An action and a deadline",
            ],
            [
              "About half",
              "Estimated",
              "\"This week was partly cloudy, so this is an estimate rather than a measurement.\"",
              "An action, with an instruction to verify in the field first",
            ],
            [
              "A small part, all-weather signal current",
              "Structure only",
              "\"We can see the crop is still growing normally, but not whether the leaves are short of nitrogen.\"",
              "What can and cannot be said, and when the next look is due",
            ],
            [
              "Effectively none",
              "Cannot assess",
              "\"There was too much cloud this week to assess this field.\"",
              "The date of the next observation — and nothing else",
            ],
          ],
          note:
            "Note what the third row does: it answers part of the question and refuses the rest, in the same sentence. That is usually the most useful thing available under cloud, and it is impossible to express with a single confidence number attached to a whole answer.",
        },
      ],
    },

    // ─────────────────────────────────────────────── grounding
    {
      id: "grounding",
      nav: "Grounded answers",
      heading: "The rule this project established",
      kicker: "Solution 03",
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
            kind: "decision",
            title: "The gate that runs before any wording is chosen",
            subtitle:
              "Four outputs, and two of them are refusals rather than answers",
            gate: {
              inputLabel: "on every question asked",
              label:
                "Can this be answered from what the analytics actually established?",
              detail:
                "Two independent checks: does the question resolve to a field and an observation window, and did that window contain enough direct observation to support the domain being asked about.",
            },
            branches: [
              {
                condition:
                  "the subject resolves and the window was largely observed",
                share: "61%",
                outcome: "Grounded answer",
                emits:
                  "the measurement as computed, the confidence in words, an action, and the window in which the action stays worth doing",
                color: palette.green,
              },
              {
                condition:
                  "the subject resolves and the window was partly usable",
                share: "18%",
                outcome: "Answer, with the limit stated",
                emits:
                  "the same facts, said as an estimate rather than a measurement, plus an instruction to verify in the field before acting",
                color: palette.cyan,
              },
              {
                condition:
                  "too little of the window was usable for the domain asked about",
                share: "13%",
                outcome: "Cannot assess",
                emits:
                  "an explicit statement that the field could not be assessed this week, and the date of the next observation. Not a low score, and not a hedged version of an answer.",
                color: palette.amber,
                refuses: true,
              },
              {
                condition: "the question does not resolve to a field and a window",
                share: "8%",
                outcome: "One question back",
                emits:
                  "a single clarifying question — which field, which season, which part of it. Never a guess at the most likely field, which is how an answer ends up being correct about the wrong ground.",
                color: palette.violet,
                refuses: true,
              },
            ],
            note:
              "There is deliberately no branch producing a plausible-sounding answer from an empty result. That has to be structural rather than instructed: a model asked politely not to speculate will still speculate under a question it can almost answer, and the output will read exactly like the true version.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "funnel",
            title: "What happens to a hundred questions",
            subtitle: "Where each one leaves the full-confidence path, and why",
            representative: true,
            unit: "%",
            keepLabel: "still on the full-confidence path",
            dropLabel: "routed to a different kind of answer",
            stages: [
              {
                label: "Questions asked",
                value: 100,
                color: palette.faint,
                note: "in the asker's own words",
              },
              {
                label: "Subject resolved",
                value: 92,
                color: palette.cyan,
                note: "a field and a window",
                dropReason:
                  "'my field' from someone with several holdings, or a season the phrasing does not pin down. A single clarifying question goes back rather than a guess at the most likely field.",
              },
              {
                label: "Quality floor met",
                value: 79,
                color: palette.cyanDim,
                note: "for the domain being asked about",
                dropReason:
                  "too little of the window was directly observed. The answer states that the field could not be assessed and gives the next observation date — an answer, but not to the question that was asked.",
              },
              {
                label: "Answered at full confidence",
                value: 61,
                color: palette.green,
                note: "measurement, action, deadline",
                dropReason:
                  "the window was partly usable, so the same facts are said as an estimate and the answer ends on verify-then-act rather than on a deadline. Still useful, and deliberately worded so it cannot be mistaken for a measurement.",
              },
            ],
            note:
              "Only the first of these three is a question the system declines to answer. The other two receive real answers of a different kind — which is the distinction that gets lost when a system reports one confidence number and lets the reader decide what to do with it.",
          },
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

    // ─────────────────────────────────────────────── impact
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
              detail:
                "Farmer, field officer, agronomist and loan officer, from one set of facts",
              tone: "green",
            },
            {
              metric: "Faster",
              label: "Decisions",
              detail:
                "Less interpretation time between an analytical output and an action",
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
          kind: "status",
          title: "What is a design property here, and what is not yet measured",
          intro:
            "This project's claims are mostly architectural rather than numerical, and the one chart on the page that looks like a measurement is not one.",
          items: [
            {
              verdict: "shipped",
              claim: "One set of computed facts, four audience framings",
              evidence:
                "The audience matrix shows the mechanism: which facts lead and which are included changes per audience, and no fact is ever contradicted between them.",
            },
            {
              verdict: "shipped",
              claim: "Confidence is delivered as a sentence, not a decimal",
              evidence:
                "A fixed mapping from observed-window share to phrasing and to what the answer may end on, applied before any wording is chosen. Set out in full in the tier table.",
            },
            {
              verdict: "defensible",
              claim:
                "The narration layer cannot state a number the analytics did not compute",
              evidence:
                "Structural rather than instructed. It receives computed facts, a confidence tier and retrieval context, and is not given the ability to compute — so where the analytics returned nothing, there is nothing for a sentence to be built from.",
            },
            {
              verdict: "not-built",
              claim: "A plausible answer when the observation record is empty",
              evidence:
                "Declined by design, and it is the whole point. A fluent answer under an unobservable window is the most dangerous output available, because it is indistinguishable from the true version to the person reading it.",
            },
            {
              verdict: "not-built",
              claim: "Any arithmetic inside the conversational layer",
              evidence:
                "Deliberately absent. Once a narration layer can compute, it can produce a figure that no upstream system will recognise, and there is then no way to trace or contest it.",
            },
            {
              verdict: "deferred",
              claim: "A measured time-to-decision improvement",
              evidence:
                "The interpretation-cost chart is representative and is labelled as such. Establishing it properly needs instrumented before-and-after usage across all four audiences over a season, which is a study rather than an engineering task — and quoting a figure without it would be exactly the failure this project exists to prevent.",
            },
          ],
          note:
            "The observation-window composition chart is representative of a monsoon season's acquisition record rather than a specific measured one; its role is to show what the confidence tiers are computed from.",
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
