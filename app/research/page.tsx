import Link from "next/link";
import { createPageMetadata, SITE_URL } from "../_lib/site-metadata";
import { PageSchema } from "../_components/PageSchema";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";
import "../site.css";
import "../research.css";

const page = {
  title: "Research",
  path: "/research/",
  description:
    "Experiments Radovar runs on AI systems, published in full with their methods, controls, results and limits, including the results that did not work.",
};

export const metadata = createPageMetadata(page);

const featured = {
  href: "/research/wave-ai/",
  date: "16 October 2026",
  iso: "2026-10-16",
  title: "Can coupled oscillators act as memory for AI?",
  copy: "For a month we tested whether a network of simulated oscillators can remember and recall information as well as standard neural networks. Seven probes, three fixed seeds, sealed test sets and two independent reviews.",
  facts: ["2 September – 2 October 2026", "7 probes", "Results and data published in full"],
  bars: [
    { label: "Wave", value: 72.0, lead: true },
    { label: "GRU", value: 76.5 },
    { label: "SSM", value: 53.5 },
  ],
};

const principles = [
  { n: "01", title: "The question comes first.", copy: "We write down the question, the comparisons and what would count as a result before the first run." },
  { n: "02", title: "Every result is published.", copy: "Including the probes that failed and the runs we stopped. A result that did not work still tells you something." },
  { n: "03", title: "You can check the numbers.", copy: "Each write-up comes with its conditions, its limits and a data file with every number on the page." },
];

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}${page.path}#collection`,
  name: "Radovar research",
  url: `${SITE_URL}${page.path}`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  hasPart: [{ "@id": `${SITE_URL}${featured.href}#article` }],
};

export default function ResearchPage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="site-page research-page">
        <section className="shell page-hero page-hero--split" data-analytics-section="intro" aria-labelledby="research-title">
          <div>
            <p className="kicker">Research</p>
            <h1 id="research-title">Experiments, <em>published in full.</em></h1>
          </div>
          <p className="page-hero__lead">We test ideas about AI systems before we build on them, and we publish what we find: the question, the conditions, every result including the ones that did not work, and what we will not claim.</p>
        </section>

        <section className="shell band band--tight" data-analytics-section="resources" aria-labelledby="featured-title">
          <Link className="research-feature" href={featured.href} data-analytics-action="anchor" data-analytics-placement="resources">
            <div className="research-feature__cover" aria-hidden="true">
              <p className="research-feature__cover-title">64-step memory task, accuracy</p>
              <div className="research-feature__bars">
                {featured.bars.map((bar) => (
                  <div key={bar.label} className="research-feature__bar">
                    <span>{bar.label}</span>
                    <span className="research-feature__track"><span className={bar.lead ? "is-lead" : undefined} style={{ width: `${bar.value}%` }} /></span>
                    <b>{bar.value.toFixed(1)}%</b>
                  </div>
                ))}
              </div>
              <p className="research-feature__cover-note">Shared query–key readout · 3 seeds · random guessing scores 25%</p>
            </div>
            <div className="research-feature__body">
              <p className="research-feature__meta"><time dateTime={featured.iso}>{featured.date}</time> · Experiment</p>
              <h2 id="featured-title">{featured.title}</h2>
              <p>{featured.copy}</p>
              <ul>{featured.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              <span className="action-link research-feature__cta">Read the experiment</span>
            </div>
          </Link>
        </section>

        <section className="shell band" data-analytics-section="company" aria-labelledby="how-title">
          <div className="band__head">
            <div>
              <p className="kicker">How we publish</p>
              <h2 id="how-title">Three rules for every write-up.</h2>
            </div>
          </div>
          <div className="research-rules">
            {principles.map((item) => (
              <article key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <p className="research-more">More experiments will appear here as they finish. Questions about our research: <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a></p>
        </section>
        <PageSchema {...page} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection).replace(/</g, "\\u003c") }} />
      </main>
      <SiteFooter />
    </>
  );
}
