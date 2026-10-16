import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";
import "../site.css";

export const metadata: Metadata = {
  title: "Newsroom",
  alternates: { canonical: "/press/" },
  description: "News, company facts, logos and press contact for Radovar and Codevalanche.",
};

const news = [
  { date: "2 July 2026", iso: "2026-07-02", kind: "Product", href: "/releases/", target: "releases_archive", title: "Codevalanche 0.1.31 published.", copy: "The most recent build in the June and July early-access archive, one of nine published that day." },
  { date: "17 June 2026", iso: "2026-06-17", kind: "Product", href: "/changelog/", target: "changelog_archive", title: "Early-access builds for Windows.", copy: "Signed Windows installers with an update feed. Version 0.1.11 is the earliest build in the archive." },
  { date: "Guide", iso: "", kind: "Security", href: "/security/", target: "security", title: "Your files, providers and permissions.", copy: "What stays on your PC, what a hosted model can receive and how to report a vulnerability." },
];

export default function PressPage() {
  const base = process.env.BASE_PATH || "";
  return (
    <>
      <SiteHeader />
      <main id="top" className="site-page press-page">
        <section className="shell page-hero" data-analytics-section="intro" aria-labelledby="press-title">
          <p className="kicker">Newsroom</p>
          <h1 id="press-title">Radovar and Codevalanche: <em>the facts.</em></h1>
          <p className="page-hero__lead">Product news, a company overview, the names to use and the logos to download when you write about Radovar or Codevalanche.</p>
        </section>

        <section className="shell band band--tight" data-analytics-section="resources" aria-labelledby="news-title">
          <div className="band__head">
            <div>
              <p className="kicker">Latest</p>
              <h2 id="news-title">News and records.</h2>
            </div>
            <p>Every date here comes from the published release history.</p>
          </div>
          <div className="news-list">
            {news.map((item) => (
              <Link href={item.href} key={item.href} data-analytics-action="anchor" data-analytics-target={item.target} data-analytics-placement="resources">
                {item.iso ? <time dateTime={item.iso}>{item.date}</time> : <span className="news-list__kind">{item.date}</span>}
                <span className="news-list__kind">{item.kind}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="band band--panel" data-analytics-section="company" aria-labelledby="facts-title">
          <div className="shell">
            <div className="band__head">
              <div>
                <p className="kicker">Press kit</p>
                <h2 id="facts-title">At a glance.</h2>
              </div>
              <p>Use the names as written, with an initial capital. Radovar is the company. Codevalanche is the product.</p>
            </div>
            <div className="facts">
              <dl>
                <div><dt>Company</dt><dd>Radovar, a software company building tools for working with AI agents.</dd></div>
                <div><dt>Mission</dt><dd>Make work with AI agents something people can understand, check and trust.</dd></div>
                <div><dt>Product</dt><dd>Codevalanche, a desktop app for coding with AI agents.</dd></div>
                <div><dt>Status</dt><dd>Codevalanche is in early access for Windows.</dd></div>
              </dl>
              <dl>
                <div><dt>What Codevalanche does</dt><dd>It works with projects on the user’s machine, connects supported coding agents and accounts such as Claude Code, Codex and local models, keeps each task’s conversation together and shows changed files and diffs before they are committed.</dd></div>
                <div><dt>Local-first, precisely</dt><dd>“Local-first” describes the project workspace. Hosted providers may receive prompts and relevant file context. It does not mean every model runs offline.</dd></div>
                <div><dt>Websites</dt><dd><a href="https://radovar.com">radovar.com</a> for the company. <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a> for the product.</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="shell band" data-analytics-section="resources" aria-labelledby="logos-title">
          <div className="band__head">
            <div>
              <p className="kicker">Logos</p>
              <h2 id="logos-title">Brand assets.</h2>
            </div>
            <p>Please use the logos as supplied, without redrawing, recolouring or stretching them.</p>
          </div>
          <div className="cards cards--two logo-cards">
            <a className="card" href={`${base}/radovar-logo.svg`} download="radovar-logo.svg"><div className="logo-tile"><img src={`${base}/radovar-logo.svg?v=20261016-original`} alt="" width={1184} height={230} /></div><span className="card__label">SVG</span><h3>Radovar wordmark</h3></a>
            <a className="card" href={`${base}/codevalanche-mark.svg`} download="codevalanche-mark.svg"><div className="logo-tile"><img src={`${base}/codevalanche-mark.svg`} alt="" width={1156} height={695} /></div><span className="card__label">SVG</span><h3>Codevalanche mark</h3></a>
          </div>
        </section>

        <section className="shell band band--tight" data-analytics-section="resources" aria-labelledby="press-contact-title">
          <div className="band__head">
            <div>
              <p className="kicker">Contact</p>
              <h2 id="press-contact-title">Press enquiries.</h2>
            </div>
            <p>For questions, interviews or a factual check.</p>
          </div>
          <div className="contacts">
            <a href="mailto:press@radovar.com" data-analytics-action="contact" data-analytics-contact="press" data-analytics-placement="inline"><span>Press</span><strong>press@radovar.com</strong><p>Interviews, facts and product information.</p></a>
            <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline"><span>General</span><strong>info@radovar.com</strong><p>Everything else about Radovar.</p></a>
            <Link href="/company/" data-analytics-action="anchor" data-analytics-target="company" data-analytics-placement="resources"><span>Company</span><strong>About Radovar</strong><p>Our mission, principles and story so far.</p></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
