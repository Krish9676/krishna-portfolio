"use client";
import { motion } from "framer-motion";
import { personalInfo, tripleDomain } from "@/lib/data";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

/** Renders `**text**` spans as an accent-coloured emphasis. */
function Emphasise({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ color: "var(--green-primary)", fontWeight: 600 }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
        >
          <div className="section-label">The Profile</div>
          <h2 className="section-title">Three Domains, One Path</h2>
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            Where agricultural science, earth observation, and production ML converge — a combination that simply doesn't exist off the shelf.
          </p>
        </motion.div>

        {/* Triple domain cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {tripleDomain.map((domain, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i + 1}
              variants={fadeUp}
              className="card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{domain.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {domain.title}
              </h3>
              <div
                className={`badge badge-${domain.color}`}
                style={{ marginBottom: "1rem", display: "inline-flex" }}
              >
                {domain.credential}
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                {domain.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Summary + Contact */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Summary */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeUp}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "var(--text-primary)",
              }}
            >
              About Me
            </h3>
            {/* Opening statement, set apart from the body copy */}
            <p className="about-lede">
              <Emphasise text={personalInfo.summaryLede} />
            </p>

            {personalInfo.summaryParagraphs.map((para, i) => (
              <p key={i} className="about-para">
                <Emphasise text={para} />
              </p>
            ))}

            {/* Engineering signature */}
            <div className="about-themes">
              {personalInfo.signatureThemes.map((t) => (
                <div key={t.title} className="about-theme">
                  <span className="about-theme-title">{t.title}</span>
                  <span className="about-theme-body">{t.body}</span>
                </div>
              ))}
            </div>

            {/* North Star callout */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "12px",
                background: "var(--green-glow)",
                border: "1px solid rgba(74, 222, 128, 0.2)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--green-primary)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                ⭐ North Star
              </div>
              <p
                style={{
                  color: "var(--text-primary)",
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  fontSize: "0.95rem",
                }}
              >
                &ldquo;{personalInfo.northStar}&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            variants={fadeUp}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: "var(--text-primary)",
              }}
            >
              Contact & Links
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
              {[
                { icon: <Mail size={16} />, label: personalInfo.email, href: `mailto:${personalInfo.email}`, color: "amber" },
                { icon: <Phone size={16} />, label: personalInfo.phone, href: `tel:${personalInfo.phone}`, color: "green" },
                { icon: <Linkedin size={16} />, label: personalInfo.linkedin, href: personalInfo.linkedinUrl, color: "cyan" },
                { icon: <Github size={16} />, label: personalInfo.github, href: personalInfo.githubUrl, color: "green" },
                { icon: <MapPin size={16} />, label: personalInfo.location, href: null, color: "amber" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: `var(--${item.color}-glow)`,
                      border: `1px solid rgba(${item.color === "green" ? "74,222,128" : item.color === "cyan" ? "56,182,217" : "224,168,62"}, 0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: `var(--${item.color}-primary)`,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Globe size={12} />
                Languages
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {personalInfo.languages.map((lang) => (
                  <span key={lang} className="badge badge-cyan">{lang}</span>
                ))}
              </div>
            </div>

            {/* Open to */}
            <div style={{ marginTop: "1.75rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Open To
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {personalInfo.openTo.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green-primary)", flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
