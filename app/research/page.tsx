import Link from "next/link";
import { createPageMetadata, SITE_URL } from "../_lib/site-metadata";
import { PageSchema } from "../_components/PageSchema";
import { DocPage } from "../_components/DocPage";

const page = {
  title: "Research",
  path: "/research/",
  description:
    "Experiments Radovar runs on AI systems, published in full with their methods, controls, results and limits, including the results that did not work.",
};

export const metadata = createPageMetadata(page);

const articles = [
  {
    href: "/research/wave-ai/",
    date: "16 October 2026",
    iso: "2026-10-16",
    title: "Can coupled oscillators act as memory for AI?",
    copy: "A month-long experiment comparing simulated oscillator networks with GRU and state-space models on memory tasks: setup, controls, seven probes, findings and limits.",
  },
];

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}${page.path}#collection`,
  name: "Radovar research",
  url: `${SITE_URL}${page.path}`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  hasPart: articles.map((article) => ({ "@id": `${SITE_URL}${article.href}#article` })),
};

export default function ResearchPage() {
  return (
    <DocPage
      kicker="Research"
      title="Experiments, published in full."
      intro="We test ideas about AI systems before we build on them. Each write-up gives the question, the conditions, the controls, every result including the ones that did not work, and what we will not claim."
      updated="16 October 2026"
    >
      <PageSchema {...page} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection).replace(/</g, "\\u003c") }} />
      <div className="cards">
        {articles.map((article) => (
          <Link className="card" href={article.href} key={article.href} data-analytics-action="anchor" data-analytics-placement="resources">
            <p><time dateTime={article.iso}>{article.date}</time></p>
            <h3>{article.title}</h3>
            <p>{article.copy}</p>
          </Link>
        ))}
      </div>
    </DocPage>
  );
}
