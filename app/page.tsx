import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import { AppShot, Terrain } from "./_components/AppShot";
import { Flight } from "./_components/Motion";
import { ProductExplorer } from "./_components/ProductExplorer";
import { Spot, type SpotName } from "./_components/Spot";
import "./site.css";
import "./home.css";

const latest: { id: string; href: string; label: string; title: string; copy: string; spot: SpotName; tone: "sage" | "mist" | "sand" | "clay" }[] = [
  { id: "releases_archive", href: "/releases/", label: "Release archive · June–July 2026", title: "Twenty early-access builds for Windows.", copy: "Dates and version history of the first public Codevalanche builds.", spot: "archive", tone: "sand" },
  { id: "security", href: "/security/", label: "Security", title: "Your files, providers and permissions.", copy: "What stays on your PC, and what a hosted model can receive.", spot: "shield", tone: "mist" },
  { id: "docs", href: "/docs/", label: "Product guide", title: "Your first project in Codevalanche.", copy: "Open a repository, connect an agent and review the result.", spot: "book", tone: "sage" },
  { id: "press", href: "/press/", label: "Newsroom", title: "Radovar and Codevalanche: the facts.", copy: "Company overview, product description and press contact.", spot: "news", tone: "clay" },
];

export default function HomePage() {
  const base = process.env.BASE_PATH || "";
  return (
    <>
      <SiteHeader />
      <main id="top" className="company-home site-page">
        <section className="introduction" aria-labelledby="intro-title" data-analytics-section="intro">
          <Flight lane="hero" />
          <div className="shell introduction__content">
            <h1 id="intro-title"><span>Radovar keeps people</span> <em>in charge of AI agents.</em></h1>
            <div className="intro-row">
              <p className="intro-lead">Radovar is a software company. AI agents can now write code, change files and run commands on real projects. We build the tools around them, so the person responsible for the work can see what an agent did and decide what to keep.</p>
              <div className="intro-actions">
                <Link className="intro-link action-link action-link--primary" href="#company" data-analytics-action="anchor" data-analytics-target="home" data-analytics-placement="intro">Our mission</Link>
                <Link className="intro-company-link action-link" href="#codevalanche" data-analytics-action="anchor" data-analytics-target="home" data-analytics-placement="intro">What we build</Link>
              </div>
            </div>
            <div className="intro-story">
              <Terrain />
              <ol aria-label="Why Radovar exists">
                <li><span className="intro-story__step">01 · The question</span><p className="intro-story__title">Who is in charge of the result?</p><p>Agents can already do real work in a codebase. When they do, someone still has to answer for what changed.</p></li>
                <li><span className="intro-story__step">02 · Our answer</span><p className="intro-story__title">The person, every time.</p><p>Software where you choose the agent, follow every step it takes and keep only the changes you have checked.</p></li>
                <li><span className="intro-story__step">03 · Our first product</span><p className="intro-story__title">Codevalanche.</p><p>A desktop app for coding with AI agents, in early access for Windows since June 2026.</p></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="band band--dark company-section flight-host" data-analytics-section="company" id="company" aria-labelledby="company-title">
          <Flight tone="light" />
          <div className="shell">
            <p className="kicker">Our mission</p>
            <h2 id="company-title" className="statement">Make work with AI agents something people can <em>understand, check and trust.</em></h2>
            <div className="statement-follow">
              <p>We think the tools around an agent matter as much as the agent itself: the project it works in, the conversation that guides it and the review that decides what stays.</p>
              <p>Six principles guide what we build and what we leave out. The first one is the simplest: people decide. Codevalanche is the first product built on them.</p>
            </div>
            <div className="company-actions">
              <Link className="action-link" href="/company/" data-analytics-action="anchor" data-analytics-target="company" data-analytics-placement="inline">About Radovar</Link>
              <Link className="action-link" href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="inline">Our approach to security</Link>
            </div>
          </div>
        </section>

        <section className="shell band" data-analytics-section="codevalanche" id="codevalanche" aria-labelledby="product-title">
          <div className="feature">
            <div>
              <p className="kicker">What we build</p>
              <h2 id="product-title"><Image src={`${base}/codevalanche-mark.svg`} alt="" width={1156} height={695} />Codevalanche</h2>
              <p className="feature__lead">Our first product is a desktop app for coding with AI agents. Your projects, the agents you choose and the review of every change, together in one window.</p>
              <ul className="feature__points">
                <li>Cloud agents such as Claude Code and Codex, with your own accounts.</li>
                <li>Supported local models that run on your own hardware.</li>
                <li>Every change visible and checked before you keep it.</li>
              </ul>
              <div className="feature__actions">
                <Link className="action-link action-link--primary" href="/codevalanche/" data-analytics-action="anchor" data-analytics-target="codevalanche" data-analytics-placement="product_panel">Explore Codevalanche</Link>
                <a className="action-link" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="product_panel" data-analytics-section-id="codevalanche">Visit the product site</a>
              </div>
            </div>
            <AppShot
              className="feature__visual"
              src="/media/codevalanche/approval-detail.webp"
              darkSrc="/media/codevalanche/approval-detail-dark.webp"
              width={1400}
              height={1256}
              alt="Codevalanche asks for approval before the agent runs a terminal command, with Allow once and Deny buttons."
              caption="Before an agent runs a command, Codevalanche asks you."
            />
          </div>
          <div className="how-heading">
            <p className="kicker">How a task works</p>
            <h2>From a request to a change you understand.</h2>
          </div>
          <ProductExplorer />
        </section>


        <section className="shell band" aria-labelledby="latest-title" data-analytics-section="resources">
          <div className="band__head">
            <div>
              <p className="kicker">Latest</p>
              <h2 id="latest-title">From Radovar.</h2>
            </div>
            <div className="band__head-action"><Link className="action-link" href="/press/" data-analytics-action="anchor" data-analytics-target="press" data-analytics-placement="resources">Visit the newsroom</Link></div>
          </div>
          <div className="cards cards--four">
            {latest.map((item) => (
              <Link className="card" href={item.href} key={item.href} data-analytics-action="anchor" data-analytics-target={item.id} data-analytics-placement="resources">
                <Spot name={item.spot} tone={item.tone} />
                <span className="card__label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>
          <div className="closing home-closing flight-host">
            <Flight tone="light" />
            <div>
              <h2>Codevalanche is in early access for Windows.</h2>
              <p>See what it can do today, which agents it supports and how to get it.</p>
            </div>
            <div className="closing__actions">
              <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="resources" data-analytics-section-id="resources">Visit codevalanche.com</a>
              <Link className="action-link" href="/codevalanche/" data-analytics-action="anchor" data-analytics-target="codevalanche" data-analytics-placement="resources">Explore Codevalanche</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
