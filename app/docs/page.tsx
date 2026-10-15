import Link from "next/link";
import type { Metadata } from "next";
import { DocPage } from "../_components/DocPage";
export const metadata: Metadata = {
  title: "Docs",
  alternates: { canonical: "/docs/" },
  description:
    "An introduction to Codevalanche: local projects, AI runtimes, accounts, and reviewing your work.",
};
export default function DocsPage() {
  return (
    <DocPage
      kicker="Docs"
      title="A workspace for the way you build."
      intro="Codevalanche brings your projects and supported AI tools into one desktop workspace. Here is where to start."
    >
      <h2>Start with your project</h2>
      <p>
        Open a repository or project folder on your machine. Codevalanche works
        with the files where they live, so your existing project structure
        remains the starting point.
      </p>
      <h2>Connect your tools</h2>
      <p>
        Choose from the runtimes and accounts supported by your installed
        version. Availability, authentication, and model selection depend on the
        runtime you connect.
      </p>
      <p>
        If you use a hosted AI provider, prompts and relevant project context
        can be sent to that provider. Local-first describes the workspace; it
        does not mean every model runs offline.
      </p>
      <h2>Describe the work</h2>
      <p>
        Give the agent a concrete task and the context it needs. A clear
        outcome, relevant files, and any constraints help keep the work focused.
      </p>
      <h2>Review the result</h2>
      <p>
        Inspect changes and check the result against the task. Use version
        control, run the appropriate checks, and review the work before keeping
        or committing it. Available approval controls depend on the runtime and
        configuration.
      </p>
      <div className="note">
        <p>
          Codevalanche is in early access. Supported tools and workflows may
          change between builds. For product information, visit{" "}
          <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a>.
        </p>
      </div>
      <div className="cards">
        <Link className="card" href="/releases/" data-analytics-action="anchor" data-analytics-target="releases_archive" data-analytics-placement="resources">
          <h3>Releases</h3>
          <p>Published builds and release history.</p>
        </Link>
        <Link className="card" href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">
          <h3>Security</h3>
          <p>Understand the workspace and provider boundaries.</p>
        </Link>
      </div>
    </DocPage>
  );
}
