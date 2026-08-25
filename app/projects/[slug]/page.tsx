import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";

import Footer from "@/components/Footer";
import BlockView from "@/components/project/Blocks";
import { ContentsRail, ProjectTopBar } from "@/components/project/ProjectNav";
import Backdrop from "@/components/visuals/Backdrop";
import { detailBySlug } from "@/lib/content";
import { projectBySlug, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  const detail = detailBySlug(slug);
  if (!project) return { title: "Project not found" };

  const title = `${project.title} | Gopikrishna Nallagorla`;
  const description = detail?.lede ?? project.problem;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  const detail = detailBySlug(slug);
  if (!project || !detail) notFound();

  // Next / previous, in the order the showcase lists them.
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <>
      {/* Same atmosphere as the rest of the site, so the glass has something to sit on */}
      <Backdrop variant="site" />
      <ProjectTopBar title={project.title} />

      <main className="proj-main">
        {/* ───────────────────────── hero */}
        <header className="proj-hero">
          <div className="container proj-hero-inner">
            {!detail.hideMeta && (
              <div className="proj-hero-tags">
                <span className="proj-domain">{project.domain}</span>
                {project.documented && (
                  <span className="badge badge-cyan">
                    <FileText size={11} /> Documented
                  </span>
                )}
                {project.compliance && (
                  <span className="badge badge-amber">✓ {project.compliance}</span>
                )}
              </div>
            )}

            <h1 className="proj-title">{detail.pageTitle ?? project.title}</h1>
            <p className="proj-lede">{detail.lede}</p>

            {detail.sourceNote && (
              <p className="proj-source">{detail.sourceNote}</p>
            )}

            {detail.atAGlance && detail.atAGlance.length > 0 && (
              <div className="proj-glance">
                {detail.atAGlance.map((g) => (
                  <div key={g.label} className="proj-glance-item">
                    <div className="proj-glance-label">{g.label}</div>
                    <div className="proj-glance-value">{g.value}</div>
                    {g.note && <div className="proj-glance-note">{g.note}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Capabilities where the project is a capability showcase,
                otherwise the technology stack */}
            <div className="proj-stackline">
              {(project.capabilities ?? project.stack ?? []).map((t) => (
                <span
                  key={t}
                  className={`skill-tag ${project.capabilities ? "capability-tag" : ""}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ───────────────────────── body */}
        <div className="container proj-body">
          <ContentsRail
            sections={detail.sections.map((s) => ({ id: s.id, nav: s.nav }))}
          />

          <article className="proj-article">
            {detail.sections.map((section) => (
              <section key={section.id} id={section.id} className="proj-section">
                <div className="proj-section-head">
                  {section.kicker && (
                    <div className="proj-section-kicker">{section.kicker}</div>
                  )}
                  <h2 className="proj-section-title">{section.heading}</h2>
                </div>
                {section.blocks.map((b, i) => (
                  <BlockView key={i} block={b} />
                ))}
              </section>
            ))}

            {/* ── next / previous */}
            <nav className="proj-pager" aria-label="Other projects">
              {prev ? (
                <Link href={`/projects/${prev.slug}`} className="proj-pager-card">
                  <span className="proj-pager-dir">← Previous</span>
                  <span className="proj-pager-title">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="proj-pager-card align-end"
                >
                  <span className="proj-pager-dir">Next →</span>
                  <span className="proj-pager-title">{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>

            <div className="proj-cta">
              <Link href="/#projects" className="btn-outline">
                All projects <ArrowRight size={15} />
              </Link>
              <Link href="/#contact" className="btn-primary">
                Get in touch <ExternalLink size={15} />
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
