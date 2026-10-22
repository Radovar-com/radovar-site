import Link from "next/link"
import { createPageMetadata } from "../_lib/site-metadata"
import { PageSchema } from "../_components/PageSchema"
import { DocPage } from "../_components/DocPage"

const page = {
  title: "Privacy",
  description:
    "Who is responsible for your data at Radovar, what this website stores, how long we keep email, and what Codevalanche sends to the providers you choose.",
  path: "/privacy/",
}

export const metadata = createPageMetadata(page)

const info = <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a>

export default function PrivacyPage() {
  return (
    <DocPage
      kicker="Privacy"
      title="How Radovar handles your information."
      intro="Who is responsible for your data, what this website stores, how long we keep your email, and what Codevalanche sends to the providers you choose."
      updated="22 October 2026"
    >
      <PageSchema {...page} />
      <h2>Who is responsible</h2>
      <p>
        Radovar, the company behind Codevalanche, is the controller for the personal data
        described on this page. For any question about your data, or to use any of the
        rights below, write to {info}. A person reads every message.
      </p>

      <h2>What this website stores</h2>
      <p>
        <strong>Our own website analytics is optional and starts only if you accept it.</strong>{" "}
        We do not use Google Analytics, advertising cookies, session replay or third-party
        tracking scripts. Fonts, images and our analytics script are served from this site.
      </p>
      <ul>
        <li>
          <strong>Your theme.</strong> If you pick light or dark, your browser keeps that
          choice in local storage under <code>radovar-theme</code>. It never leaves your
          browser.
        </li>
        <li>
          <strong>Your cookie choice.</strong> Manage cookies, in the footer, remembers your
          answer in an essential first-party cookie for up to 180 days. Declining analytics
          keeps optional measurement off and does not prevent you from using the website.
        </li>
        <li>
          <strong>Optional measurement.</strong> After you accept, a random browser identifier
          lasts up to 30 days. A visit ends after 30 minutes of inactivity and lasts at most
          24 hours. We measure page and section views, scrolling, visible time and actions
          such as opening the product link, and page performance where available. Events can include browser, device and language
          categories, a referring domain and campaign labels. They do not include what you
          type, page text, your email address or complete browsing URLs.
        </li>
      </ul>
      <p>
        Supabase hosts our measurement service and database. Detailed measurements have a
        90-day retention limit; statistics without browser or visit identifiers may be
        retained for up to 13 months. Daily cleanup applies these limits, so removal follows
        the next successful cleanup run. Consent records expire within 180 days and can
        remain while retained measurements still refer to them.
      </p>
      <p>
        You can review or withdraw your choice at any time through Manage cookies. Withdrawal
        stops new optional observations; existing records follow the retention limits above.
        A choice saved while measurement was unavailable may need to be confirmed again.
        Website consent is separate from optional activity in a signed-in Codevalanche account.
      </p>
      <p>
        GitHub Pages hosts this website. Cloudflare is configured for DNS and, when
        enabled for website traffic, delivery and security. These services may process
        IP addresses and request details separately from optional measurement, even if
        you decline it. Supabase also processes request metadata when you contact the
        measurement service. Provider logs have separate retention settings. Cloudflare RUM
        and Google Analytics are disabled.
      </p>

      <h2>When you write to us</h2>
      <p>
        If you email {info}, <a href="mailto:press@radovar.com" data-analytics-action="contact" data-analytics-contact="press" data-analytics-placement="inline">press@radovar.com</a> or{" "}
        <a href="mailto:security@radovar.com" data-analytics-action="contact" data-analytics-contact="security" data-analytics-placement="inline">security@radovar.com</a>, we
        use your address and message only to answer you and to keep a record of the
        conversation. We do not add you to a mailing list and we do not sell or pass on
        your address.
      </p>
      <p>
        We delete the correspondence 24 months after your last message, unless we need it
        longer to meet a legal obligation or to resolve a dispute.
      </p>

      <h2>Legal basis</h2>
      <ul>
        <li>
          <strong>Answering your email:</strong> our legitimate interest in replying to the
          people who contact us (GDPR Article 6(1)(f)), or steps you asked for before an
          agreement (Article 6(1)(b)).
        </li>
        <li>
          <strong>Theme and cookie choice:</strong> storage that is strictly necessary to
          give you the setting you asked for.
        </li>
        <li>
          <strong>Optional website measurement:</strong> only your consent
          (Article 6(1)(a)), which you can withdraw at any time.
        </li>
      </ul>

      <h2>Codevalanche</h2>
      <p>
        Codevalanche runs on your computer and works against a project on your disk. Your
        source code is not uploaded to Radovar for the product to work. We do not hold
        copies of your repositories, and we do not train anything on your work.
      </p>
      <p>
        When you choose a hosted model, the prompt and file context that the agent needs are
        sent to <strong>that provider</strong>, under that provider’s terms, not to us.
        A local model can run inference on your machine, but connected tools and runtimes
        may still make network requests. Their configuration, permissions and data handling
        determine what is sent.{" "}
        <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">The Security page</Link> sets out that boundary in more detail.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of the personal data we hold about you, and ask us to
        correct it, delete it, restrict its use or send it to you in a portable form. You
        can also object to how we use it. Write to {info} and we will answer within one
        month.
      </p>
      <p>
        If you are not satisfied with our answer, you can complain to the data protection
        authority in the country where you live or work, or where we are established.
      </p>

      <h2>Changes</h2>
      <p>
        22 October 2026: described consent-based website analytics, Supabase processing,
        browser storage, retention and withdrawal.
      </p>
      <p>
        18 October 2026: named GitHub Pages and Cloudflare for hosting, DNS and security;
        distinguished request metadata from optional measurement.
      </p>
      <p>
        16 October 2026: named who is responsible for your data, added the legal basis and
        a concrete retention period for email, and replaced the technical description of
        the measurement system, which is not switched on, with a plain summary.
      </p>
      <p>
        15 October 2026: added the cookie choice in the footer.
      </p>
      <p>
        If this policy changes in a way that affects what we collect, we will change the
        date at the top and describe the change here rather than quietly replacing the text.
      </p>
    </DocPage>
  )
}
