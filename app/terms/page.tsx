import Link from "next/link"
import { createPageMetadata } from "../_lib/site-metadata"
import { PageSchema } from "../_components/PageSchema"
import { DocPage } from "../_components/DocPage"

const page = {
  title: "Terms",
  path: "/terms/",
  description:
    "The terms that apply to this website and to Codevalanche.",
}

export const metadata = createPageMetadata(page)

export default function TermsPage() {
  return (
    <DocPage
      kicker="Terms"
      title="Website and product terms."
      intro="These terms cover this website and the use of Codevalanche. They explain acceptable use, how the product is provided and how to contact Radovar."
      updated="14 November 2026"
    >
      <PageSchema {...page} />
      <h2>Who you are agreeing with</h2>
      <p>
        Radovar is the software company behind Codevalanche. In this document,
        &quot;we&quot; and &quot;Radovar&quot; mean that company, and &quot;you&quot; means
        the person or organisation using this website or Codevalanche.
      </p>

      <h2>Codevalanche keeps changing</h2>
      <p>
        Codevalanche is updated often. Features change, and behaviour that works today may be
        different next month. If you are
        deciding whether to depend on Codevalanche for something that matters, please plan
        around that.
      </p>
      <p>
        Because of this, Codevalanche is provided as it is, without a warranty that it will be
        uninterrupted, error free, or fit for a particular purpose. We are not liable for
        loss of data, loss of profit, or consequential loss arising from its use. Nothing
        here limits liability that cannot be limited by law.
      </p>
      <div className="note">
        <p>
          Practical version: keep your work in version control, and read the diffs Codevalanche
          shows you before you approve them. That advice holds for any tool that changes code.
        </p>
      </div>

      <h2>Your code stays yours</h2>
      <p>
        You keep every right in the projects you open with Codevalanche. Using our software gives
        us no claim over your source code, no licence to it, and no right to train on it.
      </p>

      <h2>What we ask of you</h2>
      <ul>
        <li>Do not use Codevalanche to build or operate something illegal.</li>
        <li>
          Do not attempt to break, probe, or overload infrastructure that belongs to us or
          to a model provider you reach through Codevalanche. If you want to test our security,
          see <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">the Security page</Link> and tell us first.
        </li>
        <li>
          Do not redistribute Codevalanche builds as though they were your own product.
        </li>
      </ul>

      <h2>Model providers</h2>
      <p>
        When you connect Codevalanche to a third-party model provider, your use of that model is
        governed by the provider terms as well as these. We do not control what a provider
        does with a request you send it, which is why the choice of provider, including the
        option of a local model, is yours and is made explicitly.
      </p>

      <h2>This website</h2>
      <p>
        Optional website analytics requires a separate choice and is not enabled for this
        release. Declining or withdrawing does not prevent access to the website, product
        information, account, or downloads. Manage cookies in the footer opens your
        preferences. <Link href="/privacy/">The Privacy page</Link> explains storage and
        the separate signed-in account activity choice.
      </p>
      <p>
        The text and design of radovar.com belong to Radovar. You are welcome to quote and
        link to it. Please do not present it as your own.
      </p>

      <h2>Changes and questions</h2>
      <p>
        If these terms change, the date at the top changes with them. If something here is
        unclear or you need a different arrangement for your organisation, write to{" "}
        <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a> and we will talk it through.
      </p>
    </DocPage>
  )
}
