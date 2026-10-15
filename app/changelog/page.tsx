import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "An archive of Codevalanche’s early-access release dates, build counts, and version ranges from June and July 2026.",
  alternates: { canonical: "/changelog/" },
}

/* Grouped by publication date. Every date and count here comes from the
   published release history. Per-build notes are deliberately absent rather
   than reconstructed after the fact. */
const PERIODS = [
  { date: "2 July 2026", builds: 9, range: "0.1.22 to 0.1.31" },
  { date: "27 June 2026", builds: 5, range: "0.1.17 to 0.1.21" },
  { date: "24 June 2026", builds: 3, range: "0.1.14 to 0.1.16" },
  { date: "23 June 2026", builds: 2, range: "0.1.12 to 0.1.13" },
  { date: "17 June 2026", builds: 1, range: "0.1.11" },
]

export default function ChangelogPage() {
  return (
    <DocPage
      kicker="Changelog"
      title="Selected early-access release history."
      intro="This archive records Codevalanche’s publication dates and build counts from June and July 2026."
      updated="9 October 2026"
    >
      <div className="note">
        <p>
          <strong>About this record.</strong> The builds listed here, through 0.1.31, were
          published without written release notes. This archive preserves their dates and
          version ranges without reconstructing feature or fix details from memory.
        </p>
      </div>

      <h2>Archived publication dates</h2>
      <div className="vtable">
        {PERIODS.map((p) => (
          <div className="vrow" key={p.date}>
            <span className="vrow__v">{p.builds}</span>
            <span className="vrow__d">
              {p.date} &nbsp;&middot;&nbsp; {p.range}
            </span>
            <span />
          </div>
        ))}
      </div>
      <p>
        Twenty retained builds are recorded between 17 June and 2 July 2026. Several were
        published on the same day. Version 0.1.24 was subsequently pulled, so the
        2 July range contains nine retained builds.
      </p>

      <h2>Reading the archive</h2>
      <p>
        The counts and version ranges describe publication history. They do not identify
        which features or fixes were included in an individual build. See{" "}
        <Link href="/releases/" data-analytics-action="anchor" data-analytics-target="releases_archive" data-analytics-placement="resources">the release archive</Link> for a selection of dated builds
        and the background to their version numbers.
      </p>

      <h2>Current product information</h2>
      <p>
        Visit <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a> for current
        Codevalanche product and download information.
      </p>
    </DocPage>
  )
}
