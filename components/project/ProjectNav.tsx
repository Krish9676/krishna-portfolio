"use client";
// components/project/ProjectNav.tsx — the sticky contents rail, plus a slim
// top bar that keeps a way back to the portfolio visible on every project page.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ProjectTopBar({ title }: { title: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`proj-topbar ${scrolled ? "scrolled" : ""}`}>
      <Link href="/#projects" className="proj-back">
        <ArrowLeft size={15} />
        <span>All projects</span>
      </Link>
      <span className="proj-topbar-title">{scrolled ? title : ""}</span>
      <Link href="/" className="proj-topbar-home">
        GK
      </Link>
    </div>
  );
}

export function ContentsRail({
  sections,
}: {
  sections: { id: string; nav: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 140) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <nav className="proj-rail" aria-label="On this page">
      <div className="proj-rail-label">On this page</div>
      <ul>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={active === s.id ? "active" : ""}
            >
              <span className="proj-rail-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.nav}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
