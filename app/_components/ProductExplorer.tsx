"use client";

import { useState } from "react";
import { AppShot } from "./AppShot";
import { trackFeature } from "../analytics/config";

const views = [
  { name: "Your project", title: "Give the task a home.", copy: "Open a folder that is already on your PC and describe the change in plain words. Each task keeps its own conversation, so you can come back to it without starting from scratch.", image: "task-brief.webp", detail: ["task-brief-detail.webp", 1000, 882] as const, alt: "Codevalanche with a sample project open and a task typed into the message box, ready to send." },
  { name: "Your agents", title: "Choose how the work runs.", copy: "Connect the AI providers and accounts you already use, or a supported local model. Your project and conversation stay the same when you switch.", image: "ai-providers.webp", detail: ["ai-providers-detail.webp", 1000, 1032] as const, alt: "Codevalanche settings listing AI providers such as OpenAI, Anthropic, Google and DeepSeek, each ready to connect." },
  { name: "Your review", title: "Check what actually changed.", copy: "Read the exact changes in every file and the result of the checks before you decide what to keep.", image: "changes.webp", detail: ["changes-detail.webp", 1000, 1092] as const, alt: "Codevalanche showing the line-by-line changes an agent made to two files in a sample project." },
];

export function ProductExplorer() {
  const [active, setActive] = useState(0);
  const view = views[active];
  const select = (index: number) => {
    if (index !== active) trackFeature(["project", "agents", "review"][index]);
    setActive(index);
  };
  return (
    <div className="product-explorer">
      <div className="explorer-story">
        <div className="explorer-tabs" role="tablist" aria-label="Explore the workspace">
          {views.map((item, index) => (
            <button key={item.name} id={`explorer-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="explorer-panel" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? views.length - 1 : (index + (event.key === "ArrowRight" ? 1 : views.length - 1)) % views.length;
              select(next);
              document.getElementById(`explorer-tab-${next}`)?.focus();
            }}>{item.name}</button>
          ))}
        </div>
        <div id="explorer-panel" role="tabpanel" aria-labelledby={`explorer-tab-${active}`} tabIndex={0}>
          <h3>{view.title}</h3>
          <p>{view.copy}</p>
          <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="product_panel" data-analytics-section-id="codevalanche">Explore Codevalanche</a>
        </div>
      </div>
      <AppShot key={view.image} className="explorer-shot" src={`/media/codevalanche/${view.image}`} mobileSrc={`/media/codevalanche/${view.detail[0]}`} mobileSize={[view.detail[1], view.detail[2]]} alt={view.alt} caption="Codevalanche on Windows, with a sample project." />
    </div>
  );
}
