import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Press",
  description:
    "Boilerplate, facts and naming guidance for writing about Radovar and Creator, plus who to contact.",
}

export default function PressPage() {
  return (
    <DocPage
      kicker="Press"
      title="Everything you need to write about us accurately."
      intro="Copy any of this. If you need something that is not here, or you want to check a claim before you publish it, write to us and we will answer the same week."
      updated="30 July 2026"
    >
      <h2>Contact</h2>
      <p>
        Press enquiries: <a href="mailto:press@radovar.com">press@radovar.com</a>
      </p>

      <h2>Boilerplate</h2>
      <div className="note">
        <p>
          Radovar is a technology company building local-first AI. Its first product,
          Creator, is a desktop application that runs AI agents against a project on the
          user own machine, proposing every change as a reviewable diff and keeping the
          source code on the device. Creator is in early access.
        </p>
      </div>

      <h2>One-liner</h2>
      <p>Radovar builds AI that runs on your machine instead of someone else server.</p>

      <h2>Facts</h2>
      <ul>
        <li><strong>Company:</strong> Radovar</li>
        <li><strong>Product:</strong> Creator, a desktop application for local-first AI agents</li>
        <li><strong>Platform:</strong> Windows desktop</li>
        <li><strong>Status:</strong> early access, published as pre-release builds</li>
        <li><strong>Website:</strong> radovar.com</li>
      </ul>

      <h2>Naming</h2>
      <ul>
        <li>
          The company is <strong>Radovar</strong>. The product is <strong>Creator</strong>.
          Radovar is to Creator what a publisher is to the thing it publishes.
        </li>
        <li>
          Both are written with a single capital and no stylisation. Not RADOVAR, not
          radovar, not Cre8tor.
        </li>
        <li>
          Creator is a desktop application, not a plugin, an extension, or a web service.
          Calling it an IDE is closer than calling it a chatbot, but it is neither.
        </li>
      </ul>

      <h2>Claims we will stand behind</h2>
      <p>
        These are safe to quote, because they describe how the product is built rather than
        how well it performs:
      </p>
      <ul>
        <li>Creator opens an existing project on disk and works against the real files.</li>
        <li>
          Agent changes arrive as diffs that a person approves or rejects before anything is
          written.
        </li>
        <li>
          Creator can run against a model on the user own hardware, in which case no code
          leaves the machine.
        </li>
        <li>
          When a hosted model is selected, prompts and file context go to that provider, not
          to Radovar.
        </li>
      </ul>

      <h2>Claims we will not make</h2>
      <p>
        We hold no third-party security certification, we publish no benchmark scores, and
        we do not describe Creator as generally available. If you have seen any of those
        attributed to us, it did not come from us. Please check with{" "}
        <a href="mailto:press@radovar.com">press@radovar.com</a> before printing it.
      </p>
    </DocPage>
  )
}
