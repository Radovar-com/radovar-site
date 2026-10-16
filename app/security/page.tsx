import { createPageMetadata } from "../_lib/site-metadata";
import { PageSchema } from "../_components/PageSchema";
import { DocPage } from "../_components/DocPage";
const page = {
  title: "Security",
  path: "/security/",
  description:
    "The boundaries between your local Codevalanche workspace, connected AI runtimes, and model providers.",
};

export const metadata = createPageMetadata(page);
export default function SecurityPage() {
  return (
    <DocPage
      kicker="Security"
      title="Your files, providers, and permissions."
      intro="Codevalanche opens projects on your computer. What an AI agent can read, change, or send over the network also depends on the runtime and provider you connect."
    >
      <PageSchema {...page} />
      <h2>Where your project lives</h2>
      <p>
        Codevalanche is a desktop application that works with projects on your
        machine. You can open an existing repository without moving your
        development workflow into a hosted editor.
      </p>
      <h2>What a hosted provider can receive</h2>
      <p>
        When you use a hosted model, your prompts and relevant file context can
        be sent to the provider. That provider’s terms and data practices apply.
        Keeping a repository on disk does not make hosted inference private or
        offline.
      </p>
      <p>
        Review the configuration and documentation of the runtime you connect,
        including its authentication, telemetry, network access, and tool
        permissions.
      </p>
      <h2>What to check before starting an agent</h2>
      <ul>
        <li>Which model and provider will receive the task and its context?</li>
        <li>Which files, tools, commands, and network resources can the runtime access?</li>
        <li>Which operations require approval in your current configuration?</li>
        <li>Is your existing work saved, and do you need a separate working copy?</li>
      </ul>
      <p>
        Review AI-generated changes and check the work before you keep or commit
        it. Approval behavior and file access depend on the runtime and
        configuration. A review interface is not a guarantee that every
        operation waits for individual approval.
      </p>
      <p>
        Keep important work in version control. Choose permissions deliberately,
        and use a separate working copy when a task needs isolation.
      </p>
      <h2>Reporting a vulnerability</h2>
      <p>
        If you believe you have found a security issue in Codevalanche, write to{" "}
        <a href="mailto:security@radovar.com" data-analytics-action="contact" data-analytics-contact="security" data-analytics-placement="inline">security@radovar.com</a> with the
        affected version and enough detail to reproduce it. Please avoid
        including credentials or sensitive project data.
      </p>
      <h2>Early access and security requirements</h2>
      <p>
        Codevalanche is in early access. Radovar does not claim third-party
        security certification. For a deployment with specific security
        requirements, contact{" "}
        <a href="mailto:info@radovar.com" data-analytics-action="contact" data-analytics-contact="info" data-analytics-placement="inline">info@radovar.com</a> to discuss the
        configuration you plan to use.
      </p>
    </DocPage>
  );
}
