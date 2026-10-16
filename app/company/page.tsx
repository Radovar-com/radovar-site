import Link from "next/link";
import { createPageMetadata } from "../_lib/site-metadata";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";
import { Spot, type SpotName } from "../_components/Spot";
import { Flight } from "../_components/Motion";
import "../site.css";

export const metadata = createPageMetadata({
  title: "About Radovar",
  path: "/company/",
  description: "Radovar is the software company behind Codevalanche. Our mission is to make work with AI agents something people can understand, check and trust.",
});

const principles: { spot: SpotName; tone: "sage" | "mist" | "sand" | "clay"; title: string; copy: string }[] = [
  { spot: "compass", tone: "sage", title: "People decide.", copy: "Agents can move fast. The decision about what to keep belongs to the person responsible for the work, and our products are built around that moment." },
  { spot: "archive", tone: "sand", title: "Start where the work already is.", copy: "Your repository, your files, your version history. Opening a project should not mean moving it into someone else’s service." },
  { spot: "paths", tone: "mist", title: "Choice, not lock-in.", copy: "Different tasks call for different models, in the cloud or on your own hardware. We build around the work, not around a single provider." },
  { spot: "review", tone: "clay", title: "Show the work.", copy: "Changes, checks and previews belong next to the answer. A confident reply from an agent is the start of a review, not the end of one." },
  { spot: "voice", tone: "sage", title: "Say what is true.", copy: "We describe what our products do today, including their limits. Early access means early access, and a hosted model is not an offline one." },
  { spot: "shield", tone: "mist", title: "Earn trust slowly.", copy: "We explain where data goes and what an agent can reach, so you can choose permissions deliberately. Security and privacy are part of the product, not a page at the end." },
];

export default function CompanyPage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="site-page company-page">
        <section className="shell page-hero page-hero--art" data-analytics-section="intro" aria-labelledby="company-page-title">
          <div>
            <p className="kicker">About Radovar</p>
            <h1 id="company-page-title">We build software that keeps people <em>in charge of AI work.</em></h1>
            <p className="page-hero__lead">Radovar is the software company behind Codevalanche. We make tools for working with AI agents on real projects, where you choose the agent, see what it did and decide what stays.</p>
          </div>
          <Spot name="summit" tone="mist" />
        </section>

        <div data-analytics-section="company">
        <section className="band band--dark" aria-labelledby="mission-title">
          <div className="shell">
            <p className="kicker">Our mission</p>
            <h2 id="mission-title" className="statement">Make work with AI agents something people can <em>understand, check and trust.</em></h2>
            <div className="statement-follow">
              <p>AI agents can already read a codebase, edit files and run commands. The hard part is no longer getting an answer. It is knowing what happened, whether it is right and what to keep.</p>
              <p>We think the tools around the agent matter as much as the agent itself. That is where Radovar works: on the project, the conversation and the review that turn an AI agent’s output into work a person can stand behind.</p>
            </div>
          </div>
        </section>

        <section className="shell band" aria-labelledby="principles-title">
          <div className="band__head">
            <div>
              <p className="kicker">What we believe</p>
              <h2 id="principles-title">Six principles behind everything we make.</h2>
            </div>
            <p>They decide what we build, what we leave out and how we talk about our products.</p>
          </div>
          <div className="principles">
            {principles.map((item, index) => (
              <article key={item.title}>
                <Spot name={item.spot} tone={item.tone} />
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="band band--panel" data-analytics-section="codevalanche" aria-labelledby="build-title">
          <div className="shell">
            <div className="band__head">
              <div>
                <p className="kicker">What we build</p>
                <h2 id="build-title">Codevalanche is our first product.</h2>
              </div>
              <div>
                <p className="band__aside">A desktop app for coding with AI agents. Your local projects, cloud agents or local models, and a review of every change, in one window.</p>
                <Link className="action-link action-link--primary" href="/codevalanche/" data-analytics-action="anchor" data-analytics-target="codevalanche" data-analytics-placement="product_panel">Explore Codevalanche</Link>
              </div>
            </div>
            <div className="cards">
              <article className="card"><Spot name="cloud" tone="mist" /><h3>Cloud agents, your accounts.</h3><p>Supported agents such as Claude Code and Codex, signed in with the accounts you already use.</p></article>
              <article className="card"><Spot name="device" tone="sand" /><h3>Local models on your PC.</h3><p>When a task should stay on your machine, a supported local model can do the work.</p></article>
              <article className="card"><Spot name="review" tone="sage" /><h3>A review before you keep it.</h3><p>Changed files, diffs and checks sit next to the conversation that produced them.</p></article>
            </div>
          </div>
        </section>

        <section className="band band--dark flight-host" aria-labelledby="story-title">
          <Flight tone="light" />
          <div className="shell">
            <div className="band__head">
              <div>
                <p className="kicker">Our story so far</p>
                <h2 id="story-title" className="serif">Shipping early, keeping the record.</h2>
              </div>
              <p>We publish what we ship and keep the record, including the build we pulled.</p>
            </div>
            <ol className="timeline">
              <li><time dateTime="2026-06">June 2026</time><h3>Early access on Windows.</h3><p>Codevalanche is published as signed Windows installers, with an update feed that installed copies can check for new builds.</p></li>
              <li><time dateTime="2026-07">July 2026</time><h3>Twenty builds in just over two weeks.</h3><p>Between 17 June and 2 July we publish twenty early-access builds. One, version 0.1.24, is pulled after a problem is found, and the <Link href="/changelog/" data-analytics-action="anchor" data-analytics-target="changelog_archive" data-analytics-placement="inline">release history</Link> still lists it.</p></li>
              <li><time dateTime="2026-10-16">October 2026</time><h3>A company site, and public downloads in preparation.</h3><p>radovar.com relaunches as the home of the company. Codevalanche stays in early access for Windows while public downloads are prepared. It works with cloud agents such as Claude Code and Codex and with supported local models.</p></li>
            </ol>
          </div>
        </section>

        </div>

        <div data-analytics-section="resources">
        <section className="shell band" aria-labelledby="trust-title">
          <div className="band__head">
            <div>
              <p className="kicker">Trust</p>
              <h2 id="trust-title">How we handle your work.</h2>
            </div>
            <p>Plain answers about files, providers, data and the terms of early access.</p>
          </div>
          <div className="cards">
            <Link className="card" href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources"><Spot name="shield" tone="mist" /><span className="card__label">Security</span><h3>Your files, providers and permissions.</h3><p>What stays on your PC and what a hosted model can receive.</p></Link>
            <Link className="card" href="/privacy/" data-analytics-action="anchor" data-analytics-target="privacy" data-analytics-placement="resources"><Spot name="compass" tone="sand" /><span className="card__label">Privacy</span><h3>How Radovar handles your information.</h3><p>Website preferences, email and information you share with us.</p></Link>
            <Link className="card" href="/terms/" data-analytics-action="anchor" data-analytics-target="terms" data-analytics-placement="resources"><Spot name="book" tone="clay" /><span className="card__label">Terms</span><h3>Website and early-access terms.</h3><p>What we ask of you, and what early access means.</p></Link>
          </div>
        </section>

        <section className="shell band band--tight" aria-labelledby="contact-title">
          <div className="band__head">
            <div>
              <p className="kicker">Contact</p>
              <h2 id="contact-title">Talk to us.</h2>
            </div>
            <p>Write to the address that fits your question. A person reads every message.</p>
          </div>
          <div className="contacts">
            <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline"><span>General</span><strong>info@radovar.com</strong><p>Questions about Radovar or Codevalanche.</p></a>
            <a href="mailto:press@radovar.com" data-analytics-action="contact" data-analytics-contact="press" data-analytics-placement="inline"><span>Press</span><strong>press@radovar.com</strong><p>Interviews, facts and product information.</p></a>
            <a href="mailto:security@radovar.com" data-analytics-action="contact" data-analytics-contact="security" data-analytics-placement="inline"><span>Security</span><strong>security@radovar.com</strong><p>Report a vulnerability in Codevalanche.</p></a>
          </div>
        </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
