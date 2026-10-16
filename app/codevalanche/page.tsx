import Link from "next/link";
import Image from "next/image";
import { createPageMetadata } from "../_lib/site-metadata";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";
import { AppShot } from "../_components/AppShot";
import { Flight } from "../_components/Motion";
import { ProductExplorer } from "../_components/ProductExplorer";
import { Spot } from "../_components/Spot";
import "../site.css";
import "../home.css";

export const metadata = createPageMetadata({
  title: "Codevalanche",
  path: "/codevalanche/",
  description: "Codevalanche is a desktop app for coding with AI agents: your local projects, cloud agents or local models, and a review of every change in one window.",
});

const strengths = [
  { spot: "parallel" as const, tone: "mist" as const, title: "Several tasks at once.", copy: "Each task keeps its own conversation, agent and changes. See which one is working, which one needs you and which one is ready for review." },
  { spot: "review" as const, tone: "sage" as const, title: "You decide what stays.", copy: "Read every file change and run the checks before you keep the result. A confident answer is where the review starts." },
  { spot: "archive" as const, tone: "sand" as const, title: "Your project, where it already is.", copy: "Open the repository that is already on your PC, with its files, folders and version control. Nothing to import or rebuild." },
];

export default function CodevalanchePage() {
  const base = process.env.BASE_PATH || "";
  return (
    <>
      <SiteHeader />
      <main id="top" className="site-page product-page">
        <section className="shell page-hero" data-analytics-section="intro" aria-labelledby="product-page-title">
          <div className="page-hero--split">
            <div>
              <p className="kicker"><Image src={`${base}/codevalanche-mark.svg`} alt="" width={1156} height={695} />Codevalanche</p>
              <h1 id="product-page-title">One place to work with <em>AI coding agents.</em></h1>
            </div>
            <div>
              <p className="page-hero__lead">Open your project, give a task to the agent you choose and follow it from the first message to a change you have checked. In the cloud or on your own PC.</p>
              <div className="page-hero__actions">
                <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="intro" data-analytics-section-id="codevalanche">Visit codevalanche.com</a>
                <Link className="action-link" href="/docs/" data-analytics-action="anchor" data-analytics-target="docs" data-analytics-placement="intro">Read the guide</Link>
              </div>
              <p className="page-hero__meta">Early access for Windows. Public downloads are in preparation. Supported agents and models vary by build.</p>
            </div>
          </div>
        </section>
        <div className="shell">
          <AppShot
            stage
            priority
            src="/media/codevalanche/task-review-light.webp"
            darkSrc="/media/codevalanche/task-review-dark.webp"
            mobileSrc="/media/codevalanche/task-review-detail-light.webp"
            mobileDarkSrc="/media/codevalanche/task-review-detail-dark.webp"
            mobileSize={[1200, 1068]}
            alt="Codevalanche on Windows: a finished task in a sample project. The agent lists its steps and a summary, and two changed files wait for review."
            caption="Codevalanche on Windows, working on a sample project."
          />
        </div>

        <section className="shell band" data-analytics-section="codevalanche" aria-labelledby="choice-title">
          <div className="band__head">
            <div>
              <p className="kicker">Your choice of agent</p>
              <h2 id="choice-title">In the cloud or on your PC. Per task.</h2>
            </div>
            <p>The project, the conversation and the review stay in the same place when the agent changes.</p>
          </div>
          <div className="runtime-choice">
            <article className="runtime-card runtime-card--cloud">
              <p className="runtime-card__where">In the cloud</p>
              <h3>Use the coding agents you already have.</h3>
              <p>Sign in with your own accounts for supported agents such as Claude Code and Codex. They work on your project from inside Codevalanche.</p>
              <ul aria-label="Examples of cloud agents"><li>Claude Code</li><li>Codex</li><li>More by build</li></ul>
            </article>
            <article className="runtime-card runtime-card--local">
              <p className="runtime-card__where">On your PC</p>
              <h3>Run a model on your own hardware.</h3>
              <p>When a task should stay on your machine, give it to a supported local model. Same project, same conversation, same review.</p>
              <ul aria-label="Local model support"><li>Local models</li><li>Where supported</li></ul>
            </article>
          </div>

          <div className="how-heading">
            <p className="kicker">How a task works</p>
            <h2>From a request to a change you understand.</h2>
          </div>
          <ProductExplorer />

          <div className="cards product-strengths">
            {strengths.map((item) => (
              <article className="card" key={item.title}>
                <Spot name={item.spot} tone={item.tone} />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="band band--panel" data-analytics-section="resources" aria-labelledby="questions-title">
          <div className="shell reader-questions reader-questions--plain">
            <h2 id="questions-title">Before your first task.</h2>
            <dl>
              <div><dt>Can I use an existing project?</dt><dd>Yes. Open a local folder or repository and start with a focused task. Keep important work in version control and review changes before committing them.</dd></div>
              <div><dt>Which agents can I connect?</dt><dd>The agents and accounts supported by your installed build. Codevalanche is designed around tools such as Claude Code, Codex and supported local models.</dd></div>
              <div><dt>Does local-first mean everything is offline?</dt><dd>Your repository stays on disk. A hosted model can still receive prompts and relevant file context. The provider and runtime you choose determine those boundaries. <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">Read more about security</Link>.</dd></div>
              <div><dt>Where can I get it?</dt><dd>Codevalanche is in early access for Windows. Early-access builds shipped in June and July 2026, and public downloads are in preparation. codevalanche.com will carry them as soon as they ship. Radovar keeps the <Link href="/changelog/" data-analytics-action="anchor" data-analytics-target="changelog_archive" data-analytics-placement="resources">early-access release history</Link>.</dd></div>
            </dl>
          </div>
          <div className="shell">
            <div className="closing product-closing flight-host">
              <Flight tone="light" />
              <div>
                <h2>See Codevalanche for yourself.</h2>
                <p>Current availability, supported agents and downloads are on the product website.</p>
              </div>
              <div className="closing__actions">
                <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="resources" data-analytics-section-id="resources">Visit codevalanche.com</a>
                <Link className="action-link" href="/docs/" data-analytics-action="anchor" data-analytics-target="docs" data-analytics-placement="resources">Read the guide</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
