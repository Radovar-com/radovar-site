import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What has been changing in Creator, and the release rhythm behind it.",
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
      title="What has been changing."
      intro="Creator ships in small increments while it is in early access. This page tracks that rhythm, and from the next build it tracks the contents of each one."
      updated="30 July 2026"
    >
      <div className="note">
        <p>
          <strong>A note on what is missing.</strong> Builds up to 0.1.31 were published
          without written notes. We are not going to reconstruct them from memory and
          present the result as a record, so this page starts with the rhythm and adds
          per-build detail from here on.
        </p>
      </div>

      <h2>Release rhythm</h2>
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
        Twenty builds between 17 June and 2 July 2026. Several land on the same day, which
        is what it looks like when fixes ship as they are finished instead of waiting for a
        weekly train.
      </p>

      <h2>What changes between builds</h2>
      <p>
        At this stage of a product, most of the movement is in three places, and it is worth
        knowing which one a given build touched:
      </p>
      <ul>
        <li>
          <strong>The agent loop.</strong> How a request becomes a plan, a set of file
          reads, and a proposed diff.
        </li>
        <li>
          <strong>Model support.</strong> Which providers and which local runtimes Creator
          can drive, and how the choice is surfaced.
        </li>
        <li>
          <strong>The review surface.</strong> How a proposed change is presented before you
          approve it, which is the part we are least willing to get wrong.
        </li>
      </ul>

      <h2>Following along</h2>
      <p>
        An installed copy of Creator updates itself from the release feed, so you do not need
        to watch this page to stay current. See <Link href="/releases/">Releases</Link> for the
        current build and how publishing works.
      </p>
    </DocPage>
  )
}
