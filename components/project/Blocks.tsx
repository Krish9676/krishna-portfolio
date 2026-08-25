// components/project/Blocks.tsx — renders a content block. Server component:
// every block on a project page is static, so none of this needs to ship JS.

import Viz from "@/components/charts/Viz";
import { verdictMeta, type Block } from "@/lib/projectContent";

function ToneClass(tone?: string) {
  return `tone-${tone ?? "neutral"}`;
}

export default function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    // ── prose ──────────────────────────────────────────────
    case "prose":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.body.map((p, i) => (
            <p key={i} className="pb-para">
              {p}
            </p>
          ))}
        </div>
      );

    // ── callout ────────────────────────────────────────────
    case "callout":
      return (
        <aside className={`pb-callout ${ToneClass(block.tone)}`}>
          <div className="pb-callout-title">{block.title}</div>
          <p className="pb-callout-body">{block.body}</p>
          {block.source && <div className="pb-callout-src">{block.source}</div>}
        </aside>
      );

    // ── table ──────────────────────────────────────────────
    case "table":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <div className="pb-tablewrap">
            <table className={`pb-table ${block.keyColumn ? "keycol" : ""}`}>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="pb-note">{block.note}</p>}
        </div>
      );

    // ── viz ────────────────────────────────────────────────
    case "viz": {
      const specs = block.specs ?? (block.spec ? [block.spec] : []);
      const cols = block.columns ?? (specs.length > 1 ? 2 : 1);
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <div className={`pb-vizgrid cols-${cols}`}>
            {specs.map((s, i) => (
              <Viz key={i} spec={s} />
            ))}
          </div>
        </div>
      );
    }

    // ── cards ──────────────────────────────────────────────
    case "cards":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <div className={`pb-cards cols-${block.columns ?? 2}`}>
            {block.items.map((it) => (
              <div key={it.title} className={`pb-card ${ToneClass(it.tone)}`}>
                <div className="pb-card-head">
                  <span className="pb-card-title">{it.title}</span>
                  {it.meta && <span className="pb-card-meta">{it.meta}</span>}
                </div>
                <p className="pb-card-body">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    // ── outcomes ───────────────────────────────────────────
    case "outcomes":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <div className="pb-outcomes">
            {block.items.map((it) => (
              <div key={it.label} className={`pb-outcome ${ToneClass(it.tone)}`}>
                <div className="pb-outcome-metric">{it.metric}</div>
                <div className="pb-outcome-label">{it.label}</div>
                {it.detail && <div className="pb-outcome-detail">{it.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    // ── status ─────────────────────────────────────────────
    case "status":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <ul className="pb-status">
            {block.items.map((it, i) => {
              const m = verdictMeta[it.verdict];
              return (
                <li key={i} className={`pb-status-row ${ToneClass(m.tone)}`}>
                  <span className="pb-status-badge">{m.label}</span>
                  <div className="pb-status-body">
                    <div className="pb-status-claim">{it.claim}</div>
                    <div className="pb-status-evidence">{it.evidence}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          {block.note && <p className="pb-note">{block.note}</p>}
        </div>
      );

    // ── highlights ─────────────────────────────────────────
    case "highlights":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <ul className="pb-highlights">
            {block.items.map((it) => (
              <li key={it.title}>
                <span className="pb-hl-title">{it.title}</span>
                <span className="pb-hl-body">{it.body}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    // ── stack ──────────────────────────────────────────────
    case "stack":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          {block.title && <h3 className="pb-title">{block.title}</h3>}
          <div className="pb-stackgroups">
            {block.groups.map((g) => (
              <div key={g.label} className="pb-stackgroup">
                <div className="pb-stackgroup-label">{g.label}</div>
                <div className="pb-stackgroup-items">
                  {g.items.map((i) => (
                    <span key={i} className="skill-tag">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    // ── boundary ───────────────────────────────────────────
    case "boundary":
      return (
        <div className="pb-block">
          {block.label && <div className="pb-label">{block.label}</div>}
          <h3 className="pb-title">{block.title}</h3>
          {block.intro && <p className="pb-para">{block.intro}</p>}
          <ul className="pb-boundary">
            {block.items.map((it) => (
              <li key={it.not}>
                <div className="pb-boundary-not">
                  <span aria-hidden="true">✕</span>
                  {it.not}
                </div>
                <div className="pb-boundary-why">{it.why}</div>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}
