import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Creator is built: what stays on your machine, what leaves it when you choose a hosted model, and how to report a vulnerability to Radovar.",
}

export default function SecurityPage() {
  return (
    <DocPage
      kicker="Security"
      title="What leaves your machine, and what does not."
      intro="Most AI coding tools answer the security question with a policy. We would rather answer it with an architecture, and then be precise about where that architecture stops."
      updated="30 July 2026"
    >
      <h2>The design premise</h2>
      <p>
        Creator is a desktop application. It opens a project that already exists on your
        disk, and the agents inside it read and write those files directly. There is no
        step where your repository is copied to a Radovar server in order for the product
        to work, because there is no Radovar server in the path.
      </p>
      <p>
        That single decision removes a large part of the usual threat model. There is no
        shared bucket of customer source code to breach. There is no retention window to
        argue about. There is no internal team with a plausible reason to read your
        project. We cannot lose data we never receive.
      </p>

      <h2>Where the architecture stops</h2>
      <p>
        Being precise matters more than sounding safe, so: <strong>if you point Creator at
        a hosted model, the content of your prompts and the file context the agent needs
        are sent to that model provider.</strong> That is how hosted models work. Creator
        does not change it, and no amount of local-first design can.
      </p>
      <p>What Creator does give you is the choice, made explicitly and visibly:</p>
      <ul>
        <li>
          <strong>Hosted model.</strong> Your prompt and the relevant file context go to
          the provider you selected, under that provider terms. Radovar is not in the
          middle of that exchange.
        </li>
        <li>
          <strong>Local model.</strong> The model runs on your own hardware. Nothing
          leaves the machine at all. This is the mode for work that genuinely cannot go
          anywhere.
        </li>
      </ul>
      <div className="note">
        <p>
          If you are evaluating Creator for a codebase that cannot be disclosed to a third
          party, the local model path is the one to test. It is the only configuration
          where the guarantee is architectural rather than contractual.
        </p>
      </div>

      <h2>Changes are proposed, not applied</h2>
      <p>
        An agent that can silently rewrite your working tree is a security problem
        regardless of where it runs. Creator treats every edit an agent wants to make as a
        proposal: it arrives as a diff, scoped to named files, and it does not land until
        you approve it.
      </p>
      <p>
        This is the control that matters in practice. It means a mistaken instruction, a
        confused model, or text injected into a file the agent happened to read cannot
        turn into a committed change without a person seeing the diff first.
      </p>

      <h2>Credentials</h2>
      <p>
        Provider keys and sign-in sessions are stored on the machine that uses them, and
        are read only by the process that needs them to make a request. Radovar does not
        proxy provider traffic, so we never hold your provider credentials.
      </p>

      <h2>Reporting a vulnerability</h2>
      <p>
        If you believe you have found a security issue in Creator, write to{" "}
        <a href="mailto:security@radovar.com">security@radovar.com</a> with enough detail
        to reproduce it. Please give us a reasonable window to investigate and ship a fix
        before disclosing publicly.
      </p>
      <p>
        We will confirm receipt, tell you what we found, and tell you when a fix ships. If
        we disagree that something is a vulnerability, we will explain why rather than go
        quiet.
      </p>

      <h2>What we do not claim</h2>
      <p>
        Radovar is a small company and Creator is in early access. We hold no third-party
        security certification today, and we would rather say so plainly than imply
        otherwise. If a certification becomes relevant to how you would use Creator, tell
        us and we will tell you honestly where we stand.
      </p>
    </DocPage>
  )
}
