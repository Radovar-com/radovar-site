import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://radovar.com"),
  title: {
    default: "Radovar — Innovation in artificial intelligence solutions",
    template: "%s — Radovar",
  },
  description:
    "Radovar is a technology company building AI solutions that keep data on the user's machine. Maker of Creator, a desktop app for local AI agents.",
  keywords: ["Radovar", "Creator", "AI agents", "local AI", "privacy", "desktop AI"],
  authors: [{ name: "Radovar" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://radovar.com",
    siteName: "Radovar",
    title: "Radovar — Innovation in artificial intelligence solutions",
    description:
      "Technology company building AI solutions that keep data on the user's machine. Maker of Creator.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radovar — Innovation in artificial intelligence solutions",
    description:
      "Technology company building AI solutions that keep data on the user's machine. Maker of Creator.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
