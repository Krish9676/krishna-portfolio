// lib/content/dataAgent.ts — Semi-Automated AI Data Collection Agent.
//
// A capability showcase for the unglamorous half of computer vision: reaching a
// long tail, then rejecting most of what was reached. The central claim is
// counter-intuitive and the charts have to carry it — aggressive filtering
// produces a smaller dataset, a lower validation score, and a better model.

import type { ProjectDetail } from "@/lib/projectContent";
import { palette } from "@/components/charts/primitives";
import { labelSpaceAfter, labelSpaceBefore, trainableFloor } from "./curves";

export const dataAgent: ProjectDetail = {
  slug: "ai-data-collection-agent",
  pageTitle: "Semi-Automated AI Data Collection Agent",
  hideMeta: true,
  lede:
    "The unglamorous tool that made a 300-class vision system possible — reaching the long tail of rare classes automatically, then filtering hard enough that the dataset gets smaller and the model gets better.",
  sections: [
    // ─────────────────────────────────────────────── overview
    {
      id: "overview",
      nav: "Overview",
      heading: "The model was never the bottleneck",
      blocks: [
        {
          kind: "prose",
          body: [
            "Training a classifier across three hundred pest and disease classes needs three hundred balanced, correctly labelled image sets. Assembling those by hand is weeks of work per iteration, and it is the step that silently caps how fast any computer vision project can move — because it does not look like the bottleneck. Model architecture is the visible, discussable part; dataset assembly is the part everyone assumes is nearly done.",
            "It caps quality too, in a way that is hard to see. An under-populated class does not fail loudly. It just performs badly, the confusion matrix shows weakness, and the natural response is to reach for a better architecture — spending a month on modelling to solve a data problem. Recognising which one you actually have is most of the work.",
            "So the tool exists to remove that constraint: generate the search strategies, retrieve at volume across sources, then filter aggressively enough that what survives is worth training on.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "bars",
            title: "Where an iteration cycle actually went",
            subtitle: "Share of elapsed time per model iteration, before the tool",
            representative: true,
            max: 100,
            data: [
              {
                label: "Dataset assembly",
                value: 62,
                valueLabel: "62%",
                color: palette.red,
                note: "searching, downloading, deduplicating, checking labels, filling sparse classes — by hand",
              },
              {
                label: "Training",
                value: 16,
                valueLabel: "16%",
                color: palette.cyan,
                note: "the part everyone plans around",
              },
              {
                label: "Evaluation & error analysis",
                value: 14,
                valueLabel: "14%",
                color: palette.green,
                note: "where the data problems were repeatedly mistaken for model problems",
              },
              {
                label: "Architecture & tuning",
                value: 8,
                valueLabel: "8%",
                color: palette.violet,
                note: "the part that gets discussed",
              },
            ],
            caption:
              "Representative of the split this project was built to fix. Nearly two-thirds of every cycle went into the step nobody counted, and the visible symptom was a weak confusion matrix — which pointed attention at the eight per cent rather than the sixty-two.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "stages",
            title: "What the tool actually does",
            subtitle: "Five steps, of which the third is where the quality comes from",
            stages: [
              {
                n: "01",
                name: "Generate the search strategies",
                produces:
                  "Per class: the scientific name, the common name, regional common names, the host-crop pairing, and a description of the symptom rather than the agent — because a great many images are captioned by what the photographer saw. Producing that set for three hundred classes by hand is what makes the tail unreachable.",
                kind: "config",
              },
              {
                n: "02",
                name: "Retrieve across sources",
                produces:
                  "Candidates at volume, each carrying its caption and its origin, from more than one kind of source — so one source's systematic biases do not silently become the dataset's.",
                kind: "ingest",
              },
              {
                n: "03",
                name: "Filter, hard",
                produces:
                  "Resolution, near-duplicate, text-overlay and label-sanity checks. Each targets one specific, named failure mode rather than scoring general quality, because the failure modes are not versions of each other.",
                kind: "repair",
              },
              {
                n: "04",
                name: "Augment where the distribution needs it",
                produces:
                  "Augmentation concentrated on the under-populated classes. Applied uniformly it multiplies the whole dataset and leaves the imbalance exactly where it was — the head grows as fast as the tail.",
                kind: "model",
              },
              {
                n: "05",
                name: "Export with a split that holds",
                produces:
                  "Train, validation and test splits built after deduplication rather than before. A near-duplicate pair straddling the boundary inflates the validation score without changing the model, and it is the easiest way to ship something that looked fine in evaluation.",
                kind: "publish",
              },
            ],
            note:
              "The word semi-automated in the title is load-bearing. Steps one to five run unattended; a human reviews the sparse classes and the label-sanity rejections, because that is where an automated judgement is least reliable and most expensive to get wrong.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── long tail
    {
      id: "long-tail",
      nav: "The long tail",
      heading: "Reaching classes that barely exist online",
      kicker: "Solution 01",
      blocks: [
        {
          kind: "prose",
          body: [
            "The head of a three-hundred-class agricultural problem is easy. Common diseases on major crops are extensively photographed, indexed and labelled. The tail is where the work is: an uncommon pathogen on a regionally important crop may have a few dozen usable images scattered across the internet under half a dozen different names.",
            "Finding those requires the search itself to be generated rather than typed. Each class needs multiple strategies — the scientific name, the common name, regional common names, the host-crop pairing, and a description of the symptom rather than the agent, because a great many images are captioned by what the photographer saw rather than by what caused it. Producing that set of strategies for three hundred classes is what makes the tail reachable at all.",
            "The right way to look at the result is one point per class rather than a grouped average, because the whole problem is a distribution rather than a total. A dataset that doubles in size while its worst-represented classes stay where they were has not improved the thing that was broken.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "rankcurve",
            title: "All 300 classes, before and after",
            subtitle:
              "Usable images per class, ranked — the shape of the problem and the shape of the fix",
            representative: true,
            xLabel: "class, ranked by how many usable images exist",
            yLabel: "usable images available",
            height: 340,
            domainMax: 4000,
            domainMin: 1,
            regions: [
              { from: 0, to: 40, label: "head" },
              { from: 40, to: 140, label: "mid-distribution" },
              { from: 140, to: 299, label: "long tail" },
            ],
            threshold: {
              at: trainableFloor,
              label: `${trainableFloor} images — the floor below which a class is not worth training alone`,
              countLabel: "classes below the floor",
            },
            series: [
              {
                name: "manual assembly",
                color: palette.amber,
                dash: "6 4",
                values: labelSpaceBefore,
              },
              {
                name: "after automated collection and filtering",
                color: palette.green,
                values: labelSpaceAfter,
              },
            ],
            caption:
              "The two curves barely differ for the first thirty classes, and that is correct — the head never needed help. Everything this tool is for happens on the right-hand two-thirds, where the amber curve falls through the floor at around rank 118 and the green one never reaches it. The counts printed on each line are the number that matters: a 300-class model is bounded by its worst-represented classes, so moving 183 of them above the trainable floor changes what the classifier can be, and adding more images to the head would not have.",
            note:
              "The log axis is doing the work. On a linear scale both curves are flat against the baseline past about rank forty and the entire difference between them — the whole result of the project — is invisible.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "dumbbell",
            title: "Class balance, before and after",
            subtitle: "Usable images per class, by position in the distribution",
            representative: true,
            domain: [0, 1000],
            unit: " imgs",
            fromLabel: "manual assembly",
            toLabel: "after automated collection",
            rows: [
              {
                label: "Head classes",
                from: 850,
                to: 900,
                note: "already well covered",
                color: palette.cyan,
              },
              {
                label: "Mid-distribution",
                from: 240,
                to: 620,
                note: "moderately documented",
                color: palette.green,
              },
              {
                label: "Long tail",
                from: 35,
                to: 410,
                note: "sparse, multi-named",
                color: palette.green,
              },
              {
                label: "Rarest classes",
                from: 8,
                to: 280,
                note: "near-absent by hand",
                color: palette.green,
              },
            ],
            caption:
              "The same change as the curve above, read as four groups. The head barely moves and that is correct — it did not need help. The value is entirely at the bottom, where classes went from unusable to trainable, because a 300-class model is only as good as its worst-represented classes.",
          },
        },
      ],
    },

    // ─────────────────────────────────────────────── filtering
    {
      id: "filtering",
      nav: "Filtering",
      heading: "Where the quality actually comes from",
      kicker: "Solution 02",
      blocks: [
        {
          kind: "prose",
          body: [
            "An automated collector without aggressive filtering produces a larger dataset and a worse model. That is the counter-intuitive core of the whole tool, and it is worth being precise about why.",
            "Scraped agricultural images arrive with systematic contamination. Many carry watermarks, captions or diagnostic text overlays — and a convolutional network will happily learn that a particular watermark predicts a particular disease, because in the training data it does. Many are near-duplicates of each other across sources, which inflates apparent volume while adding no information and quietly corrupting any validation split they straddle. Many are simply mislabelled, since the caption reflected what the uploader believed. Each of those is a specific failure mode, and each needs its own filter rather than a general quality score.",
            "Resolution thresholds, near-duplicate detection across sources, text-overlay removal and label sanity checks together reject well over half of what is retrieved. That rejection rate is the point, not a cost.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "funnel",
            title: "The collection funnel, and what each gate is protecting against",
            subtitle: "Retention through each filtering stage",
            representative: true,
            unit: "%",
            keepLabel: "still a training candidate",
            dropLabel: "rejected",
            stages: [
              {
                label: "Retrieved",
                value: 100,
                color: palette.faint,
                note: "multi-source, generated strategies",
              },
              {
                label: "Above the resolution floor",
                value: 71,
                color: palette.cyan,
                note: "lesion margin resolvable",
                dropReason:
                  "an image too small to show a lesion margin is too small to train on — the diagnostic feature is simply not present in the pixels.",
              },
              {
                label: "Not a near-duplicate",
                value: 58,
                color: palette.cyanDim,
                note: "deduplicated across sources",
                dropReason:
                  "the same photograph reappearing under different captions. It inflates apparent volume, adds no information, and if the pair straddles a split it inflates the validation score without improving the model.",
              },
              {
                label: "No text or watermark overlay",
                value: 49,
                color: palette.amber,
                note: "no learnable shortcut",
                dropReason:
                  "a network will learn that a particular watermark predicts a particular disease, because in the training data it genuinely does. The shortcut does not exist on a grower's photograph, so the model fails exactly where it is used.",
              },
              {
                label: "Label survives a sanity check",
                value: 41,
                color: palette.green,
                note: "kept for training",
                dropReason:
                  "captions record what the uploader believed. Obvious mislabels are rejected before they teach the wrong thing, and the ambiguous ones go to a human rather than to a threshold.",
              },
            ],
            note:
              "Nearly six in ten retrieved images never reach the dataset. Skipping the text-overlay gate alone would produce a model that scores well in validation and fails in a field — which is the single most expensive kind of failure, because nothing in the evaluation predicts it.",
          },
        },
        {
          kind: "viz",
          spec: {
            kind: "matrix",
            title: "Each source is contaminated differently",
            subtitle:
              "Why the filters are specific rather than one general quality score",
            representative: true,
            rowLabels: [
              "Watermark or caption overlay",
              "Near-duplicate of another source",
              "Resolution below the lesion scale",
              "Caption does not match the image",
              "Diagram or composite, not a photograph",
              "Wrong host crop for the named agent",
            ],
            colLabels: [
              "Image search",
              "Extension bulletins",
              "Research figures",
              "Community uploads",
              "Marketplace listings",
            ],
            levels: [
              { at: 0, color: "rgba(30,42,36,0.45)", label: "rare" },
              { at: 1, color: "rgba(224,168,62,0.45)", label: "present" },
              { at: 2, color: palette.red, label: "dominant failure mode" },
            ],
            values: [
              [2, 1, 2, 0, 2],
              [2, 1, 1, 1, 2],
              [1, 1, 0, 2, 1],
              [1, 0, 0, 2, 1],
              [1, 2, 2, 0, 0],
              [1, 0, 0, 1, 2],
            ],
            caption:
              "Representative of the pattern rather than an audit. Read it by column and the argument for specific filters becomes obvious: research figures are high-resolution and correctly labelled but are frequently multi-panel composites with annotation baked in, while community uploads are genuine field photographs that are often blurred and captioned with a guess. A single quality score treats those as the same defect and gets both wrong — it discards good field photographs for being low-resolution and accepts annotated figures for being sharp.",
            note:
              "Multi-source retrieval is what makes a dataset representative, and it is also what makes per-source filtering necessary. Retrieving from one source only would need fewer filters and produce a model that had learned that source.",
          },
        },
        {
          kind: "callout",
          tone: "cyan",
          title: "Augmentation is targeted, not uniform",
          body:
            "Applying the same augmentation everywhere multiplies the whole dataset and leaves the imbalance exactly where it was — the head grows as fast as the tail. Concentrating augmentation on under-populated classes is what actually shifts the distribution, and the distribution is the thing that was broken.",
        },
      ],
    },

    // ─────────────────────────────────────────────── the counter-intuitive part
    {
      id: "ablation",
      nav: "Smaller and better",
      heading: "Why the validation score has to fall for the model to improve",
      kicker: "Solution 03",
      blocks: [
        {
          kind: "prose",
          body: [
            "The claim that filtering more aggressively makes a model better is easy to state and hard to believe, because every intermediate signal points the other way. Each filter removes training data. Each filter makes the validation score worse. A team measuring progress on validation accuracy will conclude, correctly and disastrously, that the filters are hurting.",
            "The resolution is that the validation score and the thing anyone cares about are measuring different populations. Validation is drawn from the same contaminated pool as training, so a shortcut that works in training works in validation too — a watermark that predicts a disease predicts it on both sides of the split, and a near-duplicate pair straddling the split means the model is being tested on an image it has already seen. Both inflate the score without the model having learned anything transferable.",
            "So the only measurement that settles the question is accuracy on photographs taken by the people who will actually use the system: a phone, a field, uneven light, no watermark. Reading the two side by side is what makes the trade-off visible, and it is why the gap between them is a more useful number to watch than either one alone.",
          ],
        },
        {
          kind: "viz",
          spec: {
            kind: "dumbbell",
            title: "Validation score against real-world accuracy, filter by filter",
            subtitle:
              "The same architecture each time; only the dataset changes",
            representative: true,
            domain: [40, 100],
            unit: "%",
            fromLabel: "validation accuracy",
            toLabel: "accuracy on growers' own photographs",
            rows: [
              {
                label: "No filtering",
                from: 94,
                to: 51,
                note: "the widest gap — the model learned the sources",
                color: palette.red,
              },
              {
                label: "Resolution floor only",
                from: 93,
                to: 58,
                note: "removes unusable images, not the shortcuts",
                color: palette.red,
              },
              {
                label: "+ near-duplicate removal",
                from: 88,
                to: 69,
                note: "validation falls because an inflation was removed",
                color: palette.amber,
              },
              {
                label: "+ text-overlay removal",
                from: 87,
                to: 79,
                note: "the single largest real gain",
                color: palette.green,
              },
              {
                label: "+ label sanity check",
                from: 87,
                to: 84,
                note: "as published",
                color: palette.green,
              },
            ],
            caption:
              "Representative of the shape of the ablation, not a published benchmark. Read the left-hand dots downward: the validation score gets worse as filters are added, and every one of those decreases is the fix working. The clearest case is near-duplicate removal — the model did not change at all between those two rows, so the five points the validation score lost were never real; they were the score being partly computed on images the model had already trained on. Meanwhile the right-hand dots rise by thirty-three points, and the gap between the two columns collapses from forty-three to three.",
            note:
              "The gap itself is the diagnostic worth keeping on a dashboard. A widening gap between validation and field accuracy is the earliest available signal that a dataset has acquired a shortcut, and it shows up long before anyone can name what the shortcut is.",
          },
        },
        {
          kind: "callout",
          tone: "amber",
          title: "The failure this prevents is the one nothing warns you about",
          body:
            "A model that has learned a watermark reports high confidence, passes evaluation, ships, and then performs at chance on the photographs it was built for — with no error message, no exception and no metric moving. It looks exactly like a working system to everyone except the growers using it. That asymmetry is the argument for spending engineering effort on a data-collection tool instead of on the model: the modelling failures announce themselves, and this one does not.",
        },
      ],
    },

    // ─────────────────────────────────────────────── impact
    {
      id: "impact",
      nav: "Impact",
      heading: "What it unlocked",
      kicker: "Impact",
      blocks: [
        {
          kind: "outcomes",
          items: [
            {
              metric: "70%",
              label: "Reduction in preparation time",
              detail: "Per dataset iteration",
              tone: "green",
            },
            {
              metric: "Trainable",
              label: "Rarest classes",
              detail: "Classes that were effectively unreachable by hand",
              tone: "green",
            },
            {
              metric: "Faster",
              label: "Iteration cycles",
              detail: "Limited by training time rather than by collection",
              tone: "cyan",
            },
            {
              metric: "Enabler",
              label: "For the 300-class system",
              detail: "The classifier is not feasible without this",
              tone: "amber",
            },
          ],
        },
        {
          kind: "status",
          title: "What is measured, and what the charts are arguing",
          intro:
            "One figure here is measured. The two most persuasive charts on the page — the rank curve and the ablation — are representative, and it matters that they are read as arguments about mechanism rather than as benchmarks.",
          items: [
            {
              verdict: "verified",
              claim: "70% reduction in dataset preparation time per iteration",
              evidence:
                "A measured figure, and the one that justified building the tool. It is also the least interesting of its effects: the time saving made iteration faster, and the filtering made the model better.",
            },
            {
              verdict: "defensible",
              claim:
                "Aggressive filtering yields a smaller dataset and a better model",
              evidence:
                "Standard shortcut-learning and train-test-leakage reasoning, made concrete by the ablation. The mechanism is not in dispute: a watermark that predicts a class in training predicts it in validation too, and a duplicate straddling a split is a test on a seen image.",
            },
            {
              verdict: "shipped",
              claim: "Splits are constructed after deduplication, not before",
              evidence:
                "A one-line ordering decision with a large effect. Deduplicating within an already-split dataset leaves cross-split pairs in place, which is the most common way a reported validation score turns out to have been partly measuring memorisation.",
            },
            {
              verdict: "shipped",
              claim: "Search strategies are generated per class rather than typed",
              evidence:
                "The step that makes the tail reachable. Five naming strategies across three hundred classes is fifteen hundred queries nobody was going to write, and the symptom-description strategy is the one that finds images captioned by what the photographer saw.",
            },
            {
              verdict: "not-built",
              claim: "Fully autonomous labelling",
              evidence:
                "Semi-automated on purpose, and the word is in the title. Sparse classes and ambiguous label-sanity rejections go to a person, because that is exactly where an automated judgement is least reliable and where a wrong call propagates into every later evaluation.",
            },
            {
              verdict: "deferred",
              claim:
                "A per-class attribution of accuracy gain to collection versus modelling",
              evidence:
                "Would need a controlled per-class ablation across three hundred classes and a field-photograph test set for each. Worth having and not yet done; the aggregate ablation above is the honest interim view.",
            },
          ],
        },
        {
          kind: "boundary",
          title: "What this tool does not solve",
          items: [
            {
              not: "A fix for a class that does not exist online",
              why: "A handful of the three hundred are genuinely unphotographed — a regionally confined agent on a minor crop may have no usable public images at all under any of its names. Retrieval cannot manufacture those, and the honest response is a deliberate field-collection effort rather than a thinner class quietly trained anyway.",
            },
            {
              not: "A substitute for expert labelling",
              why: "It filters obvious mislabels and routes the ambiguous ones to a person. Distinguishing two visually similar pathogens on the same host is a plant-pathology judgement, and a caption-based sanity check is not qualified to make it.",
            },
            {
              not: "A source of ground truth for anything measured rather than seen",
              why: "Photographs support a visual classification problem and nothing else. Yield, soil carbon and nutrient status all need physical measurement in a field, which is why those capabilities carry thinner validation and say so.",
            },
            {
              not: "A licence-cleared image library",
              why: "Retrieval surfaces candidates; what may be redistributed, republished or used commercially is a separate question with its own answer per source. Treating a collection pipeline as though it settled that is a straightforward way to acquire a problem later.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "neutral",
          title: "Why a tool like this belongs in a portfolio",
          body:
            "It is the least visible project here and one of the most consequential. Recognising that the binding constraint was dataset assembly rather than model architecture — and then building the unglamorous thing that removed it — is the same judgement that later identified boundary quality, rather than scoring sophistication, as the limit on field-level analytics.",
        },
      ],
    },
  ],
};
