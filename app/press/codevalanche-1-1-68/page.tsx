import Link from "next/link";
import { createPageMetadata, SITE_URL } from "../../_lib/site-metadata";
import { PageSchema } from "../../_components/PageSchema";
import { DocPage } from "../../_components/DocPage";

const page = {
  title: "Codevalanche 1.1.68: from one conversation to a whole project",
  path: "/press/codevalanche-1-1-68/",
  description:
    "Codevalanche 1.1.68 for Windows brings projects led by a Coordinator, local models in conversations, a natural voice, every AI account in one place and a lighter, steadier app.",
};

export const metadata = createPageMetadata(page);

const article = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "@id": `${SITE_URL}${page.path}#article`,
  headline: page.title,
  description: page.description,
  datePublished: "2026-11-13",
  inLanguage: "en",
  author: { "@id": `${SITE_URL}/#organization` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: `${SITE_URL}${page.path}`,
  about: ["Codevalanche", "AI coding agents", "Software release"],
};

export default function Codevalanche1168Page() {
  return (
    <DocPage
      kicker="Product · 13 November 2026"
      title="Codevalanche 1.1.68: from one conversation to a whole project"
      intro="Today we published Codevalanche 1.1.68 for Windows. It is the first public update since version 1.0.1 on 20 October, and the most capable version of Codevalanche we have released. A single conversation with one agent can now become a project: a Coordinator splits the work, hands each part to an agent, follows it and reports back, while you stay in charge of every change that stays."
      updated="13 November 2026"
    >
      <PageSchema {...page} parent={{ title: "Updates", path: "/press/" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }} />

      <div className="note">
        <p>
          <strong>In short.</strong> Projects with their own Coordinator that runs several agents in parallel. Local
          models that answer inside conversations. A voice mode with a natural voice built into the app. One page for
          every AI account and key you use, with the limits of each plan. And an app that uses far less memory, opens
          faster and no longer needs Node installed. Codevalanche 1.1.68 is available now from{" "}
          <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="inline">codevalanche.com</a>.
        </p>
      </div>

      <h2 id="why">Why projects</h2>
      <p>
        AI coding agents have become good at focused tasks. Real work is rarely one focused task. A feature needs a
        change in the interface, a change on the server, tests and a review, and the people using agents today often
        juggle several windows, several accounts and several conversations to get there, copying context from one to
        the next.
      </p>
      <p>
        Codevalanche 1.1.68 turns that into one place. You describe the goal once. The project keeps the context, and
        the Coordinator does the juggling.
      </p>

      <h2 id="coordinator">How a project works</h2>
      <p>
        Each project has its own Coordinator. It reads your request, splits it into parts and starts an agent for each
        part. The agents work in parallel, each in its own task, and the Coordinator follows them and reports back to
        you in plain words.
      </p>
      <ul>
        <li><strong>Every task is visible.</strong> Delegated tasks open beside the Coordinator and appear in the project&rsquo;s task list, so you can see which one is working, which one needs you and which one is done.</li>
        <li><strong>You can step in at any time.</strong> Write to any agent directly, without going through the Coordinator.</li>
        <li><strong>Permissions stay where you put them.</strong> The Coordinator uses the project access you approved and keeps the extra folders you allowed. Approvals for delegated work stay with that task, not with the whole project.</li>
        <li><strong>The project stays open.</strong> When a report is finished, the project and its Coordinator wait for your next message.</li>
      </ul>

      <h2 id="agents">The agents you already use, in one place</h2>
      <p>
        Codevalanche is a workspace for the AI tools you choose. It does not replace them. A new page in Settings, Your
        AIs, brings them together: sign in to your agents, add your own keys and check that each connection works.
      </p>
      <ul>
        <li><strong>Claude Code, Codex and Gemini CLI</strong>, plus agents such as Grok Build, OpenCode and Kimi Code from the public catalog. The app tells you when an agent comes from a third-party publisher.</li>
        <li><strong>More than one account</strong> or key for the same provider, with search and filters to find any connection.</li>
        <li><strong>Automatic model choice.</strong> Pick Automatic and each agent uses the model it recommends. You can still choose an exact model for any chat.</li>
        <li><strong>Limits you can see.</strong> Codevalanche shows how much of your Claude and Codex plans is left and when each limit resets, subscription by subscription.</li>
      </ul>

      <h2 id="local">Local models in conversations</h2>
      <p>
        Models that run on your own computer now answer inside conversations, one turn at a time. When a local model
        cannot do something, it says so plainly instead of failing silently. With a local model, your conversation
        never leaves your PC.
      </p>

      <h2 id="voice">Talk to your agents</h2>
      <p>
        Voice mode now answers with a natural voice that comes with the app, with nothing extra to download, in your
        conversation&rsquo;s language. It thinks as hard as you chose, tells you when it is thinking and stops at once
        when you no longer need the answer. Listening only to your own voice is still experimental.
      </p>

      <h2 id="ship">From chat to a live site</h2>
      <p>
        When a site is ready, you can publish it on GitHub Pages or Vercel straight from the chat and share the link.
        Attachments now work with every agent, including files you add while an agent is working.
      </p>

      <h2 id="lighter">Lighter and steadier</h2>
      <p>
        A large part of this release is work you will not see but will feel. Codevalanche now runs on its own built-in
        engine, so it no longer needs a Node installation on your PC.
      </p>
      <ul>
        <li>Far less memory with a long history, and the app opens faster.</li>
        <li>Undo, approvals and continuing a Codex session work reliably, even after a restart or a crash.</li>
        <li>On a fresh Windows installation it no longer stops with a missing VCRUNTIME140.dll error, and it warns you when the disk is nearly full.</li>
        <li>A task whose agent could not start no longer stays queued for hours, and a few screens and dialogs that could misbehave now work as they should.</li>
      </ul>

      <h2 id="unchanged">What does not change</h2>
      <p>
        You decide what stays. Every change an agent makes can be read and checked before you keep it. Your projects
        stay where they already are on your PC. Your conversations, files and code do not pass through our servers:
        they go from your computer to the AI provider you picked, or stay on your computer if you use a local model.
        Codevalanche starts the agents and shows you what they do; it does not change how they behave.
      </p>
      <p>
        The app speaks 17 languages, and the full list of changes since 1.0.1 is on the{" "}
        <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="inline">Codevalanche website</a>.
        Security details are on our <Link href="/security/" data-analytics-action="anchor" data-analytics-target="security" data-analytics-placement="resources">security page</Link>.
      </p>

      <h2 id="availability">Availability</h2>
      <p>
        Codevalanche 1.1.68 is available today for Windows from{" "}
        <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="inline">codevalanche.com</a>.
        If you already use Codevalanche, the app offers the update. To use cloud agents you need your own account or key
        with the provider you choose; local models need no account.
      </p>
      <p>
        Radovar is the software company behind Codevalanche. Questions about this release:{" "}
        <a href="mailto:press@radovar.com" data-analytics-action="contact" data-analytics-contact="press" data-analytics-placement="inline">press@radovar.com</a>. More from us on the{" "}
        <Link href="/press/" data-analytics-action="anchor" data-analytics-target="press" data-analytics-placement="resources">Updates</Link> page.
      </p>
    </DocPage>
  );
}
