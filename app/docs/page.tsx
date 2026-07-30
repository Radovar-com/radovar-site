import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How Creator works: opening a project, the propose-and-review loop, choosing between hosted and local models, and where Creator keeps its state.",
}

export default function DocsPage() {
  return (
    <DocPage
      kicker="Docs"
      title="How Creator works."
      intro="Enough to understand the product before you install it, and enough to get a first change through the loop once you have."
      updated="30 July 2026"
    >
      <h2>What Creator is</h2>
      <p>
        Creator is a desktop application that puts AI agents to work on a project that
        already lives on your computer. It is not a web editor, and it is not a chat window
        you paste code into. It opens a folder, reads the real files, and proposes real
        edits to them.
      </p>

      <h2>What you need</h2>
      <ul>
        <li>A Windows desktop machine.</li>
        <li>A project on disk. Version control is strongly recommended.</li>
        <li>
          Either an account with a model provider, or a local model on your own hardware.
        </li>
      </ul>

      <h2>The loop</h2>
      <h3>1. Open a project</h3>
      <p>
        Point Creator at an existing folder. There is no import step and no upload step. The
        project stays where it is, and Creator works against it in place.
      </p>

      <h3>2. Describe the change</h3>
      <p>
        Say what you want in plain language. The agent reads the files it needs in order to
        answer, rather than relying on what you remembered to paste.
      </p>

      <h3>3. Read the diff</h3>
      <p>
        The agent does not write to your working tree directly. It produces a proposal: a
        diff, scoped to named files, showing exactly what would change. Read it the way you
        would read a colleague pull request.
      </p>

      <h3>4. Approve or reject</h3>
      <p>
        Approving applies the change to disk. Rejecting discards it. You stay the person who
        decides what lands, which is the property that makes the rest of it safe to use.
      </p>

      <h2>Choosing a model</h2>
      <p>
        Creator can drive a hosted model or a model running locally on your own hardware,
        and the choice is explicit rather than hidden in a default.
      </p>
      <ul>
        <li>
          <strong>Hosted.</strong> More capable on hard problems. Your prompt and the file
          context the agent needs go to that provider.
        </li>
        <li>
          <strong>Local.</strong> Runs on your machine, so nothing leaves it. The right
          choice when the code cannot be disclosed to a third party.
        </li>
      </ul>
      <p>
        <Link href="/security/">The Security page</Link> describes that boundary precisely,
        including what it does not cover.
      </p>

      <h2>Where state lives</h2>
      <p>
        Conversations, project history, and settings are stored on the machine running
        Creator, alongside the workspace they belong to. Provider credentials are stored on
        the same machine and are used only to talk to the provider you configured.
      </p>

      <div className="note">
        <p>
          Creator is in early access, so these docs describe a moving target. If something
          here does not match what you see in the application, the application is right and
          this page is behind. Tell us at{" "}
          <a href="mailto:info@radovar.com">info@radovar.com</a> and we will fix it.
        </p>
      </div>

      <div className="cards">
        <Link className="card" href="/releases/">
          <h3>Releases</h3>
          <p>Every published build, with dates and how updates reach you.</p>
        </Link>
        <Link className="card" href="/changelog/">
          <h3>Changelog</h3>
          <p>What has been changing, and how often.</p>
        </Link>
        <Link className="card" href="/security/">
          <h3>Security</h3>
          <p>What stays on your machine, and where that guarantee stops.</p>
        </Link>
        <Link className="card" href="/privacy/">
          <h3>Privacy</h3>
          <p>What we collect, which is less than you expect.</p>
        </Link>
      </div>
    </DocPage>
  )
}
