import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Selected early-access Codevalanche releases from June and July 2026, with a link to current product and download information.",
  alternates: { canonical: "/releases/" },
}

/* Real published early-access builds, most recent first. Kept short on purpose: the full
   pre-release history is internal iteration and is not useful to a reader. */
const ARCHIVE = [
  { v: "0.1.31", d: "2 July 2026" },
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
      title="Early release archive."
      intro="Selected early-access release history for Codevalanche, covering June and July 2026. This archive records an early period in the product’s development."
      updated="9 October 2026"
    >
      <div className="note">
        <p>
          For current product and download information, visit{" "}
          <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a>.
        </p>
      </div>

      <h2>How these releases worked</h2>
      <p>
        These builds were published as signed Windows installers with an update feed
        alongside them. Installed copies could check that feed for updates.
      </p>
      <p>
        This archive records twenty retained builds between 17 June and 2 July 2026. Several were published
        on the same day as part of that early-access development period.
      </p>

      <h2>Version numbers</h2>
      <p>
        The builds in this archive use <strong>0.x</strong> version numbers and were marked
        pre-release. They document an early stage when interfaces and behaviour were changing.
      </p>
      <p>
        Version 0.1.24 was published and then pulled after a problem was found. It was not
        replaced under the same number, which accounts for the gap in the release history.
      </p>

      <h2>Selected early-access builds</h2>
      <div className="vtable">
        {ARCHIVE.map((r) => (
          <div className="vrow" key={r.v}>
            <span className="vrow__v">{r.v}</span>
            <span className="vrow__d">{r.d}</span>
            <span />
          </div>
        ))}
      </div>
      <p>
        This is a selection, not the complete list. See{" "}
        <Link href="/changelog/" data-analytics-action="anchor" data-analytics-target="changelog_archive" data-analytics-placement="resources">the changelog archive</Link> for publication dates and build counts.
      </p>

      <h2>Product information</h2>
      <p>
        Visit <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a> for current
        Codevalanche product and download information.
      </p>
    </DocPage>
  )
}
