"use client";
import { motion } from "framer-motion";
import { experience } from "@/lib/data";
import { TrendingUp, Award } from "lucide-react";

export default function Experience() {
  const exp = experience[0];

  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <div className="section-label">Where I&apos;ve Built</div>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            Built the complete remote sensing and AI capability of an AgriTech startup — from zero to production.
          </p>
        </motion.div>

        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
          style={{
            marginBottom: "2rem",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            borderColor: "rgba(74,222,128,0.2)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "var(--gradient-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#000",
                  fontFamily: "var(--font-heading)",
                }}
              >
                EA
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {exp.company}
                </h3>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  {exp.location}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span className="badge badge-green">Core Founding Team Member</span>
            <span className="badge badge-cyan">{exp.duration}</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          <div className="timeline-line" />

          {exp.roles.map((role, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: ri * 0.15 }}
              style={{ marginBottom: ri < exp.roles.length - 1 ? "3rem" : 0, position: "relative" }}
            >
              <div className="timeline-dot" style={{ top: "1.25rem" }} />

              {/* Role header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {role.title}
                </h3>
                {role.promoted && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: "var(--amber-glow)",
                      color: "var(--amber-primary)",
                      border: "1px solid rgba(224,168,62,0.25)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "50px",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <TrendingUp size={11} />
                    Promoted
                  </span>
                )}
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
                  {role.period}
                </span>
              </div>

              {/* Bullets (intern role) */}
              {"bullets" in role && role.bullets && (
                <div className="card" style={{ marginBottom: "1rem" }}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {role.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: "flex", gap: "0.75rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        <span style={{ color: "var(--green-primary)", marginTop: "0.2rem", flexShrink: 0 }}>▸</span>
                        <span>
                          <strong style={{ color: "var(--text-primary)" }}>{b.split(":")[0]}:</strong>
                          {b.includes(":") ? b.substring(b.indexOf(":") + 1) : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                    {role.tags.map((t) => (
                      <span key={t} className="skill-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements (DS role) */}
              {"achievements" in role && role.achievements && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                  {role.achievements.map((ach, ai) => (
                    <motion.div
                      key={ai}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ai * 0.07 }}
                      className="card"
                      style={{ padding: "1.25rem" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "0.5rem" }}>
                        <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                          {ach.title}
                        </h4>
                        <span
                          style={{
                            background: "var(--green-glow)",
                            color: "var(--green-primary)",
                            border: "1px solid rgba(74,222,128,0.2)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "50px",
                            fontSize: "0.68rem",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Award size={10} />
                          {ach.metric}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                        {ach.detail}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {ach.tags.map((t) => (
                          <span key={t} className="skill-tag">{t}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
