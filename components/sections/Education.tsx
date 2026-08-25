"use client";
import { motion } from "framer-motion";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <div className="section-label">Academic Foundation</div>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            Where the agricultural roots meet data science — a rare educational combination that enables genuine domain fluency.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
          }}
        >
          {education.map((edu, i) => {
            const isGreen = edu.color === "green";
            const accentColor = isGreen ? "var(--green-primary)" : "var(--amber-primary)";
            const accentGlow = isGreen ? "var(--green-glow)" : "var(--amber-glow)";
            const accentBorder = isGreen
              ? "rgba(74,222,128,0.2)"
              : "rgba(224,168,62,0.2)";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="card"
                style={{ padding: "2rem", position: "relative", overflow: "hidden" }}
              >
                {/* Top accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                  }}
                />

                {/* Icon + Degree */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: accentGlow,
                      border: `1px solid ${accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {edu.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {edu.degree}
                    </h3>
                    {edu.specialization && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          background: accentGlow,
                          border: `1px solid ${accentBorder}`,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        Specialization: {edu.specialization}
                      </span>
                    )}
                  </div>
                </div>

                {/* Institution */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {edu.institution}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                      color: "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span>📍 {edu.location}</span>
                    <span>📅 {edu.duration}</span>
                    <span style={{ color: accentColor }}>⭐ CGPA: {edu.cgpa}</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "var(--border-subtle)", marginBottom: "1.25rem" }} />

                {/* Coursework */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {i === 0 ? "Coursework" : "Foundation"}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {edu.coursework.map((course) => (
                      <span
                        key={course}
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          background: "rgba(30, 42, 36, 0.5)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
