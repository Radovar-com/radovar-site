import type { Metadata } from "next";
import { DocPage } from "../_components/DocPage";
export const metadata: Metadata = {
  title: "Press",
  alternates: { canonical: "/press/" },
  description:
    "Company information, product naming, and press contact for Radovar and Codevalanche.",
};
export default function PressPage() {
  return (
    <DocPage
      kicker="Press"
      title="Radovar, in a few words."
      intro="Company information and product context for people writing about our work."
    >
      <h2>About Radovar</h2>
      <div className="note">
        <p>
          Radovar is a technology company building AI tools for people who
          build. Its product, Codevalanche, is a local-first AI coding workspace
          that brings repositories, supported runtimes, accounts, and review
          into one desktop application.
        </p>
      </div>
      <h2>The company and the product</h2>
      <p>
        <strong>Radovar</strong> is the company. <strong>Codevalanche</strong>{" "}
        is the product. Use these names as written, with an initial capital.
      </p>
      <p>
        Radovar’s company website is{" "}
        <a href="https://radovar.com">radovar.com</a>. Codevalanche’s product
        website is <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a>.
      </p>
      <h2>Product context</h2>
      <ul>
        <li>Codevalanche works with projects on the user’s machine.</li>
        <li>
          It supports connecting AI runtimes and accounts within a desktop
          workspace.
        </li>
        <li>Users can inspect changes and review the work.</li>
        <li>Hosted providers may receive prompts and relevant file context.</li>
        <li>Codevalanche is in early access.</li>
      </ul>
      <h2>Press enquiries</h2>
      <p>
        For questions, interviews, or a factual check, contact{" "}
        <a href="mailto:press@radovar.com" data-analytics-action="contact" data-analytics-contact="press" data-analytics-placement="inline">press@radovar.com</a>.
      </p>
    </DocPage>
  );
}
