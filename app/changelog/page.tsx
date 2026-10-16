import { createPageMetadata } from "../_lib/site-metadata"
import { DocPage } from "../_components/DocPage"

export const metadata = createPageMetadata({
  title: "Release history",
  description:
    "Every early-access Codevalanche build published between 17 June and 2 July 2026, with its date, including the one we pulled.",
  path: "/changelog/",
})

/* The complete list, grouped by publication date. Every version and date comes
   from the published release history; 0.1.24 was pulled and stays listed. */
const DAYS: { date: string; iso: string; versions: string[] }[] = [
  { date: "2 July 2026", iso: "2026-07-02", versions: ["0.1.31", "0.1.30", "0.1.29", "0.1.28", "0.1.27", "0.1.26", "0.1.25", "0.1.24", "0.1.23", "0.1.22"] },
  { date: "27 June 2026", iso: "2026-06-27", versions: ["0.1.21", "0.1.20", "0.1.19", "0.1.18", "0.1.17"] },
  { date: "24 June 2026", iso: "2026-06-24", versions: ["0.1.16", "0.1.15", "0.1.14"] },
  { date: "23 June 2026", iso: "2026-06-23", versions: ["0.1.13", "0.1.12"] },
  { date: "17 June 2026", iso: "2026-06-17", versions: ["0.1.11"] },
]
const PULLED = "0.1.24"

export default function ChangelogPage() {
  return (
    <DocPage
      kicker="Release history"
      title="Every Codevalanche build we have published."
      intro="Twenty early-access builds for Windows, published between 17 June and 2 July 2026, plus the one we pulled. This is a historical record, not the current download page."
      updated="16 October 2026"
    >
      <div className="note">
        <p>
          <strong>Current status.</strong> Codevalanche is in early access for Windows and public
          downloads are in preparation. Visit{" "}
          <a href="https://codevalanche.com" data-analytics-action="product" data-analytics-section-id="resources" data-analytics-placement="resources">codevalanche.com</a> for
          current product and download information.
        </p>
      </div>

      <h2>All published builds</h2>
      <div className="vtable">
        {DAYS.flatMap((day) =>
          day.versions.map((v) => (
            <div className="vrow" key={v}>
              <span className="vrow__v">{v}</span>
              <span className="vrow__d">
                <time dateTime={day.iso}>{day.date}</time>
                {v === PULLED ? <> &nbsp;&middot;&nbsp; pulled after a problem was found</> : null}
              </span>
              <span />
            </div>
          )),
        )}
      </div>
      <p>
        Twenty builds remain published. Several came out on the same day. Version 0.1.24 was
        published on 2 July and then pulled after a problem was found. It was not replaced
        under the same number, which is why the list keeps it.
      </p>

      <h2>About these Windows builds</h2>
      <p>
        The builds were published as signed Windows installers with an update feed
        alongside them. Installed copies could check that feed for updates.
      </p>
      <p>
        They use <strong>0.x</strong> version numbers and were marked pre-release. They
        document an early stage when interfaces and behaviour were changing.
      </p>

      <h2>Why there are no release notes</h2>
      <p>
        These builds were published without written release notes. We keep their versions
        and dates as they were, rather than reconstructing feature or fix details from
        memory after the fact.
      </p>
    </DocPage>
  )
}
