// lib/content/index.ts — the registry every project page reads from.
//
// One file per project. They were briefly grouped into a "supporting" bundle,
// which stopped scaling once each page carried its own visuals and derived
// series: a project's charts, the data behind them and the prose that reads
// them belong in one place.

import type { ProjectDetail } from "@/lib/projectContent";
import { cropMonitoring } from "./cropMonitoring";
import { krishiBhoomi } from "./krishiBhoomi";
import { carbonMrv } from "./carbonMrv";
import { agenticLayer } from "./agenticLayer";
import { pestDisease } from "./pestDisease";
import { cropClassification } from "./cropClassification";
import { farmBoundary } from "./farmBoundary";
import { regionalIntelligence } from "./regionalIntelligence";
import { agriChatbot } from "./agriChatbot";
import { dataAgent } from "./dataAgent";

export const projectDetails: ProjectDetail[] = [
  cropMonitoring,
  krishiBhoomi,
  carbonMrv,
  agenticLayer,
  pestDisease,
  cropClassification,
  farmBoundary,
  regionalIntelligence,
  agriChatbot,
  dataAgent,
];

export const detailBySlug = (slug: string) =>
  projectDetails.find((d) => d.slug === slug);
