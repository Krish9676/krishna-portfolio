// lib/content/pestDisease.ts — Pest & Disease Identification System.
//
// A capability showcase for close-range diagnosis: a wide, long-tailed label
// space, an explanation that ships with every answer, a confidence that means
// what it says, and four permitted outputs of which two are deliberately less
// specific than the model could produce.

import { parseGrid } from "@/lib/gridArt";
import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";
import { labelSpaceBefore, trainableFloor } from "./curves";

// ── Saliency over a diagnosed leaf: the credible case ──────────────────
// Heat concentrated on the lesion and its margin.
const saliencyGood = [
  "0000111000",
  "0011222100",
  "0112333210",
  "1123444321",
  "1234444321",
  "1233444210",
  "0122333100",
  "0011221000",
];

// ── The same output shape, on a diagnosis nobody should act on ─────────
// Heat around the frame with a cold centre: the model has learned something
// about how these photographs were taken, not about the disease in them.
const saliencyBad = [
  "3444444443",
  "4322222234",
  "4200000024",
  "4200000024",
  "4200000024",
  "4200000024",
  "4322222234",
  "3444444443",
];

const saliencyStops = [
  { at: 0, color: "rgba(56,182,217,0.22)", label: "no influence" },
  { at: 1, color: "rgba(56,182,217,0.55)", label: "low" },
  { at: 2, color: palette.cyan, label: "moderate" },
  { at: 3, color: palette.amber, label: "high" },
  { at: 4, color: palette.red, label: "decisive" },
];

export const pestDisease: ProjectDetail = {
  slug: "pest-disease-identification",
  pageTitle: "Pest & Disease Identification System",
  hideMeta: true,
  lede:
    "Identifying a crop pest or disease from a single photograph across 300+ classes — while showing which part of the image drove the answer, reporting its own confidence, and explaining the next step in language a grower can act on.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading:
        "A diagnosis nobody can check is a diagnosis nobody should act on",
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
        {
          kind: "viz",
          spec: {
            kind: "rankcurve",
            title: "The same 300 classes, plotted one per class",
            subtitle:
              "Usable images available per class, from manual dataset assembly",
            representative: true,
            xLabel: "class, ranked by how many usable images exist",
            yLabel: "usable images available",
            height: 320,
            domainMax: 4000,
            domainMin: 1,
            regions: [
              { from: 0, to: 40, label: "head" },
              { from: 40, to: 140, label: "mid-distribution" },
              { from: 140, to: 299, label: "long tail" },
            ],
            threshold: {
              at: trainableFloor,
              label: `${trainableFloor} images — below this a class is not worth training alone`,
              countLabel: "classes below the floor",
            },
            series: [
              {
                name: "usable images per class",
                color: palette.amber,
                values: labelSpaceBefore,
              },
            ],
            caption:
              "This is the same information as the five bars above and it tells a completely different story, which is the reason both are here. Grouped into five categories the problem looks balanced; plotted one point per class it spans nearly three orders of magnitude, and well over half the label set sits under the level at which training a class on its own is worthwhile. No change of architecture moves that line. It is a data problem wearing the costume of a modelling problem, and mistaking one for the other is how a team spends a quarter on the wrong thing.",
            note:
              "The log axis is doing real work here — on a linear scale every class past about rank forty would be flat against the baseline and the tail would look empty rather than sparse.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── explanation
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
          columns: 2,
          intro:
            "Two saliency maps at the same confidence, over the same crop, from the same model. Nothing in the prediction distinguishes them — the overlay is the only thing that does.",
          specs: [
            {
              kind: "pixels",
              title: "A diagnosis worth acting on",
              subtitle: "Heat on the lesion and its margin",
              grid: parseGrid(saliencyGood),
              stops: saliencyStops,
              cell: 21,
              outline: false,
              caption:
                "The influence is concentrated where the symptom is, and it falls away toward the edges of the frame. This is the signature of a model that answered the question it was asked: an agronomist can look at the same region and either agree or point at what the model missed.",
            },
            {
              kind: "pixels",
              title: "The same confidence, and not usable",
              subtitle: "Heat on the frame, with a cold centre",
              grid: parseGrid(saliencyBad),
              stops: saliencyStops,
              cell: 21,
              outline: false,
              caption:
                "Here the decisive regions are the border of the photograph and the leaf is barely involved. The model has learned something real — a background, a pot rim, a lighting setup or a watermark that happens to correlate with this class in the training data — and it will be wrong the moment a grower photographs the same disease in a field. The prediction and its confidence look identical to the panel on the left, which is precisely the point.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "Why this is a data-collection safeguard as well as a UI feature",
          body:
            "A frame-heat pattern like the one on the right is the visible symptom of a systematic contamination in the training set rather than a bad prediction on one image. Seeing it repeatedly across a class is what sends you back to the dataset to find the watermark or the shared background, and it is the reason the collection tool filters text overlays and near-duplicates rather than trusting a general quality score. The explanation layer and the dataset layer are checking each other.",
        },
      ],
    },

    // ─────────────────────────────────────────────── confusion
    {
      id: "confusion",
      nav: "Where it confuses",
      heading: "The confusions that cost money, and the ones that do not",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "An accuracy figure across three hundred classes says almost nothing about whether a system is safe to deploy, because it treats every error as equivalent. They are not. One fungal leaf spot called as another fungal leaf spot often leads to the same fungicide and the same timing, so the error costs nothing. A nutrient deficiency called as a viral disease is a different matter: it converts a fixable condition into an untreatable verdict, and the grower stops trying.",
            "So the useful view is where the errors go rather than how many there are. Read as a matrix, the failures concentrate in a small number of pairs, and those pairs are the ones that determine what the system is allowed to say — which is why the abiotic disorders were added to the label set in the first place. A classifier without them has no way to express 'this is not a disease', so every heat-scorched leaf gets the nearest disease name and a confident number beside it.",
            "The asymmetries are worth reading too. Categories that are commoner in the training data attract ambiguous cases, so an error rate in one direction is rarely matched in the other. That is a property of the label distribution rather than of the biology, and it is invisible in any single number.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "confusion",
            title: "Where a diagnosis goes when it goes wrong",
            subtitle:
              "By category — rows are what the sample was, columns are what it was called",
            representative: true,
            rowAxis: "actually",
            colAxis: "diagnosed as",
            diagonalMeaning: "diagnosed correctly",
            offDiagonalMeaning: "diagnosed as another category",
            cell: 44,
            rowLabels: ["Fungal", "Bacterial", "Viral", "Insect pest", "Abiotic"],
            colLabels: ["Fungal", "Bacterial", "Viral", "Insect", "Abiotic"],
            values: [
              [91, 4, 1, 2, 2],
              [13, 76, 3, 2, 6],
              [4, 3, 74, 2, 17],
              [3, 1, 2, 92, 2],
              [6, 3, 14, 2, 75],
            ],
            highlights: [
              {
                at: [2, 4],
                why: "Mosaic and mottling from a virus look like a nutrient disorder. This pair decides whether a grower buys a spray or a fertiliser, and it is the single most consequential cell in the matrix.",
              },
              {
                at: [4, 2],
                why: "The same confusion in the more expensive direction: a nutrient problem called as a virus turns something fixable this week into a write-off, and the grower stops treating.",
              },
              {
                at: [1, 0],
                why: "Early water-soaked lesions are not reliably separable from fungal leaf spot in one photograph. A bacterial problem treated with a fungicide costs the spray and the week.",
              },
            ],
            caption:
              "Representative of the error structure rather than a benchmark table. Two things to read: the errors are concentrated, not spread — which means a small number of decision rules can cover most of the risk — and the viral-abiotic pair is symmetric in both directions, so neither can be fixed by favouring the other. That pair is why the system is allowed to answer at category level, and why the guidance layer always names the distinguishing feature to check in the field.",
            note:
              "Insect pests are the easiest category and fungal disease the second easiest, for the same reason: both leave structure a camera resolves well. Bacterial and viral disease are harder because the visible symptom is a tissue response, and several causes produce the same response.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── confidence
    {
      id: "confidence",
      nav: "Knowing when unsure",
      heading: "Reporting confidence, and knowing when not to answer",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "In a long-tailed classification problem, most real failures are not wrong answers on well-represented classes — they are confident answers on things the model has barely seen, or on images that contain no diagnosable subject at all. A photograph of soil, a blurred close-up, or a disease outside the label set will all produce a prediction, and the prediction will have a number next to it.",
            "Which makes calibration a more important property here than accuracy. A grower spends money on the strength of that number: told ninety per cent, they spray; told sixty, they scout first. If the stated ninety is really a sixty-five, the system is not merely inaccurate — it has misled someone into an expense, and it will keep doing so consistently. Raw classifier outputs are systematically overconfident, and the fix is a calibration step against held-out data rather than a note in the interface.",
            "So the system distinguishes between a diagnosis and a shortlist. Where the evidence is strong and the class is well represented, it names one agent. Where two candidates are close, it says so and gives both, because a grower who knows there are two possibilities scouts for the distinguishing feature rather than treating for the wrong one. Where the image quality is inadequate or nothing in the label set fits well, the correct output is to ask for a better photograph rather than to name something.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "scatter",
            title: "Does a stated confidence mean what it says?",
            subtitle:
              "Observed correctness against stated confidence, in bins — the calibration view",
            representative: true,
            xLabel: "confidence the model stated (%)",
            yLabel: "share of those answers actually correct (%)",
            domain: [40, 100],
            height: 360,
            identityLabel: "perfectly calibrated — stated equals observed",
            stats: [
              { label: "binned by", value: "stated confidence" },
              { label: "below the line", value: "overconfident" },
            ],
            series: [
              {
                name: "raw classifier output",
                color: palette.red,
                points: [
                  { x: 55, y: 41, tip: "says 55, is right 41% of the time" },
                  { x: 65, y: 49 },
                  { x: 75, y: 57 },
                  { x: 85, y: 67 },
                  { x: 92, y: 79 },
                  { x: 97, y: 87 },
                ],
              },
              {
                name: "as published, after calibration",
                color: palette.green,
                points: [
                  { x: 55, y: 53 },
                  { x: 64, y: 65 },
                  { x: 73, y: 71 },
                  { x: 82, y: 84 },
                  { x: 90, y: 89 },
                  { x: 96, y: 95 },
                ],
              },
            ],
            caption:
              "Representative of the shape of the problem and its correction, not a measured calibration curve. Every red point sits below the diagonal, and that is the characteristic failure of a classifier trained on an imbalanced set: it is not randomly wrong, it is reliably too sure. At a stated eighty-five it is right about two thirds of the time, and a grower acting on eighty-five has been misled in a systematic, repeatable way. The green series is the same model after calibration — no better at classifying, substantially safer to act on, and that distinction is the entire argument for treating calibration as a deliverable rather than a detail.",
          },
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
        {
          kind: "viz",
          spec: {
            kind: "decision",
            title: "How the four responses are chosen",
            subtitle:
              "One gate, taking the class distribution and the saliency into account rather than the confidence alone",
            gate: {
              inputLabel: "on every photograph submitted",
              label:
                "Is there enough evidence, on a class with enough support, to name one agent?",
              detail:
                "Three inputs, not one: the margin between the top candidates, how well represented the leading class is, and whether the saliency actually sits on a symptom.",
            },
            branches: [
              {
                condition:
                  "well-supported class, clear margin, saliency on the symptom",
                share: "61%",
                outcome: "Single confident diagnosis",
                emits:
                  "the agent, the calibrated confidence, the saliency overlay, severity at this growth stage, and the immediate measure",
                color: palette.green,
              },
              {
                condition: "two candidates within a narrow margin",
                share: "21%",
                outcome: "Two candidates, both returned",
                emits:
                  "both agents and the distinguishing feature to check in the field. A grower who knows there are two goes and looks; a grower given one confident name buys a product.",
                color: palette.cyan,
              },
              {
                condition:
                  "the leading class is sparse, or the pair is a known symmetric confusion",
                share: "11%",
                outcome: "Group-level answer only",
                emits:
                  "'a fungal leaf spot' rather than a species, plus the management common to the group — and an explicit note that a species call is not supported here",
                color: palette.amber,
                refuses: true,
              },
              {
                condition:
                  "blur, framing, or nothing diagnosable in the frame",
                share: "7%",
                outcome: "A better photograph requested",
                emits:
                  "a specific request — closer, include the lesion margin, avoid the shadow. No name, and no number that would be acted on.",
                color: palette.red,
                refuses: true,
              },
            ],
            note:
              "The saliency map is an input to this gate and not only an output for the user. A high-confidence prediction whose influence sits on the background is routed to the group-level branch, because the model has demonstrated that it answered a different question from the one asked.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── guidance
    {
      id: "guidance",
      nav: "Guidance",
      heading: "Turning a class label into an action",
      kicker: "Solution 04",
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
            kind: "stages",
            title: "From photograph to action, with the gate in the middle",
            stages: [
              {
                n: "01",
                name: "Receive the image and its context",
                produces:
                  "The photograph, the crop, the growth stage and the location. Severity and the correct measure both depend on all three — the same lesion is a nuisance at one stage and a write-off at another.",
                kind: "config",
              },
              {
                n: "02",
                name: "Classify and localise",
                produces:
                  "Candidate agents with calibrated confidences, and the saliency map showing which regions produced them.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Check the evidence before speaking",
                produces:
                  "Whether the saliency sits on a symptom, how well supported the leading class is, and how close the runner-up is — the gate that decides how specific the answer is permitted to be.",
                kind: "repair",
              },
              {
                n: "04",
                name: "Assemble the facts to be narrated",
                produces:
                  "Agent, confidence, severity at this stage, the distinguishing feature to verify, the look-alikes ruled in or out, and the measures. All of it values, none of it prose yet.",
                kind: "model",
              },
              {
                n: "05",
                name: "Narrate, without adding anything",
                produces:
                  "The answer in the grower's own language, ending on an action and a window. The layer writing the sentences is not given the ability to compute, so it has nothing with which to invent an agent, a confidence, a dose or a threshold.",
                kind: "publish",
              },
            ],
            note:
              "Step three is the one that is normally missing. A system that goes straight from classification to wording will always produce fluent advice, including on the images where it should have produced a request for a better photograph.",
          },
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
                  "calibrated confidence per candidate",
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
              metric: ">85%",
              label: "Classification accuracy",
              detail:
                "Across 300+ classes spanning fungal, bacterial, viral, insect and abiotic",
              tone: "green",
            },
            {
              metric: "300+",
              label: "Classes covered",
              detail:
                "Including abiotic look-alikes, so weather damage is not diagnosed as disease",
              tone: "green",
            },
            {
              metric: "Checkable",
              label: "Every diagnosis",
              detail:
                "Saliency overlay ships to the user, so a wrong answer can be caught",
              tone: "cyan",
            },
            {
              metric: "R&D funded",
              label: "Outcome of the work",
              detail:
                "This system is what validated the AI capability to stakeholders",
              tone: "amber",
            },
          ],
        },
        {
          kind: "status",
          title: "What is measured here, and what the panels are illustrating",
          intro:
            "One performance figure on this page is measured. The matrix and the calibration curve are showing the shape of a problem, and they are the two most likely to be mistaken for benchmarks.",
          items: [
            {
              verdict: "verified",
              claim:
                "Better than 85% classification accuracy across 300+ classes",
              evidence:
                "A measured figure, and the least interesting claim on the page. It says nothing about where the errors go, which is what the confusion matrix is for, or about whether the stated confidences mean anything, which is what the calibration panel is for.",
            },
            {
              verdict: "verified",
              claim:
                "Abiotic disorders are in the label set alongside the pathogens",
              evidence:
                "A design decision with a visible consequence: without an abiotic class there is no way for the model to express 'this is not a disease', so every scorched or nutrient-short leaf receives the nearest pathogen name and a confident number beside it.",
            },
            {
              verdict: "shipped",
              claim: "The saliency overlay ships to the user with every answer",
              evidence:
                "Not a debugging artefact. It is the mechanism by which a non-expert catches a wrong answer, and it is also an input to the gate that decides how specific the answer may be.",
            },
            {
              verdict: "defensible",
              claim: "A stated confidence has to mean what it says",
              evidence:
                "The calibration panel is representative rather than measured, but the requirement behind it is not: overconfidence in an imbalanced classifier is systematic, and a grower spends money on the strength of that number. Calibration against held-out data is a deliverable, not a detail.",
            },
            {
              verdict: "not-built",
              claim: "A species-level answer on every photograph",
              evidence:
                "Declined by design in roughly one response in five. Sparse classes and the symmetric viral-abiotic confusion do not support a species call, so the output is a group label with the distinguishing feature to check.",
            },
            {
              verdict: "deferred",
              claim: "Species-level calls across the whole long tail",
              evidence:
                "Blocked on examples rather than on architecture. Over half the label set sits below the trainable floor in the rank curve above, which is exactly the constraint the data-collection agent was built to remove.",
            },
          ],
        },
        {
          kind: "boundary",
          title: "What a photograph cannot answer",
          intro:
            "Each of these is a question users reasonably ask of a camera-based diagnostic, and each has to be answered somewhere other than here.",
          items: [
            {
              not: "A field-scale assessment",
              why: "One leaf is one leaf. How much of the field is affected, and whether it is spreading, is a question for the satellite monitoring system or for a scout — and confusing a positive diagnosis with an incidence estimate is how a whole field gets sprayed for something present in one corner.",
            },
            {
              not: "Able to see what is not in the frame",
              why: "Root and soil-borne disease, systemic infection before it expresses, and nutrient status below the visible threshold all produce photographs that look healthy. A confident 'nothing found' on such an image would be the most dangerous output the system could give, which is why the absence of a diagnosis is never reported as a clean bill of health.",
            },
            {
              not: "A prescription",
              why: "It names a management measure, not a product, a dose or a schedule. Those are regulated, regionally specific and dependent on what is legally available, and a language layer that has been given no ability to compute is exactly the wrong thing to be producing them.",
            },
            {
              not: "A substitute for a pathologist on the hard cases",
              why: "The value is triaging the large majority of ordinary cases quickly and flagging the rest as ambiguous. The residual — sparse classes, symmetric confusions, novel or out-of-set agents — is what the group-level and refusal branches exist to hand over rather than to guess at.",
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
