import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import { ProductExplorer } from "./_components/ProductExplorer";
import "./home.css";

const readings = [
  { id: "docs", href: "/docs/", label: "Product guide", title: "A closer look at Codevalanche.", copy: "The workspace, the tools, and how they fit together." },
  { id: "security", href: "/security/", label: "Security & privacy", title: "Your work. Clear boundaries.", copy: "Understand what stays local and what your connected tools can access." },
  { id: "changelog_archive", href: "/changelog/", label: "Release archive", title: "The early chapters.", copy: "A record of the first Codevalanche releases." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="company-home">
        <section className="introduction" aria-labelledby="intro-title" data-analytics-section="intro">
          <div className="shell introduction__content">
            <p className="intro-kicker">A software company with a builder’s spirit.</p>
            <div className="introduction__grid">
              <h1 id="intro-title">Good ideas.<br />Better tools.</h1>
              <div className="intro-description">
                <p>We’re Radovar. We build software that brings AI closer to the work you care about.</p>
                <p className="intro-detail">Our product, Codevalanche, brings your projects, coding agents, and review into one workspace.</p>
                <Link className="intro-link" href="#codevalanche" data-analytics-action="anchor" data-analytics-target="home" data-analytics-placement="intro">Meet Codevalanche <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="introduction__base">
              <span>Radovar, the company behind Codevalanche.</span>
              <Link href="#company" data-analytics-action="anchor" data-analytics-target="home" data-analytics-placement="intro">Discover Radovar <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
        </section>
        <section className="shell product-section" data-analytics-section="codevalanche" id="codevalanche" aria-labelledby="product-title">
          <div className="product-heading">
            <div>
              <p className="section-label">Made by Radovar</p>
              <h2 id="product-title"><Image src={`${process.env.BASE_PATH || ""}/codevalanche-mark.svg`} alt="" width={42} height={26} />Codevalanche</h2>
            </div>
            <div className="product-heading__copy">
              <p>A place for your projects.<br />Room for your best work.</p>
              <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-placement="product_panel" data-analytics-section-id="codevalanche">Visit the product <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <ProductExplorer />
          <div className="product-footnote"><span>Local projects. Connected tools. A clearer view of the result.</span><Link href="/docs/" data-analytics-action="anchor" data-analytics-target="docs" data-analytics-placement="product_panel">Read the product guide <span aria-hidden="true">↗</span></Link></div>
        </section>
        <section className="company-section" data-analytics-section="company" id="company" aria-labelledby="company-title">
          <div className="shell company-grid">
            <div className="company-intro">
              <p className="section-label">The company behind the tools</p>
              <h2 id="company-title">Built with curiosity.<br />Grounded in real work.</h2>
              <p className="company-statement">An idea becomes useful when someone can work with it. That’s where we start.</p>
              <p className="company-description">At Radovar, we build around the things a project already has: context, decisions, and people who want to make progress. Codevalanche is that thinking put into practice.</p>
            </div>
            <div className="company-principles">
              <article><h3>Context comes first.</h3><p>Your project has files, a history, and decisions behind it. Your tools should work with that reality.</p></article>
              <article><h3>Choice stays with you.</h3><p>Different work needs different tools. Connect supported runtimes and accounts in a consistent workspace.</p></article>
              <article><h3>The work stays visible.</h3><p>Keep changes and conversation together. Understand the result, check it, and decide what to keep.</p></article>
              <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="inline">Our approach to security <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
        <section className="shell reading-room" aria-labelledby="reading-title" data-analytics-section="resources">
          <div className="reading-room__heading"><h2 id="reading-title">Worth a closer look.</h2><p>A little more about what we’re building.</p></div>
          <div className="reading-list">
            {readings.map((reading) => <Link href={reading.href} key={reading.href} data-analytics-action="anchor" data-analytics-target={reading.id} data-analytics-placement="resources"><span className="section-label">{reading.label}</span><h3>{reading.title}</h3><p>{reading.copy}</p><span className="reading-arrow" aria-hidden="true">↗</span></Link>)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
