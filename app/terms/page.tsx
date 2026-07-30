import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms that apply to this website and to Creator while it is in early access.",
}

export default function TermsPage() {
  return (
    <DocPage
      kicker="Terms"
      title="The agreement, in language you can actually read."
      intro="These terms cover this website and the use of Creator during early access. They are deliberately short, because a short agreement you understand is worth more than a long one you scroll past."
      updated="30 July 2026"
    >
      <h2>Who you are agreeing with</h2>
      <p>
        Radovar is a technology company building local-first AI. In this document,
        &quot;we&quot; and &quot;Radovar&quot; mean that company, and &quot;you&quot; means
        the person or organisation using this website or Creator.
      </p>

      <h2>Creator is in early access</h2>
      <p>
        Creator is not a finished product. Builds are published as pre-releases, features
        change, and behaviour that works today may be different next month. If you are
        deciding whether to depend on Creator for something that matters, please plan
        around that.
      </p>
      <p>
        Because of this, Creator is provided as it is, without a warranty that it will be
        uninterrupted, error free, or fit for a particular purpose. We are not liable for
        loss of data, loss of profit, or consequential loss arising from its use. Nothing
        here limits liability that cannot be limited by law.
      </p>
      <div className="note">
        <p>
          Practical version: keep your work in version control, and read the diffs Creator
          shows you before you approve them. That advice would be sound even if this were a
          mature product.
        </p>
      </div>

      <h2>Your code stays yours</h2>
      <p>
        You keep every right in the projects you open with Creator. Using our software gives
        us no claim over your source code, no licence to it, and no right to train on it.
      </p>

      <h2>What we ask of you</h2>
      <ul>
        <li>Do not use Creator to build or operate something illegal.</li>
        <li>
          Do not attempt to break, probe, or overload infrastructure that belongs to us or
          to a model provider you reach through Creator. If you want to test our security,
          see <Link href="/security/">the Security page</Link> and tell us first.
        </li>
        <li>
          Do not redistribute Creator builds as though they were your own product.
        </li>
      </ul>

      <h2>Model providers</h2>
      <p>
        When you connect Creator to a third-party model provider, your use of that model is
        governed by the provider terms as well as these. We do not control what a provider
        does with a request you send it, which is why the choice of provider, including the
        option of a local model, is yours and is made explicitly.
      </p>

      <h2>This website</h2>
      <p>
        The text and design of radovar.com belong to Radovar. You are welcome to quote and
        link to it. Please do not present it as your own.
      </p>

      <h2>Changes and questions</h2>
      <p>
        If these terms change, the date at the top changes with them. If something here is
        unclear or you need a different arrangement for your organisation, write to{" "}
        <a href="mailto:info@radovar.com">info@radovar.com</a> and we will talk it through.
      </p>
    </DocPage>
  )
}
