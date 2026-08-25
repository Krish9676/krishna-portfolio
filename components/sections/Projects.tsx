"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type ProjectFilter } from "@/lib/data";
import { ArrowUpRight, FileText, Zap } from "lucide-react";

const filters: ProjectFilter[] = [
  "All",
  "Precision Agriculture",
  "Computer Vision",
  "LLM & AI",
  "Full-Stack",
  "Carbon & ESG",
  "AgriFinTech",
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");

  const filtered = projects.filter((p) => p.filters.includes(activeFilter));

  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div className="section-label">What I&apos;ve Built</div>
          <h2 className="section-title">Project Showcase</h2>
          <p className="section-subtitle">
            Satellite intelligence systems built end-to-end — crop monitoring,
            agri-lending, carbon accounting, and the AI layers that make them
            usable. Open any project for the full account: what it does, how
            remote sensing and AI get there, and what it deliberately will not
            claim.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className={`card project-card ${
                    project.featured ? "project-featured" : ""
                  }`}
                >
                  {/* Domain */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--cyan-primary)",
                        background: "var(--cyan-glow)",
                        border: "1px solid rgba(56,182,217,0.2)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        lineHeight: 1.4,
                      }}
                    >
                      {project.domain}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="project-card-title">{project.title}</h3>

                  {/* Scale marker */}
                  {project.scale && (
                    <div className="project-card-scale">
                      {project.documented && <FileText size={11} />}
                      {project.scale}
                    </div>
                  )}

                  {/* Problem */}
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      flexGrow: 1,
                    }}
                  >
                    {project.problem}
                  </p>

                  {/* Impact */}
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      background: "var(--green-glow)",
                      border: "1px solid rgba(74,222,128,0.15)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <Zap size={13} style={{ color: "var(--green-primary)" }} />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          color: "var(--green-primary)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Impact
                      </span>
                    </div>
                    <p
                      style={{
                        color: "var(--green-primary)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {project.impact}
                    </p>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.78rem",
                        marginTop: "0.25rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {project.impactDetail}
                    </p>
                  </div>

                  {/* Compliance badge */}
                  {project.compliance && (
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: "0.68rem" }}>
                        ✓ {project.compliance}
                      </span>
                    </div>
                  )}

                  {/* Capabilities where the project is shown as a capability
                      showcase, otherwise the technology stack */}
                  {(() => {
                    const tags = project.capabilities ?? project.stack ?? [];
                    const limit = project.capabilities ? 8 : 7;
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid var(--border-subtle)",
                        }}
                      >
                        {tags.slice(0, limit).map((tag) => (
                          <span
                            key={tag}
                            className={`skill-tag ${project.capabilities ? "capability-tag" : ""}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > limit && (
                          <span className="skill-tag" style={{ color: "var(--text-muted)" }}>
                            +{tags.length - limit} more
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Read more affordance */}
                  <div className="project-card-cta">
                    <span>Read the full project</span>
                    <ArrowUpRight size={15} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
