import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Radovar handles website preferences, email, and the boundaries between Codevalanche’s local workspace and connected providers.",
  alternates: { canonical: "/privacy/" },
}

export default function PrivacyPage() {
  return (
    <DocPage
      kicker="Privacy"
      title="How Radovar handles your information."
      intro="This page describes website preferences, email communications, and information handling when you use Codevalanche and connected providers."
      updated="15 October 2026"
    >
      <h2>This website</h2>
      <p>
        radovar.com is a static website with a first-party analytics preference manager.
        Optional website analytics is <strong>not enabled for this release</strong>.
        Saving a preference does not activate collection. We do not use Google Analytics,
        session replay, keylogging, or third-party tracking scripts. Fonts and website
        assets are served with the site.
      </p>
      <p>
        When you choose a light or dark theme, the site stores that preference in your
        browser’s local storage under <code>radovar-theme</code>. The site reads it on
        later visits to apply your chosen theme.
      </p>
      <p>
        The preference manager uses a host-only essential cookie, lasting up to 180 days,
        to remember your analytics choice. Browser storage also supports that choice and
        the withdrawal protocol. Use Manage cookies in the footer to accept, decline,
        customize, or withdraw. Website access works with either choice. Each website
        keeps its own consent; visiting Codevalanche does not transfer your choice or an
        anonymous identifier.
      </p>
      <p>
        If enabled in a future qualified release, website analytics requires your explicit
        choice and a valid consent receipt. It measures registered page, section and button
        interactions, coarse browser and device categories, and sanitized campaign labels
        or an external referring domain. It does not collect form values, page text, raw
        URLs or queries, email addresses, authentication tokens, prompts, or project paths.
        Missing acquisition information remains unknown. Anonymous IDs last up to 30 days;
        sessions end after 30 minutes idle or 24 hours. Queues are limited to 100 events
        and 24 hours. The intended retention is 90 days for raw analytics and 13 months
        for non-identifying aggregates; collection and provider retention require separate
        release qualification.
      </p>
      <p>
        Withdrawal stops optional collection on this browser and clears its optional IDs
        and queue. A minimal revocation proof may remain until the collector acknowledges
        withdrawal, including after an offline choice. Withdrawal does not claim to delete
        observations already accepted by a collector. Optional account activity has a
        separate choice in the signed-in account; a website choice cannot enable it.
      </p>
      <p>
        Hosting providers may process ordinary delivery and security logs, including
        network addresses and requested resources. Those logs are separate from this
        optional analytics system. Provider logging and retention must be qualified before
        optional collection is activated.
      </p>

      <h2>When you write to us</h2>
      <p>
        If you email <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a>, we hold your
        message and address for as long as it takes to have the conversation and to keep a
        record of it. We do not add you to a mailing list, and we do not pass your address
        to anyone.
      </p>

      <h2>Codevalanche</h2>
      <p>
        Codevalanche runs on your computer and works against a project on your disk. Your source
        code is not uploaded to Radovar in order for the product to function. We do not
        hold copies of your repositories, and we do not train anything on your work.
      </p>
      <p>
        When you choose a hosted model, the prompt and file context that the agent needs are
        sent to <strong>that provider</strong>, under that provider’s terms, not to us.
        A local model can run inference on your machine, but connected tools and runtimes
        may still make network requests. Their configuration, permissions, and data
        handling determine what is sent.{" "}
        <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">The Security page</Link> sets out that boundary in more detail.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us what personal data we hold about you, ask for it to be corrected,
        ask for it to be deleted, and object to how we use it. Write to{" "}
        <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a> and we will answer.
      </p>
      <p>
        If you are not satisfied with our answer, you can raise the matter with the data
        protection authority for your jurisdiction.
      </p>

      <h2>Changes</h2>
      <p>
        15 October 2026: added the first-party preference manager, the disabled analytics
        release state, collection boundaries, and withdrawal information.
      </p>
      <p>
        If this policy changes in a way that affects what we collect, we will change the
        date at the top and describe the change here rather than quietly replacing the text.
      </p>
    </DocPage>
  )
}
