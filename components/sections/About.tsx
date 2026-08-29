"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { personalInfo, tripleDomain } from "@/lib/data";
import { Mail, MapPin, Phone } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

/** Renders `**text**` spans as an accent-coloured emphasis. */
function Emphasise({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ color: "var(--green-primary)" }}>
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
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08 },
  }),
};

type Tone = "green" | "cyan" | "amber";

interface ContactRow {
  label: string;
  value: string;
  href: string | null;
  tone: Tone;
  icon: ReactNode;
}

const contactRows: ContactRow[] = [
  {
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    tone: "amber",
    icon: <Mail size={15} />,
  },
  {
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    tone: "green",
    icon: <Phone size={15} />,
  },
  {
    label: "LinkedIn",
    value: personalInfo.linkedin,
    href: personalInfo.linkedinUrl,
    tone: "cyan",
    icon: <Linkedin size={15} />,
  },
  {
    label: "GitHub",
    value: personalInfo.github,
    href: personalInfo.githubUrl,
    tone: "green",
    icon: <Github size={15} />,
  },
  {
    label: "Based in",
    value: personalInfo.location,
    href: null,
    tone: "amber",
    icon: <MapPin size={15} />,
  },
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        {/* ── heading ────────────────────────────────────── */}
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
        >
          <div className="section-label">The Profile</div>
          <h2 className="section-title">Three Domains, One Path</h2>
          <p className="section-subtitle">
            Where agricultural science, earth observation, and production ML
            converge &mdash; a combination that simply doesn&rsquo;t exist off
            the shelf.
          </p>
        </motion.div>

        {/* ── band 1: the three domains ──────────────────── */}
        <div className="domain-cards">
          {tripleDomain.map((domain, i) => (
            <motion.article
              key={domain.title}
              className="card domain-card"
              data-tone={domain.color}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i + 1}
              variants={fadeUp}
            >
              <span className="domain-icon" aria-hidden="true">
                {domain.icon}
              </span>
              <h3 className="domain-card-title">{domain.title}</h3>
              <span className={`badge badge-${domain.color}`}>
                {domain.credential}
              </span>
              <p className="domain-card-body">{domain.description}</p>
            </motion.article>
          ))}
        </div>

        {/* ── band 2: narrative + contact rail ───────────── */}
        <div className="about-main">
          <motion.div
            className="about-narrative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            variants={fadeUp}
          >
            <h3 className="about-blocktitle">About Me</h3>

            <p className="about-lede">
              <Emphasise text={personalInfo.summaryLede} />
            </p>

            {personalInfo.summaryParagraphs.map((para, i) => (
              <p key={i} className="about-para">
                <Emphasise text={para} />
              </p>
            ))}
          </motion.div>

          <motion.aside
            className="about-rail"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={2}
            variants={fadeUp}
          >
            <div>
              <h3 className="about-blocktitle">Contact &amp; Links</h3>
              <ul className="about-contact">
                {contactRows.map((row) => (
                  <li key={row.label}>
                    <span className="about-contact-icon" data-tone={row.tone}>
                      {row.icon}
                    </span>
                    <span className="about-contact-label">{row.label}</span>
                    {row.href ? (
                      <a
                        className="about-contact-value"
                        href={row.href}
                        target={row.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          row.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="about-contact-value">{row.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="about-railgroup-label">Languages</div>
              <div className="about-langs">
                {personalInfo.languages.map((lang) => (
                  <span key={lang} className="badge badge-cyan">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="about-railgroup-label">Open to</div>
              <ul className="about-opento">
                {personalInfo.openTo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>

        {/* ── band 3: how the work is characterised ──────── */}
        <motion.div
          className="about-themes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={1}
          variants={fadeUp}
        >
          {personalInfo.signatureThemes.map((t) => (
            <div key={t.title} className="about-theme">
              <span className="about-theme-title">{t.title}</span>
              <span className="about-theme-body">{t.body}</span>
            </div>
          ))}
        </motion.div>

        {/* ── band 4: the closing statement ──────────────── */}
        <motion.figure
          className="about-northstar"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={1}
          variants={fadeUp}
        >
          <figcaption className="about-northstar-label">
            <span aria-hidden="true">&#9733;</span> North Star
          </figcaption>
          <blockquote className="about-northstar-quote">
            &ldquo;{personalInfo.northStar}&rdquo;
          </blockquote>
        </motion.figure>
      </div>
    </section>
  );
}
