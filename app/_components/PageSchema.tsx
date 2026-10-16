import { SITE_URL } from "../_lib/site-metadata";

type Page = { title: string; description: string; path: string };

/* WebPage + BreadcrumbList for one route, tied to the site-wide Organization,
   WebSite and Codevalanche nodes declared once in the root layout. */
export function PageSchema({ title, description, path }: Page) {
  const url = new URL(path, SITE_URL).href;
  const home = `${SITE_URL}/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: path === "/" ? "Radovar" : title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(path === "/codevalanche/" ? { about: { "@id": `${SITE_URL}/#codevalanche` } } : {}),
        ...(path === "/" ? {} : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
      },
      ...(path === "/"
        ? []
        : [
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Radovar", item: home },
                { "@type": "ListItem", position: 2, name: title, item: url },
              ],
            },
          ]),
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
