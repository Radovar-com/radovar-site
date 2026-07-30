import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Releases",
  description:
    "The current Creator build, how early-access releases are published, and how updates reach an installed copy.",
}

/* Real published builds, most recent first. Kept short on purpose: the full
   pre-release history is internal iteration and is not useful to a reader. */
const RECENT = [
  { v: "0.1.31", d: "2 July 2026", tag: "Current" },
  { v: "0.1.30", d: "2 July 2026" },
  { v: "0.1.29", d: "2 July 2026" },
  { v: "0.1.21", d: "27 June 2026" },
  { v: "0.1.16", d: "24 June 2026" },
  { v: "0.1.11", d: "17 June 2026" },
]

export default function ReleasesPage() {
  return (
    <DocPage
      kicker="Releases"
      title="Creator 0.1.31, and how it got here."
      intro="Creator is published as pre-release builds while it is in early access. This page says what the current build is and how updates reach a machine that already has it."
      updated="30 July 2026"
    >
      <h2>Current build</h2>
      <div className="note">
        <p>
          <strong>Creator 0.1.31</strong>, published 2 July 2026, for Windows desktop.
          Marked pre-release, like every build so far.
        </p>
      </div>

      <h2>How releases work</h2>
      <p>
        Every build is published as a signed Windows installer with an update feed
        alongside it. An installed copy of Creator checks that feed and can update itself,
        so you are not expected to come back here to find out that something shipped.
      </p>
      <p>
        Builds are frequent. Between 17 June and 2 July 2026 we published twenty of them.
        That cadence is what early access looks like from the inside: small changes, shipped
        as they are ready, rather than held for a milestone.
      </p>

      <h2>Version numbers</h2>
      <p>
        Creator is on <strong>0.x</strong> and every build is a pre-release. That is not
        modesty, it is a status: interfaces move, behaviour changes, and a version number
        starting with zero is the honest way to say so.
      </p>
      <p>
        Occasionally a number is skipped. If a build is published and then found to be
        broken, it is pulled rather than quietly replaced, and the next good build takes the
        next number. Version 0.1.24 is missing for exactly that reason.
      </p>

      <h2>Selected builds</h2>
      <div className="vtable">
        {RECENT.map((r) => (
          <div className="vrow" key={r.v}>
            <span className="vrow__v">{r.v}</span>
            <span className="vrow__d">{r.d}</span>
            {r.tag ? <span className="tag">{r.tag}</span> : <span />}
          </div>
        ))}
      </div>
      <p>
        This is a selection, not the complete list. See{" "}
        <Link href="/changelog/">the changelog</Link> for what has been changing.
      </p>

      <h2>Getting a build</h2>
      <p>
        Creator is not on a public download page yet. If you want to try it, write to{" "}
        <a href="mailto:info@radovar.com">info@radovar.com</a> and tell us a little about
        what you would use it for.
      </p>
    </DocPage>
  )
}
