// lib/projectContent.ts — the shape of a project detail page.
//
// A page is an ordered list of blocks. Every block is data, so a page is edited
// by editing content, never by writing layout. The work each project page has to
// do is the same: say what the problem was, show what was built, show the
// evidence, and be explicit about what is verified and what is not.

import type { VizSpec } from "@/components/charts/Viz";

export type Tone = "green" | "cyan" | "amber" | "red" | "neutral";

/** Verification posture, used consistently across every project page. */
export type Verdict =
  | "verified"
  | "defensible"
  | "shipped"
  | "cold"
  | "not-built"
  | "deferred";

export interface Block0Prose {
  kind: "prose";
  label?: string;
  title?: string;
  body: string[];
}

export interface Block1Callout {
  kind: "callout";
  tone: Tone;
  title: string;
  body: string;
  /** A short attributed source, e.g. "product documentation v6, §0.1" */
  source?: string;
}

export interface Block2Table {
  kind: "table";
  label?: string;
  title?: string;
  intro?: string;
  head: string[];
  rows: string[][];
  note?: string;
  /** Renders the first column as an emphasised key column */
  keyColumn?: boolean;
}

export interface Block3Viz {
  kind: "viz";
  label?: string;
  intro?: string;
  /** A single visual, or several laid out side by side */
  spec?: VizSpec;
  specs?: VizSpec[];
  columns?: 2 | 3;
}

export interface Block4Cards {
  kind: "cards";
  label?: string;
  title?: string;
  intro?: string;
  columns?: 2 | 3 | 4;
  items: { title: string; body: string; meta?: string; tone?: Tone }[];
}

export interface Block5Outcomes {
  kind: "outcomes";
  label?: string;
  title?: string;
  intro?: string;
  items: { metric: string; label: string; detail?: string; tone?: Tone }[];
}

export interface Block6Status {
  kind: "status";
  label?: string;
  title?: string;
  intro?: string;
  items: { verdict: Verdict; claim: string; evidence: string }[];
  note?: string;
}

export interface Block7Highlights {
  kind: "highlights";
  label?: string;
  title?: string;
  intro?: string;
  items: { title: string; body: string }[];
}

export interface Block8Stack {
  kind: "stack";
  label?: string;
  title?: string;
  groups: { label: string; items: string[] }[];
}

export interface Block9Boundary {
  kind: "boundary";
  label?: string;
  title: string;
  intro?: string;
  items: { not: string; why: string }[];
}

export type Block =
  | Block0Prose
  | Block1Callout
  | Block2Table
  | Block3Viz
  | Block4Cards
  | Block5Outcomes
  | Block6Status
  | Block7Highlights
  | Block8Stack
  | Block9Boundary;

export interface DetailSection {
  id: string;
  /** Shown in the on-page contents rail */
  nav: string;
  heading: string;
  kicker?: string;
  blocks: Block[];
}

export interface ProjectDetail {
  slug: string;
  /** Longer, page-level title; falls back to the card title */
  pageTitle?: string;
  /** One sentence under the title */
  lede: string;
  /** Where the facts on this page come from */
  sourceNote?: string;
  /** Top-of-page facts strip. Omit on pages that open straight into an
   *  overview rather than a specification. */
  atAGlance?: { label: string; value: string; note?: string }[];
  /** Suppress the employment status and domain chips in the hero, for pages
   *  presented purely as a capability showcase. */
  hideMeta?: boolean;
  sections: DetailSection[];
}

export const verdictMeta: Record<Verdict, { label: string; tone: Tone }> = {
  verified: { label: "Verified", tone: "green" },
  defensible: { label: "Defensible", tone: "cyan" },
  shipped: { label: "Shipped", tone: "green" },
  cold: { label: "Built, cold", tone: "amber" },
  "not-built": { label: "Not built, by design", tone: "neutral" },
  deferred: { label: "Deferred — blocked on data", tone: "amber" },
};
