"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import { Mail, Phone, MapPin, Send, Download, CircleCheck } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with form data
    const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(form.subject || "Portfolio Inquiry")}&body=${encodeURIComponent(
      `Hi Gopikrishna,\n\n${form.message}\n\nBest,\n${form.name}\n${form.email}`
    )}`;
    window.open(mailtoUrl);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div className="orb orb-green" style={{ width: 500, height: 500, bottom: -200, left: -100, opacity: 0.15 }} />
      <div className="orb orb-cyan" style={{ width: 400, height: 400, top: -100, right: 0, opacity: 0.1 }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>Get In Touch</div>
          <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Let&apos;s Work Together
          </h2>
          <p className="section-subtitle" style={{ margin: "1rem auto 0" }}>
            Open to senior Data Science / ML roles · AgriTech & Climate-Tech consulting · ESG Intelligence partnerships · Startup technical advisory.
          </p>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}
          className="contact-grid"
        >
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.75rem" }}>
              Contact Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { icon: <Mail size={18} />, label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: "amber" },
                { icon: <Phone size={18} />, label: "Phone", value: personalInfo.phone, href: `tel:${personalInfo.phone}`, color: "green" },
                { icon: <Linkedin size={18} />, label: "LinkedIn", value: personalInfo.linkedin, href: personalInfo.linkedinUrl, color: "cyan" },
                { icon: <Github size={18} />, label: "GitHub", value: personalInfo.github, href: personalInfo.githubUrl, color: "green" },
                { icon: <MapPin size={18} />, label: "Location", value: personalInfo.location, href: null, color: "amber" },
              ].map((item, i) => {
                const colorVars: Record<string, string> = {
                  green: "var(--green-primary)",
                  cyan: "var(--cyan-primary)",
                  amber: "var(--amber-primary)",
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        background: `rgba(${item.color === "green" ? "74,222,128" : item.color === "cyan" ? "56,182,217" : "224,168,62"}, 0.1)`,
                        border: `1px solid rgba(${item.color === "green" ? "74,222,128" : item.color === "cyan" ? "56,182,217" : "224,168,62"}, 0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colorVars[item.color],
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "0.15rem" }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = colorVars[item.color])}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Resume download */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex", width: "100%", justifyContent: "center" }}
            >
              <Download size={16} />
              Download Resume / CV
            </a>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="card"
            style={{ padding: "2rem" }}
          >
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row">
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: "0.4rem" }}>Message</label>
                <textarea
                  className="form-input"
                  placeholder="Tell me about your project, role, or partnership idea..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  style={{ resize: "vertical", minHeight: "120px" }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  background: sent ? "var(--green-dim)" : undefined,
                }}
              >
                {sent ? (
                  <>
                    <CircleCheck size={16} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
