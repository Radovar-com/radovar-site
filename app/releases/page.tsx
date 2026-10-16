import Link from "next/link"
import type { Metadata } from "next"
import { DocPage } from "../_components/DocPage"

/* The release archive and the changelog were two partial views of one record.
   They now live together on /changelog/; this address stays for old links. */
export const metadata: Metadata = {
  title: "Release history",
  description: "The Codevalanche release archive has moved to the release history page.",
  alternates: { canonical: "/changelog/" },
  robots: { index: false, follow: true },
}

export default function ReleasesPage() {
  return (
    <DocPage
      kicker="Release history"
      title="The release archive has moved."
      intro="Every published Codevalanche build, with its date, is now on one page."
      updated="16 October 2026"
    >
      <meta httpEquiv="refresh" content={`0; url=${process.env.BASE_PATH || ""}/changelog/`} />
      <p>
        Go to the{" "}
        <Link href="/changelog/" data-analytics-action="anchor" data-analytics-target="changelog_archive" data-analytics-placement="resources">release history</Link>.
      </p>
    </DocPage>
  )
}
