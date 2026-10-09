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
      title="We collect less than you expect."
      intro="This page describes what happens to information when you visit radovar.com, when you write to us, and when you use Codevalanche. It is written to be read, not to be survived."
      updated="9 October 2026"
    >
      <h2>This website</h2>
      <p>
        radovar.com is a set of static files. It sets <strong>no cookies</strong>, runs{" "}
        <strong>no analytics</strong>, embeds <strong>no third-party trackers</strong>, and
        loads no fonts, scripts, or images from anyone else.
      </p>
      <p>
        When you choose a light or dark theme, the site stores that preference in your
        browser’s local storage under <code>radovar-theme</code>. The site reads it on
        later visits to apply your chosen theme.
      </p>
      <p>
        The server that delivers these files keeps ordinary web server logs, which include
        your IP address and the page requested. We do not build profiles from them and we
        do not combine them with anything else.
      </p>

      <h2>When you write to us</h2>
      <p>
        If you email <a href="mailto:info@radovar.com">info@radovar.com</a>, we hold your
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
        <Link href="/security/">The Security page</Link> sets out that boundary in more detail.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us what personal data we hold about you, ask for it to be corrected,
        ask for it to be deleted, and object to how we use it. Write to{" "}
        <a href="mailto:privacy@radovar.com">privacy@radovar.com</a> and we will answer.
        Given how little we collect, most of these requests are quick to satisfy.
      </p>
      <p>
        If you are not satisfied with our answer, you can raise the matter with the data
        protection authority for your jurisdiction.
      </p>

      <h2>Changes</h2>
      <p>
        9 October 2026: clarified how the website stores your theme preference and how
        local model inference differs from network activity by connected tools and runtimes.
      </p>
      <p>
        If this policy changes in a way that affects what we collect, we will change the
        date at the top and describe the change here rather than quietly replacing the text.
      </p>
    </DocPage>
  )
}
