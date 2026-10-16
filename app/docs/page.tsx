import Link from "next/link";
import { createPageMetadata } from "../_lib/site-metadata";
import { DocPage } from "../_components/DocPage";
export const metadata = createPageMetadata({
  title: "Getting started with Codevalanche",
  path: "/docs/",
  description:
    "How to open a local project, connect a supported coding runtime, give an agent a task, and review the changes in Codevalanche.",
});
export default function DocsPage() {
  return (
    <DocPage
      kicker="Docs"
      title="Your first project in Codevalanche."
      intro="Open a local repository, connect a coding agent, and work through a specific change. This guide explains the workflow and what to check before you begin."
    >
      <h2>1. Open a local repository</h2>
      <p>
        Start with a repository or project folder on your machine. Codevalanche
        works with those files; you do not need to move your project into a
        hosted editor. Before asking an agent to edit anything, save your work
        and check your version-control status so you can distinguish existing
        changes from the agent’s changes.
      </p>
      <h2>2. Choose a coding runtime</h2>
      <p>
        Connect a runtime supported by your installed build, such as Claude Code,
        Codex, or a local-model setup. Follow that runtime’s sign-in and setup
        instructions. Supported runtimes, account requirements, and model
        selection vary by build and provider.
      </p>
      <p>
        If you use a hosted AI provider, prompts and relevant project context
        can be sent to that provider. Local-first describes the workspace; it
        does not mean every model runs offline.
      </p>
      <h2>3. Give the agent one clear task</h2>
      <p>
        Use a task conversation to describe the outcome you want, the relevant
        files, and the limits of the change. Keep unrelated work in a separate
        task so its conversation and result are easier to follow.
      </p>
      <div className="note">
        <p><strong>An example task</strong></p>
        <p>
          “On the contact page, explain which fields are required and show an
          error beside an invalid email address. Keep the current layout and
          form endpoint. Check the keyboard flow and the mobile layout, then
          summarize the files you changed.”
        </p>
      </div>
      <p>
        This gives the agent a concrete result, boundaries, and a way to check
        the work. Add project-specific context instead of assuming the agent
        already knows your conventions.
      </p>
      <h2>4. Inspect the changes and check the result</h2>
      <p>
        Review the changed files and diffs against the task. Run the appropriate
        tests or checks and, for a visual change, inspect the result in a preview
        or browser. Review, check, and preview surfaces depend on the installed
        build and project setup. Do not treat an agent’s summary as a substitute
        for checking its work.
      </p>
      <p>
        Decide what to keep before committing. Available approval controls depend
        on the runtime and configuration; not every operation necessarily waits
        for an individual approval.
      </p>
      <div className="note">
        <p>
          Codevalanche is in early access. Supported tools and workflows may
          change between builds. For product information, visit{" "}
          <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a>.
        </p>
      </div>
      <div className="cards">
        <Link className="card" href="/changelog/" data-analytics-action="anchor" data-analytics-target="changelog_archive" data-analytics-placement="resources">
          <h3>Release history</h3>
          <p>Every Windows build published in June and July 2026, with its date.</p>
        </Link>
        <Link className="card" href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">
          <h3>Before connecting a provider</h3>
          <p>Understand where project context can go and how runtime permissions affect your work.</p>
        </Link>
      </div>
    </DocPage>
  );
}
