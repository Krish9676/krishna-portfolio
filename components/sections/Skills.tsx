"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  skillCategories,
  skillGroups,
  type Skill,
  type SkillGroup,
} from "@/lib/data";

const LEVELS: Skill["level"][] = ["Expert", "Proficient", "Familiar"];

const levelClass: Record<Skill["level"], string> = {
  Expert: "lvl-expert",
  Proficient: "lvl-proficient",
  Familiar: "lvl-familiar",
};

/** Expert first, so the strongest skills read first inside every card. */
const byLevel = (a: Skill, b: Skill) =>
  LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);

export default function Skills() {
  const [active, setActive] = useState<Skill["level"] | null>(null);


  const visible = useMemo(
    () =>
      skillCategories
        .map((cat) => ({
          ...cat,
          shown: [...cat.skills]
            .sort(byLevel)
            .filter((s) => !active || s.level === active),
        }))
        .filter((cat) => cat.shown.length > 0),
    [active]
  );

  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "2rem" }}
        >
          <div className="section-label">Technical Arsenal</div>
          <h2 className="section-title">Skills &amp; Expertise</h2>
          <p className="section-subtitle">
            Built for the intersection of earth observation, agronomy, machine
            learning, and production engineering. Filter by depth to see where
            the strength actually sits.
          </p>
        </motion.div>

        {/* Level filter — doubles as the summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="skill-filter"
          role="group"
          aria-label="Filter skills by depth"
        >
          <button
            className={`skill-filter-btn ${active === null ? "active" : ""}`}
            onClick={() => setActive(null)}
            aria-pressed={active === null}
          >
            <span>All skills</span>
          </button>
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`skill-filter-btn ${levelClass[level]} ${
                active === level ? "active" : ""
              }`}
              onClick={() => setActive(active === level ? null : level)}
              aria-pressed={active === level}
            >
              <span className="skill-dot" />
              <span>{level}</span>
            </button>
          ))}
        </motion.div>

        {/* Grouped grid — everything visible, no clicking required */}
        {skillGroups.map((group: SkillGroup, gi) => {
          const cats = visible.filter((c) => c.group === group);
          if (!cats.length) return null;
          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.05 }}
              className="skill-group"
            >
              <div className="skill-group-head">
                <span className="skill-group-name">{group}</span>
                <span className="skill-group-rule" />
                <span className="skill-group-count">
                  {cats.reduce((n, c) => n + c.shown.length, 0)}
                </span>
              </div>

              <div className="skill-cards">
                {cats.map((cat) => {
                  const experts = cat.skills.filter(
                    (s) => s.level === "Expert"
                  ).length;
                  return (
                    <div key={cat.category} className="skill-card">
                      <div className="skill-card-head">
                        <span className="skill-card-icon" aria-hidden="true">
                          {cat.icon}
                        </span>
                        <span className="skill-card-titles">
                          <span className="skill-card-name">{cat.category}</span>
                          <span className="skill-card-meta">
                            {cat.skills.length} skills
                            {experts > 0 && ` · ${experts} at expert`}
                          </span>
                        </span>
                      </div>
                      <div className="skill-chips">
                        {cat.shown.map((s) => (
                          <span
                            key={s.name}
                            className={`skill-chip ${levelClass[s.level]}`}
                            title={s.level}
                          >
                            <span className="skill-dot" />
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
