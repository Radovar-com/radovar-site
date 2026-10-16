import type { Metadata } from "next";

export const SITE_URL = "https://radovar.com";
export const HOME_TITLE = "Radovar | Makers of Codevalanche, an AI coding workspace";
export const SITE_DESCRIPTION = "Radovar builds software that keeps people in charge of AI agents. Discover Codevalanche, our desktop workspace for AI-assisted development.";
export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/radovar-social-20261016.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Radovar, makers of Codevalanche",
};

/** A route owns its canonical and share metadata, rather than inheriting home. */
export function createPageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: { url: string; alt: string } }): Metadata {
  const share = image ? { ...SOCIAL_IMAGE, url: new URL(image.url, SITE_URL).href, alt: image.alt } : SOCIAL_IMAGE;
  const socialTitle = path === "/" ? HOME_TITLE : `${title} | Radovar`;
  return {
    title,
    description,
    alternates: { canonical: path, types: { "application/rss+xml": [{ url: "/feed.xml", title: "Radovar updates" }] } },
    openGraph: {
      type: "website",
      url: new URL(path, SITE_URL).href,
      title: socialTitle,
      description,
      siteName: "Radovar",
      locale: "en_US",
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: share.url, alt: share.alt }],
    },
  };
}
