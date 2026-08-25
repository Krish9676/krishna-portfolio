// lib/content/index.ts — the registry every project page reads from.

import type { ProjectDetail } from "@/lib/projectContent";
import { cropMonitoring } from "./cropMonitoring";
import { krishiBhoomi } from "./krishiBhoomi";
import { carbonMrv } from "./carbonMrv";
import { agenticLayer } from "./agenticLayer";
import {
  agriChatbot,
  cropClassification,
  dataAgent,
  farmBoundary,
  pestDisease,
  regionalIntelligence,
} from "./supporting";

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
