"use client";
import { motion } from "framer-motion";
import { domainExpertise } from "@/lib/data";

const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  green: {
    border: "rgba(74,222,128,0.2)",
    bg: "var(--green-glow)",
    text: "var(--green-primary)",
  },
  cyan: {
    border: "rgba(56,182,217,0.2)",
    bg: "var(--cyan-glow)",
    text: "var(--cyan-primary)",
  },
  amber: {
    border: "rgba(224,168,62,0.2)",
    bg: "var(--amber-glow)",
    text: "var(--amber-primary)",
  },
};

export default function DomainExpertise() {
  return (
    <section id="domain" className="section section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <div className="section-label">Domain Expertise</div>
          <h2 className="section-title">What Sets This Apart</h2>
          <p className="section-subtitle">
            Genuine domain fluency — not just technical skill. The ability to understand what the data means for real-world agricultural, financial, and climate decisions.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {domainExpertise.map((domain, i) => {
            const colors = colorMap[domain.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingTop: "1.5rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = colors.border.replace("0.2", "0.5");
                  el.style.boxShadow = `0 0 30px ${colors.bg}`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-subtle)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Color accent top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${colors.text}, transparent)`,
                    opacity: 0.6,
                  }}
                />

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    marginBottom: "1rem",
                  }}
                >
                  {domain.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.35,
                  }}
                >
                  {domain.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.83rem",
                    lineHeight: 1.7,
                  }}
                >
                  {domain.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
