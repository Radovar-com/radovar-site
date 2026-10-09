"use client";

import { useState } from "react";
import Image from "next/image";

const views = [
  { name: "Your project", title: "Start where your work lives.", copy: "Open a local repository. Keep its files, conversations, and working context together.", tag: "Project context", lines: ["src / application", "docs / decisions", "tasks / current work"], note: "A familiar starting point. Your own project." },
  { name: "Your agents", title: "Bring your tools together.", copy: "Connect supported coding runtimes and accounts. Choose the tool that fits the task, with your project close at hand.", tag: "Connected tools", lines: ["Claude Code / runtime", "Codex / runtime", "Local models / on device"], note: "Your tools, connected around the same work." },
  { name: "Your review", title: "See the work. Make the call.", copy: "Keep changes and evidence close to the conversation. Inspect the result and decide what belongs in your project.", tag: "Review the result", lines: ["Files / inspect the diff", "Preview / check the result", "Decision / yours to make"], note: "A clearer view before you keep the changes." },
];

export function ProductExplorer() {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="product-explorer">
      <div className="explorer-story">
        <div className="explorer-tabs" role="tablist" aria-label="Explore the workspace">
          {views.map((item, index) => (
            <button key={item.name} id={`explorer-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="explorer-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? views.length - 1 : (index + (event.key === "ArrowRight" ? 1 : views.length - 1)) % views.length;
              setActive(next);
              document.getElementById(`explorer-tab-${next}`)?.focus();
            }}>{item.name}</button>
          ))}
        </div>
        <div id="explorer-panel" role="tabpanel" aria-labelledby={`explorer-tab-${active}`} tabIndex={0}>
          <h3>{view.title}</h3>
          <p>{view.copy}</p>
          <a href="https://codevalanche.com">Explore Codevalanche <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="workspace-illustration" role="img" aria-label={`Illustrative Codevalanche workflow: ${view.tag}. ${view.lines.join(". ")}.`}>
        <div className="workspace-illustration__bar"><Image src={`${process.env.BASE_PATH || ""}/codevalanche-mark.svg`} alt="" width={22} height={15} /><span>Codevalanche</span><span className="workspace-illustration__window" aria-hidden="true">− &nbsp; □ &nbsp; ×</span></div>
        <div className="workspace-illustration__body">
          <div className="workspace-illustration__rail" aria-hidden="true"><span className="rail-project" /><span className="rail-thread" /><span className="rail-review" /></div>
          <div className="workspace-illustration__canvas">
            <div className="workspace-illustration__project"><span className="project-dot" />next-idea <span>Local workspace</span></div>
            <div className="workspace-illustration__context" key={active}><span className="workspace-illustration__tag">{view.tag}</span>{view.lines.map((line, index) => <div className="workspace-illustration__row" key={line}><span aria-hidden="true">{index === 0 ? "⌁" : index === 1 ? "≡" : "↳"}</span>{line}<span className="workspace-illustration__check" aria-hidden="true">✓</span></div>)}</div>
            <div className="workspace-illustration__composer"><span>{view.note}</span><div><span>Project context</span><span aria-hidden="true">↑</span></div></div>
          </div>
        </div>
        <div className="workspace-illustration__caption">Illustrative workflow — not an application screenshot</div>
      </div>
    </div>
  );
}
