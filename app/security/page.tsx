import type { Metadata } from "next";
import { DocPage } from "../_components/DocPage";
export const metadata: Metadata = {
  title: "Security",
  alternates: { canonical: "/security/" },
  description:
    "The boundaries between your local Codevalanche workspace, connected AI runtimes, and model providers.",
};
export default function SecurityPage() {
  return (
    <DocPage
      kicker="Security"
      title="Know where the boundaries are."
      intro="Local-first is a starting point for understanding Codevalanche. Your connected runtime, provider, and permissions matter too."
    >
      <h2>The local workspace</h2>
      <p>
        Codevalanche is a desktop application that works with projects on your
        machine. You can open an existing repository without moving your
        development workflow into a hosted editor.
      </p>
      <h2>Connected AI providers</h2>
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
      <h2>Review and permissions</h2>
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
        <a href="mailto:security@radovar.com">security@radovar.com</a> with the
        affected version and enough detail to reproduce it. Please avoid
        including credentials or sensitive project data.
      </p>
      <h2>Early access</h2>
      <p>
        Codevalanche is in early access. Radovar does not claim third-party
        security certification. For a deployment with specific security
        requirements, contact{" "}
        <a href="mailto:info@radovar.com">info@radovar.com</a> to discuss the
        configuration you plan to use.
      </p>
    </DocPage>
  );
}
