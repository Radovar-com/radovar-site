import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import { PageSchema } from "./_components/PageSchema";
import { SITE_DESCRIPTION } from "./_lib/site-metadata";
import { AppShot, Terrain } from "./_components/AppShot";
import { Flight } from "./_components/Motion";
import { ProductExplorer } from "./_components/ProductExplorer";
import { Spot, type SpotName } from "./_components/Spot";
import "./site.css";
import "./home.css";

const latest: { id?: string; href: string; label: string; title: string; copy: string; spot: SpotName; tone: "sage" | "mist" | "sand" | "clay" }[] = [
  { href: "/research/wave-ai/", label: "Research · 16 October 2026", title: "Can coupled oscillators act as memory for AI?", copy: "A month-long experiment published in full, including the results that did not work.", spot: "compass", tone: "sage" },
  { id: "press", href: "/press/", label: "Update · 16 October 2026", title: "A new radovar.com.", copy: "The company site now says who we are and what we make. Public downloads of Codevalanche are in preparation.", spot: "news", tone: "clay" },
  { id: "security", href: "/security/", label: "Security", title: "Your files, providers and permissions.", copy: "What stays on your PC, and what a hosted model can receive.", spot: "shield", tone: "mist" },
  { id: "changelog_archive", href: "/changelog/", label: "Release history · June–July 2026", title: "Twenty early-access builds for Windows.", copy: "Every early-access build, its date, and the one we pulled.", spot: "archive", tone: "sand" },
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
              <p className="intro-lead">Radovar is a software company. We build the tools around AI agents, so the person responsible for the work can see what an agent did and decide what to keep. Our first product, Codevalanche, is a Windows desktop app where Claude Code, Codex or a local model works in your own repository, and nothing stays until you have checked it.</p>
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
                <li><span className="intro-story__step">03 · Our first product</span><p className="intro-story__title">Codevalanche.</p><p>A Windows desktop app for coding with AI agents. Early-access builds shipped in June and July 2026, and public downloads are in preparation.</p></li>
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
              <p>Three ideas guide what we build: people decide, the work stays visible, and you choose the agent and the model. Codevalanche is the first product built on them.</p>
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
                <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="product_panel" data-analytics-section-id="codevalanche">Visit codevalanche.com</a>
                <Link className="action-link" href="/codevalanche/" data-analytics-action="anchor" data-analytics-target="codevalanche" data-analytics-placement="product_panel">Explore Codevalanche</Link>
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
            <div className="band__head-action"><Link className="action-link" href="/press/" data-analytics-action="anchor" data-analytics-target="press" data-analytics-placement="resources">All updates</Link></div>
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
              <p>Public downloads are in preparation. codevalanche.com shows what it does, which agents it supports and when you can get it.</p>
            </div>
            <div className="closing__actions">
              <a className="action-link action-link--primary" href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="resources" data-analytics-section-id="resources">Visit codevalanche.com</a>
              <Link className="action-link" href="/codevalanche/" data-analytics-action="anchor" data-analytics-target="codevalanche" data-analytics-placement="resources">Explore Codevalanche</Link>
            </div>
          </div>
        </section>
      </main>
      <PageSchema title="Radovar" path="/" description={SITE_DESCRIPTION} />
      <SiteFooter />
    </>
  );
}
