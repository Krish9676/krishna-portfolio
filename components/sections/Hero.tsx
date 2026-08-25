"use client";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import { ArrowRight, Brain, Cloud, Download, Mail, MapPin, Sprout, TrendingUp } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import Backdrop from "@/components/visuals/Backdrop";
import HeroScene from "@/components/visuals/HeroScene";
import HeroStats from "@/components/visuals/HeroStats";
import MeshFloor from "@/components/visuals/MeshFloor";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

/** What the work delivers, in four plain claims. */
const pillars = [
  {
    icon: Sprout,
    title: "Smarter Monitoring",
    body: "Track crop health and stress in near real-time.",
  },
  {
    icon: TrendingUp,
    title: "Risk & Early Warnings",
    body: "Detect issues early and reduce losses.",
  },
  {
    icon: Cloud,
    title: "Carbon & Resource Intelligence",
    body: "Measure impact. Improve outcomes.",
  },
  {
    icon: Brain,
    title: "AI-Powered Decisions",
    body: "Turn complex data into clear actions.",
  },
];

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <Backdrop variant="hero" />

      <div className="container hero-inner">
        {/* ── copy ── */}
        <div className="hero-copy">
          <motion.div {...rise(0)} className="hero-eyebrow">
            <span className="hero-live" />
            Agricultural Scientist · Remote Sensing Expert · ML Engineer
          </motion.div>

          <motion.h1 {...rise(0.08)} className="hero-title">
            Turning satellite intelligence into{" "}
            <span className="hero-title-a">real-world</span>{" "}
            <span className="hero-title-b">impact.</span>
          </motion.h1>

          <motion.p {...rise(0.18)} className="hero-sub">
            I build data systems that monitor crops from space, uncover what
            matters, and help people make smarter, faster and more sustainable
            decisions.
          </motion.p>

          <motion.div {...rise(0.28)} className="hero-pillars">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="hero-pillar">
                  <span className="hero-pillar-icon">
                    <Icon size={17} />
                  </span>
                  <span className="hero-pillar-title">{p.title}</span>
                  <span className="hero-pillar-body">{p.body}</span>
                </div>
              );
            })}
          </motion.div>

          <motion.div {...rise(0.4)} className="hero-ctas">
            <a href="#projects" className="btn-primary btn-glow">
              View My Work <ArrowRight size={16} />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Download size={16} />
              Download Resume
            </a>
          </motion.div>

          <motion.div {...rise(0.5)} className="hero-meta">
            <a
              href={personalInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hero-social hero-social-cyan"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={personalInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hero-social hero-social-green"
            >
              <Github size={17} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              className="hero-social hero-social-amber"
            >
              <Mail size={17} />
            </a>
            <span className="hero-location">
              <MapPin size={13} />
              {personalInfo.location}
            </span>
          </motion.div>
        </div>

        {/* ── scene + telemetry ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="hero-visual"
        >
          <HeroScene />
          <HeroStats />
        </motion.div>
      </div>

      <MeshFloor />
    </section>
  );
}
